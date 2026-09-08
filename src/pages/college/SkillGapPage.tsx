import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JOB_ROLES } from '../../data/jobs';
import { analyzeSkillGaps } from '../../services/intelligence/recommendations';
import { CollegeProfile } from '../../types';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  Code2,
  HelpCircle,
  Layers,
  Sparkles,
  Mic,
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { profile } = useAuth();
  const collegeProfile = profile as CollegeProfile | null;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    roleParam || collegeProfile?.targetRole || 'embedded-systems-engineer'
  );

  const currentRole = JOB_ROLES.find(r => r.id === selectedRoleId) || (JOB_ROLES && JOB_ROLES.length > 0 ? JOB_ROLES[0] : undefined);
  const gapAnalysis = analyzeSkillGaps(collegeProfile, currentRole.id);

  return (
    <DashboardLayout activeRole="college">
      <div className="space-y-8">
        {/* Header with Role Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Target Role Skill Gap Analysis
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Deterministic gap breakdown and prescribed learning tasks for your target engineering title.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
            >
              {JOB_ROLES.map(role => (
                <option key={role.id} value={role.id}>{role.title}</option>
              ))}
            </select>

            <button
              onClick={() => navigate(`/dashboard/college/interview?role=${currentRole.id}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] shadow-xs cursor-pointer shrink-0"
            >
              <Mic className="w-3.5 h-3.5" />
              Practice {currentRole.title} Interview
            </button>
          </div>
        </div>

        {/* Readiness Overview Banner */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                Industry Alignment
              </div>
              <h2 className="text-2xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                {currentRole.title}
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1">
                {currentRole.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-right shrink-0">
              <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F] block">Role Readiness Match</span>
              <span className="text-3xl font-mono font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                {gapAnalysis.matchPercentage ?? gapAnalysis.overallMatchPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Columns: Strong Skills / Needs Evidence / Critical Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Strong Skills */}
          <div className="p-6 rounded-2xl border border-emerald-500/20 bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified & Strong ({gapAnalysis.strongSkills.length})</span>
            </div>

            {gapAnalysis.strongSkills.length > 0 ? (
              <div className="space-y-2">
                {gapAnalysis.strongSkills.map(skill => (
                  <div key={skill.skill} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs font-medium text-[#101413] dark:text-[#F4F7F2] flex items-center justify-between">
                    <span>{skill.skill}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Ready</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#DDE2DC] dark:border-[#29312D] text-center text-xs text-[#68716D]">
                No verified skills meet the threshold for this role yet.
              </div>
            )}
          </div>

          {/* Column 2: Improvement Areas */}
          <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
              <Zap className="w-4 h-4" />
              <span>Needs Evidence / Depth ({gapAnalysis.improvementAreas.length})</span>
            </div>

            {gapAnalysis.improvementAreas.length > 0 ? (
              <div className="space-y-2">
                {gapAnalysis.improvementAreas.map(skill => (
                  <div key={skill.skill} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs font-medium text-[#101413] dark:text-[#F4F7F2] flex items-center justify-between">
                    <span>{skill.skill}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Needs Proof</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#DDE2DC] dark:border-[#29312D] text-center text-xs text-[#68716D]">
                All declared skills have documented proof.
              </div>
            )}
          </div>

          {/* Column 3: Critical Gaps */}
          <div className="p-6 rounded-2xl border border-red-500/20 bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
              <AlertCircle className="w-4 h-4" />
              <span>Critical Deficits ({gapAnalysis.criticalGaps.length})</span>
            </div>

            {gapAnalysis.criticalGaps.length > 0 ? (
              <div className="space-y-2">
                {gapAnalysis.criticalGaps.map(skill => (
                  <div key={skill.skill} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs font-medium text-[#101413] dark:text-[#F4F7F2] flex items-center justify-between">
                    <span>{skill.skill}</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">Missing</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#DDE2DC] dark:border-[#29312D] text-center text-xs text-[#68716D]">
                Zero critical gaps! You cover all required topics.
              </div>
            )}
          </div>
        </div>

        {/* Prescribed Action Plan for Each Gap */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6">
          <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-4">
            <h2 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
              Action Plan: How to Close Gaps for {currentRole.title}
            </h2>
            <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1">
              Curated tasks, learning focus, and technical defense questions for every missing competency.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ...gapAnalysis.criticalGaps.map(g => ({
                skillName: g.skill,
                importance: 'Critical Gap',
                learningAction: g.recommendedLearning,
                practicalTask: g.practiceTask,
              })),
              ...gapAnalysis.improvementAreas.map(g => ({
                skillName: g.skill,
                importance: 'Needs Verification',
                learningAction: g.recommendedLearning,
                practicalTask: g.practiceTask,
              })),
            ].map((rec, idx) => (
              <div
                key={`${rec.importance}-${rec.skillName}-${idx}`}
                className="p-5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F]">
                      {rec.importance}
                    </span>
                    <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                      {rec.skillName}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-[#68716D] dark:text-[#9AA49F] block mb-1">
                      Target Concepts to Learn:
                    </span>
                    <p className="text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                      {rec.learningAction}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-[#68716D] dark:text-[#9AA49F] block mb-1">
                      Practical Implementation Task:
                    </span>
                    <p className="text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                      {rec.practicalTask}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
