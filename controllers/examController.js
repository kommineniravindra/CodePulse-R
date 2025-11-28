const User = require("../models/User");

// 1. Add a new exam result (No changes needed here, already correct)
const addExam = async (req, res) => {
 try {
  const { examCode, mcqMarks, fillMarks, codingMarks, totalMarksPossible} = req.body;
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

  user.exams.push({ examCode, mcqMarks, fillMarks, codingMarks, grandTotal ,totalMarksPossible});
  await user.save();
  res.status(201).json({ message: "Exam added successfully", exams: user.exams });
 } catch (err) {
  res.status(500).json({ message: err.message });
 }
};

// 2. Update exam result (CORRECTED)
const updateExam = async (req, res) => {
try {
 const { 
    examCode, 
    mcqMarks, 
    fillMarks, 
    codingMarks, 
    totalMarksPossible 
  } = req.body;
 const user = await User.findById(req.user._id);

 if (!user) {
 return res.status(404).json({ message: "User not found" });
 }

 const exam = user.exams.find((e) => e.examCode === examCode);
 if (!exam) {
 return res.status(404).json({ message: "Exam not found for this user" });
 }

 const newGrandTotal = (mcqMarks || 0) + (fillMarks || 0) + (codingMarks || 0);

 // 🎯 STEP 1: Always update the individual scores and the total possible marks 
 // to reflect the latest attempt's breakdown and context.
 exam.mcqMarks = mcqMarks;
 exam.fillMarks = fillMarks;
 exam.codingMarks = codingMarks;
 exam.totalMarksPossible = totalMarksPossible; 

 // STEP 2: Check if the current attempt is a new HIGH SCORE.
 if (newGrandTotal <= exam.grandTotal) {
    // Save the changes made in STEP 1 (individual scores and totalMarksPossible)
    await user.save(); 
  return res.status(200).json({
    message: `Your new score of ${newGrandTotal} is not higher than your previous high score of ${exam.grandTotal}. The high score was not updated.`,
    exam,
  });
 }

 // STEP 3: If the new score is higher, update the high score fields (grandTotal & timestamp).
 // Individual scores were already updated in STEP 1.
 exam.grandTotal = newGrandTotal;
 exam.createdAt = new Date(); 

 await user.save();
 res.json({ message: "Congratulations! Your new high score has been updated.", exam });
} catch (err) {
 res.status(500).json({ message: err.message });
}
};

// 3. Get all exams for a user (No changes needed, already correct)
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