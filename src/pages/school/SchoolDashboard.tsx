import { useProfile } from '../../context/ProfileContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function SchoolDashboard() {
  const { profile } = useProfile();

  return (
    <DashboardLayout type="school">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Good morning, {profile?.name || 'Student'}.</h1>
          <p className="text-text-muted mt-2">Here's your career and college intelligence summary.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 bg-surface border border-border rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4 text-text-muted text-sm uppercase tracking-wider">Career Fit</h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-accent">
                <span className="text-3xl font-bold">82%</span>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm"><span className="text-text-muted">Academic Fit</span><span className="font-medium">88%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Interest Fit</span><span className="font-medium">91%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Aptitude</span><span className="font-medium">79%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Career Alignment</span><span className="font-medium">85%</span></div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Top Career Matches</h3>
                <button className="text-sm text-accent font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-secondary border border-border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Embedded Systems Engineer</h4>
                    <p className="text-sm text-text-muted">Strong match based on Physics & Electronics interest.</p>
                  </div>
                  <span className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">86% Match</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-secondary border border-border flex justify-between items-center">
                  <div>
                    <h4 className="font-bold">Electronics Engineer</h4>
                    <p className="text-sm text-text-muted">Good alignment with current academic trajectory.</p>
                  </div>
                  <span className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">82% Match</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
               <h3 className="font-semibold text-lg mb-2">Recommended Stream</h3>
               <p className="text-text-muted mb-4">Based on your Class 10/12 profile, we recommend focusing on:</p>
               <div className="inline-block px-4 py-2 bg-accent text-background font-bold rounded-lg">
                 Science (PCM)
               </div>
               <p className="text-sm mt-4 text-text-muted">
                 Why: Strong Mathematics, Strong Physics, Technology Interest, Problem-solving Preference.
               </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}