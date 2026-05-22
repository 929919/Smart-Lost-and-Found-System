import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";

const QUICK_PILLS = [
  "Did anyone find my laptop?",
  "Where do I collect items?",
  "How long are items kept?",
  "I lost my student ID",
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg ${isUser ? "user" : "bot"}`}>
      <div className="msg-avatar">
        {isUser ? "JG" : <i className="ti ti-robot" />}
      </div>
      <div className="msg-bubble">
        <p>{msg.text}</p>
        {msg.match && (
          <div className="match-card">
            <div className="match-row">
              <div className="match-icon">{categoryEmoji(msg.match.category)}</div>
              <div>
                <div className="match-name">{msg.match.name}</div>
                <div className="match-loc">
                  <i className="ti ti-map-pin" /> {msg.match.location}
                  {msg.match.shelf_tag && ` — Shelf ${msg.match.shelf_tag}`}
                </div>
              </div>
              <span className={`status-badge status-${msg.match.status?.toLowerCase()}`}>
                {msg.match.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function categoryEmoji(cat) {
  const m = { Electronics: "💻", Accessories: "👜", Clothing: "👕", Documents: "🪪", Keys: "🔑" };
  return m[cat] || "📦";
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm FindBot, your JCU Lost & Found assistant. I can check if your item has been recovered, explain our retrieval policy, or tell you where to collect items. How can I help?",
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const data = await api.sendMessage(msg);
      setMessages((prev) => [...prev, { role: "bot", text: data.reply, match: data.match }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-avatar"><i className="ti ti-robot" /></div>
        <div>
          <div className="chat-title">FindBot — JCU Assistant</div>
          <div className="chat-online">● Online</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => <Message key={i} msg={m} />)}
        {loading && (
          <div className="msg bot">
            <div className="msg-avatar"><i className="ti ti-robot" /></div>
            <div className="msg-bubble typing"><span /><span /><span /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="quick-pills">
        {QUICK_PILLS.map((p) => (
          <button key={p} className="quick-pill" onClick={() => send(p)}>{p}</button>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Describe your lost item…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="chat-send" onClick={() => send()} disabled={loading}>
          <i className="ti ti-send" />
        </button>
      </div>
    </div>
  );
}
