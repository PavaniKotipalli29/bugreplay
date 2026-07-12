const router = require("express").Router();
const { getNotifications, markAllAsRead } = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

// GET /api/notifications
router.get("/", auth, getNotifications);

// PATCH /api/notifications/read-all
router.patch("/read-all", auth, markAllAsRead);

module.exports = router;
