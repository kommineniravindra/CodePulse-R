
// const User = require("../models/User"); // Assuming this path is correct
// const jwt = require("jsonwebtoken");

// // Generate JWT
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: "7d", // token valid for 7 days
//     });
// };

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// const registerUser = async (req, res) => {
//     try {
//         const {
//             email,
//             password,
//             studentName,
//             // dob,
//             gender,
//             mobile,
//             // college,
//             qualification,
//             passingYear,
//             cgpa,
//         } = req.body;

//         // 1. Check if all fields are present
//         if (
//             !email ||
//             !password ||
//             !studentName ||
//             !gender ||
//             !mobile ||
//             !qualification ||
//             !passingYear ||
//             !cgpa
//         ) {
//             return res.status(400).json({ message: "Please fill all fields" });
//         }

//         // 2. Check if user already exists
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // 3. Create user
//         const user = await User.create({
//             email,
//             password, 
//             studentName,
//             // dob,
//             gender,
//             mobile,
//             // college,
//             qualification,
//             passingYear,
//             cgpa,
//         });

//         // 4. Send success response
//         if (user) {
//             res.status(201).json({
//                 _id: user._id,
//                 email: user.email,
//                 studentName: user.studentName,
                
//                 token: generateToken(user._id),
//             });
//         } else {
//             res.status(400).json({ message: "Invalid user data" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // 1. Find user by email
//         const user = await User.findOne({ email });

//         // 2. Check if user exists and password matches
//         if (user && (await user.matchPassword(password))) {
//             res.json({
//                 _id: user._id,
//                 email: user.email,
//                 studentName: user.studentName,
//                    isAdmin: user.isAdmin,
//                 token: generateToken(user._id),
//             });
//         } else {
//             res.status(401).json({ message: "Invalid email or password" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Get user profile
// // @route   GET /api/auth/profile
// // @access  Private
// const getUserProfile = async (req, res) => {
//     if (req.user) {
//         res.json({
//             _id: req.user._id,
//             email: req.user.email,
//             studentName: req.user.studentName,
//             // dob: req.user.dob.toISOString().split("T")[0],
//             gender: req.user.gender,
//             mobile: req.user.mobile,
//             // college: req.user.college,
//             qualification: req.user.qualification,
//             passingYear: req.user.passingYear,
//             cgpa: req.user.cgpa,
//             isAdmin: req.user.isAdmin,
//         });
//     } else {
//         console.log("recieved request");
//         res.status(404).json({ message: "User not found" });
//     }
// };

// // @desc    Get all users with their quiz, exam, and contest scores, including timestamps
// // @route   GET /api/auth/all-scores
// // @access  Private (Admin/Reporting use case)
// const getAllUserScores = async (req, res) => {
//     try {
//         const users = await User.find().select(
//             "studentName email mobile quizzes exams contests"
//         ).lean(); 

//         if (!users || users.length === 0) {
//             return res.status(404).json({ message: "No users found" });
//         }

//         const formattedScores = users.map(user => {
//             return {
//                 studentName: user.studentName,
//                 email: user.email,
//                 mobile: user.mobile, 
                
//                 // Detailed Quiz Results
//                 quizzes: user.quizzes.map(q => ({
//                     code: q.quizCode,
//                     score: q.grandTotal,
//                     dateSubmitted: q.createdAt ? q.createdAt.toISOString() : null 
//                 })),
                
//                 // Detailed Exam Results
//                 exams: user.exams.map(e => ({
//                     code: e.examCode,
//                     score: e.grandTotal,
//                     // ... other exam fields
//                     dateSubmitted: e.createdAt ? e.createdAt.toISOString() : null
//                 })),

//                 // Detailed Contest Results
//                 contests: user.contests.map(c => ({
//                     course: c.course,
//                     // ... other contest fields
//                     code: c.contestCode,
//                     marks: c.marks,
//                     dateSubmitted: c.createdAt ? c.createdAt.toISOString() : null
//                 }))
//             };
//         });

//         res.json(formattedScores);
//     } catch (error) {
//         console.error("Error in getAllUserScores:", error);
//         res.status(500).json({ message: "Server error: " + error.message });
//     }
// };


// module.exports = { registerUser, loginUser, getUserProfile, getAllUserScores };







const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      studentName,
      gender,
      mobile,
      qualification,
      passingYear,
      cgpa,
      isAdmin,  // optional field
    } = req.body;

    if (
      !email || !password || !studentName || !gender ||
      !mobile || !qualification || !passingYear || !cgpa
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Only set admin if passed from frontend
    const user = await User.create({
      email,
      password,
      studentName,
      gender,
      mobile,
      qualification,
      passingYear,
      cgpa,
      isAdmin: isAdmin ? true : false,  // default false
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      studentName: user.studentName,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        studentName: user.studentName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id, user.isAdmin),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROFILE
const getUserProfile = async (req, res) => {
  return res.json(req.user);
};

// ADMIN: GET ALL USER SCORES
const getAllUserScores = async (req, res) => {
  try {
    const users = await User.find().select("studentName email mobile quizzes exams contests");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUserScores };
