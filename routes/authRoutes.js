const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUserScores,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/all-scores", protect, getAllUserScores);

module.exports = router;
