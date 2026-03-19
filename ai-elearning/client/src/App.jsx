import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import Layout from './components/layout/Layout.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import CourseDetailPage from './pages/CourseDetailPage.jsx';
import LearnPage from './pages/LearnPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import TutorPage from './pages/TutorPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import InstructorPage from './pages/InstructorPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuthStore();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main app */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/learn/:courseId" element={
            <ProtectedRoute><LearnPage /></ProtectedRoute>
          } />
          <Route path="/learn/:courseId/quiz/:lessonId" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />
          <Route path="/tutor/:courseId" element={
            <ProtectedRoute><TutorPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/instructor" element={
            <ProtectedRoute role="instructor"><InstructorPage /></ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
