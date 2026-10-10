-- B&F 45 — Database Migration SQL
-- Copy and paste this into the Supabase Dashboard SQL Editor to create the tables.
-- Path: Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- These tables store wine reviews, user registrations, and saved wines.
-- The app uses localStorage-based auth (no Supabase Auth sign-in), so all
-- policies use TO anon, authenticated to allow the anon-key client to work.

CREATE TABLE IF NOT EXISTS wine_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id text NOT NULL,
  user_name text NOT NULL,
  user_email text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL DEFAULT '',
  helpful integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wine_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_wine_reviews" ON wine_reviews;
CREATE POLICY "anon_select_wine_reviews" ON wine_reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_wine_reviews" ON wine_reviews;
CREATE POLICY "anon_insert_wine_reviews" ON wine_reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_wine_reviews" ON wine_reviews;
CREATE POLICY "anon_update_wine_reviews" ON wine_reviews FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_wine_reviews" ON wine_reviews;
CREATE POLICY "anon_delete_wine_reviews" ON wine_reviews FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_wine_reviews_wine_id ON wine_reviews(wine_id);

CREATE TABLE IF NOT EXISTS platform_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text NOT NULL,
  role text NOT NULL DEFAULT 'privato',
  telefono text,
  partita_iva text,
  ragione_sociale text,
  paese_attivita text,
  winery_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_platform_users" ON platform_users;
CREATE POLICY "anon_select_platform_users" ON platform_users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_platform_users" ON platform_users;
CREATE POLICY "anon_insert_platform_users" ON platform_users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_platform_users" ON platform_users;
CREATE POLICY "anon_update_platform_users" ON platform_users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_platform_users" ON platform_users;
CREATE POLICY "anon_delete_platform_users" ON platform_users FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS saved_wines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id text NOT NULL,
  user_email text,
  wine_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_wines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_wines" ON saved_wines;
CREATE POLICY "anon_select_saved_wines" ON saved_wines FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_wines" ON saved_wines;
CREATE POLICY "anon_insert_saved_wines" ON saved_wines FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_wines" ON saved_wines;
CREATE POLICY "anon_update_saved_wines" ON saved_wines FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_wines" ON saved_wines;
CREATE POLICY "anon_delete_saved_wines" ON saved_wines FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_saved_wines_wine_id ON saved_wines(wine_id);

-- Helper RPC for atomic helpful-count increment
CREATE OR REPLACE FUNCTION increment_review_helpful(review_id uuid)
RETURNS void AS $
BEGIN
  UPDATE wine_reviews SET helpful = helpful + 1 WHERE id = review_id;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_review_helpful(uuid) TO anon, authenticated;
