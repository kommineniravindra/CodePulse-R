
const express = require("express");
const router = express.Router();
const {
  submitQuiz,
  getQuizzesByUser,
} = require("../controllers/quizController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/quizzes/submit - Add or update a quiz
router.post("/submit", protect, submitQuiz);

// GET /api/quizzes/user/:userId - Get all quizzes for a specific user
router.get("/user/:userId", protect, getQuizzesByUser);

module.exports = router;