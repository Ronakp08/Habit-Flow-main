const express = require("express");
const {
  markDailyProgressByHabitId,
  getProgressHistoryByHabitId,
  getStreakByHabitId,
} = require("../controllers/progressController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:habitId", authMiddleware, markDailyProgressByHabitId);
router.get("/:habitId", authMiddleware, getProgressHistoryByHabitId);
router.get("/streak/:habitId", authMiddleware, getStreakByHabitId);

module.exports = router;
