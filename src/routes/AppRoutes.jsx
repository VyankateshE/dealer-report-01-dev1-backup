import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login/Login.jsx";
import ProtectedRoute from "./ProtectedRoute";
import GMDashboard from "../pages/Dashboard/GMDashboard";
import DealerDashboard from "../pages/Dashboard/DealerDashboard";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
      </div>
    );
  }

  const getRedirectPath = () => {
    if (!user) return "/login";

    // Redirect based on role
    switch (user.role) {
      case "GM":
        return "/gm/dashboard";
      case "DEALER":
      case "CEO":
        return "/dealer/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <Routes>
      {/* Root path - always redirect based on auth status */}
      <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />

      {/* Login route - if user exists, redirect to appropriate dashboard */}
      <Route
        path="/login"
        element={user ? <Navigate to={getRedirectPath()} replace /> : <Login />}
      />

      {/* Protected GM routes */}
      <Route
        path="/gm/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["GM"]}>
            <GMDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Dealer routes */}
      <Route
        path="/dealer/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={["DEALER", "CEO"]}>
            <DealerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
