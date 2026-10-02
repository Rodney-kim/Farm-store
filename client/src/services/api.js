// Every fetch call in the app goes through this file. Components never
// build API URLs themselves; they call these functions instead, so the
// base URL and error handling only need to live in one place.

// In development, Vite's proxy (see vite.config.js) forwards "/api/..."
// to the Express server, so an empty base URL works out of the box.
// Set VITE_API_URL in client/.env only if the API is hosted elsewhere.
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  try {
    return JSON.parse(localStorage.getItem("farmstore_user"))?.token || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  let response;
  const token = getToken();

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (networkError) {
    // fetch() itself throws when the server is unreachable (e.g. the
    // backend isn't running), not when it returns an error status.
    throw new Error("Could not reach the server. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Response had no JSON body (rare, but don't crash on it).
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

// ---- Products ----
export function getProducts({ category, search } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  if (search) params.set("search", search);
  const query = params.toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

// ---- Categories ----
export function getCategories() {
  return request("/categories");
}

// ---- Orders ----
export function createOrder(order) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function getOrderById(id) {
  return request(`/orders/${id}`);
}

// ---- Auth ----
export function registerUser(details) {
  return request("/auth/register", { method: "POST", body: JSON.stringify(details) });
}

export function loginUser(credentials) {
  return request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
}

// ---- Admin: products ----
export function createProduct(product) {
  return request("/products", { method: "POST", body: JSON.stringify(product) });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: "DELETE" });
}
