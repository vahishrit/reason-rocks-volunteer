
-- Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, grade)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'grade')::integer
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on opportunities table (public read access)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view opportunities" 
  ON public.opportunities 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create opportunities" 
  ON public.opportunities 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Enable RLS on hours table
ALTER TABLE public.hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hours" 
  ON public.hours 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hours" 
  ON public.hours 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hours" 
  ON public.hours 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Admin policy for viewing all hours (we'll use a function to check admin status)
CREATE POLICY "Admins can view all hours" 
  ON public.hours 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all hours" 
  ON public.hours 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );
