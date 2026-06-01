import { Header } from "../components/ui/Header";

export function Profile({ settings, user, setView }) {
  const page = settings.pages.profile;

  return (
    <>
      <Header appName={settings.appName} title={page.title} subtitle={page.subtitle} />
      <section className="panel profile-card">
        <strong>{user?.name}</strong>
        <p>{user?.email}</p>
        {user?.role === "superadmin" ? (
          <button className="primary" onClick={() => setView("settings")}>Edit app settings</button>
        ) : (
          <p className="muted">Only super admins can edit app settings.</p>
        )}
      </section>
    </>
  );
}
