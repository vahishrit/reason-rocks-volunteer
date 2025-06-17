
import React from "react";
import AdminHoursTable from "@/components/AdminHoursTable";

const AdminDashboard = () => (
  <div className="container py-12 min-h-[75vh]">
    <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>
    <AdminHoursTable />
  </div>
);

export default AdminDashboard;
