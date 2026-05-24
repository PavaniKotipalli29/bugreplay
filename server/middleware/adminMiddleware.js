// middleware/adminMiddleware.js

module.exports = (req, res, next) => {
  try {
    // role comes from JWT (you already added it in authController)
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied (Admin only)" });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};