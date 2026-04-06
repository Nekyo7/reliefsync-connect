-- ==========================================
-- RELIEFSYNC COMPLETE SUPABASE DATABASE SCHEMA
-- ==========================================

-- 1. PROFILES TABLE (Populated automatically when users sign up via the React App)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('volunteer', 'ngo', 'coordinator')),
  email TEXT NOT NULL,
  organization_name TEXT,
  location TEXT,
  skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VOLUNTEERS TABLE (Populated via n8n from Google Forms)
-- Note: This is an independent table from profiles, enabling workflows where 
-- volunteers register via a public form before securing a login account.
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  availability TEXT DEFAULT 'PART_TIME',
  tasks_completed INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TASKS TABLE (Populated via n8n from NGO Google Forms)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  required_skills TEXT[] DEFAULT '{}',
  source_type TEXT DEFAULT 'NGO',
  verification_status TEXT DEFAULT 'UNVERIFIED',
  priority_score NUMERIC DEFAULT 0,
  urgency_level TEXT DEFAULT 'LOW',
  status TEXT DEFAULT 'OPEN',
  submitted_by TEXT, -- Email or NGO identifier
  assigned_to TEXT, 
  lat NUMERIC,
  lng NUMERIC,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TASK ASSIGNMENTS TABLE (Populated via React App Volunteer Dashboard)
CREATE TABLE IF NOT EXISTS public.task_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  volunteer_email TEXT NOT NULL,
  status TEXT DEFAULT 'ASSIGNED',
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

-- Allow unrestricted reading for simplicity in early prototyping
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Volunteers are viewable by everyone." ON public.volunteers FOR SELECT USING (true);
CREATE POLICY "Tasks are viewable by everyone." ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Assignments are viewable by everyone." ON public.task_assignments FOR SELECT USING (true);

-- Allow unrestricted inserts from authenticated internal edge functions or users
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Anyone can insert tasks (for n8n API)." ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tasks." ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert assignments." ON public.task_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert volunteers (for n8n API)." ON public.volunteers FOR INSERT WITH CHECK (true);

-- ==========================================
-- AUTOMATIC TRIGGER: Copy data from Auth to Profiles
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, organization_name, location, skills)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'organization_name',
    new.raw_user_meta_data->>'location',
    ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'skills'))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
