
import React from "react";

const Footer = () => (
  <footer className="w-full bg-primary text-accent-foreground py-6 mt-12">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4 text-sm">
      <span className="font-bold">Rocks for a Reason</span>
      <span>
        &copy; {new Date().getFullYear()} Westfield High School 
      </span>
    </div>
  </footer>
);

export default Footer;
