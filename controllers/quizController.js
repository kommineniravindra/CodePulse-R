// const User = require("../models/User");

// // 1. Add a new quiz result
// const addQuiz = async (req, res) => {
//   try {
//     const { quizCode, mcqMarks, fillMarks, codingMarks } = req.body;
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const grandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);
//     const existingQuiz = user.quizzes.find((q) => q.quizCode === quizCode);

//     if (existingQuiz) {
//       return res
//         .status(400)
//         .json({ message: "Quiz with this code already exists. Use update instead." });
//     }

//     user.quizzes.push({ quizCode, mcqMarks, fillMarks, codingMarks, grandTotal });
//     await user.save();
//     res.status(201).json({ message: "Quiz added successfully", quizzes: user.quizzes });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. Update quiz result (only if higher score)
// const updateQuiz = async (req, res) => {
//   try {
//     const { quizCode, mcqMarks, fillMarks, codingMarks } = req.body;
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const quiz = user.quizzes.find((q) => q.quizCode === quizCode);
//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found for this user" });
//     }

//     const newGrandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);

//     if (newGrandTotal <= quiz.grandTotal) {
//       return res.status(200).json({
//         message: `Your new score of ${newGrandTotal} is not higher than your previous score of ${quiz.grandTotal}. The score was not updated.`,
//         quiz,
//       });
//     }

//     // Update only if higher
//     quiz.mcqMarks = mcqMarks;
//     quiz.fillMarks = fillMarks;
//     quiz.codingMarks = codingMarks;
//     quiz.grandTotal = newGrandTotal;
//     quiz.createdAt = new Date();

//     await user.save();
//     res.json({ message: "Congratulations! Your new high score has been updated.", quiz });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 3. Get all quizzes for a user
// const getQuizzesByUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const sortedQuizzes = user.quizzes.sort((a, b) => b.createdAt - a.createdAt);
//     res.json(sortedQuizzes);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { addQuiz, updateQuiz, getQuizzesByUser };






const User = require("../models/User");

// Combined function to add or update a quiz result
const submitQuiz = async (req, res) => {
  try {
    const { quizCode, mcqMarks, fillMarks, codingMarks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const grandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);
    const existingQuiz = user.quizzes.find((q) => q.quizCode === quizCode);

    if (existingQuiz) {
      // Quiz already exists, check if the new score is higher
      if (grandTotal > existingQuiz.grandTotal) {
        existingQuiz.mcqMarks = mcqMarks;
        existingQuiz.fillMarks = fillMarks;
        existingQuiz.codingMarks = codingMarks;
        existingQuiz.grandTotal = grandTotal;
        existingQuiz.createdAt = new Date(); // Update timestamp
        await user.save();
        return res.json({
          message: "Congratulations! Your new high score has been updated.",
          quiz: existingQuiz,
        });
      } else {
        return res.status(200).json({
          message: `Your new score of ${grandTotal} is not higher than your previous score of ${existingQuiz.grandTotal}. The score was not updated.`,
          quiz: existingQuiz,
        });
      }
    } else {
      // This is a new quiz, add it
      user.quizzes.push({
        quizCode,
        mcqMarks,
        fillMarks,
        codingMarks,
        grandTotal,
      });
      await user.save();
      return res
        .status(201)
        .json({ message: "Quiz result saved successfully!", quizzes: user.quizzes });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Get all quizzes for a user
const getQuizzesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const sortedQuizzes = user.quizzes.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.json(sortedQuizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitQuiz, getQuizzesByUser };