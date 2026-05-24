const db = require("../models/db");

exports.getActivityLogs = (req, res) => {
  const bugId = req.params.id;

  db.query(
    `
    SELECT
      activity_logs.*,
      users.name AS user_name
    FROM activity_logs
    JOIN users
    ON activity_logs.user_id = users.id
    WHERE activity_logs.bug_id = ?
    ORDER BY activity_logs.created_at DESC
    `,
    [bugId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};