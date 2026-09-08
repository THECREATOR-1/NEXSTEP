import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/storage/localStorage';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { ArrowRight, AlertCircle, CheckCircle2, HardDrive, ShieldAlert } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = resetPassword(email, newPassword);
    if (!res.success) {
      setError(res.error || 'Password reset failed.');
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block">
          <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-3xl" />
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#101413] dark:text-[#F4F7F2]">
          Reset Local Password
        </h1>
        <p className="mt-1 text-sm text-[#68716D] dark:text-[#9AA49F]">
          Browser Storage Recovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] dark:bg-[#151A18] py-8 px-4 shadow-xs sm:rounded-2xl sm:px-10 border border-[#DDE2DC] dark:border-[#29312D]">
          {/* Honest Notice */}
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Local Prototype Architecture:</strong> Password recovery is available only on this browser because NEXSTEP operates without a server database. No external email is transmitted.
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                Password Reset Successfully
              </h2>
              <p className="text-sm text-[#68716D] dark:text-[#9AA49F]">
                Your new password has been updated in this browser's local store. You can now sign in with your updated credentials.
              </p>
              <button
                onClick={() => navigate('/auth/login')}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Your Registered Email
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
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors cursor-pointer shadow-xs"
              >
                Reset Password Locally
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#DDE2DC] dark:border-[#29312D] text-center">
            <Link to="/auth/login" className="text-sm font-semibold text-[#101413] dark:text-[#F4F7F2] hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
