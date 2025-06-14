
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({
  children,
  requireAdmin = false
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-40 text-primary animate-fade-in">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !user.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
