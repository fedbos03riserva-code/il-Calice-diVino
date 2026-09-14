/*
# Create ai_access_codes table for AI engine subscription/access control

1. New Tables
- `ai_access_codes`
  - `id` (uuid, primary key)
  - `code` (text, unique, not null — the access code users enter)
  - `plan` (text, not null — 'trial', 'monthly', 'yearly')
  - `max_uses` (int, default 1000 — max API calls per code)
  - `uses_count` (int, default 0 — current usage)
  - `expires_at` (timestamptz, nullable — when the code expires)
  - `active` (boolean, default true)
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `ai_access_codes`.
- No-auth app: SELECT public (frontend needs to validate codes via anon key).
- INSERT/UPDATE: also public (admin panel manages codes via anon key — no auth in this app).
- No DELETE for safety.

3. Notes
- The AI pairing engine (edge function) checks this table before serving results.
- Users enter a code in the UI; the edge function validates it against this table.
- If valid and under usage limit, the AI returns full pairing results.
- If no code or invalid, the frontend falls back to the local IRC engine (basic pairing).
- Seed with a demo code for testing.
*/

CREATE TABLE IF NOT EXISTS ai_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'trial',
  max_uses int NOT NULL DEFAULT 1000,
  uses_count int NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_access_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_ai_codes" ON ai_access_codes;
CREATE POLICY "anon_select_ai_codes" ON ai_access_codes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ai_codes" ON ai_access_codes;
CREATE POLICY "anon_insert_ai_codes" ON ai_access_codes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ai_codes" ON ai_access_codes;
CREATE POLICY "anon_update_ai_codes" ON ai_access_codes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed demo codes
INSERT INTO ai_access_codes (code, plan, max_uses, active) VALUES
  ('BF45DEMO', 'trial', 100, true),
  ('BF45TRIAL', 'trial', 50, true),
  ('BF45PRO', 'monthly', 10000, true)
ON CONFLICT (code) DO NOTHING;
