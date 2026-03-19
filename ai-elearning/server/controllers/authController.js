import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return next(new AppError('Email already registered', 400));

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'instructor' ? 'instructor' : 'student',
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return next(new AppError('Invalid credentials', 401));

    const match = await user.comparePassword(password);
    if (!match) return next(new AppError('Invalid credentials', 401));

    const token = signToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, learningStyle, preferredDifficulty } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, learningStyle, preferredDifficulty },
      { new: true }
    );
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
};
