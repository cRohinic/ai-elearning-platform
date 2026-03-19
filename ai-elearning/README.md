# AI ELearn — Personalized E-Learning Platform

A full-stack MERN application with an AI-powered personal tutor, RAG-based course Q&A, adaptive quizzes, and Stripe payments.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS, Zustand, React Query, Socket.io client |
| Backend | Node.js, Express, Socket.io |
| Database | MongoDB Atlas + Mongoose |
| AI / RAG | OpenAI GPT-4o, text-embedding-3-small, Pinecone |
| Queue | BullMQ + Redis |
| Media | Cloudinary |
| Payments | Stripe |
| Deploy | Vercel (client) + Railway (server) |

---

## Project Structure

```
ai-elearning/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx          # Main navbar + footer wrapper
│   │   │   │   └── AuthLayout.jsx      # Login/register wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Landing page
│   │   │   ├── LoginPage.jsx           # Auth - login
│   │   │   ├── RegisterPage.jsx        # Auth - register
│   │   │   ├── DashboardPage.jsx       # Student dashboard + analytics
│   │   │   ├── CoursesPage.jsx         # Browse & filter courses
│   │   │   ├── CourseDetailPage.jsx    # Course info + enroll/buy
│   │   │   ├── LearnPage.jsx           # Video/markdown lesson viewer
│   │   │   ├── QuizPage.jsx            # Quiz taking + AI feedback
│   │   │   ├── TutorPage.jsx           # Real-time AI tutor chat
│   │   │   ├── ProfilePage.jsx         # Learning preferences
│   │   │   ├── InstructorPage.jsx      # Create courses
│   │   │   └── PaymentSuccessPage.jsx  # Stripe success redirect
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance + interceptors
│   │   │   ├── socket.js               # Socket.io client singleton
│   │   │   └── courseService.js        # All API call functions
│   │   ├── store/
│   │   │   └── authStore.js            # Zustand auth state (persisted)
│   │   ├── App.jsx                     # Router + protected routes
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Tailwind + custom CSS
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── nginx.conf                      # Production nginx for Docker
│   └── Dockerfile
│
├── server/                        # Express backend
│   ├── config/
│   │   ├── db.js                       # MongoDB connection
│   │   ├── redis.js                    # Redis / BullMQ connection
│   │   └── cloudinary.js               # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js           # Register, login, me, profile
│   │   ├── courseController.js         # CRUD, enroll, progress, complete
│   │   ├── aiController.js             # AI tutor SSE, quiz gen, study plan
│   │   ├── quizController.js           # Submit quiz, update weak topics
│   │   ├── paymentController.js        # Stripe checkout + webhook
│   │   └── uploadController.js         # Cloudinary video/image upload
│   ├── middleware/
│   │   ├── auth.js                     # JWT protect + role restrict
│   │   ├── errorHandler.js             # Global error handler + AppError
│   │   └── rateLimiter.js              # API + AI rate limiting
│   ├── models/
│   │   ├── User.js                     # User schema (enrollments, quiz history, AI profile)
│   │   ├── Course.js                   # Course + Lesson schema (embedded)
│   │   └── Progress.js                 # Per-student per-course progress + chat history
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── lessons.js
│   │   ├── quiz.js
│   │   ├── ai.js
│   │   ├── users.js
│   │   ├── payments.js
│   │   └── upload.js
│   ├── services/
│   │   ├── embeddingService.js         # Pinecone upsert + semantic search (RAG)
│   │   ├── socketService.js            # Socket.io real-time AI tutor handler
│   │   └── emailService.js             # Nodemailer welcome / progress / certificate
│   ├── jobs/
│   │   └── weeklyReport.js             # BullMQ weekly progress email job
│   ├── index.js                        # Server entry — Express + Socket.io
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD
├── docker-compose.yml
├── package.json                        # Root scripts (concurrently)
├── .gitignore
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier works)
- OpenAI API key
- Pinecone account (free tier: 1 index)

### Step 1 — Clone and install

```bash
git clone https://github.com/your-username/ai-elearning.git
cd ai-elearning
npm run install:all
```

### Step 2 — Configure environment

```bash
cp server/.env.example server/.env
```

Open `server/.env` and fill in:

```env
# Required for core functionality
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-elearning
JWT_SECRET=any_long_random_string_here
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX=elearning-courses
CLIENT_URL=http://localhost:5173

