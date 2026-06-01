const Habit = require("../models/habit.models");
const Progress = require("../models/progress.model");

const normalizeHabitPayload = (body) => {
  const title = body.title && body.title.trim();
  const description = body.description ? body.description.trim() : "";
  const category = body.category ? body.category.trim() : "General";
  const frequency = body.frequency ? body.frequency.trim() : "Daily";
  const reminderTime = body.reminderTime ? body.reminderTime.trim() : null;

  return { title, description, category, frequency, reminderTime };
};

// Create new habit POST
exports.addNewHabit = async (req, res) => {
  try {
    const { title, description, category, frequency, reminderTime } =
      normalizeHabitPayload(req.body);
    const userId = req.user && req.user.id;

    if (!userId) return res.status(401).send("Unauthorized: userId missing");
    if (!title) {
      return res.status(400).json({ message: "Habit title is required." });
    }

    const habitExists = await Habit.findOne({ where: { title, userId } });

    if (habitExists) {
      return res.status(400).send(`Habit with title: ${title} already exists!`);
    }

    const newHabit = await Habit.create({
      title,
      description,
      category,
      frequency,
      reminderTime,
      userId,
    });
    return res.status(201).json({ message: "Habit created", habit: newHabit });
  } catch (error) {
    console.error("Something went wrong while creating Habit!", error);
    res.status(500).send("Something went wrong while creating Habit!");
  }
};

// gethabit for user GET
exports.getAllHabits = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).send("Unauthorized: userId missing");

    const fetchHabits = await Habit.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      message: "Habits fetched successfully.",
      habits: fetchHabits,
    });
  } catch (error) {
    console.error("Something went wrong while fetching Habits!", error);
    res.status(500).send("Something went wrong while fetching Habits!");
  }
};

// GetSingle habit details
exports.getSingleHabit = async (req, res) => {
  try {
    const habitId = req.params.id;
    const userId = req.user.id;
    const habit = await Habit.findOne({
      where: { id: habitId, userId },
      include: [{ model: Progress, as: "progresses" }],
    });

    if (!habit) {
      return res.status(404).send("Habit not found.");
    }

    res.status(200).json({
      message: "Habit fetched successfully.",
      habit: habit,
    });
  } catch (error) {
    console.error("Error while fetching habit:", error);
    res.status(500).send("Server error while fetching habit.");
  }
};

// Update habit PUT
exports.updateHabitById = async (req, res) => {
  try {
    const { title, description, category, frequency, reminderTime } =
      normalizeHabitPayload(req.body);
    const habit = await Habit.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!habit) {
      return res.status(404).send("Habit not found");
    }
    if (!title) {
      return res.status(400).json({ message: "Habit title is required." });
    }

    await habit.update({ title, description, category, frequency, reminderTime });
    res.status(200).json({
      message: "Habit updated successfully!",
      habit,
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    res.status(500).send("Server error while updating habit");
  }
};

// Delete habit DELETE
exports.deleteHabitById = async (req, res) => {
  try {
    const deleted = await Habit.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!deleted) {
      return res.status(404).send("Habit not found");
    }
    res.status(200).send("Habit deleted successfully!");
  } catch (error) {
    console.error("Error deleting habit:", error);
    res.status(500).send("Server error while deleting habit");
  }
};
