
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
    <div className="container py-14 max-w-xl animate-fade-in">
      <h1 className="text-3xl font-bold text-primary mb-4">Contact</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-5">
        <div>
          <label className="block font-semibold mb-1 text-primary">Name</label>
          <input
            className="w-full border rounded-lg px-4 py-2"
            name="name" value={form.name} required onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-primary">Email</label>
          <input
            className="w-full border rounded-lg px-4 py-2"
            name="email" type="email" value={form.email} required onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-primary">Message</label>
          <textarea
            className="w-full border rounded-lg px-4 py-2"
            name="message" rows={5} value={form.message} required onChange={handleChange}
          />
        </div>
        <button type="submit" className="w-full bg-primary text-accent rounded-lg py-2 font-bold hover:bg-primary-light transition">
          {sent ? "Sent!" : "Send Message"}
        </button>
        {sent && <p className="text-green-800 mt-2">Message sent — thank you!</p>}
      </form>
    </div>
  );
};

export default Contact;
