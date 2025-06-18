
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PreviousHoursEntry = {
  id: string;
  date: string;
  hours: number;
  custom_title: string | null;
  description: string | null;
  status: string;
  proof_url: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  review_comment: string | null;
  admin_signature: string | null;
};

const PreviousHoursTable = () => {
  const { user } = useAuth();
  const [previousHours, setPreviousHours] = useState<PreviousHoursEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPreviousHours = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('previous_hours')
        .select('*')
        .eq('user_id', user.id)
        .order('processed_at', { ascending: false });

      if (error) throw error;
      setPreviousHours(data || []);
    } catch (error) {
      console.error('Error fetching previous hours:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousHours();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previous Hours</CardTitle>
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
        <CardTitle>Previous Hours</CardTitle>
      </CardHeader>
      <CardContent>
        {previousHours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No processed hours yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previousHours.map((entry) => (
                <TableRow key={entry.id}>
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
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.hours}</TableCell>
                  <TableCell>
                    <span className={getStatusBadge(entry.status)}>
                      {entry.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {entry.review_comment && (
                        <div className="text-gray-600 mb-1">
                          <strong>Comment:</strong> {entry.review_comment}
                        </div>
                      )}
                      {entry.admin_signature && (
                        <div className="text-gray-600">
                          <strong>Signed by:</strong> {entry.admin_signature}
                        </div>
                      )}
                      {entry.approved_at && (
                        <div className="text-gray-500 text-xs mt-1">
                          {new Date(entry.approved_at).toLocaleDateString()}
                        </div>
                      )}
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

export default PreviousHoursTable;
