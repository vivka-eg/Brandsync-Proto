-- JSON Design Handoff — Make-side schema additions.
-- Make has no migration tooling; apply this against Supabase Postgres manually
-- (Supabase SQL editor, or: psql "$DATABASE_URL" -f db/migrations/20260615_handoff.sql).
-- All changes are additive, nullable, and online-safe.

-- Bill-of-materials captured during generation: which corpus components/patterns/
-- tokens a pattern used. Consumed by /api/handoff/generate to build the manifest.
ALTER TABLE corpus_entries ADD COLUMN IF NOT EXISTS bom JSONB;

-- Stable per-project handoff key (e.g. 'MAKE-3F9C2' or a bound Jira ticket).
-- Assigned once on first handoff so the manifest version history stays continuous.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS handoff_ticket TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS projects_handoff_ticket_key
  ON projects (handoff_ticket) WHERE handoff_ticket IS NOT NULL;
