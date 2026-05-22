import { useEffect, useState } from "react";
import { api } from "../services/api";

const STATUS_NEXT = { Active: "Claimed", Claimed: "Returned" };

export default function Admin() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.getItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function advance(item) {
    const next = STATUS_NEXT[item.status];
    if (!next) return;
    setUpdating(item.id);
    try {
      const updated = await api.updateItem(item.id, { status: next });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch (e) {
      alert("Update failed: " + e.message);
    } finally {
      setUpdating(null);
    }
  }

  const statusClass = (s) => ({ Active: "status-active", Claimed: "status-claimed", Returned: "status-returned" }[s] || "");

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="admin-title">Admin — item management</h2>
        <span className="admin-sub">{items.length} items total</span>
      </div>

      {loading ? (
        <div className="loading-msg"><i className="ti ti-loader" /> Loading…</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ref ID</th><th>Item</th><th>Category</th>
                <th>Location</th><th>Shelf tag</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="ref-id">#{item.id}</td>
                  <td className="item-name-cell">{item.name}</td>
                  <td><span className="tag">{item.category}</span></td>
                  <td className="muted">{item.location}</td>
                  <td>
                    {item.shelf_tag
                      ? <span className="shelf-badge">Shelf {item.shelf_tag}</span>
                      : <span className="muted">—</span>}
                  </td>
                  <td><span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span></td>
                  <td>
                    {STATUS_NEXT[item.status] ? (
                      <button
                        className={`action-btn ${item.status === "Claimed" ? "action-success" : ""}`}
                        onClick={() => advance(item)}
                        disabled={updating === item.id}
                      >
                        {updating === item.id
                          ? <i className="ti ti-loader" />
                          : `Mark ${STATUS_NEXT[item.status]}`}
                      </button>
                    ) : (
                      <span className="muted" style={{ fontSize: 11 }}>Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
