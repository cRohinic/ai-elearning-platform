// routes/ai.js
import express from 'express';
import { askTutor, generateQuiz, generateStudyPlan, updateWeakTopics } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.use(protect);
router.post('/tutor', aiLimiter, askTutor);
router.post('/generate-quiz', aiLimiter, generateQuiz);
router.post('/study-plan', aiLimiter, generateStudyPlan);
router.post('/update-weak-topics', updateWeakTopics);

export default router;
