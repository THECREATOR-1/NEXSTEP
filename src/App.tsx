import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getCurrentUser } from './services/storage/localStorage';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { AccountTypePage } from './pages/auth/AccountTypePage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Onboarding Pages
import { SchoolOnboardingPage } from './pages/onboarding/SchoolOnboardingPage';
import { CollegeOnboardingPage } from './pages/onboarding/CollegeOnboardingPage';

// School Track Pages
import { SchoolDashboardPage } from './pages/school/SchoolDashboardPage';
import { CareerDiscoveryPage } from './pages/school/CareerDiscoveryPage';
import { CollegeIntelligencePage } from './pages/school/CollegeIntelligencePage';
import { CollegeDetailPage } from './pages/school/CollegeDetailPage';
import { CollegeComparisonPage } from './pages/school/CollegeComparisonPage';
import { SchoolRoadmapPage } from './pages/school/SchoolRoadmapPage';
import { AssessmentsPage } from './pages/school/AssessmentsPage';
import { SchoolLearningPage } from './pages/school/SchoolLearningPage';
import { SchoolProgressPage } from './pages/school/SchoolProgressPage';

// College Track Pages
import { CollegeDashboardPage } from './pages/college/CollegeDashboardPage';
import { CareerExplorerPage } from './pages/college/CareerExplorerPage';
import { SkillPassportPage } from './pages/college/SkillPassportPage';
import { SkillGapPage } from './pages/college/SkillGapPage';
import { InterviewArenaPage } from './pages/college/InterviewArenaPage';
import { CollegeProgressPage } from './pages/college/CollegeProgressPage';

// Shared Pages
import { SettingsPage } from './pages/settings/SettingsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const hasLocalSession = !!getCurrentUser();
  const authed = isAuthenticated || hasLocalSession;

  if (loading && !hasLocalSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]">
        <div className="animate-pulse text-sm font-bold font-mono">Loading NEXSTEP...</div>
      </div>
    );
  }

  if (!authed) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Route to intelligently redirect to user's dashboard
const DashboardRedirect: React.FC = () => {
  const { role, user } = useAuth();
  const target = role || user?.role || user?.accountType || 'school';
  return <Navigate to={`/dashboard/${target}`} replace />;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route
              path="/auth/account-type"
              element={
                <ProtectedRoute>
                  <AccountTypePage />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

            {/* Onboarding Routes */}
            <Route
              path="/onboarding/school"
              element={
                <ProtectedRoute>
                  <SchoolOnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/college"
              element={
                <ProtectedRoute>
                  <CollegeOnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* School Track Routes */}
            <Route
              path="/dashboard/school"
              element={
                <ProtectedRoute>
                  <SchoolDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/careers"
              element={
                <ProtectedRoute>
                  <CareerDiscoveryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/colleges"
              element={
                <ProtectedRoute>
                  <CollegeIntelligencePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/colleges/:id"
              element={
                <ProtectedRoute>
                  <CollegeDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/compare"
              element={
                <ProtectedRoute>
                  <CollegeComparisonPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/roadmap"
              element={
                <ProtectedRoute>
                  <SchoolRoadmapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/assessments"
              element={
                <ProtectedRoute>
                  <AssessmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/learning"
              element={
                <ProtectedRoute>
                  <SchoolLearningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school/progress"
              element={
                <ProtectedRoute>
                  <SchoolProgressPage />
                </ProtectedRoute>
              }
            />

            {/* College Track Routes */}
            <Route
              path="/dashboard/college"
              element={
                <ProtectedRoute>
                  <CollegeDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/careers"
              element={
                <ProtectedRoute>
                  <CareerExplorerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/skills"
              element={
                <ProtectedRoute>
                  <SkillPassportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/passport"
              element={
                <ProtectedRoute>
                  <SkillPassportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/skill-gap"
              element={
                <ProtectedRoute>
                  <SkillGapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/gap-analysis"
              element={
                <ProtectedRoute>
                  <SkillGapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/learning"
              element={
                <ProtectedRoute>
                  <SchoolLearningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/interview"
              element={
                <ProtectedRoute>
                  <InterviewArenaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/communication"
              element={
                <ProtectedRoute>
                  <InterviewArenaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/college/progress"
              element={
                <ProtectedRoute>
                  <CollegeProgressPage />
                </ProtectedRoute>
              }
            />

            {/* Shared Profile & Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
