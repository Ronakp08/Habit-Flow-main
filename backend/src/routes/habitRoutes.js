const express = require("express");
const {
  addNewHabit,
  getAllHabits,
  getSingleHabit,
  updateHabitById,
  deleteHabitById,
} = require("../controllers/habitController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

const router = express.Router();

router.post("/", authMiddleware, addNewHabit);
router.get("/", authMiddleware, getAllHabits);
router.get("/:id", authMiddleware, getSingleHabit);
router.put("/:id", authMiddleware, updateHabitById);
router.delete("/:id", authMiddleware, deleteHabitById);

module.exports = router;
