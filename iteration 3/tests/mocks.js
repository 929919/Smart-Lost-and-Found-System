/* ============================================================
   mocks.js — a minimal mock-object framework (Practical 8, task 7)

   WHY WRITE ONE RATHER THAN INSTALL A FRAMEWORK
   The application deliberately has no build step and no package
   manager, so Jest, Sinon or Vitest would have introduced Node,
   npm and a bundler purely for testing. The behaviour we need
   from a mocking library is small and well understood:

     • a test double that stands in for a real collaborator
     • recording of how it was called (a spy)
     • programmable return values, including failures
     • assertions about the interaction, not just the result

   Roughly 60 lines gives all four, keeps the suite runnable by
   opening a file in a browser, and makes the mechanics visible
   rather than hidden behind a library.

   WHAT IT IS USED FOR
   Authentication calls verify_login() inside PostgreSQL. Testing
   it against the live database would be slow, would depend on the
   network, and could not exercise failure paths on demand. The
   mocks below replace the Supabase client so the sign-in logic can
   be tested in isolation, including the cases that matter most and
   are hardest to trigger for real: a wrong password, an unknown
   account, and the database being unreachable.
   ============================================================ */

const Mock = {

  /* ---- Spy / stub -------------------------------------------------------
     Returns a function that records every call and returns whatever the
     supplied implementation returns (or undefined).                       */
  fn(impl) {
    const spy = function (...args) {
      spy.calls.push(args);
      spy.callCount++;
      return impl ? impl(...args) : undefined;
    };
    spy.calls = [];
    spy.callCount = 0;
    spy.calledWith = (...expected) =>
      spy.calls.some(c => JSON.stringify(c) === JSON.stringify(expected));
    spy.lastCall = () => spy.calls[spy.calls.length - 1];
    spy.reset = () => { spy.calls = []; spy.callCount = 0; };
    return spy;
  },

  /* ---- Fake Supabase client ---------------------------------------------
     Stands in for the real client. `rpcHandler` is swapped per test so one
     client object can simulate success, rejection and outage in turn.      */
  rpcHandler: null,
  rpc: null,          // the spy, exposed so tests can assert on the call

  installSupabase() {
    Mock.rpc = Mock.fn((name, args) => Mock.rpcHandler(name, args));
    Mock.client = { rpc: Mock.rpc };

    // Globals that auth.js probes before deciding to use the database
    window.SUPABASE_URL = "https://mock.supabase.test";
    window.SUPABASE_ANON_KEY = "mock-anon-key";
    window.USE_SUPABASE = true;
    window.supabase = { createClient: Mock.fn(() => Mock.client) };
  },

  removeSupabase() {
    window.USE_SUPABASE = false;
    delete window.supabase;
  },

  /* ---- Canned responses --------------------------------------------------
     Shaped exactly like the real supabase-js reply: {data, error}.          */
  loginSucceeds(row) {
    Mock.rpcHandler = () => Promise.resolve({ data: [row], error: null });
  },
  loginRejects() {                       // valid call, no matching account
    Mock.rpcHandler = () => Promise.resolve({ data: [], error: null });
  },
  loginErrors(message) {                 // database reachable, call failed
    Mock.rpcHandler = () => Promise.resolve({ data: null, error: { message } });
  },
  databaseUnreachable(message) {         // network failure
    Mock.rpcHandler = () => Promise.reject(new Error(message || "network down"));
  },
};
