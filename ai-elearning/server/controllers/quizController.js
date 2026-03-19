import User from '../models/User.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';

export const submitQuiz = async (req, res, next) => {
  try {
    const { courseId, lessonId, answers } = req.body;

    const course = await Course.findById(courseId);
    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const questions = lesson.questions;
    let correct = 0;
    const wrongTopics = [];
    const correctTopics = [];
    const results = [];

    answers.forEach((answerIdx, i) => {
      const q = questions[i];
      const isCorrect = answerIdx === q.correctIndex;
      if (isCorrect) {
        correct++;
        if (q.topic) correctTopics.push(q.topic);
      } else {
        if (q.topic) wrongTopics.push(q.topic);
      }
      results.push({ isCorrect, correctIndex: q.correctIndex, explanation: q.explanation });
    });

    const score = Math.round((correct / questions.length) * 100);

    // Save quiz attempt
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        quizHistory: {
          quizId: lessonId,
          courseId,
          score,
          totalQuestions: questions.length,
          wrongTopics,
        },
      },
      $addToSet: { weakTopics: { $each: wrongTopics } },
    });

    await Progress.findOneAndUpdate(
      { studentId: req.user._id, courseId },
      {
        $push: { quizScores: { lessonId, score, maxScore: 100, timestamp: new Date() } },
      },
      { upsert: true }
    );

    res.json({ score, correct, total: questions.length, results, wrongTopics, correctTopics });
  } catch (err) {
    next(err);
  }
};

export const getQuizHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('quizHistory weakTopics strongTopics');
    res.json(user);
  } catch (err) {
    next(err);
  }
};
