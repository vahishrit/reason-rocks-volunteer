
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import HoursForm from "@/components/HoursForm";
import HoursTable from "@/components/HoursTable";
import PreviousHoursTable from "@/components/PreviousHoursTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HoursEntry = {
  id: string;
  date: string;
  hours: number;
  custom_title: string | null;
  description: string | null;
  status: string | null;
  proof_url: string | null;
  submitted_at: string | null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalApprovedHours, setTotalApprovedHours] = useState(0);

  const fetchHours = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('hours')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      setHours(data || []);
      
      // Calculate total approved hours from both current and previous hours
      const currentApprovedHours = (data || [])
        .filter(entry => entry.status === 'approved')
        .reduce((total, entry) => total + entry.hours, 0);

      // Get approved hours from previous_hours table
      const { data: previousHours, error: previousError } = await supabase
        .from('previous_hours')
        .select('hours')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (previousError) throw previousError;

      const previousApprovedHours = (previousHours || [])
        .reduce((total, entry) => total + entry.hours, 0);
      
      setTotalApprovedHours(currentApprovedHours + previousApprovedHours);
    } catch (error) {
      console.error('Error fetching hours:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHours();
  }, [user]);

  const handleHoursSubmitted = () => {
    fetchHours();
  };

  return (
    <div className="container py-12 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-primary mb-3">
        Welcome, {user?.full_name || 'Student'}!
      </h1>
      <div className="mb-8">
        <span className="text-lg text-primary-light">
          Total Approved Hours: <b>{totalApprovedHours}</b>
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Hours</TabsTrigger>
              <TabsTrigger value="previous">Previous Hours</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <HoursTable hours={hours} loading={loading} />
            </TabsContent>
            <TabsContent value="previous">
              <PreviousHoursTable />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <HoursForm onHoursSubmitted={handleHoursSubmitted} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
