
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
    <div className="flex flex-col items-center pt-20 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-4">Login</h1>
      <AuthForm mode="login" />
      <div className="mt-4 text-center">
        <span className="text-gray-700">Don’t have an account? </span>
        <a href="/register" className="text-primary hover:text-accent font-semibold underline">Register</a>
      </div>
    </div>
  );
};

export default Login;
