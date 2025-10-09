import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto relative mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-cyan-400/30"></div>
            <div className="absolute inset-2 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-cyan-400 bg-clip-text text-transparent">
            FocusFlow
          </h2>
          <p className="text-gray-400">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}