const db = require("./db");

exports.countSteps = (bug_id, callback) => {
  db.query(
    "SELECT COUNT(*) as count FROM steps WHERE bug_id=?",
    [bug_id],
    callback
  );
};

exports.addStep = (bug_id, step_number, content, callback) => {
  db.query(
    "INSERT INTO steps (bug_id,step_number,content) VALUES (?,?,?)",
    [bug_id, step_number, content],
    callback
  );
};