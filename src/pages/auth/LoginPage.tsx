import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { AlertCircle } from 'lucide-react';
import { signInWithEmail, signInWithGoogle } from '../../services/firebase/auth';
import { getFriendlyFirebaseErrorMessage } from '../../utils/firebaseErrors';

export default function LoginPage() {
  const { isConfigured } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode>('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmail(email, password);
      // AuthContext will automatically redirect due to onAuthStateChanged -> user state update
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // AuthContext will handle state update and AppRoutes will handle redirection
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyFirebaseErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        
        <div className="mb-12">
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
                Please supply the following variables in your .env file:
              </p>
              <div className="bg-surface-secondary p-4 rounded-lg border border-border text-left text-xs font-mono text-text-muted mb-6 overflow-x-auto whitespace-pre">
                VITE_FIREBASE_API_KEY=...
                <br/>VITE_FIREBASE_AUTH_DOMAIN=...
                <br/>VITE_FIREBASE_PROJECT_ID=...
                <br/>VITE_FIREBASE_STORAGE_BUCKET=...
                <br/>VITE_FIREBASE_MESSAGING_SENDER_ID=...
                <br/>VITE_FIREBASE_APP_ID=...
              </div>
              <Link to="/" className="text-accent hover:underline font-medium">Return to Home</Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-8">Sign In</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <button 
                  onClick={handleGoogleSignIn}
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
                
                <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                  
                  <div className="flex justify-end">
                    <Link to="/auth/forgot-password" className="text-sm text-text-muted hover:text-accent transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 px-4 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
                
                <div className="pt-4 text-center text-sm text-text-muted">
                  Don't have an account? <Link to="/auth/signup" className="text-accent hover:underline font-medium">Create Account</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}