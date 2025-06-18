
import React from "react";
import AdminAuthForm from "@/components/AdminAuthForm";

const AdminRegister = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center py-12">
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Registration</h1>
          <p className="text-primary-light">Register as an opportunity admin</p>
        </div>
        <AdminAuthForm mode="register" />
      </div>
    </div>
  );
};

export default AdminRegister;
