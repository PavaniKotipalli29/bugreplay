require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   ✅ STATIC FILES
================================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ===============================
   ✅ ROUTES
================================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bugs", require("./routes/bugRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/steps", require("./routes/stepRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// ✅ NEW ACTIVITY ROUTE
app.use("/api/activity", require("./routes/activityRoutes"));

/* ===============================
   ✅ ERROR HANDLER
================================= */

const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

/* ===============================
   ✅ SERVER START
================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});