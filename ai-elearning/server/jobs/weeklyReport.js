import Bull from 'bull';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { sendWeeklyProgress } from '../services/emailService.js';

const weeklyReportQueue = new Bull('weekly-reports', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Process jobs
weeklyReportQueue.process(async (job) => {
  const { userId } = job.data;
  const user = await User.findById(userId);
  if (!user) return;

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const progressRecords = await Progress.find({ studentId: userId });

  let lessonsCompleted = 0;
  let totalScore = 0;
  let scoreCount = 0;
  let tutorSessions = 0;

  for (const p of progressRecords) {
    const recentLessons = p.completedLessons?.filter(
      (l) => l.completedAt && l.completedAt > oneWeekAgo
    );
    lessonsCompleted += recentLessons?.length || 0;

    const recentScores = p.quizScores?.filter((s) => s.timestamp > oneWeekAgo) || [];
    recentScores.forEach((s) => {
      totalScore += s.score;
      scoreCount++;
    });

    const recentChats = p.aiChatHistory?.filter(
      (c) => c.timestamp > oneWeekAgo && c.role === 'user'
    );
    tutorSessions += recentChats?.length || 0;
  }

  await sendWeeklyProgress(user, {
    lessonsCompleted,
    avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
    tutorSessions,
    weakTopics: user.weakTopics || [],
  });
});

// Schedule weekly reports for all students every Sunday at 9am
export async function scheduleWeeklyReports() {
  const users = await User.find({ role: 'student' }).select('_id');
  for (const user of users) {
    await weeklyReportQueue.add(
      { userId: user._id },
      { repeat: { cron: '0 9 * * 0' } }
    );
  }
  console.log(`📧 Scheduled weekly reports for ${users.length} students`);
}

export default weeklyReportQueue;
