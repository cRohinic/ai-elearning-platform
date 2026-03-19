import express from 'express';
import {
  getAllCourses, getCourse, createCourse, updateCourse,
  publishCourse, enrollInCourse, getMyProgress, completeLesson,
} from '../controllers/courseController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:slug', getCourse);

router.use(protect);
router.post('/', restrictTo('instructor', 'admin'), createCourse);
router.patch('/:id', restrictTo('instructor', 'admin'), updateCourse);
router.post('/:id/publish', restrictTo('instructor', 'admin'), publishCourse);
router.post('/:id/enroll', enrollInCourse);
router.get('/:id/progress', getMyProgress);
router.post('/complete-lesson', completeLesson);

export default router;
