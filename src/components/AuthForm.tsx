
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  mode: "login" | "register";
};

const gradeOptions = ["6", "7", "8", "9", "10", "11", "12"];

const AuthForm: React.FC<Props> = ({ mode }) => {
  const { signIn, signUp } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    grade: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const validDomain = (email: string) => email.endsWith("@wws.k12.in.us");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validDomain(form.email)) {
      setMessage({ type: "error", text: "You must use your @wws.k12.in.us school email address." });
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        setMessage({ type: "success", text: "Logged in! Redirecting..." });
        // Navigation handled by parent after session update
      } else {
        const { error } = await signUp({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          grade: form.grade,
        });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Account created! Please check your email inbox to verify.",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "register" && (
        <div>
          <label className="block text-card-foreground font-semibold mb-2">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
      )}
      {mode === "register" && (
        <div>
          <label className="block text-card-foreground font-semibold mb-2">Grade</label>
          <select
            name="grade"
            value={form.grade}
            onChange={handleChange}
            required
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="">Select Grade</option>
            {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-card-foreground font-semibold mb-2">School Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          pattern=".+@wws\.k12\.in\.us"
          className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-card-foreground font-semibold mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full bg-input border border-border rounded-lg px-4 py-3 text-card-foreground focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-accent text-accent-foreground font-bold rounded-lg py-3 hover:bg-accent/90 transition-all transform hover:scale-105 uppercase tracking-wide"
        disabled={loading}
      >
        {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
      </button>
      {message && (
        <div className={`text-center mt-4 font-semibold ${message.type === "error" ? "text-red-400" : "text-accent"}`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default AuthForm;
