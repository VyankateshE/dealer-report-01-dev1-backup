import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Setup axios interceptor for handling 401 responses
  useEffect(() => {
    // Request interceptor to add token
    const requestInterceptor = axios.interceptors.request.use(
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

    // Response interceptor to handle 401
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only show toast and redirect if user was logged in
          const token = localStorage.getItem("token");
          if (token && !window.location.pathname.includes("/login")) {
            // console.log("🔐 Session expired - redirecting to login");

            // Clear storage
            localStorage.clear();
            sessionStorage.clear();

            // Show session expired message
            toast.error("Your session has expired. Please login again.");

            // Redirect to login after a short delay
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
        }
        return Promise.reject(error);
      },
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    // console.log("🔄 AuthContext: Checking localStorage for current session...");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const userData = localStorage.getItem("userData");

    // console.log("📦 Found in localStorage:", {
    //   token: token ? "EXISTS" : "NULL",
    //   role,
    //   userData: userData ? "EXISTS" : "NULL",
    // });

    // ONLY set user if data exists, but don't persist across dev server restarts
    if (token && role && userData) {
      try {
        const parsedData = JSON.parse(userData);
        // console.log("✅ Setting user for current session:", parsedData);
        setUser({ token, role, ...parsedData });
      } catch (error) {
        // console.error("❌ Error parsing user data:", error);
        // Clear corrupted data but only for current refresh
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userData");
      }
    } else {
      // console.log("❌ No valid session data - showing login page");
    }

    setLoading(false);
  }, []); // This only runs once per page session

  const login = (userData, token, role) => {
    // console.log("🔐 Manual login called:", { userData, token, role });
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser({ token, role, ...userData });
  };

  const logout = () => {
    // console.log("🚪 Logout called");
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
