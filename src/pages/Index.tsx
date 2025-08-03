
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
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 flex items-center justify-between max-w-6xl">
        <div className="flex-1 max-w-lg">
          <h1 className="text-5xl font-sunborn font-extrabold text-foreground mb-6 leading-tight">
            ROCKS FOR A<br />REASON
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            A modern platform for Westfield High School students to discover volunteer opportunities, log hours, and make a difference!
          </p>
          <a
            href="/login"
            className="inline-block bg-accent text-accent-foreground font-bold px-8 py-3 rounded-lg hover:bg-accent/90 text-lg transition-all transform hover:scale-105"
          >
            GET STARTED
          </a>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="relative">
            <div className="w-80 h-60 bg-muted rounded-lg shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30"></div>
              <div className="absolute top-6 right-6 space-y-3">
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded font-bold shadow-lg">DECIDE</div>
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded font-bold shadow-lg ml-4">COMMIT</div>
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded font-bold shadow-lg">FOCUS</div>
                <div className="bg-accent text-accent-foreground px-4 py-2 rounded font-bold shadow-lg ml-8">SUCCEED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
