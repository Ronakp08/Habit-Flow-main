const express = require("express");
const {
  getAppSettings,
  updateAppSettings,
} = require("../controllers/settingsController");
const { authMiddleware, superAdminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAppSettings);
router.put("/", authMiddleware, superAdminMiddleware, updateAppSettings);

module.exports = router;
