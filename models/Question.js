// models/Question.js
const mongoose = require("mongoose");

// Reply (one level)
const replySchema = new mongoose.Schema(
  {
    reply: { type: String, required: true },
    replyBy: { type: String, required: true }, // name or username
  },
  { timestamps: true }
);

// Answer (with replies array)
const answerSchema = new mongoose.Schema(
  {
    answer: { type: String, required: true },
    answerBy: { type: String, required: true },
    output: { type: String }, // optional
    replies: [replySchema],
  },
  { timestamps: true }
);

// Question (root)
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    questionBy: { type: String, required: true }, // poster name
    input: { type: String }, // optional (e.g., code input)
    expectedOutput: { type: String }, // optional
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
