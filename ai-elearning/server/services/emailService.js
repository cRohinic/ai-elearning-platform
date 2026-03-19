import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendWelcomeEmail(user) {
  await transporter.sendMail({
    from: `"AI ELearn" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Welcome to AI ELearn!',
    html: `<h2>Hi ${user.name}!</h2>
           <p>Welcome to your personalized AI-powered learning journey.</p>
           <p>Your AI tutor is ready to help you learn smarter, not harder.</p>`,
  });
}

export async function sendWeeklyProgress(user, stats) {
  await transporter.sendMail({
    from: `"AI ELearn" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Your Weekly Learning Report',
    html: `<h2>Hi ${user.name}!</h2>
           <p>Here's your learning summary for this week:</p>
           <ul>
             <li>Lessons completed: ${stats.lessonsCompleted}</li>
             <li>Quiz average score: ${stats.avgScore}%</li>
             <li>AI tutor sessions: ${stats.tutorSessions}</li>
             <li>Weak topics to review: ${stats.weakTopics.join(', ') || 'None — great job!'}</li>
           </ul>
           <p>Keep it up!</p>`,
  });
}

export async function sendCertificateEmail(user, course, certUrl) {
  await transporter.sendMail({
    from: `"AI ELearn" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Certificate: ${course.title}`,
    html: `<h2>Congratulations ${user.name}!</h2>
           <p>You've completed <strong>${course.title}</strong>.</p>
           <p><a href="${certUrl}">Download your certificate</a></p>`,
  });
}
