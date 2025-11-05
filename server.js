// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors"); 
// // server.js (or index.js) — add the base path for question routes
// const questionRoutes = require("./routes/questionRoutes");


// // Load environment variables
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();
// app.use(cors());

// // Middleware to parse JSON
// app.use(express.json());

// // Basic route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Routes
//  const authRoutes = require("./routes/authRoutes");
//  app.use("/api/auth", authRoutes);

// app.use("/api/questions", questionRoutes);

// const examRoutes = require("./routes/examRoutes");

// app.use("/api", examRoutes);
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const examRoutes = require("./routes/examRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);

// ✅ CHANGED: Corrected the base path for exam routes.
// This ensures that requests to '/api/exams/...' are handled correctly.
app.use("/api/exams", examRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quizzes", quizRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});