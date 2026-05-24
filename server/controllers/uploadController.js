const db = require("../models/db");

exports.uploadScreenshot = (req, res) => {
  try {
    const bug_id = req.params.id;

    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    db.query(
      "INSERT INTO screenshots (bug_id, file_path) VALUES (?, ?)",
      [bug_id, filePath],
      (err) => {
        if (err) {
          console.error("DB ERROR:", err);
          return res.status(500).json(err);
        }

        res.json({
          msg: "Screenshot uploaded successfully",
          path: filePath
        });
      }
    );
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ msg: "Upload failed", error });
  }
};