const express = require("express");
const router = express.Router();

const {
  getActivityLogs
} = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, getActivityLogs);

module.exports = router;