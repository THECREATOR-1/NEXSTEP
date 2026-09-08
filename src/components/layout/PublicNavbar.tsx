import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function PublicNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl tracking-tighter">NEXSTEP</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-secondary text-text-muted">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/auth/login" className="px-4 py-2 font-medium text-text hover:text-accent transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}