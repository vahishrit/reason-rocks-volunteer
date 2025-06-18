
-- Add opportunity_id column to users table to link admins to opportunities
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS opportunity_id uuid REFERENCES public.opportunities(id);

-- Add admin signature requirement - modify previous_hours to include admin signature
ALTER TABLE public.previous_hours ADD COLUMN IF NOT EXISTS admin_signature text;

-- Drop existing policies that conflict and recreate them
DROP POLICY IF EXISTS "Users can view their own hours" ON public.hours;
DROP POLICY IF EXISTS "Users can insert their own hours" ON public.hours;
DROP POLICY IF EXISTS "Users can update their own pending hours" ON public.hours;

-- Create comprehensive policies for hours table
CREATE POLICY "Users can view their own hours" ON public.hours
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hours" ON public.hours
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending hours" ON public.hours
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

-- Add policy for opportunity admins to view their opportunity's hours
CREATE POLICY "Opportunity admins can view their opportunity hours" ON public.hours
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.opportunity_id = hours.opportunity_id
      AND users.is_admin = true
    )
  );

-- Add policy for opportunity admins to update their opportunity's hours
CREATE POLICY "Opportunity admins can update their opportunity hours" ON public.hours
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.opportunity_id = hours.opportunity_id
      AND users.is_admin = true
    )
  );

-- Add policy for opportunity admins to view their processed hours in previous_hours
CREATE POLICY "Opportunity admins can view their processed hours" ON public.previous_hours
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.hours h ON h.opportunity_id = u.opportunity_id
      WHERE u.id = auth.uid() 
      AND u.is_admin = true
      AND h.id = previous_hours.original_hours_id
    )
    OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
