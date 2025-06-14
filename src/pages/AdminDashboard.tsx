
import React from "react";

// admin emails only (logic on user.isAdmin)
// Placeholder - update w/db wiring
const AdminDashboard = () => (
  <div className="container py-12 min-h-[75vh]">
    <h1 className="text-3xl font-bold text-primary mb-5">Admin Dashboard</h1>
    <div className="bg-white shadow rounded-xl p-8">
      <h2 className="text-xl font-bold mb-3">Pending Volunteer Hours</h2>
      <p>The hours table will go here (for all students, with Approve/Reject).</p>
    </div>
  </div>
);
export default AdminDashboard;
