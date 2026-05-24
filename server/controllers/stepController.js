const db = require("../models/db");

// ADD STEP
exports.addStep = (req, res) => {
  const bug_id = req.params.id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ msg: "Step content required" });
  }

  // get next step number
  db.query(
    "SELECT COUNT(*) as count FROM steps WHERE bug_id=?",
    [bug_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const step_number = result[0].count + 1;

      db.query(
        "INSERT INTO steps (bug_id, step_number, content) VALUES (?,?,?)",
        [bug_id, step_number, content],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({
            msg: "Step added",
            step_number
          });
        }
      );
    }
  );
};