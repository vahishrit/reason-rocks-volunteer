
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  const fetchAllHours = async () => {
    if (!user?.isAdmin) {
      setLoading(false);
      return;
    }

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
        .eq('status', 'pending')
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
      const hoursEntry = hours.find(h => h.id === hoursId);
      if (!hoursEntry) return;

      // Move to previous_hours table
      const { error: insertError } = await supabase
        .from('previous_hours')
        .insert({
          original_hours_id: hoursId,
          user_id: hoursEntry.user_id,
          date: hoursEntry.date,
          hours: hoursEntry.hours,
          custom_title: hoursEntry.custom_title,
          description: hoursEntry.description,
          proof_url: hoursEntry.proof_url,
          status,
          review_comment: comments[hoursId] || null,
          submitted_at: hoursEntry.submitted_at,
          approved_by: user?.id,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        });

      if (insertError) throw insertError;

      // Delete from current hours table
      const { error: deleteError } = await supabase
        .from('hours')
        .delete()
        .eq('id', hoursId);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: `Hours ${status} successfully.`,
      });

      // Clear the comment for this entry
      setComments(prev => {
        const newComments = { ...prev };
        delete newComments[hoursId];
        return newComments;
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

  const handleCommentChange = (hoursId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [hoursId]: comment
    }));
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
          <CardTitle>Pending Volunteer Hours - Admin Review</CardTitle>
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
        <CardTitle>Pending Volunteer Hours - Admin Review</CardTitle>
      </CardHeader>
      <CardContent>
        {hours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending volunteer hours to review.
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
                <TableHead>Review Comment</TableHead>
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
                    <Textarea
                      placeholder="Add review comment..."
                      value={comments[entry.id] || ''}
                      onChange={(e) => handleCommentChange(entry.id, e.target.value)}
                      className="min-h-[80px] text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
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
