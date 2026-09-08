import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { TrueFocus } from '../brand/TrueFocus';
import { Sun, Moon, ArrowRight, Menu, X, Compass, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/auth/login';
    if (!role) return '/auth/account-type';
    return role === 'college' ? '/dashboard/college' : '/dashboard/school';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F6F7F2]/90 dark:bg-[#0D1110]/90 backdrop-blur-md border-b border-[#DDE2DC] dark:border-[#29312D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="text-xl tracking-tight font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            <TrueFocus sentence="NEX STEP" animationDuration={0.4} />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard/school"
            className="text-sm font-medium text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2] transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-[#68716D] dark:text-[#9AA49F]" />
            For School Students
          </Link>
          <Link
            to="/dashboard/college"
            className="text-sm font-medium text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2] transition-colors flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-[#68716D] dark:text-[#9AA49F]" />
            For College Students
          </Link>
          <Link
            to="/how-it-works"
            className="text-sm font-medium text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2] transition-colors"
          >
            How It Works
          </Link>
        </nav>

        {/* Right CTA / Controls */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] border border-transparent hover:border-[#DDE2DC] dark:hover:border-[#29312D] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C7F36B]" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <Link
              to={getDashboardPath()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[#101413] text-[#F4F7F2] dark:bg-[#F4F7F2] dark:text-[#101413] hover:opacity-90 transition-opacity"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className="px-3.5 py-1.5 text-sm font-medium text-[#101413] dark:text-[#F4F7F2] hover:text-[#68716D] dark:hover:text-[#9AA49F] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C7F36B]" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard/school"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]"
            >
              For School Students
            </Link>
            <Link
              to="/dashboard/college"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]"
            >
              For College Students
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]"
            >
              How It Works
            </Link>
          </div>

          <div className="pt-4 border-t border-[#DDE2DC] dark:border-[#29312D] flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
                className="w-full py-2.5 px-4 text-center rounded-lg bg-[#101413] text-[#F4F7F2] dark:bg-[#F4F7F2] dark:text-[#101413] font-semibold text-sm"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-lg border border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-lg bg-[#C7F36B] text-[#101413] font-semibold text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
