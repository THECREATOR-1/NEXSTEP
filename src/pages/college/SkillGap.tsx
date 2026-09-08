import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useProfile } from '../../context/ProfileContext';
import { Target, CheckCircle2, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';

export default function SkillGap() {
  const { profile } = useProfile();

  return (
    <DashboardLayout type="college">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Skill Gap Analysis</h1>
          <p className="text-text-muted mt-2">Comparing your current profile against {profile?.targetJob || 'Software Engineer'} requirements.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-lg">Target Role</h3>
              </div>
              <p className="text-xl font-bold">{profile?.targetJob || 'Software Engineer'}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm text-text-muted mb-2">Overall Match</div>
                <div className="w-full bg-surface-secondary rounded-full h-2 mb-1">
                   <div className="bg-accent h-2 rounded-full" style={{ width: '74%' }}></div>
                </div>
                <div className="text-right text-xs font-medium">74%</div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" /> 
                Strong Matches
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between text-sm"><span className="font-medium">C++</span><span className="text-text-muted">Required: Med</span></li>
                <li className="flex justify-between text-sm"><span className="font-medium">Arduino</span><span className="text-text-muted">Required: Med</span></li>
                <li className="flex justify-between text-sm"><span className="font-medium">ESP32</span><span className="text-text-muted">Required: High</span></li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  Areas to Improve
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-secondary border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-base">Embedded C</h4>
                      <p className="text-sm text-text-muted mt-1">Required for advanced firmware development.</p>
                    </div>
                    <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-border">
                    <div className="flex-1"><span className="text-text-muted">Current:</span> Beginner</div>
                    <div className="flex-1"><span className="text-text-muted">Target:</span> Advanced</div>
                    <button className="flex items-center text-accent hover:underline font-medium">
                      <BookOpen className="w-4 h-4 mr-1" /> Learn
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-2xl shadow-sm border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Critical Gaps
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-secondary border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-base">RTOS (Real-Time Operating Systems)</h4>
                      <p className="text-sm text-text-muted mt-1">Essential for {profile?.targetJob}. Missing from profile.</p>
                    </div>
                    <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">High Priority</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-border">
                    <div className="flex-1"><span className="text-text-muted">Current:</span> None</div>
                    <div className="flex-1"><span className="text-text-muted">Target:</span> Intermediate</div>
                    <button className="flex items-center text-accent hover:underline font-medium">
                      <BookOpen className="w-4 h-4 mr-1" /> Start Path
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-surface-secondary border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-base">PCB Design</h4>
                      <p className="text-sm text-text-muted mt-1">Frequently requested skill for this role.</p>
                    </div>
                    <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">High Priority</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-border">
                    <div className="flex-1"><span className="text-text-muted">Current:</span> None</div>
                    <div className="flex-1"><span className="text-text-muted">Target:</span> Beginner</div>
                    <button className="flex items-center text-accent hover:underline font-medium">
                      <BookOpen className="w-4 h-4 mr-1" /> Start Path
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}