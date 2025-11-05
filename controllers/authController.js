const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "9h", // token valid for 9 hour
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      studentName,
      dob,
      gender,
      mobile,
      college,
      qualification,
      passingYear,
      cgpa,
    } = req.body;

    // 1. Check if all fields are present
    if (
      !email ||
      !password ||
      !studentName ||
      !dob ||
      !gender ||
      !mobile ||
      !college ||
      !qualification ||
      !passingYear ||
      !cgpa
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Create user
    const user = await User.create({
      email,
      password, // will be hashed in schema
      studentName,
      dob,
      gender,
      mobile,
      college,
      qualification,
      passingYear,
      cgpa,
    });

    // 4. Send success response
    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        studentName: user.studentName,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        studentName: user.studentName,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
//
const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      email: req.user.email,
      studentName: req.user.studentName,
      dob: req.user.dob.toISOString().split("T")[0],
      gender: req.user.gender,
      mobile: req.user.mobile,
      college: req.user.college,
      qualification: req.user.qualification,
      passingYear: req.user.passingYear,
      cgpa: req.user.cgpa,
    });
  } else {
    console.log("recieved request");

    res.status(404).json({ message: "User not found" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
