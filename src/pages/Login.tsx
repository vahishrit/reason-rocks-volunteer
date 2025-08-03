import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20"></div>
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-sunborn font-bold text-center text-card-foreground mb-8">LOGIN</h1>
          <AuthForm mode="login" />
          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Don't have an account? </span>
            <a href="/register" className="text-accent hover:text-accent/80 font-semibold underline">Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;