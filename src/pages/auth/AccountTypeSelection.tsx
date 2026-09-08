import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { GraduationCap, School } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export default function AccountTypeSelection() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // If we already have an account type, we shouldn't be here
    if (!loading && user && user.accountType) {
      navigate(user.accountType === 'college' ? '/dashboard/college' : '/dashboard/school', { replace: true });
    }
  }, [user, loading, navigate]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleSelect = async (type: 'school' | 'college') => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const userRef = doc(db!, 'users', user.uid);
      await updateDoc(userRef, {
        accountType: type,
        updatedAt: new Date() // Ideally serverTimestamp() but Date() is fine for client side immediate update
      });
      // Context might take a moment to refresh, so we force navigation here to onboarding
      navigate(`/onboarding/${type}`);
      // In a real app we might reload context here, but reloading the page is a simple trick, or just let context catch up.
      window.location.href = `/onboarding/${type}`;
    } catch (err) {
      console.error('Error updating account type:', err);
      setIsUpdating(false);
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

        <div className="w-full max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">I am a...</h2>
          <p className="text-text-muted mb-12">
            Select your account type to personalize your NEXSTEP experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleSelect('school')}
              disabled={isUpdating}
              className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-2xl hover:border-accent hover:bg-surface-secondary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <School className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">School Student</h3>
              <p className="text-text-muted text-sm px-4">
                Explore careers, find the right college, and build your roadmap for the future.
              </p>
            </button>

            <button
              onClick={() => handleSelect('college')}
              disabled={isUpdating}
              className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-2xl hover:border-accent hover:bg-surface-secondary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">College Student</h3>
              <p className="text-text-muted text-sm px-4">
                Prepare for interviews, analyze your skill gap, and get job-ready.
              </p>
            </button>
          </div>
          
          {isUpdating && (
            <div className="mt-8 text-accent flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin mr-3"></div>
              Setting up your workspace...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
