import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const RequireSuperAdmin = ({ children }) => {
  const role = useSelector(
    (state) => state.auth.user?.role_name
  );
  if (role !== "super_admin") {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

export default RequireSuperAdmin;