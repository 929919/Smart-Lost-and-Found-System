export default function StatsBar({ stats }) {
  const cards = [
    { label: "Total found",  value: stats.total,    cls: "blue"  },
    { label: "Active",       value: stats.active,   cls: "green" },
    { label: "Claimed",      value: stats.claimed,  cls: "amber" },
    { label: "Returned",     value: stats.returned, cls: "muted" },
  ];
  return (
    <div className="stats-row">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <div className="stat-label">{c.label}</div>
          <div className={`stat-num ${c.cls}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
