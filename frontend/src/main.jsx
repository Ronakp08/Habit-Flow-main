import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { api } from "./api/client";
import { AppLayout } from "./components/layout/AppLayout";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import { useSettings } from "./hooks/useSettings";
import { AuthScreen } from "./pages/AuthScreen";
import { Coach } from "./pages/Coach";
import { Dashboard } from "./pages/Dashboard";
import { Habits } from "./pages/Habits";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import "./styles.css";

const pageComponents = {
  dashboard: Dashboard,
  habits: Habits,
  coach: Coach,
  profile: Profile,
  settings: Settings,
};

function App() {
  const { settings, loading, reloadSettings } = useSettings();
  const [token, setToken] = useState(localStorage.getItem("habitflow_token"));
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState("");

  const pageId = token ? view : "auth";
  useDocumentTitle(settings, pageId);

  const logout = useCallback(() => {
    localStorage.removeItem("habitflow_token");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    api("/auth/me")
      .then(setUser)
      .catch(() => logout());
  }, [token, logout]);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }, []);

  const CurrentPage = useMemo(() => pageComponents[view] || Dashboard, [view]);

  if (loading) return null;

  if (!token) {
    return (
      <AuthScreen
        settings={settings}
        onAuth={setToken}
        notify={notify}
        toast={toast}
      />
    );
  }

  return (
    <AppLayout
      settings={settings}
      user={user}
      view={view}
      setView={setView}
      logout={logout}
      toast={toast}
    >
      <CurrentPage
        settings={settings}
        user={user}
        notify={notify}
        setView={setView}
        refreshSettings={reloadSettings}
      />
    </AppLayout>
  );
}

createRoot(document.getElementById("root")).render(<App />);
