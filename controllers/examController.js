// const User = require("../models/User");

// // 1. Add a new exam result
// const addExam = async (req, res) => {
//   try {
//     const { email, examCode, mcqMarks, fillMarks, codingMarks } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Calculate grand total
//     const grandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);

//     // Check if exam already exists
//     const existingExam = user.exams.find((e) => e.examCode === examCode);
//     if (existingExam) {
//       return res
//         .status(400)
//         .json({ message: "Exam with this code already exists. Use update instead." });
//     }

//     user.exams.push({ examCode, mcqMarks, fillMarks, codingMarks, grandTotal });
//     await user.save();

//     res.status(201).json({ message: "Exam added", exams: user.exams });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. Update exam result
// const updateExam = async (req, res) => {
//   try {
//     const { email, examCode, mcqMarks, fillMarks, codingMarks } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const exam = user.exams.find((e) => e.examCode === examCode);
//     if (!exam) return res.status(404).json({ message: "Exam not found" });

//     if (mcqMarks !== undefined) exam.mcqMarks = mcqMarks;
//     if (fillMarks !== undefined) exam.fillMarks = fillMarks;
//     if (codingMarks !== undefined) exam.codingMarks = codingMarks;

//     exam.grandTotal = exam.mcqMarks + exam.fillMarks + exam.codingMarks;

//     await user.save();
//     res.json({ message: "Exam updated", exam });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 3. Get exam result
// const getExam = async (req, res) => {
//   try {
//     const { email, examCode } = req.query;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const exam = user.exams.find((e) => e.examCode === examCode);
//     if (!exam) return res.status(404).json({ message: "Exam not found" });

//     res.json({
//       email: user.email,
//       examCode: exam.examCode,
//       mcqMarks: exam.mcqMarks,
//       fillMarks: exam.fillMarks,
//       codingMarks: exam.codingMarks,
//       grandTotal: exam.grandTotal,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { addExam, updateExam, getExam };






// const User = require("../models/User");

// // 1. Add a new exam result
// const addExam = async (req, res) => {
//   try {
//     const { examCode, mcqMarks, fillMarks, codingMarks } = req.body;

//     // ✅ CHANGED: Get user securely from the 'protect' middleware token
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const grandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);

//     const existingExam = user.exams.find((e) => e.examCode === examCode);
//     if (existingExam) {
//       return res
//         .status(400)
//         .json({ message: "Exam with this code already exists. Use update instead." });
//     }

//     user.exams.push({ examCode, mcqMarks, fillMarks, codingMarks, grandTotal });
//     await user.save();

//     res.status(201).json({ message: "Exam added successfully", exams: user.exams });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 2. Update exam result
// const updateExam = async (req, res) => {
//   try {
//     const { examCode, mcqMarks, fillMarks, codingMarks } = req.body;

//     // ✅ CHANGED: Get user securely from the 'protect' middleware token
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const exam = user.exams.find((e) => e.examCode === examCode);
//     if (!exam) {
//       return res.status(404).json({ message: "Exam not found for this user" });
//     }

//     // Update marks if provided
//     if (mcqMarks !== undefined) exam.mcqMarks = mcqMarks;
//     if (fillMarks !== undefined) exam.fillMarks = fillMarks;
//     if (codingMarks !== undefined) exam.codingMarks = codingMarks;

//     // Recalculate grand total and update timestamp
//     exam.grandTotal = (exam.mcqMarks || 0) + (exam.fillMarks || 0) + (exam.codingMarks || 0);
//     exam.createdAt = new Date();

//     await user.save();
//     res.json({ message: "Exam updated successfully", exam });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🚀 NEW: Function to get all exams for the dashboard
// // This is required by your ExamDashboard.js component.
// const getExamsByUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Sort exams by date, newest first, for a consistent history view
//     const sortedExams = user.exams.sort((a, b) => b.createdAt - a.createdAt);

//     res.json(sortedExams);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // 🚀 NEW: Export the new function
// module.exports = { addExam, updateExam, getExamsByUser };



const User = require("../models/User");

// 1. Add a new exam result
const addExam = async (req, res) => {
  try {
    const { examCode, mcqMarks, fillMarks, codingMarks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const grandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);
    const existingExam = user.exams.find((e) => e.examCode === examCode);

    if (existingExam) {
      return res
        .status(400)
        .json({ message: "Exam with this code already exists. Use update instead." });
    }

    user.exams.push({ examCode, mcqMarks, fillMarks, codingMarks, grandTotal });
    await user.save();
    res.status(201).json({ message: "Exam added successfully", exams: user.exams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Update exam result
// ✅ LOGIC MOVED HERE: This function now checks if the new score is a high score.
const updateExam = async (req, res) => {
  try {
    const { examCode, mcqMarks, fillMarks, codingMarks } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exam = user.exams.find((e) => e.examCode === examCode);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found for this user" });
    }

    const newGrandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);

    // Only update if the new score is higher than the existing score
    if (newGrandTotal <= exam.grandTotal) {
      return res.status(200).json({
        message: `Your new score of ${newGrandTotal} is not higher than your previous score of ${exam.grandTotal}. The score was not updated.`,
        exam,
      });
    }

    // If the new score is higher, proceed with the update
    exam.mcqMarks = mcqMarks;
    exam.fillMarks = fillMarks;
    exam.codingMarks = codingMarks;
    exam.grandTotal = newGrandTotal;
    exam.createdAt = new Date(); 

    await user.save();
    res.json({ message: "Congratulations! Your new high score has been updated.", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get all exams for a user
const getExamsByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const sortedExams = user.exams.sort((a, b) => b.createdAt - a.createdAt);
    res.json(sortedExams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addExam, updateExam, getExamsByUser };