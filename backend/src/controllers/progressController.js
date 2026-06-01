const Habit = require("../models/habit.models");
const Progress = require("../models/progress.model");

const toDateOnly = (value = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const getOwnedHabit = async (habitId, userId) =>
  Habit.findOne({ where: { id: habitId, userId } });

const calculateCurrentStreak = (progressRows) => {
  let streak = 0;
  const byDate = new Map(
    progressRows.map((progress) => [progress.date, Boolean(progress.status)])
  );
  const cursor = new Date();

  while (true) {
    const key = toDateOnly(cursor);
    if (!byDate.get(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

exports.markDailyProgressByHabitId = async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const userId = req.user.id;
    const date = toDateOnly(req.body.date);
    const status =
      typeof req.body.status === "boolean"
        ? req.body.status
        : req.body.status === "true";
    const note = req.body.note ? req.body.note.trim() : "";

    if (!date) {
      return res.status(400).json({ message: "Please provide a valid date." });
    }

    const habit = await getOwnedHabit(habitId, userId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const [progress, created] = await Progress.findOrCreate({
      where: { habitId, date },
      defaults: { habitId, date, status, note },
    });

    if (!created) {
      await progress.update({ status, note });
    }

    return res.status(created ? 201 : 200).json({
      message: created
        ? "Progress marked for the day."
        : "Progress updated successfully.",
      progress,
    });
  } catch (error) {
    console.error("Error while updating progress:", error);
    res.status(500).json({ message: "Server error while updating progress." });
  }
};

exports.getProgressHistoryByHabitId = async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const habit = await getOwnedHabit(habitId, req.user.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const progressHistory = await Progress.findAll({
      where: { habitId },
      order: [["date", "DESC"]],
    });

    res.status(200).json({ message: "Progress found", progressHistory });
  } catch (error) {
    console.error("Error while fetching progress report:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching progress report." });
  }
};

exports.getStreakByHabitId = async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const habit = await getOwnedHabit(habitId, req.user.id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found." });
    }

    const allProgress = await Progress.findAll({
      where: { habitId },
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      message: "Streak calculated successfully.",
      streak: calculateCurrentStreak(allProgress),
    });
  } catch (error) {
    console.error("Error while calculating streak:", error);
    res.status(500).json({ message: "Server error while calculating streak." });
  }
};

exports.calculateCurrentStreak = calculateCurrentStreak;
