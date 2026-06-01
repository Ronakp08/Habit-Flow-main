export function Sidebar({ settings, user, view, setView, logout }) {
  const actions = settings.actions || {};
  const layout = settings.layout || {};

  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">{settings.appName}</p>
        <h1>{user ? `${layout.greetingPrefix}, ${user.name}` : settings.appName}</h1>
      </div>
      <nav>
        {settings.navigation.map((item) => (
          <button
            key={item.id}
            className={view === item.id ? "active" : ""}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button className="ghost" onClick={logout}>
        {actions.logout}
      </button>
    </aside>
  );
}
