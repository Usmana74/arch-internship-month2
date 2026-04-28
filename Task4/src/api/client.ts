// Centralized API base. Swap to a real Django REST endpoint via env var.
export const API_BASE = import.meta.env.VITE_API_URL ?? "";

// Tiny artificial latency so the mock feels async like a real fetch.
export const wait = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// In real impl this would be: fetch(`${API_BASE}${path}`, init).then(r => r.json())
