import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { getUserProfile, getCurrentUser } from '../../services/storage/localStorage';
import { ArrowRight, Lock, Mail, AlertCircle, HardDrive } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const res = login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials.');
      return;
    }

    // Direct user to correct dashboard or onboarding based on existing profile
    const current = getCurrentUser();
    const effectiveRole = current?.role || current?.accountType;
    if (!effectiveRole) {
      navigate('/auth/account-type');
      return;
    }

    const profile = current ? getUserProfile(current.id) : null;
    if (!profile || !profile.onboardingCompleted) {
      navigate(effectiveRole === 'school' ? '/onboarding/school' : '/onboarding/college');
      return;
    }

    navigate(effectiveRole === 'school' ? '/dashboard/school' : '/dashboard/college');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* TrueFocus Branding */}
        <Link to="/" className="inline-block">
          <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-3xl" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#101413] dark:text-[#F4F7F2]">
          Sign in to your account
        </h1>
        <p className="mt-1 text-sm text-[#68716D] dark:text-[#9AA49F]">
          Access your personalized career intelligence and Skill Passport.
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
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2]"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Local storage note */}
          <div className="mt-6 pt-5 border-t border-[#DDE2DC] dark:border-[#29312D] text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#68716D] dark:text-[#9AA49F]">
              <HardDrive className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Stand-alone local browser storage mode.</span>
            </div>
            <p className="mt-4 text-sm text-[#68716D] dark:text-[#9AA49F]">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="font-semibold text-[#101413] dark:text-[#F4F7F2] underline hover:no-underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
