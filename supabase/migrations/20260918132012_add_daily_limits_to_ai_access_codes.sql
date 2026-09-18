/*
# Add daily usage limits to AI access codes

1. Modified Tables
- `ai_access_codes`
  - `daily_limit` (int, default 20) — max AI calls per day per code
  - `daily_uses_count` (int, default 0) — current usage today
  - `daily_reset_at` (timestptz, nullable) — when the daily counter resets (24h after first use of the day)

2. Logic
- The edge function checks daily_uses_count against daily_limit before serving.
- If daily_reset_at is null or older than 24 hours, the counter resets to 0 and daily_reset_at is set to now().
- This gives each code a rolling 24-hour usage window that resets automatically.

3. Security
- No new tables. Existing RLS policies remain unchanged.
- No destructive operations.

4. Notes
- Existing codes get a default daily_limit of 20 (sufficient for demo/trial use).
- The PRO code (BF45PRO) gets a higher daily_limit of 100.
*/

ALTER TABLE ai_access_codes
  ADD COLUMN IF NOT EXISTS daily_limit int NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS daily_uses_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS daily_reset_at timestamptz;

-- Set higher daily limit for PRO codes
UPDATE ai_access_codes SET daily_limit = 100 WHERE code = 'BF45PRO';
UPDATE ai_access_codes SET daily_limit = 30 WHERE code = 'BF45TRIAL';

-- Add a new demo code with 50 daily limit
INSERT INTO ai_access_codes (code, plan, max_uses, daily_limit, active) VALUES
  ('BF45PROVA', 'trial', 100, 50, true)
ON CONFLICT (code) DO UPDATE SET daily_limit = EXCLUDED.daily_limit;
