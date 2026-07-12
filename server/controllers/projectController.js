const db = require("../models/db");

// CREATE PROJECT
exports.createProject = (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ msg: "Project name is required" });
  }

  db.query(
    "INSERT INTO projects (name, description) VALUES (?, ?)",
    [name, description || null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({
        msg: "Project created successfully",
        projectId: result.insertId
      });
    }
  );
};

// GET ALL PROJECTS
exports.getProjects = (req, res) => {
  db.query(
    "SELECT * FROM projects ORDER BY name ASC",
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(result);
    }
  );
};
