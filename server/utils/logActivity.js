const db = require("../models/db");

const logActivity = (bugId, userId, action) => {
  db.query(
    `
    INSERT INTO activity_logs
    (bug_id, user_id, action)
    VALUES (?, ?, ?)
    `,
    [bugId, userId, action]
  );
};

module.exports = logActivity;