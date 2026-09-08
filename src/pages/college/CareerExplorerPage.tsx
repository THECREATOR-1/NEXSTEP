import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { JOB_ROLES } from '../../data/jobs';
import { analyzeSkillGaps } from '../../services/intelligence/recommendations';
import { CollegeProfile } from '../../types';
import { saveUserProfile } from '../../services/storage/localStorage';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Target,
} from 'lucide-react';

export const CareerExplorerPage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const collegeProfile = profile as CollegeProfile | null;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Embedded & Hardware', 'Software Engineering', 'AI & Data Science', 'Robotics & Automation'];

  const rolesWithAnalysis = JOB_ROLES.map((role) => {
    const gap = analyzeSkillGaps(collegeProfile, role.id);
    const isCurrentTarget = collegeProfile?.targetRole === role.id;
    return { role, gap, isCurrentTarget };
  }).sort((a, b) => {
    const scoreB = b.gap?.matchPercentage ?? b.gap?.overallMatchPercentage ?? 0;
    const scoreA = a.gap?.matchPercentage ?? a.gap?.overallMatchPercentage ?? 0;
    return scoreB - scoreA;
  });

  const handleSetTargetRole = (roleId: string) => {
    if (!collegeProfile) return;
    const updated: CollegeProfile = {
      ...collegeProfile,
      targetRole: roleId,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfile(updated);
    refreshProfile();
  };

  const filtered = rolesWithAnalysis.filter(({ role }) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || role.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <DashboardLayout activeRole="college">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            Engineering Career Explorer
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Real-time benchmarking of your verified skills against industry engineering role criteria.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68716D] dark:text-[#9AA49F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search engineering roles, technologies (e.g. Firmware, React, FreeRTOS, PyTorch)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413]'
                    : 'border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#68716D] dark:text-[#9AA49F]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(({ role, gap, isCurrentTarget }) => (
            <div
              key={role.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrentTarget
                  ? 'border-[#101413] dark:border-[#C7F36B] bg-[#FFFFFF] dark:bg-[#151A18] shadow-xs ring-1 ring-[#C7F36B]/40'
                  : 'border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-semibold">
                      {role.category}
                    </span>
                    {isCurrentTarget && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Current Target
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-[#C7F36B] text-[#101413]">
                    {gap?.matchPercentage ?? gap?.overallMatchPercentage ?? 0}% Match
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#101413] dark:text-[#F4F7F2]">
                  {role.title}
                </h3>
                <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  {role.description}
                </p>

                {/* Salary & Hiring Standards */}
                <div className="mt-4 p-3 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-xs">
                  <div className="text-[#68716D] dark:text-[#9AA49F]">
                    Indicative Compensation: <strong className="text-[#101413] dark:text-[#F4F7F2]">{role.salaryRange || '₹6 - ₹18 LPA'}</strong>
                  </div>
                  <div className="text-[#68716D] dark:text-[#9AA49F] mt-1 line-clamp-1">
                    Hiring: {role.companyExpectations ? (Array.isArray(role.companyExpectations) ? role.companyExpectations.join(', ') : role.companyExpectations) : 'Technical portfolio, verified problem-solving, and domain project defenses.'}
                  </div>
                </div>

                {/* Skills Analysis Pill Group */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#68716D] dark:text-[#9AA49F]">Required Skills:</span>
                    <span className="font-mono text-[#101413] dark:text-[#F4F7F2]">
                      {gap?.strongSkills?.length || 0} of {role.requiredSkills.length} Verified
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {role.requiredSkills.map(skill => {
                      const isStrong = gap?.strongSkills?.some(s => s.skill.toLowerCase() === skill.toLowerCase());
                      const isCrit = gap?.criticalGaps?.some(s => s.skill.toLowerCase() === skill.toLowerCase());
                      return (
                        <span
                          key={skill}
                          className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                            isStrong
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                              : isCrit
                              ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isStrong ? '✓ ' : isCrit ? '✕ ' : '~ '}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between gap-3">
                {!isCurrentTarget ? (
                  <button
                    onClick={() => handleSetTargetRole(role.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] cursor-pointer"
                  >
                    Set as Target Role
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active Goal
                  </span>
                )}

                <button
                  onClick={() => navigate(`/dashboard/college/gap-analysis?role=${role.id}`)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors cursor-pointer shadow-xs"
                >
                  Analyze Gaps & Tasks
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
