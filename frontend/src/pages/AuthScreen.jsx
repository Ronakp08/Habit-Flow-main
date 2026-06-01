import React, { useState } from "react";
import { api } from "../api/client";

export function AuthScreen({ settings, onAuth, notify, toast }) {
  const page = settings.pages?.auth || {};
  const labels = settings.auth || {};
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify(form),
        });
        notify(labels.accountCreated);
        setMode("login");
      } else {
        const data = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify(form),
        });
        localStorage.setItem("habitflow_token", data.token);
        onAuth(data.token);
      }
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <div className="toast">{toast}</div>}
      <main className="auth-layout">
        <section className="auth-hero">
          <p className="eyebrow">{settings.appName}</p>
          <h1>{page.title || labels.heroTitle}</h1>
          <p>{labels.heroSubtitle}</p>
        </section>
        <form className="panel auth-card" onSubmit={submit}>
          <div className="tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              {labels.loginTab}
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              {labels.registerTab}
            </button>
          </div>
          {mode === "register" && (
            <label>
              {labels.nameLabel}
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
          )}
          <label>
            {labels.emailLabel}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            {labels.passwordLabel}
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </label>
          <button className="primary" disabled={loading}>
            {loading
              ? labels.loadingButton
              : mode === "login"
                ? labels.loginButton
                : labels.registerButton}
          </button>
        </form>
      </main>
    </>
  );
}
