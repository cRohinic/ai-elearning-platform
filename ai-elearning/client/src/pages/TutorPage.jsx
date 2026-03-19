import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourse, fetchProgress } from '../services/courseService.js';
import { getSocket } from '../services/socket.js';
import { useAuthStore } from '../store/authStore.js';
import { Send, Bot, User, ArrowLeft, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUGGESTED = [
  'Explain this topic in simple terms',
  'Give me a real-world example',
  'What are common mistakes beginners make?',
  'Create a quick summary of what I just learned',
  'I got this quiz question wrong — help me understand it',
];

export default function TutorPage() {
  const { courseId } = useParams();
  const { token, user } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your personal AI tutor for this course. Ask me anything — I'll adapt my explanations to your learning style and weak areas.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const { data: courseData } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: false,
  });

  useEffect(() => {
    const socket = getSocket(token);
    socketRef.current = socket;
    socket.emit('join-course', courseId);

    socket.on('tutor-delta', ({ delta }) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last?.streaming) {
          return [...prev.slice(0, -1), { ...last, content: last.content + delta }];
        }
        return [...prev, { role: 'assistant', content: delta, streaming: true }];
      });
    });

    socket.on('tutor-done', () => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.streaming) {
          return [...prev.slice(0, -1), { ...last, streaming: false }];
        }
        return prev;
      });
      setIsStreaming(false);
    });

    socket.on('tutor-error', ({ message }) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Sorry, I ran into an issue: ${message}` }]);
      setIsStreaming(false);
    });

    return () => {
      socket.off('tutor-delta');
      socket.off('tutor-done');
      socket.off('tutor-error');
    };
  }, [courseId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text = input) => {
    if (!text.trim() || isStreaming) return;
    const question = text.trim();
    setInput('');
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    socketRef.current?.emit('tutor-message', { question, courseId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </Link>
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-gray-900 text-lg leading-tight">AI Tutor</h1>
          <p className="text-xs text-gray-400">Personalized to your learning profile</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-700 font-medium">Online</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
              } ${msg.streaming ? 'streaming-cursor' : ''}`}
            >
              {msg.role === 'assistant' ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-primary-700">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg my-2 text-xs overflow-x-auto">{children}</pre>
                    ),
                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs bg-white border border-gray-200 text-gray-600 hover:border-primary-400 hover:text-primary-600 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about this course…"
          disabled={isStreaming}
          className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || isStreaming}
          className="w-9 h-9 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
