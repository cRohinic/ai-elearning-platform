import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'] },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const progressSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    quizScores: [
      {
        lessonId: mongoose.Schema.Types.ObjectId,
        score: Number,
        maxScore: Number,
        timestamp: Date,
      },
    ],
    aiChatHistory: [chatMessageSchema],
    percentComplete: { type: Number, default: 0 },
    lastAccessed: Date,
    certificateIssued: { type: Boolean, default: false },
    certificateUrl: String,
  },
  { timestamps: true }
);

progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
