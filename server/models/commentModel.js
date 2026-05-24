const db = require("./db");

exports.addComment = (bug_id, user_id, comment, callback) => {
  db.query(
    "INSERT INTO comments (bug_id,user_id,comment) VALUES (?,?,?)",
    [bug_id, user_id, comment],
    callback
  );
};

exports.getComments = (bug_id, callback) => {
  db.query(
    `SELECT c.*, u.name 
     FROM comments c 
     JOIN users u ON c.user_id=u.id
     WHERE bug_id=?`,
    [bug_id],
    callback
  );
};