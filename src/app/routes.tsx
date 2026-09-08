import React from 'react';
import { Routes, Route, Navigate, useRouteError } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AccountTypeSelection from '../pages/auth/AccountTypeSelection';
import SchoolOnboarding from '../pages/onboarding/SchoolOnboarding';
import CollegeOnboarding from '../pages/onboarding/CollegeOnboarding';
import SchoolDashboard from '../pages/school/SchoolDashboard';
import CollegeDashboard from '../pages/college/CollegeDashboard';
import SkillPassport from '../pages/college/SkillPassport';
import SkillGap from '../pages/college/SkillGap';
import InterviewArena from '../pages/college/InterviewArena';
import CareerDiscovery from '../pages/school/CareerDiscovery';
import CollegeIntelligence from '../pages/school/CollegeIntelligence';
import SchoolRoadmapPage from '../pages/school/SchoolRoadmapPage';
import SchoolAssessments from '../pages/school/SchoolAssessments';
import SchoolLearning from '../pages/school/SchoolLearning';
import CollegeDetail from '../pages/school/CollegeDetail';
import CollegeCompare from '../pages/school/CollegeCompare';
import CollegeCareers from '../pages/college/CollegeCareers';
import CollegeLearning from '../pages/college/CollegeLearning';
import InterviewReportPage from '../pages/college/InterviewReportPage';
import CommunicationCoach from '../pages/college/CommunicationCoach';
import CollegeProgress from '../pages/college/CollegeProgress';
import Profile from '../pages/common/Profile';
import Settings from '../pages/common/Settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user && !user.accountType && window.location.pathname !== '/auth/account-type') {
    return <Navigate to="/auth/account-type" replace />;
  }
  
  return <>{children}</>;
}

export function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? (!user.accountType ? <Navigate to="/auth/account-type" /> : user.accountType === 'college' ? <Navigate to="/dashboard/college" /> : <Navigate to="/dashboard/school" />) : <LandingPage />} />

      <Route path="/auth/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/account-type" element={<AccountTypeSelection />} />
      
      <Route path="/onboarding/school" element={<SchoolOnboarding />} />
      <Route path="/onboarding/college" element={<CollegeOnboarding />} />
      
      {/* School Routes */}
      <Route path="/dashboard/school" element={<PrivateRoute><SchoolDashboard /></PrivateRoute>} />
      <Route path="/dashboard/school/careers" element={<PrivateRoute><CareerDiscovery /></PrivateRoute>} />
      <Route path="/dashboard/school/colleges" element={<PrivateRoute><CollegeIntelligence /></PrivateRoute>} />
      <Route path="/dashboard/school/colleges/:id" element={<PrivateRoute><CollegeDetail /></PrivateRoute>} />
      <Route path="/dashboard/school/compare" element={<PrivateRoute><CollegeCompare /></PrivateRoute>} />
      <Route path="/dashboard/school/roadmap" element={<PrivateRoute><SchoolRoadmapPage /></PrivateRoute>} />
      <Route path="/dashboard/school/assessments" element={<PrivateRoute><SchoolAssessments /></PrivateRoute>} />
      <Route path="/dashboard/school/learning" element={<PrivateRoute><SchoolLearning /></PrivateRoute>} />
      
      {/* College Routes */}
      <Route path="/dashboard/college" element={<PrivateRoute><CollegeDashboard /></PrivateRoute>} />
      <Route path="/dashboard/college/careers" element={<PrivateRoute><CollegeCareers /></PrivateRoute>} />
      <Route path="/dashboard/college/skills" element={<PrivateRoute><SkillPassport /></PrivateRoute>} />
      <Route path="/dashboard/college/skill-gap" element={<PrivateRoute><SkillGap /></PrivateRoute>} />
      <Route path="/dashboard/college/learning" element={<PrivateRoute><CollegeLearning /></PrivateRoute>} />
      <Route path="/dashboard/college/interview" element={<PrivateRoute><InterviewArena /></PrivateRoute>} />
      <Route path="/dashboard/college/interview/report/:id" element={<PrivateRoute><InterviewReportPage /></PrivateRoute>} />
      <Route path="/dashboard/college/communication" element={<PrivateRoute><CommunicationCoach /></PrivateRoute>} />
      <Route path="/dashboard/college/progress" element={<PrivateRoute><CollegeProgress /></PrivateRoute>} />
      
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
    </Routes>
  );
}