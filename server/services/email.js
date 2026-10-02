import nodemailer from "nodemailer";

export async function sendAdminReceipt(order) {
  if (!process.env.ADMIN_NOTIFY_EMAIL || !process.env.SMTP_USER) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const lines = order.products
    .map((p) => `  ${p.name} x ${p.quantity} @ KSh ${p.price} = KSh ${p.price * p.quantity}`)
    .join("\n");

  const text = `New PAID order on FarmStore

Order: #${String(order._id).slice(-6).toUpperCase()}
M-Pesa receipt: ${order.mpesaReceipt}
Paid: ${order.paidAt.toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}

Customer: ${order.customerName}
Phone: ${order.phone}
Email: ${order.email}
Delivery address: ${order.address}

Items:
${lines}

TOTAL: KSh ${order.totalAmount}
`;

  await transporter.sendMail({
    from: `"FarmStore" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `New paid order: KSh ${order.totalAmount} (${order.mpesaReceipt})`,
    text,
  });
}