/*
# Create job_listings table

1. New Tables
- `job_listings` — bacheca annunci di lavoro per aziende del settore vino
  - `id` (uuid, primary key)
  - `company` (text, nome azienda)
  - `title` (text, titolo posizione)
  - `role_type` (text, tipo ruolo: cantina, ristoratore, export, marketing, altro)
  - `location` (text, luogo)
  - `description` (text, descrizione annuncio)
  - `requirements` (text, requisiti)
  - `contact_email` (text, email contatto)
  - `active` (boolean, default true)
  - `created_at` (timestamptz, default now)
2. Security
- Enable RLS on `job_listings`.
- SELECT: anon + authenticated (pubblico, visibile a tutti)
- INSERT: anon + authenticated (aziende possono pubblicare)
- UPDATE/DELETE: anon + authenticated (gestione admin)
*/

CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  title text NOT NULL,
  role_type text NOT NULL DEFAULT 'altro',
  location text,
  description text NOT NULL,
  requirements text,
  contact_email text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_jobs" ON job_listings;
CREATE POLICY "anon_select_jobs" ON job_listings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_jobs" ON job_listings;
CREATE POLICY "anon_insert_jobs" ON job_listings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_jobs" ON job_listings;
CREATE POLICY "anon_update_jobs" ON job_listings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_jobs" ON job_listings;
CREATE POLICY "anon_delete_jobs" ON job_listings FOR DELETE
  TO anon, authenticated USING (true);
