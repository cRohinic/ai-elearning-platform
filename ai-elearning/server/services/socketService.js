import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { semanticSearch } from './embeddingService.js';

let openai = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    import('openai').then(({ default: OpenAI }) => {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    });
  }
  return openai;
}

export function setupSocketHandlers(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Unauthorized'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.userId}`);

    socket.on('join-course', (courseId) => {
      socket.join(`course-${courseId}`);
    });

    socket.on('tutor-message', async ({ question, courseId, lessonContext }) => {
      try {
        if (!process.env.OPENAI_API_KEY) {
          socket.emit('tutor-error', { message: 'AI tutor not configured yet.' });
          return;
        }

        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const student = await User.findById(socket.userId);
        const progress = await Progress.findOne({
          studentId: socket.userId,
          courseId,
        });

        const weakTopics = student.weakTopics?.join(', ') || 'none';
        const recentHistory = progress?.aiChatHistory?.slice(-6) || [];

        let retrievedContext = '';
        try {
          const chunks = await semanticSearch(question, courseId, 4);
          retrievedContext = chunks.map((c) => c.text).join('\n\n---\n\n');
        } catch (e) {
          console.warn('RAG skipped:', e.message);
        }

        const systemPrompt = `You are a patient, expert AI tutor.
Student weak areas: ${weakTopics}
Learning style: ${student.learningStyle || 'mixed'}
Lesson context: ${lessonContext || 'general'}
Relevant course content:
${retrievedContext || 'No content retrieved.'}
Be concise, use examples, encourage the student.`;

        const messages = [
          { role: 'system', content: systemPrompt },
          ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: question },
        ];

        let fullResponse = '';

        const stream = await client.chat.completions.create({
          model: 'gpt-4o',
          messages,
          stream: true,
          max_tokens: 600,
          temperature: 0.6,
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            fullResponse += delta;
            socket.emit('tutor-delta', { delta });
          }
        }

        socket.emit('tutor-done', { fullResponse });

        Progress.findOneAndUpdate(
          { studentId: socket.userId, courseId },
          {
            $push: {
              aiChatHistory: {
                $each: [
                  { role: 'user', content: question },
                  { role: 'assistant', content: fullResponse },
                ],
              },
            },
          },
          { upsert: true }
        ).catch(console.error);

      } catch (err) {
        socket.emit('tutor-error', { message: 'AI tutor unavailable. Try again.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.userId}`);
    });
  });
}