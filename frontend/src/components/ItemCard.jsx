const EMOJI = { Electronics:"💻", Accessories:"👜", Clothing:"👕", Documents:"🪪", Keys:"🔑", Other:"📦" };
const COLOR  = { Electronics:"blue", Accessories:"amber", Clothing:"teal", Documents:"green", Keys:"coral", Other:"gray" };

export default function ItemCard({ item, onNavigate }) {
  return (
    <div className="item-card" onClick={() => onNavigate("chat")}>
      <div className="item-card-top">
        <div className={`item-icon icon-${COLOR[item.category] || "gray"}`}>
          {EMOJI[item.category] || "📦"}
        </div>
        <span className={`status-badge status-${item.status?.toLowerCase()}`}>{item.status}</span>
      </div>
      <div className="item-name">{item.name}</div>
      <div className="item-meta">
        <i className="ti ti-map-pin" /> {item.location}
      </div>
      {item.description && (
        <div className="item-desc">{item.description.slice(0, 60)}{item.description.length > 60 ? "…" : ""}</div>
      )}
      <div className="item-footer">
        <span className="tag">{item.category}</span>
        {item.shelf_tag && item.status !== "Returned" && (
          <span className="shelf-badge">Shelf {item.shelf_tag}</span>
        )}
      </div>
    </div>
  );
}
