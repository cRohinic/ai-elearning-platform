import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { AppError } from '../middleware/errorHandler.js';
import { embedCourse } from '../services/embeddingService.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.$text = { $search: search };

    const courses = await Course.find(query)
      .populate('instructorId', 'name avatar')
      .sort({ enrollmentCount: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);
    res.json({ courses, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructorId', 'name avatar bio');
    if (!course) return next(new AppError('Course not found', 404));
    res.json({ course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({ ...req.body, instructorId: req.user._id });
    res.status(201).json({ course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructorId: req.user._id },
      req.body,
      { new: true }
    );
    if (!course) return next(new AppError('Course not found or unauthorized', 404));
    res.json({ course });
  } catch (err) {
    next(err);
  }
};

export const publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructorId: req.user._id });
    if (!course) return next(new AppError('Not found', 404));

    course.isPublished = true;
    await course.save();

    // Index course content into Pinecone for RAG
    embedCourse(course).catch(console.error);

    res.json({ message: 'Course published and indexing started', course });
  } catch (err) {
    next(err);
  }
};

export const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError('Course not found', 404));

    const alreadyEnrolled = req.user.enrolledCourses.some(
      (e) => e.courseId.toString() === course._id.toString()
    );
    if (alreadyEnrolled) return next(new AppError('Already enrolled', 400));

    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: { courseId: course._id } },
    });
    await Course.findByIdAndUpdate(course._id, { $inc: { enrollmentCount: 1 } });
    await Progress.create({ studentId: req.user._id, courseId: course._id });

    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMyProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      studentId: req.user._id,
      courseId: req.params.id,
    });
    res.json({ progress });
  } catch (err) {
    next(err);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    const course = await Course.findById(courseId);

    const progress = await Progress.findOneAndUpdate(
      { studentId: req.user._id, courseId },
      {
        $addToSet: { completedLessons: lessonId },
        lastAccessed: new Date(),
      },
      { new: true, upsert: true }
    );

    const totalLessons = course.lessons.length;
    const done = progress.completedLessons.length;
    progress.percentComplete = Math.round((done / totalLessons) * 100);
    await progress.save();

    res.json({ progress });
  } catch (err) {
    next(err);
  }
};
