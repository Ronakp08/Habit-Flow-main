import { useState } from "react";
import { api } from "../api/client";
import { Header } from "../components/ui/Header";

export function Coach({ settings, notify }) {
  const [habit, setHabit] = useState("");
  const [plan, setPlan] = useState(null);
  const page = settings.pages.coach;

  const askCoach = async (event) => {
    event.preventDefault();
    try {
      const data = await api("/ai/habit-plan", {
        method: "POST",
        body: JSON.stringify({ habit }),
      });
      setPlan(data);
    } catch (error) {
      notify(error.message);
    }
  };

  return (
    <>
      <Header appName={settings.appName} title={page.title} subtitle={page.subtitle} />
      <form className="panel coach-form" onSubmit={askCoach}>
        <label>
          {page.habitIdeaLabel}
          <input
            value={habit}
            onChange={(event) => setHabit(event.target.value)}
            placeholder={page.habitIdeaPlaceholder}
          />
        </label>
        <button className="primary">{page.generateButton}</button>
      </form>
      {plan && (
        <section className="panel coach-result">
          <h2>{plan.title}</h2>
          <p>
            <strong>{page.starterGoal}:</strong> {plan.starterGoal}
          </p>
          <p>
            <strong>{page.bestTime}:</strong> {plan.reminderTime}
          </p>
          <p>
            <strong>{page.category}:</strong> {plan.category}
          </p>
          <p>{plan.motivation}</p>
          <div className="week-plan">
            {plan.sevenDayPlan.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
