
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Filter, MapPin, Users } from "lucide-react";

type FilterProps = {
  filters: {
    startDate: string;
    endDate: string;
    peopleNeeded: string;
    volunteerType: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
};

const OpportunityFilters = ({ filters, onFilterChange, onClearFilters }: FilterProps) => {
  const handleInputChange = (field: string, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter size={20} />
          Filter Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Calendar size={16} />
              Start Date
            </label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Calendar size={16} />
              End Date
            </label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Users size={16} />
              People Needed
            </label>
            <Input
              type="number"
              min="1"
              placeholder="Any number"
              value={filters.peopleNeeded}
              onChange={(e) => handleInputChange('peopleNeeded', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Volunteer Type
            </label>
            <Input
              placeholder="e.g., Community, Animals"
              value={filters.volunteerType}
              onChange={(e) => handleInputChange('volunteerType', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <MapPin size={16} />
              Location
            </label>
            <Input
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full md:w-auto"
          >
            Clear All Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityFilters;
