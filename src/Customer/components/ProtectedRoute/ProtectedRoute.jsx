import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.userSlice);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/dangnhap" state={{ from: location }} replace />;
  }

  return children;
}
