/* ============================================================
   config.js — Supabase connection settings (story 5.1)

   The anon/publishable key is designed to be used in browser code:
   it is protected by the Row-Level Security policies defined in
   db/schema.sql. Never put the service_role/secret key here.

   Set USE_SUPABASE = false to fall back to browser localStorage
   (useful offline, or if the database is unreachable).
   ============================================================ */

const SUPABASE_URL = "https://yifijmyyrvmbzwtjmgsb.supabase.co";

// anon / publishable key (Supabase → Settings → API → Project API keys)
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZmlqbXl5cnZtYnp3dGptZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3Nzg2NTUsImV4cCI6MjEwMTM1NDY1NX0.uwN-ebAXiX4_VrFXOIcYZjOBZriY3VMEuPpisrPeNgw";

// Master switch: use the cloud database when configured, else localStorage.
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
