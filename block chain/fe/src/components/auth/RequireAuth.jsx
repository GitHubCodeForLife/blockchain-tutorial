import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RequireAuth({ children }) {
  const { isAuthenticated } = useSelector((state) => state.user);
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default RequireAuth;
