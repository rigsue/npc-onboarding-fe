import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminIdentity } from '../context/AdminIdentityContext';

export default function RequireSuperAdmin({ children }) {
  const { isSuperAdmin } = useAdminIdentity();
  if (!isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
