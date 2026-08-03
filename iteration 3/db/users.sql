-- ============================================================================
-- Smart Lost & Found — user accounts & authentication (story 1.1)
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- SECURITY NOTE
-- The browser only ever holds the anon key. Row-Level Security below grants
-- the anon role NO access to the users table at all, so account rows can never
-- be read from the client. Logging in goes through verify_login(), a
-- SECURITY DEFINER function that checks the credentials inside the database
-- and returns only the JCU ID and role — never the password.
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    jcu_id      TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    full_name   TEXT DEFAULT '',
    role        TEXT NOT NULL DEFAULT 'none'
                CHECK (role IN ('student', 'admin', 'none')),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Lock the table down: RLS on, and deliberately NO policy for the anon role,
-- so a browser client cannot SELECT, INSERT, UPDATE or DELETE any account.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- Demo accounts
--   student  → full student access
--   admin    → full administrator access
--   none     → a valid account with no permissions (demonstrates access control)
-- ---------------------------------------------------------------------------
INSERT INTO users (jcu_id, password, full_name, role) VALUES
    ('jc111111', 'student123', 'Student Demo Account',    'student'),
    ('jc999999', 'admin123',   'Campus Security Admin',   'admin'),
    ('jc000000', 'guest123',   'Unapproved Demo Account', 'none')
ON CONFLICT (jcu_id) DO UPDATE
    SET password = EXCLUDED.password,
        full_name = EXCLUDED.full_name,
        role      = EXCLUDED.role;

-- ---------------------------------------------------------------------------
-- verify_login(): the only way a client can authenticate.
-- Runs with the definer's rights so it can read `users` even though the
-- caller cannot. Returns one row on success, zero rows on failure.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION verify_login(p_jcu_id TEXT, p_password TEXT)
RETURNS TABLE (jcu_id TEXT, full_name TEXT, role TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT u.jcu_id, u.full_name, u.role
    FROM users u
    WHERE lower(u.jcu_id) = lower(trim(p_jcu_id))
      AND u.password = p_password;
$$;

-- Allow the browser (anon role) to call the function, but nothing else.
GRANT EXECUTE ON FUNCTION verify_login(TEXT, TEXT) TO anon;

-- ---------------------------------------------------------------------------
-- Try it:
--   SELECT * FROM verify_login('jc111111', 'student123');  -- returns student
--   SELECT * FROM verify_login('jc111111', 'wrong');       -- returns 0 rows
--   SELECT * FROM users;                                   -- works here (SQL
--        editor runs as admin) but is blocked from the browser by RLS
-- ---------------------------------------------------------------------------
