import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { AlertCircle } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '../../services/firebase/auth';
import { getFriendlyErrorMessage } from '../../utils/firebaseErrors';

export default function SignupPage() {
  const { isConfigured } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<React.ReactNode>('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signUpWithEmail(name, email, password);
      // AppRoutes redirects automatically, but for sign up we might need to go to account type if profile has accountType: null
      // Actually AuthContext sets accountType to null on initial creation, so Routes will redirect to AccountTypeSelection implicitly
      // But wait, the route for '/' only redirects if it's school or college. Otherwise it renders LandingPage.
      // Let's explicitly redirect to account type selection here just to be safe.
      navigate('/auth/account-type');
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/auth/account-type');
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err));
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
                Please supply the required variables in your .env file.
              </p>
              <Link to="/" className="text-accent hover:underline font-medium">Return to Home</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-8">Create Account</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                  <p>{error}</p>
                  {error === 'This email is already registered.' && (
                    <Link to="/auth/login" className="inline-block mt-2 font-medium hover:underline text-accent">
                      Sign in instead
                    </Link>
                  )}
                </div>
              )}
              <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  type="button"
                  className="w-full py-3 px-4 bg-surface-secondary border border-border rounded-xl hover:bg-border transition-colors font-medium text-left flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
                  Continue with Google
                </button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface text-text-muted">Or continue with email</span>
                  </div>
                </div>
                
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
                  />
                  <input 
                    type="email" 
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
                  />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 px-4 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>
                
                <div className="pt-4 text-center text-sm text-text-muted">
                  Already have an account? <Link to="/auth/login" className="text-accent hover:underline font-medium">Sign In</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
