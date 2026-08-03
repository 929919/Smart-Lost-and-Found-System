/* tests.js — zero-dependency unit tests for the data layer.
   Snapshots localStorage, runs assertions against the REAL Store/Claims
   objects from store.js, then restores your data. Open tests.html to run. */

(function () {
  const KEYS = ["slf_jcu_items_v2", "slf_jcu_claims_v1"];
  const snapshot = {};
  KEYS.forEach(k => (snapshot[k] = localStorage.getItem(k)));

  const results = [];
  const assert = (name, cond) => results.push({ name, pass: !!cond });
  const eq = (name, got, exp) =>
    results.push({ name: `${name} — expected ${JSON.stringify(exp)}, got ${JSON.stringify(got)}`, pass: got === exp });
  const group = (title) => results.push({ group: title });
  const freshData = () => { Store.reset(); Claims.reset(); };

  try {
    // ---- Items ----
    group("Store — items");
    freshData();
    eq("seed loads 10 items", Store.load().length, 10);

    const it = Store.add({ name: "Test Wallet", category: "Accessories", location: "Library", item_type: "found" });
    assert("Store.add returns an id > 0", it.id > 0);
    eq("new item defaults to Active", it.status, "Active");
    assert("new item has a created_at date", !!it.created_at);
    eq("new item photoUrl defaults to empty", it.photoUrl, "");
    eq("Store.get returns the added item", (Store.get(it.id) || {}).name, "Test Wallet");
    eq("Store.get(9999) returns null for missing", Store.get(9999), null);

    Store.updateStatus(it.id, "Returned");
    eq("Store.updateStatus persists", Store.get(it.id).status, "Returned");

    const st = Store.stats();
    eq("stats.total counts all items", st.total, 11);
    assert("stats.activeFound is a number", typeof st.activeFound === "number");

    // Regression: mutating then resetting must fully restore the seed
    // (seed constants must never be mutated in memory).
    Store.updateStatus(2, "Claimed");
    freshData();
    eq("reset() fully restores seed item 2 to Active", Store.get(2).status, "Active");

    // ---- Claims ----
    group("Claims — workflow");
    freshData();
    eq("seed loads 2 claims", Claims.load().length, 2);

    const c = Claims.add({ itemId: 1, claimantJcuId: "jc100200", proof: "Left earbud has a blue mark" });
    eq("new claim defaults to Pending", c.status, "Pending");
    assert("new claim has created_at + updated_at", !!c.created_at && !!c.updated_at);
    eq("Claims.forItem(1) finds the claim", Claims.forItem(1).some(x => x.id === c.id), true);

    // Approve → claim Approved AND item Claimed
    freshData();
    const pending = Claims.load().find(x => x.status === "Pending");   // seed claim on item 2
    Claims.approve(pending.id);
    eq("approve() sets claim Approved", Claims.load().find(x => x.id === pending.id).status, "Approved");
    eq("approve() sets linked item Claimed", Store.get(pending.itemId).status, "Claimed");

    // Reject → claim Rejected, item unchanged
    freshData();
    const p2 = Claims.load().find(x => x.status === "Pending");
    const beforeStatus = Store.get(p2.itemId).status;
    Claims.reject(p2.id);
    eq("reject() sets claim Rejected", Claims.load().find(x => x.id === p2.id).status, "Rejected");
    eq("reject() leaves item status unchanged", Store.get(p2.itemId).status, beforeStatus);

    // Mark returned → claim Returned AND item Returned
    freshData();
    const appr = Claims.load().find(x => x.status === "Approved");     // seed claim on item 4
    Claims.markReturned(appr.id);
    eq("markReturned() sets claim Returned", Claims.load().find(x => x.id === appr.id).status, "Returned");
    eq("markReturned() sets linked item Returned", Store.get(appr.itemId).status, "Returned");

    const cc = Claims.counts();
    eq("counts.total counts all claims", cc.total, 2);

    // ---- Matching engine (story 5.3) ----
    group("Matcher — lost ↔ found auto-matching");
    const lostWallet = { name: "Black leather wallet", category: "Accessories",
      location: "Food Court / Canteen", color: "Black", description: "cards inside",
      item_type: "lost", created_at: "2026-05-29" };

    const foundWallet = { id: 101, name: "Black leather wallet", category: "Accessories",
      location: "Food Court / Canteen", color: "Black", description: "contains cards",
      item_type: "found", status: "Active", created_at: "2026-05-29" };
    const unrelated = { id: 102, name: "Nike running cap", category: "Clothing",
      location: "Sports Courts", color: "Red", description: "size L",
      item_type: "found", status: "Active", created_at: "2026-06-01" };

    assert("identical item scores above threshold",
      Matcher.score(lostWallet, foundWallet).score >= Matcher.MATCH_THRESHOLD);
    assert("unrelated item scores below threshold",
      Matcher.score(lostWallet, unrelated).score < Matcher.MATCH_THRESHOLD);
    assert("score explains itself with reasons",
      Matcher.score(lostWallet, foundWallet).reasons.length > 0);
    eq("findMatches returns the matching found item",
      Matcher.findMatches(lostWallet, [foundWallet, unrelated])[0].item.id, 101);
    eq("findMatches excludes non-matches",
      Matcher.findMatches(lostWallet, [foundWallet, unrelated]).length, 1);
    eq("findMatches ignores non-Active found items",
      Matcher.findMatches(lostWallet, [{ ...foundWallet, status: "Returned" }]).length, 0);
    eq("findMatches ignores other lost reports",
      Matcher.findMatches(lostWallet, [{ ...foundWallet, item_type: "lost" }]).length, 0);
    eq("stopwords alone do not create a match",
      Matcher.score({ name: "the a of", category: "X", description: "" },
                    { name: "the a of", category: "Y", description: "" }).score, 0);

    // per-student grouping
    const mine = { ...lostWallet, id: 200, reported_by: "jc555" };
    const theirs = { ...lostWallet, id: 201, reported_by: "jc999" };
    const grouped = Matcher.matchesForUser("jc555", [mine, theirs, foundWallet]);
    eq("matchesForUser returns only my lost reports", grouped.length, 1);
    eq("matchesForUser attaches the matches", grouped[0].matches.length, 1);

    // ---- Helpers ----
    group("Helpers");
    eq("escapeHTML escapes angle brackets & ampersand", escapeHTML("<b>&"), "&lt;b&gt;&amp;");
    eq("icon() maps a known category", icon("Keys"), "🔑");
    eq("icon() falls back for unknown category", icon("Nope"), "📦");
  } catch (err) {
    results.push({ name: "❌ Uncaught error: " + err.message, pass: false });
  } finally {
    // Restore the user's real data
    KEYS.forEach(k => (snapshot[k] == null ? localStorage.removeItem(k) : localStorage.setItem(k, snapshot[k])));
  }

  // ---- Render ----
  const asserts = results.filter(r => !r.group);
  const passed = asserts.filter(r => r.pass).length;
  const failed = asserts.length - passed;

  document.getElementById("summary").innerHTML =
    `<span class="pill ${failed ? "fail" : "pass"}">${failed ? "✖" : "✔"} ${passed}/${asserts.length} passing</span>` +
    (failed ? `<span class="pill fail">${failed} failing</span>` : "") +
    `<span class="pill total">Data layer: store.js</span>`;

  document.getElementById("results").innerHTML = results.map(r => {
    if (r.group) return `<div class="grp">${r.group}</div><ul data-u></ul>`;
    return "";
  }).join("");

  // group rows under their headings
  let html = "";
  results.forEach(r => {
    if (r.group) html += `<div class="grp">${r.group}</div><ul>`;
    else html += `<li class="${r.pass ? "ok" : "no"}"><span class="tag">${r.pass ? "PASS" : "FAIL"}</span><span>${r.name}</span></li>`;
  });
  document.getElementById("results").innerHTML = html + "</ul>";
})();
