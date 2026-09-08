import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocalUser, UserRole, SchoolProfile, CollegeProfile } from '../types';
import {
  getCurrentUser,
  loginLocalAccount,
  createLocalAccount,
  logoutLocalAccount,
  updateCurrentUserRole,
  updateCurrentUserAccountType,
  getUserProfile,
} from '../services/storage/localStorage';

interface AuthContextType {
  user: LocalUser | null;
  role: UserRole;
  accountType: UserRole;
  activeRole: UserRole;
  isAuthenticated: boolean;
  profile: SchoolProfile | CollegeProfile | any | null;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; user?: LocalUser; error?: string };
  logout: () => void;
  setRole: (role: 'school' | 'college') => boolean;
  setAccountType: (accountType: 'school' | 'college') => boolean;
  refreshUser: () => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  accountType: null,
  activeRole: null,
  isAuthenticated: false,
  profile: null,
  loading: false,
  login: () => ({ success: false }),
  signup: () => ({ success: false }),
  logout: () => {},
  setRole: () => false,
  setAccountType: () => false,
  refreshUser: () => {},
  refreshProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization prevents hydration flash or protected-route race condition
  const [user, setUser] = useState<LocalUser | null>(() => getCurrentUser());
  const [profile, setProfile] = useState<SchoolProfile | CollegeProfile | any | null>(() => {
    const current = getCurrentUser();
    return current ? getUserProfile(current.id) : null;
  });
  const [loading, setLoading] = useState(false);

  const loadUserData = () => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      const prof = getUserProfile(current.id);
      setProfile(prof);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const login = (email: string, password: string) => {
    const res = loginLocalAccount(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      const prof = getUserProfile(res.user.id);
      setProfile(prof);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed.' };
  };

  const signup = (name: string, email: string, password: string) => {
    const res = createLocalAccount(name, email, password);
    if (res.success && res.user) {
      setUser(res.user);
      const prof = getUserProfile(res.user.id);
      setProfile(prof);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error || 'Signup failed.' };
  };

  const logout = () => {
    logoutLocalAccount();
    setUser(null);
    setProfile(null);
  };

  const setAccountType = (newType: 'school' | 'college'): boolean => {
    const updated = updateCurrentUserAccountType(newType);
    if (updated) {
      setUser(updated);
      const prof = getUserProfile(updated.id);
      setProfile(prof);
      return true;
    }
    return false;
  };

  const setRole = (newRole: 'school' | 'college'): boolean => {
    return setAccountType(newRole);
  };

  const refreshUser = () => {
    loadUserData();
  };

  const refreshProfile = () => {
    if (user) {
      const prof = getUserProfile(user.id);
      setProfile(prof);
    }
  };

  const isAuthenticated = !!user || !!getCurrentUser();
  const currentRole = user?.role ?? user?.accountType ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        accountType: user?.accountType ?? currentRole,
        activeRole: currentRole,
        isAuthenticated,
        profile,
        loading,
        login,
        signup,
        logout,
        setRole,
        setAccountType,
        refreshUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
