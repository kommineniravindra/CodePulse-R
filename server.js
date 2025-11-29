const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Assuming you have this
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require("./routes/authRoutes");
const contestRoutes = require("./routes/contestRoutes");
const quizRoutes = require("./routes/quizRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();
app.use(cors());

app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- API Routes ---
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/exams", examRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});