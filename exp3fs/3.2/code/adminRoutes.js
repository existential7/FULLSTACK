const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/dashboard", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: "Welcome to the Admin dashboard" });
});

module.exports = router;
