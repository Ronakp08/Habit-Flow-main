import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Header } from "../components/ui/Header";

export function Settings({ settings, user, notify, refreshSettings, setView }) {
  const page = settings.pages?.settings || {};
  const [jsonText, setJsonText] = useState(JSON.stringify(settings, null, 2));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setJsonText(JSON.stringify(settings, null, 2));
  }, [settings]);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = JSON.parse(jsonText);
      await api("/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      notify(page.saved || "Settings updated successfully.");
      refreshSettings();
    } catch (error) {
      notify(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== "superadmin") {
    return (
      <>
        <Header appName={settings.appName} title={page.title || "Settings"} subtitle={page.subtitle || "Edit UI settings"} />
        <section className="panel settings-panel">
          <p>Only super admins can access this page.</p>
          <button className="primary" onClick={() => setView("profile")}>Back to profile</button>
        </section>
      </>
    );
  }

  return (
    <>
      <Header appName={settings.appName} title={page.title || "Settings"} subtitle={page.subtitle || "Edit UI settings"} />
      <section className="panel settings-panel">
        <p>{page.description || "Modify app UI settings as JSON and save."}</p>
        <form onSubmit={saveSettings}>
          <label>
            {page.editorLabel || "App settings JSON"}
            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              rows={24}
            />
          </label>
          <div className="form-actions">
            <button className="primary" type="submit" disabled={saving}>
              {saving ? page.savingButton || "Saving..." : page.saveButton || "Save settings"}
            </button>
            <button type="button" onClick={() => setView("profile")}> 
              {page.backButton || "Back to profile"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
