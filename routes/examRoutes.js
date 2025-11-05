// const express = require("express");
// const { addExam, updateExam, getExam } = require("../controllers/examController");

// const router = express.Router();

// router.post("/exams", addExam);     // Add exam
// router.patch("/exams", updateExam); // Update exam
// router.get("/exams", getExam);      // Get exam result

// module.exports = router;





// const express = require("express");
// const router = express.Router();
// const {
//   addExam,
//   updateExam,
//   getExamsByUser,
// } = require("../controllers/examController");
// const { protect } = require("../middleware/authMiddleware"); // Assuming this middleware verifies the JWT

// // ✅ CHANGED: Routes are now more RESTful and secure.

// // POST /api/exams
// // Creates a new exam result for the logged-in user.
// router.post("/", protect, addExam);

// // PATCH /api/exams
// // Updates an existing exam result for the logged-in user.
// router.patch("/", protect, updateExam);

// // GET /api/exams/user/:userId
// // This is the essential route for the dashboard to fetch all exam history.
// router.get("/user/:userId", protect, getExamsByUser);

// module.exports = router;



const express = require("express");
const router = express.Router();
const {
  addExam,
  updateExam,
  getExamsByUser,
} = require("../controllers/examController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/exams
router.post("/", protect, addExam);

// PATCH /api/exams
router.patch("/", protect, updateExam);

// GET /api/exams/user/:userId
router.get("/user/:userId", protect, getExamsByUser);

module.exports = router;