const fallbackHost =
  typeof window !== "undefined" ? window.location.hostname || "localhost" : "localhost";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || `http://${fallbackHost}:5000/api`;

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const output = query.toString();
  return output ? `?${output}` : "";
};

const request = async (path, { method = "GET", body, token } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const api = {
  health: () => request("/health"),
  home: () => request("/store/home"),
  products: (params) => request(`/products${buildQueryString(params)}`),
  product: (slug) => request(`/products/${slug}`),
  // Clerk handles sign-in and sign-up; no register or login endpoints here.
  me: (token) => request("/auth/me", { token }),
  updateProfile: (token, payload) =>
    request("/auth/me", { method: "PUT", token, body: payload }),
  paymentSession: (payload) =>
    request("/payments/session", { method: "POST", body: payload }),
  createOrder: (payload, token) =>
    request("/orders", { method: "POST", body: payload, token }),
  myOrders: (token) => request("/orders/my-orders", { token }),
  adminOverview: (token) => request("/admin/overview", { token }),
  createProduct: (token, payload) =>
    request("/admin/products", { method: "POST", token, body: payload }),
  updateProduct: (token, slug, payload) =>
    request(`/admin/products/${slug}`, { method: "PUT", token, body: payload }),
  updateOrderStatus: (token, id, status) =>
    request(`/admin/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: { status }
    })
};
