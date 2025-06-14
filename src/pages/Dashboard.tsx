
import React from "react";
// Placeholder page — connect db later

const Dashboard = () => (
  <div className="container py-12 min-h-[70vh]">
    <h1 className="text-3xl font-bold text-primary mb-3">Welcome, Student!</h1>
    <div className="mb-8">
      <span className="text-lg text-primary-light">Total Approved Hours: <b>—</b></span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-3">Submitted Hours</h2>
        <p>This table will show your submissions after the database is set up.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-3">Log New Hours</h2>
        <p>The hours submission form will appear here soon.</p>
      </div>
    </div>
  </div>
);
export default Dashboard;
