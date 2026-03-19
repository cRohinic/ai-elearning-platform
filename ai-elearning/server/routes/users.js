import express from 'express';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/dashboard', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.courseId', 'title thumbnail slug')
      .populate('studyPlan.courseId', 'title');
    res.json({ user: user.toPublicJSON() });
  } catch (err) { next(err); }
});

router.get('/analytics', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const progresses = await Progress.find({ studentId: req.user._id })
      .populate('courseId', 'title');

    const totalLessons = progresses.reduce((a, p) => a + p.completedLessons.length, 0);
    const allScores = progresses.flatMap((p) => p.quizScores.map((s) => s.score));
    const avgScore = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    res.json({
      totalLessons,
      avgScore,
      weakTopics: user.weakTopics,
      strongTopics: user.strongTopics,
      enrolledCount: user.enrolledCourses.length,
      progresses,
    });
  } catch (err) { next(err); }
});

export default router;
