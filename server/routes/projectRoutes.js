const router = require("express").Router();
const { createProject, getProjects } = require("../controllers/projectController");
const auth = require("../middleware/authMiddleware");

// POST /api/projects
router.post("/", auth, createProject);

// GET /api/projects
router.get("/", auth, getProjects);

module.exports = router;
