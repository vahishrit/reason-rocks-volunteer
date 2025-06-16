
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const HoursForm = ({ onHoursSubmitted }: { onHoursSubmitted: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: '',
    customTitle: '',
    description: '',
    proofUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('hours')
        .insert({
          user_id: user.id,
          date: formData.date,
          hours: parseFloat(formData.hours),
          custom_title: formData.customTitle || null,
          description: formData.description || null,
          proof_url: formData.proofUrl || null,
          status: 'pending',
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Hours submitted!",
        description: "Your volunteer hours have been submitted for review.",
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        customTitle: '',
        description: '',
        proofUrl: ''
      });

      onHoursSubmitted();
    } catch (error) {
      console.error('Error submitting hours:', error);
      toast({
        title: "Error",
        description: "Failed to submit hours. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log New Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="hours" className="block text-sm font-medium mb-2">
              Hours
            </label>
            <Input
              id="hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="2.5"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="customTitle" className="block text-sm font-medium mb-2">
              Activity Title
            </label>
            <Input
              id="customTitle"
              placeholder="e.g., Beach cleanup, Food bank volunteer"
              value={formData.customTitle}
              onChange={(e) => setFormData({ ...formData, customTitle: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <Input
              id="description"
              placeholder="Brief description of your volunteer work"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="proofUrl" className="block text-sm font-medium mb-2">
              Proof URL (optional)
            </label>
            <Input
              id="proofUrl"
              type="url"
              placeholder="Link to photo or documentation"
              value={formData.proofUrl}
              onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Hours"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HoursForm;
