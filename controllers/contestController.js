
const User = require('../models/User'); 

// Utility function to check for a valid MongoDB ID format
const isMongoIdValid = (id) => {
    return id && id.match(/^[0-9a-fA-F]{24}$/);
};


// get specific contest marks of a user
exports.getSpecificContest = async (req, res) => {
    try {
        const { userId } = req.params;
        const { course, chapter, example } = req.query;

        if (!isMongoIdValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format provided." });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const contest = user.contests.find(
            (c) =>
                c.course === course &&
                c.chapter === Number(chapter) &&
                c.example === Number(example)
        );

        if (!contest) return res.status(404).json({ message: "Contest not found" });

        res.json({ contest });
    } catch (err) {
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        console.error("Error in getSpecificContest:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

// Get total marks for a specific chapter in a course
exports.getChapterTotal = async (req, res) => {
    try {
        const { userId } = req.params;
        const { course, chapter } = req.query;

        if (!isMongoIdValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format provided." });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const contests = user.contests.filter(
            (c) => c.course === course && c.chapter === Number(chapter)
        );

        const totalMarks = contests.reduce((sum, c) => sum + c.marks, 0);

        res.json({ course, chapter, totalMarks, contests });
    } catch (err) {
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        console.error("Error in getChapterTotal:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

// Get total marks for a specific course
exports.getCourseTotal = async (req, res) => {
    try {
        const { userId } = req.params;
        const { course } = req.query;

        if (!isMongoIdValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format provided." });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const contests = user.contests.filter((c) => c.course === course);

        const totalMarks = contests.reduce((sum, c) => sum + c.marks, 0);

        res.json({ course, totalMarks, contests });
    } catch (err) {
        if (err.name === 'CastError' && err.path === '_id') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        console.error("Error in getCourseTotal:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

// Add or update contest result for a user
exports.addContestResult = async (req, res) => {
    try {
        const { userId } = req.params;
        const { course, chapter, example, marks, code } = req.body;

        if (!course || !chapter || !example || marks === undefined) {
            return res.status(400).json({
                message: "course, chapter, example, and marks are required",
            });
        }

        if (!isMongoIdValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format provided." });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const numChapter = Number(chapter);
        const numExample = Number(example);

        const contestCode = `${course}-CH${numChapter}-EX${numExample}`;

        const existing = user.contests.find(
            (c) =>
                c.course === course && c.chapter === numChapter && c.example === numExample
        );

        if (existing) {
            // Update existing contest
            existing.marks = marks;
            existing.contestCode = contestCode;
            existing.code = code; 
        } else {
            // Add new contest
            user.contests.push({
                course,
                chapter: numChapter,
                example: numExample,
                contestCode,
                marks,
                code: code, 
            });
        }

        await user.save();

        res.json({ message: "Contest result saved successfully" });
    } catch (error) {
        if (error.name === 'CastError' && error.path === '_id') {
            return res.status(400).json({ message: "Invalid User ID format." });
        }
        console.error("Error in addContestResult:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
};