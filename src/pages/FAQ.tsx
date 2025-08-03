
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
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-sunborn font-bold text-center text-foreground mb-12">FAQ</h1>
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={f.q} className="bg-card rounded-xl overflow-hidden shadow-lg">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="flex w-full justify-between items-center py-4 px-6 bg-card text-card-foreground hover:bg-card/80 transition-all font-semibold text-left"
              >
                <span className="text-lg">{f.q}</span>
                <span className="text-2xl font-bold ml-4 flex-shrink-0">
                  {open === idx ? "−" : "+"}
                </span>
              </button>
              {open === idx && (
                <div className="bg-card border-t border-border px-6 py-4 text-card-foreground">
                  <p className="leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default FAQ;
