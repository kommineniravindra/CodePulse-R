const {
  getSpecificContest,
  getChapterTotal,
  getCourseTotal,
  addContestResult,
} = require("../controllers/contestController");

const router = require("express").Router();

// 1. Get Specific Contest
router.get("/:userId/single", getSpecificContest);
// 2. Get Total Marks for a Chapter
router.get("/:userId/chapter", getChapterTotal);

// 3. Get Total Marks for a Course
router.get("/:userId/course", getCourseTotal);

// POST → Save or Update Contest Score
router.post("/:userId", addContestResult); // This route now sends the code

module.exports = router;