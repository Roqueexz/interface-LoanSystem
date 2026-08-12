import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  isAuth: boolean;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ isAuth, children }) => {
  const role = localStorage.getItem('role');

  if (!isAuth || role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
