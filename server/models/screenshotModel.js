const db = require("./db");

exports.addScreenshot = (bug_id, file_path, callback) => {
  db.query(
    "INSERT INTO screenshots (bug_id,file_path) VALUES (?,?)",
    [bug_id, file_path],
    callback
  );
};

exports.getScreenshots = (bug_id, callback) => {
  db.query(
    "SELECT * FROM screenshots WHERE bug_id=?",
    [bug_id],
    callback
  );
};