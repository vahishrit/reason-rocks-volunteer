
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface HoursTableProps {
  hours: HoursEntry[];
  loading: boolean;
}

const HoursTable = ({ hours, loading }: HoursTableProps) => {
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Submitted Hours</CardTitle>
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
        <CardTitle>Your Submitted Hours</CardTitle>
      </CardHeader>
      <CardContent>
        {hours.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hours submitted yet. Use the form to log your first volunteer hours!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.map((entry) => (
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
                      {entry.status || 'pending'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {entry.submitted_at ? new Date(entry.submitted_at).toLocaleDateString() : '-'}
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

export default HoursTable;
