
import React from "react";

const About = () => (
  <div className="container py-14 max-w-2xl animate-fade-in">
    <h1 className="text-3xl font-bold text-primary mb-4">About Rocks for a Reason</h1>
    <p className="text-lg text-gray-800 mb-7">
      <b>Rocks for a Reason</b> is a student-run volunteer initiative at Westfield High School, aiming to connect students with local opportunities to serve, grow, and make a positive impact. Our mission is to make volunteering easy, rewarding, and recognized for every student.
    </p>
    <ul className="list-disc pl-6 space-y-2 text-primary-light mb-8">
      <li>Find and track approved volunteer hours in one place.</li>
      <li>Discover local organizations and service projects.</li>
      <li>Empower students to lead with compassion and excellence.</li>
    </ul>
    <div className="text-primary-light italic">
      “Be the reason someone believes in the goodness of people.” — <span className="text-accent">Rocks for a Reason</span>
    </div>
  </div>
);

export default About;
