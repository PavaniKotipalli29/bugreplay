const db = require("../models/db");

// GET ALL UNREAD NOTIFICATIONS FOR LOGGED IN USER
exports.getNotifications = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    [userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(result);
    }
  );
};

// MARK ALL NOTIFICATIONS AS READ
exports.markAllAsRead = (req, res) => {
  const userId = req.user.id;

  db.query(
    "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
    [userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({ msg: "All notifications marked as read" });
    }
  );
};
