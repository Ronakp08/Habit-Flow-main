import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export const fallbackSettings = {
  appName: "HabitFlow",
  documentTitleSeparator: "|",
  auth: {
    heroTitle: "Build habits you can actually keep.",
    heroSubtitle:
      "Track daily progress, watch streaks grow, and get a small free coach to shape better goals.",
    loginTab: "Login",
    registerTab: "Register",
    nameLabel: "Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    registerButton: "Create account",
    loadingButton: "Please wait...",
    accountCreated: "Account created. Please log in.",
  },
  navigation: [
    { id: "dashboard", label: "Dashboard" },
    { id: "habits", label: "Habits" },
    { id: "coach", label: "AI Coach" },
    { id: "profile", label: "Profile" },
  ],
  layout: {
    greetingPrefix: "Hi",
  },
  pages: {
    auth: {
      title: "Sign in",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Today at a glance",
      habitHealthTitle: "Habit health",
      loading: "Loading dashboard...",
    },
    habits: {
      title: "Habits",
      subtitle: "Create, update, complete, and review your habits",
      addTitle: "Add habit",
      editTitle: "Edit habit",
      listTitle: "Your habits",
      empty: "No habits yet.",
      noDescription: "No description",
      historyTitle: "Progress history",
    },
    coach: {
      title: "AI Habit Coach",
      subtitle: "Free local suggestions, no paid AI API needed",
      habitIdeaLabel: "Habit idea",
      habitIdeaPlaceholder: "Example: study React daily",
      generateButton: "Generate plan",
      starterGoal: "Starter goal",
      bestTime: "Best time",
      category: "Category",
    },
    profile: {
      title: "Profile",
      subtitle: "Your account details",
    },
    settings: {
      title: "App settings",
      subtitle: "Edit dynamic UI configuration",
      description: "Update app UI settings through JSON.",
      editorLabel: "App settings JSON",
      saveButton: "Save settings",
      savingButton: "Saving...",
      backButton: "Back to profile",
      saved: "Settings updated successfully.",
    },
  },
  stats: {
    totalHabits: "Total habits",
    completedToday: "Done today",
    missedToday: "Missed today",
    bestStreak: "Best streak",
    days: "days",
    complete: "complete",
    dayStreak: "day streak",
  },
  habitForm: {
    title: "Title",
    description: "Description",
    category: "Category",
    frequency: "Frequency",
    reminderTime: "Reminder time",
    createButton: "Create habit",
    updateButton: "Update habit",
    saved: "Habit saved.",
    deleted: "Habit deleted.",
    markedComplete: "Marked complete.",
    markedPending: "Marked pending.",
  },
  actions: {
    done: "Done",
    pending: "Pending",
    history: "History",
    edit: "Edit",
    delete: "Delete",
    logout: "Logout",
  },
  categories: ["General", "Health", "Study", "Work", "Fitness", "Mindfulness"],
  frequencies: ["Daily", "Weekly", "Custom"],
};

export function useSettings() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback((showLoader = false) => {
    if (showLoader) setLoading(true);
    api("/settings")
      .then((data) => setSettings({ ...fallbackSettings, ...data }))
      .catch(() => setSettings(fallbackSettings))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSettings(true);
  }, [loadSettings]);

  return { settings, loading, reloadSettings: () => loadSettings(false) };
}
