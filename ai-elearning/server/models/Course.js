import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  correctIndex: { type: Number, required: true },
  explanation: String,
  topic: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'markdown', 'quiz'], required: true },
  content: String,           // markdown content
  videoUrl: String,          // cloudinary URL
  videoDuration: Number,     // seconds
  questions: [questionSchema],
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  // For RAG — each lesson gets chunked & embedded
  vectorIds: [String],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    tags: [String],
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    stripePriceId: String,
    lessons: [lessonSchema],
    totalDuration: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    requirements: [String],
    outcomes: [String],
    // RAG — pinecone namespace for this course
    pineconeNamespace: String,
  },
  { timestamps: true }
);

// Auto-generate slug
courseSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();
  }
  next();
});

export default mongoose.model('Course', courseSchema);
