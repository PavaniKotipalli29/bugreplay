const db = require("./db");

exports.createBug = (data, callback) => {
  const {
    user_id,
    title,
    description,
    expected_result,
    actual_result,
    severity,
    status
  } = data;

  db.query(
    `INSERT INTO bugs 
    (user_id,title,description,expected_result,actual_result,severity,status)
    VALUES (?,?,?,?,?,?,?)`,
    [
      user_id,
      title,
      description,
      expected_result,
      actual_result,
      severity,
      status
    ],
    callback
  );
};

exports.getAllBugs = (query, values, callback) => {
  db.query(query, values, callback);
};

exports.getBugById = (id, callback) => {
  db.query("SELECT * FROM bugs WHERE id=?", [id], callback);
};