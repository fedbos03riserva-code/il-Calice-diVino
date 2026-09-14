/*
# Create work_with_us table

1. New Tables
- `work_with_us`
- `id` (uuid, primary key)
- `name` (text, not null) — nome e cognome del candidato
- `email` (text, not null) — email di contatto
- `role` (text, not null) — ruolo di interesse (es. cantina, ristoratore, export, sviluppatore, marketing)
- `message` (text, not null) — messaggio del candidato
- `status` (text, default 'new') — stato della candidatura (new, reviewed, contacted)
- `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `work_with_us`.
- INSERT: anon + authenticated (chiunque puo inviare candidatura)
- SELECT/UPDATE/DELETE: authenticated only (solo admin puo leggere/gestire)
*/

CREATE TABLE IF NOT EXISTS work_with_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE work_with_us ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_work_with_us" ON work_with_us;
CREATE POLICY "anon_insert_work_with_us" ON work_with_us FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_work_with_us" ON work_with_us;
CREATE POLICY "auth_select_work_with_us" ON work_with_us FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_work_with_us" ON work_with_us;
CREATE POLICY "auth_update_work_with_us" ON work_with_us FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_work_with_us" ON work_with_us;
CREATE POLICY "auth_delete_work_with_us" ON work_with_us FOR DELETE
  TO authenticated USING (true);
