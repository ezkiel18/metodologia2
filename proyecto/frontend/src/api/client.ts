import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err.response?.data?.message || "Error de red";
    return Promise.reject(new Error(msg));
  }
);