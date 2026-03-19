import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Payment successful!</h1>
      <p className="text-gray-500 mb-8">You're now enrolled. Your AI tutor is ready whenever you are.</p>
      <div className="flex justify-center gap-4">
        <Link to="/dashboard" className="btn-primary">Go to dashboard</Link>
        <Link to="/courses" className="btn-secondary">Browse more courses</Link>
      </div>
    </div>
  );
}
