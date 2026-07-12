const db = require("../models/db");
const createNotification = require("../utils/createNotification");

// ADD COMMENT
exports.addComment = (req, res) => {
  const bug_id = req.params.id;
  const user_id = req.user.id;
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ msg: "Comment cannot be empty" });
  }

  db.query(
    "INSERT INTO comments (bug_id, user_id, comment) VALUES (?, ?, ?)",
    [bug_id, user_id, comment],
    (err) => {
      if (err) return res.status(500).json(err);

      // Fetch bug info for notification
      db.query("SELECT title, user_id, assigned_to FROM bugs WHERE id = ?", [bug_id], (err2, bugRes) => {
        if (!err2 && bugRes.length > 0) {
          const bug = bugRes[0];
          const msg = `New comment on bug "${bug.title}" by ${req.user.name || 'User'}`;
          
          if (bug.user_id !== req.user.id) {
            createNotification(bug.user_id, "comment", msg);
          }
          if (bug.assigned_to && bug.assigned_to !== req.user.id && bug.assigned_to !== bug.user_id) {
            createNotification(bug.assigned_to, "comment", msg);
          }
        }
      });

      res.json({ msg: "Comment added" });
    }
  );
};

// GET COMMENTS
exports.getComments = (req, res) => {
  const bug_id = req.params.id;

  db.query(
    `SELECT comments.*, users.name 
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE comments.bug_id = ?
     ORDER BY comments.created_at DESC`,
    [bug_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json(result);
    }
  );
};