# Required for payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Required for media uploads
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Optional (emails work without this but won't send)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
```

### Step 3 — Start Redis (required for job queue)

```bash
# macOS
brew install redis && brew services start redis

# Ubuntu/Debian
sudo apt install redis-server && sudo systemctl start redis

# Windows — use WSL2 or Docker:
docker run -d -p 6379:6379 redis:alpine
```

### Step 4 — Create your Pinecone index

1. Go to [pinecone.io](https://pinecone.io) → Create index
2. Name: `elearning-courses`
3. Dimensions: `1536` (matches `text-embedding-3-small`)
4. Metric: `cosine`

### Step 5 — Run the app

```bash
# Runs both server (port 5000) and client (port 5173) together
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Docker Setup (Full Stack)

Run everything — Mongo, Redis, server, client — with one command:

```bash
# Copy and fill in your .env first
cp server/.env.example server/.env

# Build and start all services
docker-compose up --build

# Stop
docker-compose down
```

Services:
- Client: http://localhost:5173
- Server API: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register (student or instructor) |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | ✓ | Get current user |
| PATCH | /api/auth/profile | ✓ | Update name, learning style |

### Courses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/courses | — | List courses (filter by category, level, search) |
| GET | /api/courses/:slug | — | Get single course |
| POST | /api/courses | instructor | Create course |
| PATCH | /api/courses/:id | instructor | Update course |
| POST | /api/courses/:id/publish | instructor | Publish + trigger RAG embedding |
| POST | /api/courses/:id/enroll | ✓ | Enroll in free course |
| GET | /api/courses/:id/progress | ✓ | Get my progress |
| POST | /api/courses/complete-lesson | ✓ | Mark lesson complete |

### AI
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/ai/tutor | ✓ | SSE streaming AI tutor response |
| POST | /api/ai/generate-quiz | ✓ | AI-generated quiz questions |
| POST | /api/ai/study-plan | ✓ | Personalized 2-week study plan |
| POST | /api/ai/update-weak-topics | ✓ | Update student weak/strong topics |

### Quiz
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/quiz/submit | ✓ | Submit answers, get score + feedback |
| GET | /api/quiz/history | ✓ | Get quiz history + weak topics |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/payments/checkout | ✓ | Create Stripe checkout session |
| POST | /api/payments/webhook | — | Stripe webhook (enroll on payment) |

### Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/upload/video | instructor | Upload video to Cloudinary |
| POST | /api/upload/image | instructor | Upload thumbnail to Cloudinary |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/dashboard | ✓ | Dashboard data (enrolled courses, study plan) |
| GET | /api/users/analytics | ✓ | Learning analytics (scores, topics, progress) |

---

## Socket.io Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-course` | `courseId` | Join course room |
| `tutor-message` | `{ question, courseId, lessonContext }` | Send question to AI tutor |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `tutor-delta` | `{ delta }` | Streaming token from AI |
| `tutor-done` | `{ fullResponse }` | Stream complete |
| `tutor-error` | `{ message }` | Error fallback |

---

## Stripe Setup (for paid courses)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Copy your **Secret key** (`sk_test_...`) to `.env`
3. For webhooks (local testing):
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payments/webhook

# Copy the webhook signing secret to .env as STRIPE_WEBHOOK_SECRET
```

---

## Deployment

### Client → Vercel

```bash
cd client
npm install -g vercel
vercel --prod
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = your Railway server URL

### Server → Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `server/` as root directory
4. Add all environment variables from `.env`
5. Railway auto-provisions MongoDB and Redis add-ons if needed

---

## How the AI Tutor Works

```
Student asks question
        ↓
Build student context (weak topics, learning style, quiz history)
        ↓
Embed question with text-embedding-3-small
        ↓
Query Pinecone (course namespace) → top 5 relevant lesson chunks
        ↓
Build personalized system prompt:
  "Student weak areas: X. Style: visual. Relevant content: [chunks]"
        ↓
Stream GPT-4o response token by token via Socket.io
        ↓
Save chat to Progress.aiChatHistory
        ↓
After quiz → update User.weakTopics / strongTopics
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✓ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✓ | Any long random string |
| `JWT_EXPIRES_IN` | — | Default: `7d` |
| `OPENAI_API_KEY` | ✓ | For GPT-4o + embeddings |
| `PINECONE_API_KEY` | ✓ | For vector search (RAG) |
| `PINECONE_INDEX` | ✓ | Your index name |
| `CLOUDINARY_CLOUD_NAME` | ✓ | For video/image uploads |
| `CLOUDINARY_API_KEY` | ✓ | |
| `CLOUDINARY_API_SECRET` | ✓ | |
| `STRIPE_SECRET_KEY` | ✓ | For paid courses |
| `STRIPE_WEBHOOK_SECRET` | ✓ | For Stripe webhook verification |
| `REDIS_URL` | ✓ | For BullMQ job queue |
| `CLIENT_URL` | ✓ | Frontend URL (for CORS) |
| `SMTP_HOST` | — | For email notifications |
| `SMTP_PORT` | — | |
| `SMTP_USER` | — | |
| `SMTP_PASS` | — | |
| `PORT` | — | Default: `5000` |
| `NODE_ENV` | — | `development` or `production` |

---

## Common Issues

**MongoDB connection fails**
- Make sure your IP is whitelisted in MongoDB Atlas (Network Access → Add 0.0.0.0/0 for dev)

**Pinecone 404 on query**
- Create the index first. Dimensions must be `1536`, metric `cosine`

**AI tutor not streaming**
- Check your `OPENAI_API_KEY` is set and has credits
- Check Redis is running (needed for Socket.io to scale)

**Stripe webhook signature fails**
- Use `stripe listen` CLI locally — it gives you the correct `STRIPE_WEBHOOK_SECRET`
- Make sure the `/api/payments/webhook` route uses `express.raw()` before the JSON middleware

---

## License

MIT
