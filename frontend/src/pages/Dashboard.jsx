import { useEffect, useState } from "react";
import { api } from "../services/api";
import ItemCard from "../components/ItemCard";
import StatsBar from "../components/StatsBar";

const CATEGORIES = ["All", "Electronics", "Accessories", "Clothing", "Documents", "Keys", "Other"];
const STATUSES   = ["All", "Active", "Claimed", "Returned"];

export default function Dashboard({ onNavigate }) {
  const [items,    setItems]    = useState([]);
  const [stats,    setStats]    = useState({ total: 0, active: 0, claimed: 0, returned: 0 });
  const [category, setCategory] = useState("All");
  const [status,   setStatus]   = useState("All");
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    loadData();
  }, [category, status, search]);

  async function loadData() {
    setLoading(true);
    try {
      const [itemsData, statsData] = await Promise.all([
        api.getItems({
          category: category !== "All" ? category : "",
          status:   status   !== "All" ? status   : "",
          search,
        }),
        api.getStats(),
      ]);
      setItems(itemsData);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <i className="ti ti-search" />
          <input
            type="text"
            placeholder="Search items by name or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? "on" : ""}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>

        <div className="filter-row">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`chip ${status === s ? "on" : ""}`}
              onClick={() => setStatus(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="loading-msg"><i className="ti ti-loader" /> Loading items…</div>
      ) : items.length === 0 ? (
        <div className="empty-msg">
          <i className="ti ti-mood-sad" style={{ fontSize: 32 }} />
          <p>No items found. Try a different filter or <button className="link-btn" onClick={() => onNavigate("report")}>report a lost item</button>.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}
