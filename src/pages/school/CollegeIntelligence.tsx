import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useProfile } from '../../context/ProfileContext';
import { Search } from 'lucide-react';

export default function CollegeIntelligence() {
  const { profile } = useProfile();

  return (
    <DashboardLayout type="school">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">College Intelligence</h1>
          <p className="text-text-muted mt-2">Discover colleges that fit your academic profile and goals.</p>
        </header>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search colleges, courses, or locations..." 
            className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="grid gap-4 mt-6">
           <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="font-bold text-xl mb-1">National Institute of Technology</h3>
                <p className="text-text-muted">B.Tech Electronics and Communication Engineering</p>
                <div className="flex gap-2 mt-3 text-sm">
                  <span className="font-medium px-2 py-1 bg-accent/10 text-accent-foreground rounded">94% Fit</span>
                  <span className="text-text-muted px-2 py-1 bg-surface-secondary rounded">Strong Research</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-surface-secondary hover:bg-border border border-border rounded-lg font-medium transition-colors">
                View Details
              </button>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}