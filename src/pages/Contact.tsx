
import React, { useState } from "react";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12">
      <div className="w-full max-w-md mx-4">
        <h1 className="text-3xl font-sunborn font-bold text-center text-foreground mb-8">CONTACT</h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-2xl space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-card-foreground">Name</label>
            <input
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
              name="name" value={form.name} required onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-card-foreground">Email</label>
            <input
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
              name="email" type="email" value={form.email} required onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-card-foreground">Message</label>
            <textarea
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              name="message" rows={6} value={form.message} required onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-accent text-accent-foreground rounded-lg py-3 font-bold hover:bg-accent/90 transition-all transform hover:scale-105"
          >
            {sent ? "SENT!" : "SEND MESSAGE"}
          </button>
          {sent && <p className="text-accent text-center mt-4 font-semibold">Message sent — thank you!</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
