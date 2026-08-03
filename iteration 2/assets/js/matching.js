/* ============================================================
   matching.js — lost ↔ found auto-matching engine (story 5.3)

   Scores every ACTIVE found item against a student's lost report
   and returns the likely matches. This is the "Smart" in Smart
   Lost & Found: a student no longer has to keep checking manually.

   Scoring model (transparent + testable):
     same category ............ +3
     same campus location ..... +2
     each shared keyword ...... +2  (from name + description)
     same colour .............. +2
     found within 14 days ..... +1
   A found item is reported as a match at MATCH_THRESHOLD or above.
   ============================================================ */

const Matcher = {
  MATCH_THRESHOLD: 4,

  /* Words too generic to be evidence of a match */
  STOPWORDS: new Set([
    "the", "a", "an", "and", "or", "of", "my", "with", "for", "in", "on",
    "it", "is", "was", "size", "small", "large", "new", "old", "some",
  ]),

  keywords(item) {
    return String(`${item.name} ${item.description || ""}`)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(w => w.length > 2 && !this.STOPWORDS.has(w));
  },

  daysApart(a, b) {
    const ms = Math.abs(new Date(a) - new Date(b));
    return Number.isNaN(ms) ? 999 : Math.round(ms / 86400000);
  },

  /* Score a single found item against a lost item. Returns {score, reasons}. */
  score(lost, found) {
    let score = 0;
    const reasons = [];

    if (lost.category && lost.category === found.category) {
      score += 3; reasons.push(`same category (${found.category})`);
    }
    if (lost.location && lost.location === found.location) {
      score += 2; reasons.push(`same location (${found.location})`);
    }
    if (lost.color && found.color && lost.color.toLowerCase() === found.color.toLowerCase()) {
      score += 2; reasons.push(`same colour (${found.color})`);
    }

    const lostWords = new Set(this.keywords(lost));
    const shared = this.keywords(found).filter(w => lostWords.has(w));
    const uniqueShared = [...new Set(shared)];
    if (uniqueShared.length) {
      score += 2 * uniqueShared.length;
      reasons.push(`matching words: ${uniqueShared.join(", ")}`);
    }

    if (this.daysApart(lost.created_at, found.created_at) <= 14) {
      score += 1; reasons.push("reported around the same time");
    }

    return { score, reasons };
  },

  /* All active FOUND items that match this lost item, best first. */
  findMatches(lost, allItems) {
    const items = allItems || (typeof Store !== "undefined" ? Store.all() : []);
    return items
      .filter(i => i.item_type === "found" && i.status === "Active")
      .map(found => {
        const { score, reasons } = this.score(lost, found);
        return { item: found, score, reasons };
      })
      .filter(m => m.score >= this.MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score);
  },

  /* Every match for the lost reports submitted by one student. */
  matchesForUser(jcuId, allItems) {
    const items = allItems || (typeof Store !== "undefined" ? Store.all() : []);
    const myLost = items.filter(i => i.item_type === "lost" && i.reported_by === jcuId);
    return myLost
      .map(lost => ({ lost, matches: this.findMatches(lost, items) }))
      .filter(g => g.matches.length > 0);
  },
};
