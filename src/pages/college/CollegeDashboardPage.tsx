import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { calculateCollegeReadiness, analyzeSkillGaps } from '../../services/intelligence/recommendations';
import { CollegeProfile } from '../../types';
import { JOB_ROLES } from '../../data/jobs';
import { getInterviewSessions } from '../../services/storage/localStorage';
import {
  ShieldCheck,
  Target,
  Mic,
  ArrowRight,
  Sparkles,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Code2,
  Briefcase,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const CollegeDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const collegeProfile = profile as CollegeProfile | null;

  const readiness = calculateCollegeReadiness(collegeProfile);
  const targetRole = JOB_ROLES.find(r => r.id === (collegeProfile?.targetRole || 'embedded-systems-engineer')) || (JOB_ROLES && JOB_ROLES.length > 0 ? JOB_ROLES[0] : undefined);
  const skillGaps = analyzeSkillGaps(collegeProfile, targetRole.id);
  const interviewSessions = user ? getInterviewSessions(user.id) : [];
  const latestInterview = interviewSessions && interviewSessions.length > 0 ? interviewSessions[0] : undefined;

  return (
    <DashboardLayout activeRole="college">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Skill Passport & Engineering Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Welcome back, {user?.name || 'Engineer'}
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Target Role: <strong className="text-[#101413] dark:text-[#F4F7F2]">{targetRole.title}</strong> • {collegeProfile?.university || 'Engineering College'} (CGPA: {collegeProfile?.cgpa || '8.2'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/college/interview"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors shadow-xs"
            >
              <Mic className="w-4 h-4" />
              Launch AI Interview Arena
            </Link>
          </div>
        </div>

        {/* Readiness & Skill Passport Metrics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
              Verification & Industry Readiness Diagnostic
            </h2>
            <Link
              to="/dashboard/college/passport"
              className="text-xs font-semibold text-[#101413] dark:text-[#C7F36B] hover:underline flex items-center gap-1"
            >
              Manage Skill Passport
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Target Role Readiness</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                {readiness.targetRoleReadiness}%
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Based on verified skills vs {targetRole.title} specs
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Average Verification Confidence</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                {readiness.averageVerificationConfidence}%
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Claimed Level ≠ Verified Skill
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Skill Passport Count</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                {readiness.verifiedSkillsCount} / {readiness.totalSkillsCount}
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Skills with attached evidence or assessment
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Critical Skill Gaps</div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600 dark:text-red-400 mt-1">
                {skillGaps.criticalGaps.length}
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Required skills currently missing from passport
              </p>
            </div>
          </div>
        </div>

        {/* Critical Skill Gaps Banner */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C7F36B]" />
                Skill Gap Analysis for {targetRole.title}
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-0.5">
                Benchmark against real industry hiring criteria: {targetRole.companyExpectations ? (Array.isArray(targetRole.companyExpectations) ? targetRole.companyExpectations.join(', ') : targetRole.companyExpectations) : 'Technical portfolio, verified problem-solving, and domain project defenses.'}
              </p>
            </div>
            <Link
              to="/dashboard/college/gap-analysis"
              className="text-xs font-bold text-[#101413] dark:text-[#C7F36B] hover:underline"
            >
              Full Gap Breakdown & Tasks →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strong Verified Skills ({skillGaps.strongSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skillGaps.strongSkills.length > 0 ? (
                  skillGaps.strongSkills.map(s => (
                    <span key={s.skill} className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                      {s.skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#68716D]">No strong skills verified yet.</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Needs Evidence ({skillGaps.improvementAreas.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skillGaps.improvementAreas.length > 0 ? (
                  skillGaps.improvementAreas.map(s => (
                    <span key={s.skill} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                      {s.skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#68716D]">All declared skills verified.</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Critical Deficits ({skillGaps.criticalGaps.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skillGaps.criticalGaps.length > 0 ? (
                  skillGaps.criticalGaps.map(s => (
                    <span key={s.skill} className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-700 dark:text-red-300 font-medium">
                      {s.skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#68716D]">No critical gaps for this role!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interview Arena Quick Access & Latest Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[#C7F36B]" />
                  <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                    AI Interview Arena
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Voice & Text
                </span>
              </div>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
                Simulate high-pressure technical interviews with real speech recognition and live feedback on cadence (WPM), filler word count, answer structure (STAR), and technical accuracy.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="p-2.5 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                  <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">Total Sessions</span>
                  <span className="block text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">{interviewSessions.length}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                  <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">Latest Score</span>
                  <span className="block text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                    {latestInterview ? `${latestInterview.overallScore}%` : 'Not yet'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D]">
              <Link
                to="/dashboard/college/interview"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors shadow-xs"
              >
                Start Live Interview Session
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C7F36B]" />
                  <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                    NEXSTEP Skill Passport
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#68716D] dark:text-[#9AA49F]">
                  Untamperable Proof
                </span>
              </div>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
                Connect your GitHub repositories, hardware lab recordings, and project demos to transform unverified claims into empirically proven confidence scores.
              </p>

              <div className="mt-4 space-y-2">
                {(collegeProfile?.skills || []).slice(0, 3).map(skill => (
                  <div key={skill.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110]">
                    <span className="font-semibold text-[#101413] dark:text-[#F4F7F2]">{skill.name}</span>
                    <span className="font-mono text-[#68716D] dark:text-[#9AA49F]">
                      {skill.verifiedConfidence}% Confidence ({skill.verificationStatus})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D]">
              <Link
                to="/dashboard/college/passport"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold border border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] transition-colors"
              >
                View Full Skill Passport
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
