
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  mode: "login" | "register";
};

type Opportunity = {
  id: string;
  title: string;
  description: string;
};

const gradeOptions = ["6", "7", "8", "9", "10", "11", "12"];

const AdminAuthForm: React.FC<Props> = ({ mode }) => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    full_name: "",
    grade: "",
    email: "",
    password: "",
    opportunity_id: "",
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const validDomain = (email: string) => email.endsWith("@wws.k12.in.us");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('id, title, description')
        .order('title');

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities.",
        variant: "destructive",
      });
    }
  };

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

    if (!form.opportunity_id) {
      setMessage({ type: "error", text: "Please select an opportunity to manage." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        grade: form.grade,
      });
      
      if (error) throw error;

      // After successful signup, we need to update the user as admin and assign opportunity
      // This will happen via a trigger or we can do it here after email verification
      setMessage({
        type: "success",
        text: "Admin account created! Please check your email to verify your account. After verification, your opportunity assignment will be processed.",
      });

      // Store the opportunity_id temporarily (in a real app, you'd handle this more securely)
      localStorage.setItem('pending_admin_opportunity', form.opportunity_id);
      
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 max-w-md mx-auto mt-8 space-y-6 animate-fade-in">
      <div>
        <label className="block text-primary font-semibold mb-1">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>
      
      <div>
        <label className="block text-primary font-semibold mb-1">Grade</label>
        <select
          name="grade"
          value={form.grade}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select Grade</option>
          {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-primary font-semibold mb-1">Opportunity to Manage</label>
        <select
          name="opportunity_id"
          value={form.opportunity_id}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select Opportunity</option>
          {opportunities.map(opp => (
            <option key={opp.id} value={opp.id}>
              {opp.title}
            </option>
          ))}
        </select>
        {form.opportunity_id && (
          <div className="text-sm text-gray-600 mt-1">
            {opportunities.find(o => o.id === form.opportunity_id)?.description}
          </div>
        )}
      </div>

      <div>
        <label className="block text-primary font-semibold mb-1">School Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          pattern=".+@wws\.k12\.in\.us"
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-primary font-semibold mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-accent font-extrabold rounded-lg py-2 hover:bg-primary-light transition"
        disabled={loading}
      >
        {loading ? "Creating Admin Account..." : "Register as Admin"}
      </button>

      {message && (
        <div className={`text-center ${message.type === "error" ? "text-red-600" : "text-green-700"} mt-2`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default AdminAuthForm;
