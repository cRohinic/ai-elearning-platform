import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchCourse, submitQuiz } from '../services/courseService.js';
import { CheckCircle, XCircle, ChevronRight, Trophy, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['course-for-quiz', courseId],
    queryFn: () => fetchCourse(courseId),
  });

  const lesson = data?.course?.lessons?.find((l) => l._id === lessonId);
  const questions = lesson?.questions || [];

  const submitMutation = useMutation({
    mutationFn: () =>
      submitQuiz({
        courseId,
        lessonId,
        answers: questions.map((_, i) => answers[i] ?? -1),
      }),
    onSuccess: (data) => {
      setResults(data);
      if (data.score >= 70) toast.success(`Great job! You scored ${data.score}%`);
      else toast('Keep practicing! Review the explanations below.', { icon: '📚' });
    },
    onError: () => toast.error('Failed to submit quiz'),
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" /></div>;

  if (results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Score card */}
        <div className={`card p-8 text-center mb-8 ${results.score >= 70 ? 'border-green-200' : 'border-amber-200'}`}>
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${results.score >= 70 ? 'bg-green-50' : 'bg-amber-50'}`}>
            <Trophy size={36} className={results.score >= 70 ? 'text-green-500' : 'text-amber-500'} />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900">{results.score}%</h2>
          <p className="text-gray-500 mt-1">{results.correct} of {results.total} correct</p>
          {results.wrongTopics?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Topics to review:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.wrongTopics.map((t) => (
                  <span key={t} className="badge bg-red-50 text-red-600">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Answer review */}
        <div className="space-y-4 mb-8">
          {questions.map((q, i) => {
            const r = results.results[i];
            return (
              <div key={i} className={`card p-5 border ${r.isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                <div className="flex gap-3">
                  {r.isCorrect
                    ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    : <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{q.text}</p>
                    {!r.isCorrect && (
                      <p className="text-xs text-green-700 mt-1">
                        Correct: {q.options[r.correctIndex]}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setResults(null); setAnswers({}); }} className="btn-secondary flex-1">
            Retry quiz
          </button>
          <Link to={`/learn/${courseId}`} className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
            Continue course <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link to={`/learn/${courseId}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900">{lesson?.title || 'Quiz'}</h1>
          <p className="text-sm text-gray-400">{questions.length} questions</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="card p-6">
            <p className="font-medium text-gray-900 mb-4">
              <span className="text-primary-500 mr-2">{i + 1}.</span>{q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => setAnswers({ ...answers, [i]: j })}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    answers[i] === j
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="font-medium mr-2 text-gray-400">{String.fromCharCode(65 + j)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => submitMutation.mutate()}
        disabled={Object.keys(answers).length < questions.length || submitMutation.isPending}
        className="btn-primary w-full mt-8"
      >
        {submitMutation.isPending
          ? 'Submitting…'
          : `Submit (${Object.keys(answers).length}/${questions.length} answered)`}
      </button>
    </div>
  );
}
