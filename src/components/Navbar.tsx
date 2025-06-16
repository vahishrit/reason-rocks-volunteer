
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white px-8 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center font-bold text-xl tracking-tight hover:opacity-90 transition">
          Rocks for a Reason
        </Link>
      </div>
      <ul className="flex gap-6 items-center">
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={`hover:text-accent transition ${location.pathname === to ? "border-b-2 border-accent" : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
        {user ? (
          <>
            <li className="flex items-center gap-2 pl-2">
              <User size={20} className="text-accent" />
              <span className="font-medium">{user.full_name || user.email}</span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="ml-3 bg-accent hover:bg-accent-dark text-primary font-semibold py-1.5 px-4 rounded-lg shadow transition"
              >Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="font-medium hover:text-accent transition">Login</Link></li>
            <li><Link to="/register" className="font-medium hover:text-accent transition">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
