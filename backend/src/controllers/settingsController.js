const AppSetting = require("../models/appSetting.model");

const defaultSettings = {
  key: "app_ui",
  value: {
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
  },
};

const isPlainObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value);

const mergeSettings = (defaults, saved) => {
  if (!isPlainObject(defaults) || !isPlainObject(saved)) {
    return saved === undefined ? defaults : saved;
  }

  return Object.keys(defaults).reduce(
    (merged, key) => ({
      ...merged,
      [key]: mergeSettings(defaults[key], saved[key]),
    }),
    { ...saved }
  );
};

exports.getAppSettings = async (req, res) => {
  try {
    const [settings] = await AppSetting.findOrCreate({
      where: { key: defaultSettings.key },
      defaults: defaultSettings,
    });

    const mergedSettings = mergeSettings(defaultSettings.value, settings.value);
    if (JSON.stringify(mergedSettings) !== JSON.stringify(settings.value)) {
      await settings.update({ value: mergedSettings });
    }

    res.status(200).json(mergedSettings);
  } catch (error) {
    console.error("Error while fetching app settings:", error);
    res.status(500).json({ message: "Server error while fetching settings." });
  }
};

exports.updateAppSettings = async (req, res) => {
  if (!isPlainObject(req.body)) {
    return res.status(400).json({ message: "Invalid settings payload." });
  }

  try {
    const [settings] = await AppSetting.findOrCreate({
      where: { key: defaultSettings.key },
      defaults: defaultSettings,
    });

    const newSettingsValue = mergeSettings(
      defaultSettings.value,
      mergeSettings(settings.value, req.body)
    );

    if (JSON.stringify(newSettingsValue) !== JSON.stringify(settings.value)) {
      await settings.update({ value: newSettingsValue });
    }

    res.status(200).json(newSettingsValue);
  } catch (error) {
    console.error("Error while updating app settings:", error);
    res.status(500).json({ message: "Server error while updating settings." });
  }
};
