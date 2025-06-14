
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className="flex flex-col items-center pt-20 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-4">Register</h1>
      <AuthForm mode="register" />
      <div className="mt-4 text-center">
        <span className="text-gray-700">Already have an account? </span>
        <a href="/login" className="text-primary hover:text-accent font-semibold underline">Login</a>
      </div>
    </div>
  );
};

export default Register;
