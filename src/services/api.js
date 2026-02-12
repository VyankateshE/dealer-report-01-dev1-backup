import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://uat.smartassistapp.in/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Add timeout
});

// REQUEST: Attach token + normalize URL
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // 🔥 If user passed full URL, strip base domain
    if (config.url.startsWith(BASE_URL)) {
      config.url = config.url.replace(BASE_URL, "");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for network errors/no internet
    if (!window.navigator.onLine) {
      // toast.error("Please check your internet connection!");
      return Promise.reject(error);
    }

    // Check for timeout errors
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      // toast.error("Request timeout. Please check your internet connection!");
      return Promise.reject(error);
    }

    // Check for network failure
    if (!error.response) {
      // toast.error("Network error. Please check your internet connection!");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const msg =
      error.response.data?.message || "Something went wrong! Please try again.";

    if (status === 401) {
      localStorage.removeItem("authToken");
      toast.error("Session expired. Please login again.");
      // Optional: redirect to login page
      // window.location.href = '/login';
    } else {
      toast.error(msg);
    }

    return Promise.reject(error);
  },
);

export default api;
