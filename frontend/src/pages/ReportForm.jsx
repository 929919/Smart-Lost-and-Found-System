import { useState } from "react";
import { api } from "../services/api";

const CATEGORIES = ["Electronics", "Accessories", "Clothing", "Documents", "Keys", "Other"];
const LOCATIONS  = [
  "Library (Building 2)", "Student Hub", "Lecture Theatre A", "Lecture Theatre B",
  "Cafeteria", "Car park", "Sports complex", "Administration Building", "Other",
];

export default function ReportForm({ onNavigate }) {
  const [form, setForm] = useState({
    name: "", category: "", location: "", item_type: "lost",
    description: "", color: "", contact: "",
  });
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())     e.name     = "Item name is required.";
    if (!form.category)        e.category = "Please select a category.";
    if (!form.location)        e.location = "Please select a location.";
    return e;
  }

  async function submit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const item = await api.createItem(form);
      setSuccess(`Report submitted! Reference ID: #LF-2026-${String(item.id).padStart(3, "0")}`);
      setForm({ name: "", category: "", location: "", item_type: "lost", description: "", color: "", contact: "" });
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Report a lost item</h2>
        <p className="form-sub">Fill in as many details as possible — it helps us find a match faster.</p>

        {success && (
          <div className="toast success">
            <i className="ti ti-circle-check" /> {success}
            <button className="link-btn" onClick={() => onNavigate("dashboard")}>View dashboard →</button>
          </div>
        )}
        {errors.global && <div className="toast error"><i className="ti ti-alert-circle" /> {errors.global}</div>}

        <div className="form-grid">
          {/* Item type toggle */}
          <div className="form-group full">
            <label className="form-label">I am reporting a…</label>
            <div className="toggle-group">
              {["lost", "found"].map((t) => (
                <button key={t} className={`toggle-btn ${form.item_type === t ? "active" : ""}`} onClick={() => set("item_type", t)}>
                  {t === "lost" ? "🔍 Lost item" : "📦 Found item"}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Item name *</label>
            <input className={`form-input ${errors.name ? "err" : ""}`} type="text" placeholder='e.g. MacBook Pro 14"'
              value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <span className="err-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Colour</label>
            <input className="form-input" type="text" placeholder="e.g. Silver, black case"
              value={form.color} onChange={(e) => set("color", e.target.value)} />
          </div>

          <div className="form-group full">
            <label className="form-label">Category *</label>
            <div className="cat-chips">
              {CATEGORIES.map((c) => (
                <button key={c} className={`cat-chip ${form.category === c ? "sel" : ""}`} onClick={() => set("category", c)}>{c}</button>
              ))}
            </div>
            {errors.category && <span className="err-msg">{errors.category}</span>}
          </div>

          <div className="form-group full">
            <label className="form-label">Location {form.item_type === "lost" ? "last seen" : "found"} *</label>
            <select className={`form-select ${errors.location ? "err" : ""}`} value={form.location}
              onChange={(e) => set("location", e.target.value)}>
              <option value="">Select a location…</option>
              {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
            </select>
            {errors.location && <span className="err-msg">{errors.location}</span>}
          </div>

          <div className="form-group full">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} placeholder="Any unique features, brand, model, stickers, damage…"
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="form-group full">
            <label className="form-label">Your contact email</label>
            <input className="form-input" type="email" placeholder="s1234567@my.jcu.edu.au"
              value={form.contact} onChange={(e) => set("contact", e.target.value)} />
          </div>

          <div className="form-actions full">
            <button className="btn-primary" onClick={submit} disabled={loading}>
              {loading ? <><i className="ti ti-loader" /> Submitting…</> : "Submit report"}
            </button>
            <button className="btn-secondary" onClick={() => onNavigate("dashboard")}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
