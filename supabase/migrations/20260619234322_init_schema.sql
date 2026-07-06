-- ============================================================
-- SKILLGATE DATABASE SCHEMA - Full Migration
-- Generated for Supabase PostgreSQL
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. CUSTOM TYPES (ENUMS)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('mahasiswa', 'umkm', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE gig_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 3. TABLES
-- ============================================================

-- 3.1 Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'mahasiswa',
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'Profil dasar pengguna SkillGate, extends auth.users';

-- 3.2 Student Profiles
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  nim text DEFAULT '',
  university text DEFAULT '',
  major text DEFAULT '',
  semester int DEFAULT 1,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  bio text DEFAULT '',
  hours_per_week int DEFAULT 10,
  portfolio_links text[] DEFAULT '{}',
  rating_avg numeric(3,2) DEFAULT 0.00,
  readiness_score int DEFAULT 0,
  total_earned numeric(12,2) DEFAULT 0.00,
  projects_completed int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.student_profiles IS 'Detail profil akademik dan keahlian mahasiswa';

-- 3.3 UMKM Profiles
CREATE TABLE IF NOT EXISTS public.umkm_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  business_name text NOT NULL DEFAULT '',
  category text DEFAULT '',
  address text DEFAULT '',
  description text DEFAULT '',
  website text DEFAULT '',
  rating_avg numeric(3,2) DEFAULT 0.00,
  total_spent numeric(12,2) DEFAULT 0.00,
  projects_posted int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.umkm_profiles IS 'Detail profil bisnis UMKM';

-- 3.4 Gigs (Micro-gig Projects)
CREATE TABLE IF NOT EXISTS public.gigs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  umkm_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  skills_required text[] DEFAULT '{}',
  output_expected text DEFAULT '',
  budget numeric(12,2) DEFAULT 0.00,
  deadline date,
  status gig_status NOT NULL DEFAULT 'open',
  applicant_count int DEFAULT 0,
  accepted_student_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.gigs IS 'Lowongan proyek mikro dari UMKM';

-- 3.5 Applications (Proposals)
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id uuid NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  cover_letter text DEFAULT '',
  timeline_days int DEFAULT 3,
  bid_amount numeric(12,2) DEFAULT 0.00,
  attachment_urls text[] DEFAULT '{}',
  status application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(gig_id, student_id) -- satu mahasiswa hanya bisa melamar sekali per gig
);

COMMENT ON TABLE public.applications IS 'Lamaran/proposal mahasiswa untuk proyek UMKM';

