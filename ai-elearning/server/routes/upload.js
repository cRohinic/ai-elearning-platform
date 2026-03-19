import express from 'express';
import multer from 'multer';
import { uploadVideo, uploadImage } from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const upload = multer({ dest: '/tmp/' });
const router = express.Router();

router.use(protect, restrictTo('instructor', 'admin'));
router.post('/video', upload.single('video'), uploadVideo);
router.post('/image', upload.single('image'), uploadImage);

export default router;
