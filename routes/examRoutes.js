const express = require("express");
const router = express.Router();
const {
  addExam,
  updateExam,
  getExamsByUser,
} = require("../controllers/examController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/exams
router.post("/", protect, addExam);

// PATCH /api/exams
router.patch("/", protect, updateExam);

// GET /api/exams/user/:userId
router.get("/user/:userId", protect, getExamsByUser);

module.exports = router;