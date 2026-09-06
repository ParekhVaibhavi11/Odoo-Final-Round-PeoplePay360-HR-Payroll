import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { forgotPassword } from '../../../services/authService';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSubmitted(true);
      showToast(res.message || 'Password reset email sent!', 'success');
    } catch (err) {
      showToast(err.message || 'Error processing request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-plum-700 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Reset your password</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your registered work email address and we will send you a password reset link.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-900">Check your inbox</h3>
          <p className="text-xs text-emerald-700 leading-relaxed">
            If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Work Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plum-700/20 focus:border-plum-700 transition-all text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-plum-700 hover:bg-plum-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
