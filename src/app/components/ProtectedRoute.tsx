import { Navigate } from 'react-router';

export const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
};