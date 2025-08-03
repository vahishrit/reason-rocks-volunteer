
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
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20"></div>
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-card-foreground mb-8">REGISTER</h1>
          <AuthForm mode="register" />
          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Already have an account? </span>
            <a href="/login" className="text-accent hover:text-accent/80 font-semibold underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
