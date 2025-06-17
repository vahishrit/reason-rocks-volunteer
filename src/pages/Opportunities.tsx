
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import OpportunityCard from "@/components/OpportunityCard";
import OpportunityFilters from "@/components/OpportunityFilters";

type Opportunity = {
  id: string;
  title: string;
  org?: string;
  tags: string[];
  signup_link: string;
  location?: string;
  description?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  people_needed?: number;
  volunteer_type?: string;
};

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    peopleNeeded: '',
    volunteerType: '',
    location: ''
  });

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database data to match component expectations
      const mappedOpportunities = (data || []).map(op => ({
        id: op.id,
        title: op.title,
        org: undefined, // Not in database schema
        tags: op.tags || [],
        signup_link: op.signup_link || '',
        location: op.location,
        description: op.description,
        category: op.category,
        start_date: op.start_date,
        end_date: op.end_date,
        people_needed: op.people_needed,
        volunteer_type: op.volunteer_type,
      }));

      setOpportunities(mappedOpportunities);
      setFilteredOpportunities(mappedOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setOpportunities([]);
      setFilteredOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    let filtered = opportunities;

    // Filter by start date
    if (filters.startDate) {
      filtered = filtered.filter(op => 
        !op.start_date || new Date(op.start_date) >= new Date(filters.startDate)
      );
    }

    // Filter by end date
    if (filters.endDate) {
      filtered = filtered.filter(op => 
        !op.end_date || new Date(op.end_date) <= new Date(filters.endDate)
      );
    }

    // Filter by people needed
    if (filters.peopleNeeded) {
      const needsNumber = parseInt(filters.peopleNeeded);
      filtered = filtered.filter(op => 
        !op.people_needed || op.people_needed >= needsNumber
      );
    }

    // Filter by volunteer type
    if (filters.volunteerType) {
      filtered = filtered.filter(op => 
        op.volunteer_type?.toLowerCase().includes(filters.volunteerType.toLowerCase()) ||
        op.category?.toLowerCase().includes(filters.volunteerType.toLowerCase()) ||
        op.tags?.some(tag => tag.toLowerCase().includes(filters.volunteerType.toLowerCase()))
      );
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(op => 
        op.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredOpportunities(filtered);
  }, [filters, opportunities]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      peopleNeeded: '',
      volunteerType: '',
      location: ''
    });
  };

  if (loading) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Browse Volunteer Opportunities</h1>
        <div className="text-center py-8 text-gray-500">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">Browse Volunteer Opportunities</h1>
      
      <OpportunityFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredOpportunities.length} of {opportunities.length} opportunities
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredOpportunities.map((op) => (
          <OpportunityCard op={op} key={op.id} />
        ))}
      </div>
      
      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {opportunities.length === 0 
            ? "No volunteer opportunities available at this time." 
            : "No opportunities match your current filters. Try adjusting your search criteria."
          }
        </div>
      )}
    </div>
  );
};

export default Opportunities;
