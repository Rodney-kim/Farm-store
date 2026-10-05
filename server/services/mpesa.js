const baseUrl = () =>
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// Accepts 0712345678, +254712345678, 254712345678, 712345678 -> 254712345678
export function normalizePhone(input) {
  let p = String(input || "").replace(/[\s+\-]/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  else if (p.startsWith("7") || p.startsWith("1")) p = "254" + p;
  if (!/^254[17]\d{8}$/.test(p)) {
    throw new Error("Enter a valid Safaricom number, e.g. 0712345678");
  }
  return p;
}

// Safaricom wants a fresh token for requests; it comes from your key + secret.
export async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) throw new Error("Could not connect to M-Pesa. Please try again.");
  const data = await res.json();
  return data.access_token;
}

// YYYYMMDDHHmmss
const makeTimestamp = () => new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);

export async function stkPush({ phone, amount, orderId }) {
  const token = await getAccessToken();
  const timestamp = makeTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE;

  // The password is base64(shortcode + passkey + timestamp).
  const password = Buffer.from(
    `${shortcode}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const body = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
    Amount: Math.ceil(amount),
    PartyA: phone,
    // For a Till (Buy Goods) this is the till number; for Paybill it is the shortcode.
    PartyB: process.env.MPESA_PARTYB || shortcode,
    PhoneNumber: phone,
    CallBackURL: `${process.env.MPESA_CALLBACK_BASE}/api/pay/callback/${process.env.MPESA_CALLBACK_SECRET}`,
    AccountReference: `FS${String(orderId).slice(-8).toUpperCase()}`,
    TransactionDesc: "FarmStore",
  };

  const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.ResponseCode !== "0") {
    console.error("STK push failed:", data);
    throw new Error(data.errorMessage || data.ResponseDescription || "M-Pesa request failed");
  }

  return data; // includes CheckoutRequestID and CustomerMessage
}