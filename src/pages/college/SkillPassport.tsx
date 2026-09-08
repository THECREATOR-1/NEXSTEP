import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useProfile } from '../../context/ProfileContext';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function SkillPassport() {
  const { profile } = useProfile();

  const skills = [
    { name: 'Python', claimed: 'Intermediate', evidence: '3 Projects', assessment: '82%', interview: '78%', confidence: 'High', status: 'verified' },
    { name: 'C++', claimed: 'Intermediate', evidence: '2 Projects', assessment: '75%', interview: '70%', confidence: 'Medium', status: 'verified' },
    { name: 'ESP32', claimed: 'Advanced', evidence: 'Hardware Prototype', assessment: '90%', interview: '88%', confidence: 'High', status: 'verified' },
    { name: 'React', claimed: 'Beginner', evidence: 'None', assessment: '-', interview: '-', confidence: 'Low', status: 'pending' },
  ];

  return (
    <DashboardLayout type="college">
      <div className="space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Skill Passport</h1>
            <p className="text-text-muted mt-2">Your evidence-backed skills and readiness verification.</p>
          </div>
          <button className="px-4 py-2 bg-accent text-background font-medium rounded-lg hover:opacity-90 transition-opacity">
            Add New Skill
          </button>
        </header>

        <div className="grid gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="p-6 bg-surface border border-border rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl">{skill.name}</h3>
                  {skill.status === 'verified' ? (
                    <span className="flex items-center text-xs font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-medium bg-surface-secondary text-text-muted px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" /> Pending Evidence
                    </span>
                  )}
                </div>
                <div className="text-sm text-text-muted">
                  Claimed Level: <span className="text-text font-medium">{skill.claimed}</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-text-muted mb-1 text-xs uppercase tracking-wider">Evidence</div>
                  <div className="font-medium">{skill.evidence}</div>
                </div>
                <div>
                  <div className="text-text-muted mb-1 text-xs uppercase tracking-wider">Assessment</div>
                  <div className="font-medium">{skill.assessment}</div>
                </div>
                <div>
                  <div className="text-text-muted mb-1 text-xs uppercase tracking-wider">Interview</div>
                  <div className="font-medium">{skill.interview}</div>
                </div>
                <div>
                  <div className="text-text-muted mb-1 text-xs uppercase tracking-wider">Confidence</div>
                  <div className={`font-medium ${skill.confidence === 'High' ? 'text-accent-foreground' : skill.confidence === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500'}`}>
                    {skill.confidence}
                  </div>
                </div>
              </div>
              
              <div className="shrink-0">
                 <button className="text-sm text-accent font-medium hover:underline">
                   View Details
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}