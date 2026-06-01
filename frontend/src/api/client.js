export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = async (path, options = {}) => {
  const token = localStorage.getItem("habitflow_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.message || text || "Request failed");
  return data;
};
