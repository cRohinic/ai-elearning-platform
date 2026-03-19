import api from './api.js';

// ── Courses ────────────────────────────────────────────
export const fetchCourses = (params) => api.get('/courses', { params }).then((r) => r.data);
export const fetchCourse = (slug) => api.get(`/courses/${slug}`).then((r) => r.data);
export const createCourse = (data) => api.post('/courses', data).then((r) => r.data);
export const updateCourse = (id, data) => api.patch(`/courses/${id}`, data).then((r) => r.data);
export const publishCourse = (id) => api.post(`/courses/${id}/publish`).then((r) => r.data);
export const enrollCourse = (id) => api.post(`/courses/${id}/enroll`).then((r) => r.data);
export const fetchProgress = (courseId) => api.get(`/courses/${courseId}/progress`).then((r) => r.data);
export const completeLesson = (courseId, lessonId) =>
  api.post('/courses/complete-lesson', { courseId, lessonId }).then((r) => r.data);

// ── Lessons ────────────────────────────────────────────
export const addLesson = (courseId, data) =>
  api.post(`/lessons/${courseId}/lessons`, data).then((r) => r.data);
export const updateLesson = (courseId, lessonId, data) =>
  api.patch(`/lessons/${courseId}/lessons/${lessonId}`, data).then((r) => r.data);
export const deleteLesson = (courseId, lessonId) =>
  api.delete(`/lessons/${courseId}/lessons/${lessonId}`).then((r) => r.data);

// ── Quiz ───────────────────────────────────────────────
export const submitQuiz = (data) => api.post('/quiz/submit', data).then((r) => r.data);
export const fetchQuizHistory = () => api.get('/quiz/history').then((r) => r.data);

// ── AI ────────────────────────────────────────────────
export const generateQuiz = (data) => api.post('/ai/generate-quiz', data).then((r) => r.data);
export const generateStudyPlan = (courseId) =>
  api.post('/ai/study-plan', { courseId }).then((r) => r.data);

// ── Users ─────────────────────────────────────────────
export const fetchDashboard = () => api.get('/users/dashboard').then((r) => r.data);
export const fetchAnalytics = () => api.get('/users/analytics').then((r) => r.data);
export const updateProfile = (data) => api.patch('/auth/profile', data).then((r) => r.data);

// ── Payments ──────────────────────────────────────────
export const createCheckout = (courseId) =>
  api.post('/payments/checkout', { courseId }).then((r) => r.data);

// ── Upload ────────────────────────────────────────────
export const uploadVideo = (formData, onProgress) =>
  api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  }).then((r) => r.data);

export const uploadImage = (formData) =>
  api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
