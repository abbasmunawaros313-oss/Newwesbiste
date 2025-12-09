import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to Login, but save the current location they were trying to visit!
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;