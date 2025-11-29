const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUserScores,
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

// ONLY ADMIN CAN ACCESS THIS
router.get("/all-scores", protect, admin, getAllUserScores);

module.exports = router;
