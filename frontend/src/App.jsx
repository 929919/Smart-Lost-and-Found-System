import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ReportForm from "./pages/ReportForm";
import Admin from "./pages/Admin";
import "./App.css";

const TABS = [
  { id: "dashboard", label: "Dashboard",    icon: "ti-layout-grid" },
  { id: "chat",      label: "AI Assistant", icon: "ti-robot" },
  { id: "report",    label: "Report Item",  icon: "ti-plus" },
  { id: "admin",     label: "Admin",        icon: "ti-settings" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");

  const pages = { dashboard: Dashboard, chat: Chat, report: ReportForm, admin: Admin };
  const Page = pages[tab];

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <div className="logo-icon"><i className="ti ti-search" /></div>
          <div>
            <div className="logo-title">Smart Lost &amp; Found</div>
            <div className="logo-sub">James Cook University</div>
          </div>
        </div>

        <nav className="app-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <i className={`ti ${t.icon}`} />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="user-badge">
          <div className="avatar">JG</div>
          <span>João Gabriel</span>
        </div>
      </header>

      {/* Page */}
      <main className="app-main">
        <Page onNavigate={setTab} />
      </main>
    </div>
  );
}
