const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Submission = require('../models/submission');

// Get all submissions for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('questionId', 'title');

        const formattedSubmissions = submissions.map(sub => ({
            id: sub._id,
            timeSubmitted: sub.createdAt,
            questionTitle: sub.questionId.title,
            status: sub.status,
            runtime: sub.runtime,
            language: sub.language
        }));

        res.json(formattedSubmissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;