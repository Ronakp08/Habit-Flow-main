import { Sidebar } from "./Sidebar";

export function AppLayout({ settings, user, view, setView, logout, toast, children }) {
  return (
    <main className="app-shell">
      <Sidebar
        settings={settings}
        user={user}
        view={view}
        setView={setView}
        logout={logout}
      />
      <section className="workspace">
        {toast && <div className="toast">{toast}</div>}
        {children}
      </section>
    </main>
  );
}
