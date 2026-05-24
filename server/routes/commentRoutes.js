const router = require("express").Router();
const {
  addComment,
  getComments
} = require("../controllers/commentController");

const auth = require("../middleware/authMiddleware");

// POST /api/comments/:bugId
router.post("/:id", auth, addComment);

// GET /api/comments/:bugId
router.get("/:id", getComments);

module.exports = router;