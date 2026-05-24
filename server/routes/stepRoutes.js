const router = require("express").Router();
const { addStep } = require("../controllers/stepController");
const auth = require("../middleware/authMiddleware");

// ✅ FINAL CLEAN ROUTE
// POST /api/steps/:id
router.post("/:id", auth, addStep);

module.exports = router;