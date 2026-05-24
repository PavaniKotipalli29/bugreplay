const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { uploadScreenshot } = require("../controllers/uploadController");
const auth = require("../middleware/authMiddleware");

// ✅ FIXED STORAGE PATH
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // ✅ IMPORTANT FIX
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ FINAL ROUTE
router.post("/:id", auth, upload.single("file"), uploadScreenshot);

module.exports = router;