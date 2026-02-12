// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   // Sirf user check karo - token expiration AuthContext handle kar raha hai
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check if user has required role
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sirf user check karo - token expiration AuthContext handle kar raha hai
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Instead of going to unauthorized, redirect to user's own dashboard
    switch (user.role) {
      case "GM":
        return <Navigate to="/gm/dashboard" replace />;
      case "DEALER":
      case "CEO":
        return <Navigate to="/dealer/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