-- 3.6 Messages (Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id uuid REFERENCES public.gigs(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.messages IS 'Pesan chat antar pengguna terkait proyek';

-- 3.7 Reviews (Ratings)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id uuid NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(gig_id, reviewer_id) -- satu reviewer hanya bisa memberi ulasan sekali per gig
);

COMMENT ON TABLE public.reviews IS 'Ulasan dan rating penyelesaian proyek';

-- 3.8 Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  type text DEFAULT 'info', -- 'info', 'success', 'warning', 'gig_update', 'application_update'
  related_gig_id uuid REFERENCES public.gigs(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'Notifikasi untuk pengguna';

-- ============================================================
-- 4. INDEXES (Performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_gigs_umkm_id ON public.gigs(umkm_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON public.gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON public.gigs(category);
CREATE INDEX IF NOT EXISTS idx_gigs_created_at ON public.gigs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_gig_id ON public.applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

CREATE INDEX IF NOT EXISTS idx_messages_gig_id ON public.messages(gig_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_gig_id ON public.reviews(gig_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ============================================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================================

-- 5.1 Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to all relevant tables
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['users', 'student_profiles', 'umkm_profiles', 'gigs', 'applications'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
      CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    ', tbl, tbl);
  END LOOP;
END $$;

-- 5.2 Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role_val public.user_role;
  raw_meta jsonb;
BEGIN
  raw_meta := NEW.raw_user_meta_data;
  
  -- Determine role from metadata, default to 'mahasiswa'
  BEGIN
    user_role_val := (COALESCE(raw_meta->>'role', 'mahasiswa'))::public.user_role;
  EXCEPTION WHEN OTHERS THEN
    user_role_val := 'mahasiswa';
  END;
  
  -- Insert into public.users
  INSERT INTO public.users (id, role, full_name, phone, avatar_url)
  VALUES (
    NEW.id,
    user_role_val,
    COALESCE(raw_meta->>'full_name', ''),
    COALESCE(raw_meta->>'phone', ''),
    COALESCE(raw_meta->>'avatar_url', '')
  );
  
  -- Insert into role-specific profile table
  IF user_role_val = 'mahasiswa' THEN
    INSERT INTO public.student_profiles (user_id, nim, university, major, semester, skills, interests, bio, hours_per_week, readiness_score)
    VALUES (
      NEW.id,
      COALESCE(raw_meta->>'nim', ''),
      COALESCE(raw_meta->>'university', ''),
      COALESCE(raw_meta->>'major', ''),
      COALESCE((raw_meta->>'semester')::int, 1),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(raw_meta->'skills')), '{}'),
      COALESCE(ARRAY(SELECT jsonb_array_elements_text(raw_meta->'interests')), '{}'),
      COALESCE(raw_meta->>'bio', ''),
      COALESCE((raw_meta->>'hours_per_week')::int, 10),
      COALESCE((raw_meta->>'readiness_score')::int, 0)
    );
  ELSIF user_role_val = 'umkm' THEN
    INSERT INTO public.umkm_profiles (user_id, business_name, category, address, description)
    VALUES (
      NEW.id,
      COALESCE(raw_meta->>'business_name', ''),
      COALESCE(raw_meta->>'category', ''),
      COALESCE(raw_meta->>'address', ''),
      COALESCE(raw_meta->>'description', '')
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5.3 Update applicant_count on applications insert/delete
CREATE OR REPLACE FUNCTION public.update_applicant_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.gigs SET applicant_count = applicant_count + 1 WHERE id = NEW.gig_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.gigs SET applicant_count = applicant_count - 1 WHERE id = OLD.gig_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_applicant_count ON public.applications;
CREATE TRIGGER trg_update_applicant_count
  AFTER INSERT OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_applicant_count();

-- 5.4 Update rating_avg on review insert
CREATE OR REPLACE FUNCTION public.update_rating_avg()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  avg_rating numeric(3,2);
  reviewee_role public.user_role;
BEGIN
  -- Calculate new average
  SELECT AVG(rating)::numeric(3,2) INTO avg_rating
  FROM public.reviews WHERE reviewee_id = NEW.reviewee_id;
  
  -- Get role of reviewee
  SELECT role INTO reviewee_role FROM public.users WHERE id = NEW.reviewee_id;
  
  -- Update appropriate profile
  IF reviewee_role = 'mahasiswa' THEN
    UPDATE public.student_profiles SET rating_avg = avg_rating WHERE user_id = NEW.reviewee_id;
  ELSIF reviewee_role = 'umkm' THEN
    UPDATE public.umkm_profiles SET rating_avg = avg_rating WHERE user_id = NEW.reviewee_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_rating_avg ON public.reviews;
CREATE TRIGGER trg_update_rating_avg
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_rating_avg();

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6.1 Users Policies
CREATE POLICY "Users: viewable by everyone"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users: update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- 6.2 Student Profiles Policies
CREATE POLICY "Student profiles: viewable by everyone"
  ON public.student_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Student profiles: update own"
  ON public.student_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 6.3 UMKM Profiles Policies
CREATE POLICY "UMKM profiles: viewable by everyone"
  ON public.umkm_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "UMKM profiles: update own"
  ON public.umkm_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 6.4 Gigs Policies
CREATE POLICY "Gigs: viewable by everyone"
  ON public.gigs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Gigs: UMKM can insert own"
  ON public.gigs FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = umkm_id);

CREATE POLICY "Gigs: UMKM can update own"
  ON public.gigs FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = umkm_id)
  WITH CHECK ((select auth.uid()) = umkm_id);

CREATE POLICY "Gigs: UMKM can delete own"
  ON public.gigs FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = umkm_id);

-- 6.5 Applications Policies
CREATE POLICY "Applications: students see own, UMKM see for their gigs"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = student_id 
    OR 
    EXISTS (SELECT 1 FROM public.gigs WHERE gigs.id = applications.gig_id AND gigs.umkm_id = (select auth.uid()))
  );

CREATE POLICY "Applications: students can insert own"
  ON public.applications FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = student_id);

CREATE POLICY "Applications: UMKM can update for their gigs"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.gigs WHERE gigs.id = applications.gig_id AND gigs.umkm_id = (select auth.uid()))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.gigs WHERE gigs.id = applications.gig_id AND gigs.umkm_id = (select auth.uid()))
  );

-- 6.6 Messages Policies
CREATE POLICY "Messages: participants can view"
  ON public.messages FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = sender_id OR (select auth.uid()) = receiver_id);

CREATE POLICY "Messages: authenticated can send"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = sender_id);

CREATE POLICY "Messages: receiver can mark read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = receiver_id)
  WITH CHECK ((select auth.uid()) = receiver_id);

-- 6.7 Reviews Policies
CREATE POLICY "Reviews: viewable by everyone"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Reviews: authenticated can insert own"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = reviewer_id);

-- 6.8 Notifications Policies
CREATE POLICY "Notifications: user sees own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Notifications: user can update own (mark read)"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================
-- 7. REALTIME SUBSCRIPTIONS
-- ============================================================
-- Enable realtime for messages and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================================
-- 8. SEED DATA (Sample Gigs for Demo)
-- ============================================================
-- Note: Seed data will be inserted via the application after
-- a demo UMKM user is created through the auth signup flow.
-- This ensures proper foreign key references.
