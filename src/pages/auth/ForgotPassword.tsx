import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { useAuth } from '../../context/AuthContext';
import { sendPasswordReset } from '../../services/firebase/auth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { getFriendlyFirebaseErrorMessage } from '../../utils/firebaseErrors';

export default function ForgotPassword() {
  const { isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<React.ReactNode>('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await sendPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        
        <div className="mb-8">
          <TrueFocus 
            sentence="NEX STEP"
            separator=" "
            manualMode={false}
            blurAmount={4}
            borderColor="#C7F36B"
            glowColor="rgba(199, 243, 107, 0.45)"
            animationDuration={0.7}
            pauseBetweenAnimations={1.4}
          />
        </div>

        <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-border shadow-sm">
          {!isConfigured ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Configuration Required</h2>
              <p className="text-text-muted mb-6">
                Firebase is required for the NEXSTEP platform. 
              </p>
              <Link to="/" className="text-accent hover:underline font-medium">Return to Home</Link>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-500 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-text-muted mb-6">
                If an account exists for {email}, we've sent password reset instructions.
              </p>
              <Link to="/auth/login" className="text-accent hover:underline font-medium block">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
              <p className="text-text-muted text-center mb-8 text-sm">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
                />
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 px-4 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
              
              <div className="pt-6 text-center text-sm">
                <Link to="/auth/login" className="text-text-muted hover:text-accent font-medium transition-colors">
                  &larr; Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
