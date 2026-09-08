import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useProfile } from '../../context/ProfileContext';
import { Search } from 'lucide-react';

export default function CareerDiscovery() {
  const { profile } = useProfile();

  return (
    <DashboardLayout type="school">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Career Discovery</h1>
          <p className="text-text-muted mt-2">Explore careers based on your strengths and interests.</p>
        </header>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search careers, domains, or skills..." 
            className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="grid gap-4 mt-6">
           {/* Placeholder for career cards */}
           <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
              <h3 className="font-bold text-xl mb-2">Embedded Systems Engineer</h3>
              <p className="text-text-muted mb-4">Design and develop the software that runs on custom hardware, connecting the physical and digital worlds.</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-surface-secondary px-3 py-1 rounded text-sm">Electronics</span>
                <span className="bg-surface-secondary px-3 py-1 rounded text-sm">Programming</span>
                <span className="bg-surface-secondary px-3 py-1 rounded text-sm">Hardware</span>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}