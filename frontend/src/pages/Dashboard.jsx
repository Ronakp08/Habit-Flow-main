import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Empty } from "../components/ui/Empty";
import { Header } from "../components/ui/Header";
import { Stat } from "../components/ui/Stat";

export function Dashboard({ settings, notify }) {
  const [summary, setSummary] = useState(null);
  const page = settings.pages.dashboard;
  const stats = settings.stats || {};
  const actions = settings.actions || {};

  useEffect(() => {
    api("/dashboard")
      .then(setSummary)
      .catch((error) => notify(error.message));
  }, [notify]);

  if (!summary) return <Empty title={page.loading} />;

  return (
    <>
      <Header appName={settings.appName} title={page.title} subtitle={page.subtitle} />
      <div className="stats-grid">
        <Stat label={stats.totalHabits} value={summary.totalHabits} />
        <Stat label={stats.completedToday} value={summary.completedToday} />
        <Stat label={stats.missedToday} value={summary.missedToday} />
        <Stat label={stats.bestStreak} value={`${summary.bestStreak} ${stats.days}`} />
      </div>
      <section className="panel">
        <h2>{page.habitHealthTitle}</h2>
        <div className="habit-grid">
          {summary.habitCards.map((habit) => (
            <article className="habit-card" key={habit.id}>
              <div>
                <strong>{habit.title}</strong>
                <p>{habit.category} / {habit.frequency}</p>
              </div>
              <span className={habit.completedToday ? "pill done" : "pill"}>
                {habit.completedToday ? actions.done : actions.pending}
              </span>
              <div className="bar">
                <span style={{ width: `${habit.completionRate}%` }} />
              </div>
              <small>
                {habit.completionRate}% {stats.complete} / {habit.streak}{" "}
                {stats.dayStreak}
              </small>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
