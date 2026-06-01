import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Empty } from "../components/ui/Empty";
import { Header } from "../components/ui/Header";

const createDefaultForm = (settings) => ({
  title: "",
  description: "",
  category: settings.categories[0] || "",
  frequency: settings.frequencies[0] || "",
  reminderTime: "",
});

export function Habits({ settings, notify }) {
  const [habits, setHabits] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState(createDefaultForm(settings));
  const page = settings.pages.habits;
  const labels = settings.habitForm || {};
  const actions = settings.actions || {};

  const load = () =>
    api("/habits")
      .then((data) => setHabits(data.habits))
      .catch((error) => notify(error.message));

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setSelected(null);
    setForm(createDefaultForm(settings));
  };

  const saveHabit = async (event) => {
    event.preventDefault();
    try {
      await api(selected ? `/habits/${selected.id}` : "/habits", {
        method: selected ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      resetForm();
      notify(labels.saved);
      load();
    } catch (error) {
      notify(error.message);
    }
  };

  const editHabit = (habit) => {
    setSelected(habit);
    setForm({
      title: habit.title,
      description: habit.description || "",
      category: habit.category || settings.categories[0],
      frequency: habit.frequency || settings.frequencies[0],
      reminderTime: habit.reminderTime || "",
    });
  };

  const deleteHabit = async (habitId) => {
    await api(`/habits/${habitId}`, { method: "DELETE" });
    notify(labels.deleted);
    load();
  };

  const markToday = async (habit, status) => {
    await api(`/progress/${habit.id}`, {
      method: "POST",
      body: JSON.stringify({
        status,
        date: new Date().toISOString().slice(0, 10),
      }),
    });
    notify(status ? labels.markedComplete : labels.markedPending);
  };

  const openHistory = async (habit) => {
    const data = await api(`/progress/${habit.id}`);
    setHistory(data.progressHistory);
    setSelected(habit);
  };

  return (
    <>
      <Header appName={settings.appName} title={page.title} subtitle={page.subtitle} />
      <div className="split">
        <form className="panel habit-form" onSubmit={saveHabit}>
          <h2>{selected ? page.editTitle : page.addTitle}</h2>
          <label>
            {labels.title}
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>
          <label>
            {labels.description}
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </label>
          <label>
            {labels.category}
            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            >
              {settings.categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            {labels.frequency}
            <select
              value={form.frequency}
              onChange={(event) =>
                setForm({ ...form, frequency: event.target.value })
              }
            >
              {settings.frequencies.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            {labels.reminderTime}
            <input
              type="time"
              value={form.reminderTime}
              onChange={(event) =>
                setForm({ ...form, reminderTime: event.target.value })
              }
            />
          </label>
          <button className="primary">
            {selected ? labels.updateButton : labels.createButton}
          </button>
        </form>
        <section className="panel">
          <h2>{page.listTitle}</h2>
          <div className="list">
            {habits.length === 0 && <Empty title={page.empty} />}
            {habits.map((habit) => (
              <article className="list-row" key={habit.id}>
                <div>
                  <strong>{habit.title}</strong>
                  <p>{habit.description || page.noDescription} / {habit.category}</p>
                </div>
                <div className="actions">
                  <button onClick={() => markToday(habit, true)}>{actions.done}</button>
                  <button onClick={() => openHistory(habit)}>{actions.history}</button>
                  <button onClick={() => editHabit(habit)}>{actions.edit}</button>
                  <button className="danger" onClick={() => deleteHabit(habit.id)}>
                    {actions.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {history.length > 0 && (
            <div className="history">
              <h3>{page.historyTitle}</h3>
              {history.slice(0, 14).map((item) => (
                <span key={item.id} className={item.status ? "pill done" : "pill"}>
                  {item.date}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
