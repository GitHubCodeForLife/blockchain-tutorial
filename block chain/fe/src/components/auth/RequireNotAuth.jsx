import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RequireNotAuth({ children }) {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

export default RequireNotAuth;
