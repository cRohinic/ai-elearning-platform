import express from 'express';
import { submitQuiz, getQuizHistory } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/submit', submitQuiz);
router.get('/history', getQuizHistory);

export default router;
