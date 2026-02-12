import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "https://uat.smartassistapp.in/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let isUnauthorizedToastShowing = false;

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
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (!isUnauthorizedToastShowing) {
        isUnauthorizedToastShowing = true;

        localStorage.clear();

        toast.error("Session expired. Please login again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          onClose: () => {
            isUnauthorizedToastShowing = false;
          },
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }

      return Promise.reject(new Error("Session expired"));
    }

    return Promise.reject(error);
  },
);

export default api;
