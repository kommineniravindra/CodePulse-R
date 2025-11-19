const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Exam schema (subdocument)
const examSchema = new mongoose.Schema(
  {
    examCode: { type: String, required: true },
    mcqMarks: { type: Number, default: 0 },
    fillMarks: { type: Number, default: 0 },
    codingMarks: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Quiz schema (subdocument)
const quizSchema = new mongoose.Schema(
  {
    quizCode: { type: String, required: true },
    mcqMarks: { type: Number, default: 0 },
    fillMarks: { type: Number, default: 0 },
    codingMarks: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// contest Schema
const contestSchema = new mongoose.Schema(
  {
    course: { type: String, required: true }, // e.g., "HTML"
    chapter: { type: Number, required: true }, // e.g., 1
    example: { type: Number, required: true }, // e.g., 2
    contestCode: { type: String, required: true }, // e.g., "HTML-CH1-EX2"
    marks: { type: Number, default: 0 },
    code: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// User schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    mobile: { type: String, required: true },
    college: { type: String, required: true },
    qualification: { type: String, required: true },
    passingYear: { type: Number, required: true },
    cgpa: { type: Number, required: true },

    // Arrays of subdocuments
    exams: [examSchema],
    quizzes: [quizSchema],
    contests: [contestSchema], // This schema now includes the 'code' field
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to match entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);