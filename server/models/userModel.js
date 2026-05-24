const db = require("./db");

exports.findByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email=?", [email], callback);
};

exports.createUser = (name, email, password, callback) => {
  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, password],
    callback
  );
};