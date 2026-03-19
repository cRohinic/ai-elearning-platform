import express from 'express';
import Course from '../models/Course.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// Add a lesson to a course
router.post('/:courseId/lessons', restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId, instructorId: req.user._id },
      { $push: { lessons: req.body } },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (err) { next(err); }
});

// Update a lesson
router.patch('/:courseId/lessons/:lessonId', restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, instructorId: req.user._id });
    if (!course) return res.status(404).json({ message: 'Not found' });
    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    Object.assign(lesson, req.body);
    await course.save();
    res.json({ lesson });
  } catch (err) { next(err); }
});

// Delete a lesson
router.delete('/:courseId/lessons/:lessonId', restrictTo('instructor', 'admin'), async (req, res, next) => {
  try {
    await Course.findOneAndUpdate(
      { _id: req.params.courseId, instructorId: req.user._id },
      { $pull: { lessons: { _id: req.params.lessonId } } }
    );
    res.json({ message: 'Lesson deleted' });
  } catch (err) { next(err); }
});

export default router;
