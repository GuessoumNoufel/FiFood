import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // adjust to your backend's actual port
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
