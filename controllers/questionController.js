const Question = require("../models/Question");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { question, input, expectedOutput } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question text is required" });
    }

    const questionBy = req.body.questionBy;
    if (!questionBy) return res.status(400).json({ message: "questionBy is required" });

    const newQuestion = await Question.create({
      question,
      questionBy,
      input,
      expectedOutput,
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get single question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Add answer to a question
const addAnswer = async (req, res) => {
  try {
    const { id } = req.params; // question ID
    const { answer, output } = req.body;

    if (!answer || answer.trim() === "") {
      return res.status(400).json({ message: "Answer text is required" });
    }

    const answerBy = req.body.answerBy;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.answers.push({ answer, answerBy, output });
    await question.save();

    const newAnswer = question.answers[question.answers.length - 1];
    res.status(201).json({ questionId: question._id, answer: newAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Add reply to an answer
const addReply = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const replyBy = req.body.replyBy;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.replies.push({ reply, replyBy });
    await question.save();

    const updatedAnswer = question.answers.id(answerId);
    res.status(201).json({ questionId: question._id, answer: updatedAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE a question (only by question owner)
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    if (question.questionBy !== req.user.studentName) {
      return res.status(403).json({ message: "Not authorized to delete this question" });
    }

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE an answer (only by answer owner)
const deleteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    if (answer.answerBy !== req.user.studentName) {
      return res.status(403).json({ message: "Not authorized to delete this answer" });
    }

    answer.remove();
    await question.save();
    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE a reply (only by reply owner)
const deleteReply = async (req, res) => {
  try {
    const { questionId, answerId, replyId } = req.params;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    const reply = answer.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.replyBy !== req.user.studentName) {
      return res.status(403).json({ message: "Not authorized to delete this reply" });
    }

    reply.remove();
    await question.save();
    res.json({ message: "Reply deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  addReply,
  deleteQuestion,
  deleteAnswer,
  deleteReply,
};
