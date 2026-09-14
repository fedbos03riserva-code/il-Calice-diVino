/*
# Create RFQ table for export requests

1. New Tables
- `rfqs` — stores Request for Quote submissions from international buyers
  - `id` (uuid, primary key)
  - `winery_id` (text, nullable — references winery directory code, not FK since wineries are static data)
  - `paese` (text, not null — destination country)
  - `volume` (text, not null — requested volume)
  - `tipologia` (text, nullable — wine type)
  - `budget` (text, nullable — budget range)
  - `incoterm` (text, not null — preferred incoterm)
  - `nome` (text, not null — contact name)
  - `email` (text, not null — contact email)
  - `azienda` (text, nullable — company name)
  - `note` (text, nullable — additional notes)
  - `status` (text, default 'nuova' — nuova, in_lavorazione, chiusa)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `rfqs`.
- This is a no-auth app (no sign-in screen), so policies use `TO anon, authenticated`.
- INSERT: anyone can submit an RFQ (public form).
- SELECT: only readable via service role (dashboard is internal, not public-facing).
  The anon key CANNOT read RFQs — this protects buyer data.
- No UPDATE/DELETE for anon.

3. Notes
- The analytics dashboard reads RFQ data via the service role key in an edge function,
  NOT via the anon key. This keeps buyer data private while showing aggregate stats.
*/

CREATE TABLE IF NOT EXISTS rfqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  winery_id text,
  paese text NOT NULL,
  volume text NOT NULL,
  tipologia text,
  budget text,
  incoterm text NOT NULL DEFAULT 'FOB',
  nome text NOT NULL,
  email text NOT NULL,
  azienda text,
  note text,
  status text NOT NULL DEFAULT 'nuova',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;

-- Allow public insert (the RFQ form is public, no sign-in needed)
DROP POLICY IF EXISTS "anon_insert_rfqs" ON rfqs;
CREATE POLICY "anon_insert_rfqs" ON rfqs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon — RFQ data is private
-- The internal dashboard reads via service role (bypasses RLS)
