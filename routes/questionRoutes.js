const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // your JWT middleware

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  addReply,
  deleteQuestion,
  deleteAnswer,
  deleteReply,
} = require("../controllers/questionController");

// -------------------- Question Routes --------------------
// Create a new question
router.post("/",  createQuestion);

// Get all questions
router.get("/", getQuestions);

// Get single question by ID
router.get("/:id", getQuestionById);

// Delete a question (only by owner)
router.delete("/:id", protect, deleteQuestion);

// -------------------- Answer Routes --------------------
// Add answer to a question
router.post("/:id/answers", addAnswer);

// Delete an answer (only by answer owner)
router.delete("/:questionId/answers/:answerId", protect, deleteAnswer);

// -------------------- Reply Routes --------------------
// Add reply to an answer
router.post("/:questionId/answers/:answerId/replies", addReply);

// Delete a reply (only by reply owner)
router.delete("/:questionId/answers/:answerId/replies/:replyId", protect, deleteReply);

module.exports = router;
