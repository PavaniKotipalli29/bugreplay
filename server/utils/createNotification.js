const db = require("../models/db");

const createNotification = (userId, type, message) => {
  if (!userId) return;

  db.query(
    "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)",
    [userId, type, message],
    (err) => {
      if (err) {
        console.error("❌ Failed to create notification:", err);
      } else {
        console.log(`🔔 Notification created for User ${userId}: ${message}`);
      }
    }
  );
};

module.exports = createNotification;
