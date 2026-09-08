import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { ArrowRight, AlertCircle, HardDrive } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = signup(name, email, password);

      if (!res.success) {
        setError(res.error || 'Failed to create account.');
        setLoading(false);
        return;
      }

      // Automatically navigate to account-type selection after successful account & profile creation
      navigate('/auth/account-type');
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during signup.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-3xl" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#101413] dark:text-[#F4F7F2]">
          Create your local account
        </h1>
        <p className="mt-1 text-sm text-[#68716D] dark:text-[#9AA49F]">
          Start your career journey backed by verifiable intelligence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] dark:bg-[#151A18] py-8 px-4 shadow-xs sm:rounded-2xl sm:px-10 border border-[#DDE2DC] dark:border-[#29312D]">
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Sharma"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
              />
            </div>

            <button
              type="submit"
              id="signup-submit-btn"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? 'Creating account...' : 'Continue to Track Selection'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#DDE2DC] dark:border-[#29312D] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#68716D] dark:text-[#9AA49F]">
              <HardDrive className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Data stored locally in your browser.</span>
            </div>
            <p className="mt-4 text-sm text-[#68716D] dark:text-[#9AA49F]">
              Already have an account?{' '}
              <Link to="/auth/login" className="font-semibold text-[#101413] dark:text-[#F4F7F2] underline hover:no-underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
