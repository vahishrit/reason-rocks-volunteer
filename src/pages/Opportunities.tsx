
import React from "react";
import OpportunityCard from "@/components/OpportunityCard";

// TEMP DATA - replace with DB later
const demoOps = [
  {
    title: "Food Pantry Assistant",
    org: "Westfield Food Bank",
    tags: ["Community", "Food"],
    signup_link: "https://signup.example.com/food",
    location: "Westfield, IN",
    description: "Help organize and hand out food to local families in need.",
    category: "Community",
  },
  {
    title: "Animal Shelter Helper",
    org: "Hamilton Co. Animal Shelter",
    tags: ["Animals", "Care"],
    signup_link: "https://signup.example.com/animals",
    location: "Noblesville, IN",
    description: "Support pet care and adoption event operations.",
    category: "Animals",
  },
  {
    title: "Park Cleanup Crew",
    org: "Friends of Westfield Parks",
    tags: ["Environment", "Outdoors"],
    signup_link: "https://signup.example.com/parks",
    location: "Grand Park, Westfield",
    description: "Join us to keep our city parks clean and beautiful.",
    category: "Environment",
  },
];

const Opportunities = () => (
  <div className="container py-12">
    <h1 className="text-3xl font-bold text-primary mb-8">Browse Volunteer Opportunities</h1>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {demoOps.map((op) => (
        <OpportunityCard op={op} key={op.title} />
      ))}
    </div>
  </div>
);

export default Opportunities;
