import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, LayoutDashboard, Search, GraduationCap, Map, BookOpen, Brain, TrendingUp, Settings, User } from 'lucide-react';
import { signOutUser } from '../../services/firebase/auth';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
}

const schoolNav: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard/school', icon: LayoutDashboard },
  { name: 'Career Discovery', href: '/dashboard/school/careers', icon: Search },
  { name: 'College Intelligence', href: '/dashboard/school/colleges', icon: GraduationCap },
  { name: 'My Roadmap', href: '/dashboard/school/roadmap', icon: Map },
  { name: 'Assessments', href: '/dashboard/school/assessments', icon: Brain },
  { name: 'Learning', href: '/dashboard/school/learning', icon: BookOpen },
];

const collegeNav: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard/college', icon: LayoutDashboard },
  { name: 'Career Explorer', href: '/dashboard/college/careers', icon: Search },
  { name: 'Skill Passport', href: '/dashboard/college/skills', icon: GraduationCap },
  { name: 'Skill Gap', href: '/dashboard/college/skill-gap', icon: Map },
  { name: 'Learning', href: '/dashboard/college/learning', icon: BookOpen },
  { name: 'Interview Arena', href: '/dashboard/college/interview', icon: Brain },
  { name: 'Progress', href: '/dashboard/college/progress', icon: TrendingUp },
];

export function DashboardLayout({ children, type }: { children: React.ReactNode, type: 'school' | 'college' }) {
  const { theme, toggleTheme } = useTheme();
  // logout was removed from useAuth
  const location = useLocation();

  const navItems = type === 'school' ? schoolNav : collegeNav;

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-bold text-xl tracking-tighter">NEXSTEP</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-surface-secondary text-text' 
                      : 'text-text-muted hover:bg-surface-secondary hover:text-text'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-accent' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <nav className="space-y-1">
            <Link to="/profile" className="flex items-center px-3 py-2 text-sm font-medium text-text-muted rounded-lg hover:bg-surface-secondary hover:text-text">
              <User className="mr-3 h-5 w-5" /> Profile
            </Link>
            <Link to="/settings" className="flex items-center px-3 py-2 text-sm font-medium text-text-muted rounded-lg hover:bg-surface-secondary hover:text-text">
              <Settings className="mr-3 h-5 w-5" /> Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden font-bold text-xl tracking-tighter">NEXSTEP</div>
          <div className="hidden md:block"></div> {/* Spacer */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-secondary text-text-muted">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={handleSignOut} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text border border-border rounded-lg hover:bg-surface-secondary transition-colors">
              Sign out
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
