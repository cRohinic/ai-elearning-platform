import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCourse, fetchProgress, completeLesson } from '../services/courseService.js';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Circle, ChevronRight, MessageSquare, ClipboardList, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LearnPage() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState(null);

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
    onSuccess: (d) => { if (!activeLesson) setActiveLesson(d.course.lessons[0]); },
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => fetchProgress(courseId),
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId) => completeLesson(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['progress', courseId]);
      toast.success('Lesson completed!');
    },
  });

  const course = courseData?.course;
  const progress = progressData?.progress;
  const completedSet = new Set(progress?.completedLessons?.map(String) || []);
  const currentLesson = activeLesson || course?.lessons?.[0];

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!course) return <div className="text-center py-20 text-gray-400">Course not found</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h2 className="font-display font-bold text-gray-900 text-sm leading-tight">{course.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${progress?.percentComplete || 0}%` }} />
            </div>
            <span className="text-xs text-gray-400">{progress?.percentComplete || 0}%</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((lesson, i) => {
            const done = completedSet.has(lesson._id?.toString());
            const active = currentLesson?._id === lesson._id;
            return (
              <button
                key={lesson._id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-gray-50 transition-colors ${
                  active ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                {done
                  ? <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  : <Circle size={16} className={`flex-shrink-0 mt-0.5 ${active ? 'text-primary-500' : 'text-gray-300'}`} />}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${active ? 'text-primary-700' : 'text-gray-700'}`}>
                    {i + 1}. {lesson.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{lesson.type}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link
            to={`/tutor/${courseId}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
          >
            <MessageSquare size={15} /> Ask AI tutor
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {currentLesson && (
          <div className="max-w-4xl mx-auto p-8">
            <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">{currentLesson.title}</h1>

            {/* Video lesson */}
            {currentLesson.type === 'video' && currentLesson.videoUrl && (
              <div className="rounded-2xl overflow-hidden bg-black mb-6 aspect-video">
                <ReactPlayer
                  url={currentLesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            )}

            {/* Markdown content */}
            {(currentLesson.type === 'markdown' || currentLesson.content) && (
              <div className="card p-8 mb-6 prose prose-gray max-w-none">
                <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
              </div>
            )}

            {/* Quiz link */}
            {currentLesson.type === 'quiz' && currentLesson.questions?.length > 0 && (
              <div className="card p-6 border-primary-100 bg-primary-50 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <ClipboardList size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentLesson.title}</h3>
                    <p className="text-sm text-gray-500">{currentLesson.questions.length} questions</p>
                  </div>
                </div>
                <Link
                  to={`/learn/${courseId}/quiz/${currentLesson._id}`}
                  className="btn-primary flex items-center gap-2 w-fit"
                >
                  Start quiz <ChevronRight size={16} />
                </Link>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              {!completedSet.has(currentLesson._id?.toString()) ? (
                <button
                  onClick={() => completeMutation.mutate(currentLesson._id)}
                  disabled={completeMutation.isPending}
                  className="btn-primary"
                >
                  {completeMutation.isPending ? 'Marking…' : 'Mark as complete'}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle size={16} /> Completed
                </div>
              )}

              {/* Next lesson */}
              {(() => {
                const idx = course.lessons.findIndex((l) => l._id === currentLesson._id);
                const next = course.lessons[idx + 1];
                return next ? (
                  <button
                    onClick={() => setActiveLesson(next)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                  >
                    Next: {next.title} <ChevronRight size={15} />
                  </button>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
