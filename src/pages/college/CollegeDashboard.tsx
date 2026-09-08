import { useProfile } from '../../context/ProfileContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';

export default function CollegeDashboard() {
  const { profile } = useProfile();

  return (
    <DashboardLayout type="college">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Good morning, {profile?.name || 'Student'}.</h1>
          <p className="text-text-muted mt-2">Here's your career readiness and skill overview.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 p-6 bg-surface border border-border rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4 text-text-muted text-sm uppercase tracking-wider">Career Readiness</h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-accent">
                <span className="text-3xl font-bold">74%</span>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between text-sm"><span className="text-text-muted">Technical</span><span className="font-medium">82%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Projects</span><span className="font-medium">78%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Aptitude</span><span className="font-medium">65%</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">Communication</span><span className="font-medium">70%</span></div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Target: {profile?.targetJob || 'Software Engineer'}</h3>
                <Link to="/dashboard/college/skill-gap" className="text-sm text-accent font-medium hover:underline">View Gap Analysis</Link>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">C++ (Strong)</span>
                  </div>
                  <div className="w-full bg-surface-secondary rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Embedded C (Improve)</span>
                  </div>
                  <div className="w-full bg-surface-secondary rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '40%', opacity: 0.7 }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">RTOS (Critical Gap)</span>
                  </div>
                  <div className="w-full bg-surface-secondary rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '10%', opacity: 0.4 }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col items-start">
                  <h3 className="font-semibold text-lg mb-2">AI Interview Arena</h3>
                  <p className="text-sm text-text-muted mb-4 flex-1">Practice your skills with our AI interviewer.</p>
                  <Link to="/dashboard/college/interview" className="px-4 py-2 bg-surface-secondary hover:bg-border border border-border transition-colors font-medium rounded-lg text-sm">Start Practice</Link>
               </div>
               <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col items-start">
                  <h3 className="font-semibold text-lg mb-2">Skill Passport</h3>
                  <p className="text-sm text-text-muted mb-4 flex-1">View your verified skills and evidence.</p>
                  <Link to="/dashboard/college/skills" className="px-4 py-2 bg-surface-secondary hover:bg-border border border-border transition-colors font-medium rounded-lg text-sm">View Passport</Link>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}