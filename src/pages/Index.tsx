
// Home page: redirect to dashboard if logged in, otherwise show a beautiful hero/landing

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-fade-in">
      <h1 className="text-5xl font-extrabold text-primary mb-6 tracking-tight">
        Rocks for a Reason
      </h1>
      <p className="text-lg text-primary-light mb-8 max-w-xl text-center">
        A modern platform for Westfield High School students to discover volunteer opportunities, log hours, and make a difference!
      </p>
      <a
        href="/login"
        className="bg-accent text-primary font-bold px-8 py-3 rounded-lg hover:bg-accent-dark text-lg shadow transition"
      >
        Get Started
      </a>
    </div>
  );
};

export default Index;
