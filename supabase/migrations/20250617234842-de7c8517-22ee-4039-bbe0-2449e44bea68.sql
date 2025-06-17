
-- Add missing columns to opportunities table
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS people_needed integer;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS volunteer_type text;

-- Add review_comment column to hours table if it doesn't exist
ALTER TABLE public.hours ADD COLUMN IF NOT EXISTS review_comment text;

-- Create previous_hours table for processed hours
CREATE TABLE IF NOT EXISTS public.previous_hours (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_hours_id uuid NOT NULL,
  user_id uuid NOT NULL,
  date date NOT NULL,
  hours numeric NOT NULL,
  custom_title text,
  description text,
  proof_url text,
  status text NOT NULL,
  review_comment text,
  submitted_at timestamp with time zone,
  approved_by uuid REFERENCES public.users(id),
  approved_at timestamp with time zone,
  processed_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on previous_hours table
ALTER TABLE public.previous_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for previous_hours table
CREATE POLICY "Users can view their own previous hours" ON public.previous_hours
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all previous hours" ON public.previous_hours
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can manage previous hours" ON public.previous_hours
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Insert demo opportunities into the opportunities table
INSERT INTO public.opportunities (title, description, category, tags, signup_link, location, start_date, end_date, people_needed, volunteer_type)
VALUES 
  (
    'Food Pantry Assistant',
    'Help organize and hand out food to local families in need.',
    'Community',
    ARRAY['Community', 'Food'],
    'https://signup.example.com/food',
    'Westfield, IN',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '14 days',
    10,
    'Community'
  ),
  (
    'Animal Shelter Helper',
    'Support pet care and adoption event operations.',
    'Animals',
    ARRAY['Animals', 'Care'],
    'https://signup.example.com/animals',
    'Noblesville, IN',
    CURRENT_DATE + INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '10 days',
    5,
    'Animals'
  ),
  (
    'Park Cleanup Crew',
    'Join us to keep our city parks clean and beautiful.',
    'Environment',
    ARRAY['Environment', 'Outdoors'],
    'https://signup.example.com/parks',
    'Grand Park, Westfield',
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '12 days',
    20,
    'Environment'
  )
ON CONFLICT DO NOTHING;
