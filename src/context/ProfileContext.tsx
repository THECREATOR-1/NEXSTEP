import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export type AccountType = 'school' | 'college' | null;

export interface ProfileData {
  uid: string;
  accountType: AccountType;
  name: string;
  // School fields
  class?: string;
  board?: string;
  stream?: string;
  overallPercentage?: number;
  strongSubjects?: string[];
  interests?: string[];
  careerGoals?: string;
  // College fields
  university?: string;
  degree?: string;
  branch?: string;
  year?: string;
  cgpa?: number;
  skills?: any[];
  targetJob?: string;
}

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchProfile() {
      setLoading(true);
      if (user && db) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists() && isMounted) {
            setProfile(docSnap.data() as ProfileData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else if (isMounted) {
        setProfile(null);
      }
      if (isMounted) setLoading(false);
    }
    
    fetchProfile();
    
    return () => { isMounted = false; };
  }, [user]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!profile || !user || !db) return;
    
    const updated = { ...profile, ...data };
    // Optimistic update
    setProfile(updated);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Revert on failure (could be improved)
      setProfile(profile);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

