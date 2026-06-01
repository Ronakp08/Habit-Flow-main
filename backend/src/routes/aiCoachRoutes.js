const express = require("express");
const { generateHabitCoachPlan } = require("../controllers/aiCoachController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/habit-plan", authMiddleware, generateHabitCoachPlan);

module.exports = router;
