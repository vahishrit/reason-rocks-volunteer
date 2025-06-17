
import React from "react";

type Opportunity = {
  id: string;
  title: string;
  org?: string;
  tags: string[];
  signup_link: string;
  location?: string;
  category?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  people_needed?: number;
  volunteer_type?: string;
};

const OpportunityCard: React.FC<{op: Opportunity}> = ({ op }) => (
  <div className="rounded-xl border shadow bg-white p-6 flex flex-col justify-between min-w-[290px] hover:shadow-xl transition hover-scale">
    <div>
      <h3 className="text-xl font-bold text-primary mb-1">{op.title}</h3>
      {op.org && <p className="text-sm text-primary-light font-semibold mb-1">{op.org}</p>}
      <p className="text-xs text-gray-600 mb-2">{op.location}</p>
      
      {(op.start_date || op.end_date || op.people_needed) && (
        <div className="text-xs text-gray-500 mb-2 space-y-1">
          {op.start_date && <div>Starts: {new Date(op.start_date).toLocaleDateString()}</div>}
          {op.end_date && <div>Ends: {new Date(op.end_date).toLocaleDateString()}</div>}
          {op.people_needed && <div>Volunteers needed: {op.people_needed}</div>}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {op.tags.map(tag => (
          <span className="bg-accent text-primary font-semibold rounded-full px-3 py-1 text-xs" key={tag}>{tag}</span>
        ))}
      </div>
      {op.description && (
        <p className="text-[15px] text-gray-800 mb-3">{op.description}</p>
      )}
    </div>
    <a
      href={op.signup_link}
      className="inline-block mt-3 py-1.5 px-4 rounded-lg bg-primary text-accent font-bold shadow hover:bg-primary-light transition"
      target="_blank" rel="noopener noreferrer"
    >
      Sign Up
    </a>
  </div>
);

export default OpportunityCard;
