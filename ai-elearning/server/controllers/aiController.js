import OpenAI from 'openai';
import { getPineconeIndex } from '../services/embeddingService.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Course from '../models/Course.js';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const askTutor = async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({ message: 'AI tutor not configured yet.' });
    }
    const { question, courseId, lessonContext } = req.body;
    const student = await User.findById(req.user._id);
    const progress = await Progress.findOne({ studentId: req.user._id, courseId });

    const recentHistory = progress?.aiChatHistory?.slice(-6) || [];
    const weakTopics = student.weakTopics?.join(', ') || 'none identified yet';
    const learningStyle = student.learningStyle || 'mixed';

    let retrievedContext = '';
    try {
      const index = await getPineconeIndex();
      const embeddingRes = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: question,
      });
      const queryVector = embeddingRes.data[0].embedding;
      const namespace = courseId || 'global';
      const results = await index.namespace(namespace).query({
        vector: queryVector,
        topK: 5,
        includeMetadata: true,
      });
      retrievedContext = results.matches
        .map((m) => m.metadata?.text || '')
        .filter(Boolean)
        .join('\n\n---\n\n');
    } catch (e) {
      console.warn('Pinecone retrieval failed:', e.message);
    }

    const systemPrompt = `You are an expert, patient AI tutor.
Student weak areas: ${weakTopics}
Learning style: ${learningStyle}
Lesson context: ${lessonContext || 'general'}
Relevant course content:
${retrievedContext || 'No specific content retrieved.'}
Tailor your explanation, use examples, keep it clear.`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: question },
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      stream: true,
      max_tokens: 800,
      temperature: 0.6,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

    Progress.findOneAndUpdate(
      { studentId: req.user._id, courseId },
      {
        $push: {
          aiChatHistory: {
            $each: [
              { role: 'user', content: question },
              { role: 'assistant', content: fullResponse },
            ],
          },
        },
        lastAccessed: new Date(),
      },
      { upsert: true }
    ).catch(console.error);

  } catch (err) {
    if (!res.headersSent) next(err);
    else res.end();
  }
};

export const generateQuiz = async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({ message: 'AI not configured yet.' });
    }
    const { lessonContent, topic, numQuestions = 5, difficulty = 'medium' } = req.body;
    const prompt = `Generate ${numQuestions} multiple-choice quiz questions about "${topic}" based on:
${lessonContent}
Difficulty: ${difficulty}
Return a JSON object with a "questions" array:
{
  "questions": [
    {
      "text": "Question?",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Why correct",
      "topic": "subtopic"
    }
  ]
}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    res.json({ questions: parsed.questions || [] });
  } catch (err) {
    next(err);
  }
};

export const generateStudyPlan = async (req, res, next) => {
  try {
    if (!openai) {
      return res.status(503).json({ message: 'AI not configured yet.' });
    }
    const student = await User.findById(req.user._id);
    const course = await Course.findById(req.body.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessonTitles = course.lessons.map((l) => l.title).join(', ');
    const prompt = `Create a 2-week study plan for:
Student weak topics: ${student.weakTopics?.join(', ') || 'none'}
Learning style: ${student.learningStyle}
Course: ${course.title}
Lessons: ${lessonTitles}
Return JSON: { "plan": [{ "day": 1, "topic": "...", "duration": 30, "type": "lesson", "notes": "..." }] }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });
    const parsed = JSON.parse(response.choices[0].message.content);
    res.json({ plan: parsed.plan || [] });
  } catch (err) {
    next(err);
  }
};

export const updateWeakTopics = async (req, res, next) => {
  try {
    const { wrongTopics, correctTopics } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { weakTopics: { $each: wrongTopics } },
      $pull: { weakTopics: { $in: correctTopics } },
      $addToSet: { strongTopics: { $each: correctTopics } },
    });
    res.json({ message: 'Learning profile updated' });
  } catch (err) {
    next(err);
  }
};