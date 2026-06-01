const Habit = require("../models/habit.models");
const Progress = require("../models/progress.model");
const { calculateCurrentStreak } = require("./progressController");

const todayKey = () => new Date().toISOString().slice(0, 10);

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.findAll({
      where: { userId },
      include: [{ model: Progress, as: "progresses" }],
      order: [["createdAt", "DESC"]],
    });

    const today = todayKey();
    const habitCards = habits.map((habit) => {
      const progresses = habit.progresses || [];
      const completedToday = progresses.some(
        (progress) => progress.date === today && progress.status
      );
      const doneCount = progresses.filter((progress) => progress.status).length;
      const completionRate =
        progresses.length === 0
          ? 0
          : Math.round((doneCount / progresses.length) * 100);

      return {
        id: habit.id,
        title: habit.title,
        category: habit.category,
        frequency: habit.frequency,
        reminderTime: habit.reminderTime,
        completedToday,
        completionRate,
        streak: calculateCurrentStreak(progresses),
      };
    });

    const completedToday = habitCards.filter((habit) => habit.completedToday)
      .length;
    const totalHabits = habits.length;

    res.status(200).json({
      totalHabits,
      completedToday,
      missedToday: Math.max(totalHabits - completedToday, 0),
      bestStreak: habitCards.reduce(
        (best, habit) => Math.max(best, habit.streak),
        0
      ),
      habitCards,
    });
  } catch (error) {
    console.error("Error while fetching dashboard:", error);
    res.status(500).json({ message: "Server error while fetching dashboard." });
  }
};
