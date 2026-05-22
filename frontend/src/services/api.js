// All API calls go through this file.
// Change API_BASE to your Render URL after deploying the backend.

const API_BASE = "http://127.0.0.1:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Items
  getItems: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request(`/api/items${qs ? "?" + qs : ""}`);
  },
  getItem:    (id)   => request(`/api/items/${id}`),
  createItem: (data) => request("/api/items", { method: "POST", body: JSON.stringify(data) }),
  updateItem: (id, data) =>
    request(`/api/items/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  // Stats
  getStats: () => request("/api/stats"),

  // Chat
  sendMessage: (message) =>
    request("/api/chat", { method: "POST", body: JSON.stringify({ message }) }),
};
