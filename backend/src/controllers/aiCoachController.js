const categoryHints = [
  { pattern: /walk|run|gym|exercise|workout|yoga|fitness/i, category: "Fitness" },
  { pattern: /read|study|learn|course|code|javascript|react/i, category: "Study" },
  { pattern: /sleep|water|meditat|journal|mind/i, category: "Mindfulness" },
  { pattern: /email|plan|write|work|task/i, category: "Work" },
  { pattern: /diet|meal|health|medicine/i, category: "Health" },
];

const timeHints = [
  { pattern: /sleep|journal|read/i, time: "21:30" },
  { pattern: /walk|run|exercise|workout|yoga|water/i, time: "07:00" },
  { pattern: /study|learn|code|write/i, time: "19:00" },
  { pattern: /work|email|plan/i, time: "09:30" },
];

const titleCase = (value) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

exports.generateHabitCoachPlan = async (req, res) => {
  const rawHabit = req.body.habit || req.body.title || "";
  const habit = rawHabit.trim();

  if (!habit) {
    return res.status(400).json({ message: "Please enter a habit idea." });
  }

  const category =
    categoryHints.find((hint) => hint.pattern.test(habit))?.category ||
    "General";
  const reminderTime =
    timeHints.find((hint) => hint.pattern.test(habit))?.time || "08:30";
  const compactTitle = titleCase(habit.replace(/\bdaily\b/gi, "").trim());
  const starterTitle =
    compactTitle.length > 4 ? compactTitle : `Practice ${titleCase(habit)}`;

  res.status(200).json({
    title: starterTitle,
    category,
    frequency: "Daily",
    reminderTime,
    starterGoal: `Start with 5 minutes of ${habit.toLowerCase()} so it feels easy to begin.`,
    motivation:
      "Make the habit small enough to do on a low-energy day. Consistency first, intensity later.",
    sevenDayPlan: [
      "Day 1: Do the smallest possible version.",
      "Day 2: Repeat at the same time.",
      "Day 3: Prepare your space before the reminder.",
      "Day 4: Add one tiny improvement.",
      "Day 5: Track what made it easier.",
      "Day 6: Keep the habit small, even if you feel motivated.",
      "Day 7: Review your week and set next week's version.",
    ],
  });
};
