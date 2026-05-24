const db = require("../models/db");

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