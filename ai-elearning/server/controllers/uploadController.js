import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middleware/errorHandler.js';

export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('No file uploaded', 400));

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      folder: 'elearning/videos',
      transformation: [{ quality: 'auto' }],
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('No file uploaded', 400));

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'elearning/thumbnails',
      transformation: [{ width: 1280, height: 720, crop: 'fill' }, { quality: 'auto' }],
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    next(err);
  }
};
