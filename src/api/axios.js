import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Request interceptor: auto attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle token expiration and global errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      localStorage.removeItem("token");
      // Check if we are already on the login page to avoid repetitive toasts
      if (window.location.pathname !== "/" && window.location.pathname !== "/register") {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } else if (status === 403) {
      toast.error("Access denied. Admin rights required.");
    } else if (status === 404) {
      // Don't show toast for 404 onboarding check since it is a normal flow for new users
      if (!error.config.url.includes("/onboarding")) {
        toast.error(error.response?.data?.detail || "Resource not found.");
      }
    } else if (status === 500) {
      toast.error("Server error. Please try again later.");
    } else {
      const detail = error.response?.data?.detail;
      if (detail && typeof detail === "string") {
        toast.error(detail);
      } else {
        toast.error("Network connection issue.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
