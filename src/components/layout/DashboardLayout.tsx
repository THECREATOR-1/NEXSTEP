import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { TrueFocus } from '../brand/TrueFocus';
import {
  LayoutDashboard,
  Compass,
  Building2,
  GitFork,
  MapPin,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Target,
  Mic,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  HardDrive,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: 'school' | 'college';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeRole }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const schoolNavItems = [
    { to: '/dashboard/school', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/school/careers', label: 'Career Discovery', icon: Compass },
    { to: '/dashboard/school/colleges', label: 'College Intelligence', icon: Building2 },
    { to: '/dashboard/school/compare', label: 'College Comparison', icon: GitFork },
    { to: '/dashboard/school/roadmap', label: 'My Roadmap', icon: MapPin },
    { to: '/dashboard/school/assessments', label: 'Assessments', icon: ClipboardCheck },
    { to: '/dashboard/school/learning', label: 'Learning', icon: BookOpen },
    { to: '/dashboard/school/progress', label: 'Progress', icon: TrendingUp },
  ];

  const collegeNavItems = [
    { to: '/dashboard/college', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/dashboard/college/careers', label: 'Career Explorer', icon: Compass },
    { to: '/dashboard/college/skills', label: 'Skill Passport', icon: ShieldCheck },
    { to: '/dashboard/college/skill-gap', label: 'Skill Gap', icon: Target },
    { to: '/dashboard/college/learning', label: 'Learning Center', icon: BookOpen },
    { to: '/dashboard/college/interview', label: 'Interview Arena', icon: Mic },
    { to: '/dashboard/college/communication', label: 'Communication Coach', icon: MessageSquare },
    { to: '/dashboard/college/progress', label: 'Progress', icon: TrendingUp },
  ];

  const navItems = activeRole === 'school' ? schoolNavItems : collegeNavItems;

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] flex flex-col md:flex-row transition-colors">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-lg" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C7F36B]" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand & Role Tag */}
        <div className="p-5 border-b border-[#DDE2DC] dark:border-[#29312D]">
          <Link to="/" className="block">
            <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-xl" />
          </Link>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] border border-[#DDE2DC] dark:border-[#29312D]">
              {activeRole === 'school' ? 'School Track' : 'College Track'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#68716D] dark:text-[#9AA49F]" title="Data saved locally in browser">
              <HardDrive className="w-3 h-3 text-[#C7F36B]" />
              Local DB
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive: matchActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    matchActive || isActive
                      ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] font-semibold shadow-xs'
                      : 'text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] hover:text-[#101413] dark:hover:text-[#F4F7F2]'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile & Settings */}
        <div className="p-3 border-t border-[#DDE2DC] dark:border-[#29312D] space-y-1 bg-[#F6F7F2]/50 dark:bg-[#0D1110]/50">
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${
                isActive
                  ? 'bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#F4F7F2] font-medium'
                  : 'text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]'
              }
            `}
          >
            <User className="w-4 h-4" />
            <span className="truncate">{user?.name || 'My Profile'}</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
              ${
                isActive
                  ? 'bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#F4F7F2] font-medium'
                  : 'text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]'
              }
            `}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>
          <div className="pt-2 flex items-center justify-between px-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2] cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#C7F36B]" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:opacity-80 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-[#FFFFFF] dark:bg-[#151A18] h-full flex flex-col z-10 border-r border-[#DDE2DC] dark:border-[#29312D]">
            <div className="p-4 flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D]">
              <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-lg" />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#68716D] dark:text-[#9AA49F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      ${
                        isActive
                          ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] font-semibold'
                          : 'text-[#68716D] dark:text-[#9AA49F]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#DDE2DC] dark:border-[#29312D] space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 text-sm text-[#101413] dark:text-[#F4F7F2]"
              >
                <User className="w-4 h-4" />
                <span>{user?.name || 'Profile'}</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 text-sm text-[#101413] dark:text-[#F4F7F2]"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 pt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
