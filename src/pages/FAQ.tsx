
import React, { useState } from "react";

const faqs = [
  {
    q: "Who can participate in Rocks for a Reason?",
    a: "All Westfield High School students in grades 6–12 with a school email may join!"
  },
  {
    q: "How do I log my volunteer hours?",
    a: "Once you’re registered and logged in, visit your Dashboard to submit hours for admin approval."
  },
  {
    q: "Are only specific opportunities eligible?",
    a: "Any opportunity approved by the school or community partners is valid. Use the Opportunities page to choose!"
  },
  {
    q: "How do admins approve hours?",
    a: "Admins see all student submissions on the Admin Dashboard. They can approve/reject with one click."
  },
  {
    q: "How do I become an admin?",
    a: "Email the coordinators — admin privileges are granted to staff/approved organizers only."
  }
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="container max-w-2xl py-14 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary mb-7">FAQ</h1>
      <ul className="space-y-3">
        {faqs.map((f, idx) => (
          <li key={f.q}>
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="flex w-full justify-between items-center py-3 px-5 bg-primary-light text-primary rounded-xl hover:bg-primary transition font-semibold"
            >
              <span>{f.q}</span>
              <span>{open === idx ? "-" : "+"}</span>
            </button>
            <div className={`bg-white rounded-b-xl shadow px-5 py-4 text-primary text-[15px] transition-all duration-200 ${open === idx ? "block" : "hidden"}`}>
              {f.a}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FAQ;
