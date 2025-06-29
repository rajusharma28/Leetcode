import express from 'express';
import * as contestController from '../controllers/contestController.js';
import userMiddleware from '../middleware/userMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', contestController.getAllContests);
router.get('/:id', contestController.getContestById);
router.get('/:id/leaderboard', contestController.getContestLeaderboard);

// Protected routes (require authentication)
router.post('/:id/register', userMiddleware, contestController.registerForContest);
router.post('/:id/submit', userMiddleware, contestController.submitContestSolution);

// Admin routes
router.post('/', userMiddleware, adminMiddleware, contestController.createContest);

export default router;