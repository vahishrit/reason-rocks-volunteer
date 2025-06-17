
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type HoursEntry = {
  id: string;
  date: string;
  hours: number;
  custom_title: string | null;
  description: string | null;
  status: string | null;
  proof_url: string | null;
  submitted_at: string | null;
  user_id: string;
  users: {
    full_name: string;
    email: string;
  };
};

const AdminHoursTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hours, setHours] = useState<HoursEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllHours = async () => {
    if (!user?.isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('hours')
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setHours(data || []);
    } catch (error) {
      console.error('Error fetching hours:', error);
      toast({
        title: "Error",
        description: "Failed to fetch volunteer hours.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHours();
  }, [user]);

  const updateHoursStatus = async (hoursId: string, status: 'approved' | 'rejected') => {
    try {
      const updateData: any = {
        status,
      };

      if (status === 'approved') {
        updateData.approved_by = user?.id;
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('hours')
        .update(updateData)
        .eq('id', hoursId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Hours ${status} successfully.`,
      });

      fetchAllHours();
    } catch (error) {
      console.error('Error updating hours status:', error);
      toast({
        title: "Error",
        description: "Failed to update hours status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  if (!user?.isAdmin) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Volunteer Hours - Admin View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Volunteer Hours - Admin Review</CardTitle>
      </CardHeader>
      <CardContent>
        {hours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No volunteer hours submitted yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.users?.full_name}</div>
                      <div className="text-sm text-gray-500">{entry.users?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {entry.custom_title || 'Volunteer Work'}
                      </div>
                      {entry.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {entry.description}
                        </div>
                      )}
                      {entry.proof_url && (
                        <a 
                          href={entry.proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Proof
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.hours}</TableCell>
                  <TableCell>
                    <span className={getStatusBadge(entry.status)}>
                      {entry.status || 'pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {entry.submitted_at ? new Date(entry.submitted_at).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    {entry.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateHoursStatus(entry.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateHoursStatus(entry.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminHoursTable;
