
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For now, just render children directly
  // In a real app, this would check authentication
  return <>{children}</>;
};

export default ProtectedRoute;
