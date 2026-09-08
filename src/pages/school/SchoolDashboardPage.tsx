import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { calculateSchoolCareerFit } from '../../services/intelligence/recommendations';
import { SchoolProfile } from '../../types';
import { getProgressStats } from '../../services/storage/localStorage';
import {
  Compass,
  Building2,
  MapPin,
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Info,
  ChevronRight,
} from 'lucide-react';

export const SchoolDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;
  const careerFits = calculateSchoolCareerFit(schoolProfile);
  const progressStats = user ? getProgressStats(user.id) : null;

  const topMatches = careerFits.slice(0, 3);
  const bestFit = careerFits && careerFits.length > 0 ? careerFits[0] : undefined;

  return (
    <DashboardLayout activeRole="school">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>School Track Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Hello, {user?.name || 'Student'}
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Class {schoolProfile?.currentClass || '12'} • {schoolProfile?.board || 'CBSE'} • Overall {schoolProfile?.overallPercentage || '85'}%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/school/assessments"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors shadow-xs"
            >
              <ClipboardCheck className="w-4 h-4" />
              Take Aptitude Diagnostic
            </Link>
          </div>
        </div>

        {/* Top Metric Cards: 4-Dimensional Fit */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
              Your Primary Career Fit Diagnostic: {bestFit?.career.name}
            </h2>
            <Link
              to="/dashboard/school/careers"
              className="text-xs font-semibold text-[#101413] dark:text-[#C7F36B] hover:underline flex items-center gap-1"
            >
              Explore all careers
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Academic Fit</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-1">
                {bestFit?.academicFit}%
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Subject match with {bestFit?.career.importantSubjects?.slice(0, 2)?.join(' & ')}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Interest Fit</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-1">
                {bestFit?.interestFit}%
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Alignment with hands-on building & problem solving
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Aptitude Alignment</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-1">
                {bestFit?.aptitudeFit}%
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Spatial, quantitative, and logical benchmarks
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Target Alignment</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-1">
                {bestFit?.careerAlignment}%
              </div>
              <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-snug">
                Matches your declared preferences & aspirations
              </p>
            </div>
          </div>
        </div>

        {/* Career Matches Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                Personalized Career Recommendations
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                Calculated deterministically from your subject marks, declared affinities, and cognitive profile.
              </p>
            </div>
            <Link
              to="/dashboard/school/careers"
              className="text-xs font-bold text-[#101413] dark:text-[#C7F36B] hover:underline"
            >
              View Full Catalog ({careerFits.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {topMatches.map((res) => (
              <div
                key={res.career.id}
                className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-semibold">
                      {res.career.category}
                    </span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#C7F36B] text-[#101413]">
                      {res.overallFit}% Fit
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                    {res.career.name}
                  </h3>
                  <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-2 line-clamp-2 leading-relaxed">
                    {res.career.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#DDE2DC] dark:border-[#29312D] space-y-2">
                    <div className="text-xs text-[#101413] dark:text-[#F4F7F2] font-semibold">
                      Why it matches you:
                    </div>
                    {res.matchReasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#68716D] dark:text-[#9AA49F]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B] shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between">
                  <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                    {res.career.importantSubjects?.join(', ')}
                  </span>
                  <Link
                    to={`/dashboard/school/careers`}
                    className="text-xs font-bold text-[#101413] dark:text-[#C7F36B] hover:underline"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/dashboard/school/colleges"
            className="group p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] hover:border-[#101413] dark:hover:border-[#C7F36B] transition-all"
          >
            <Building2 className="w-8 h-8 text-[#C7F36B] mb-3 group-hover:scale-105 transition-transform" />
            <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
              College Intelligence
            </h3>
            <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-relaxed">
              Explore premier engineering and design institutions with multi-dimensional compatibility fit and reference facts.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#101413] dark:text-[#C7F36B]">
              <span>Explore Colleges</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/school/roadmap"
            className="group p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] hover:border-[#101413] dark:hover:border-[#C7F36B] transition-all"
          >
            <MapPin className="w-8 h-8 text-[#C7F36B] mb-3 group-hover:scale-105 transition-transform" />
            <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
              7-Stage Career Roadmap
            </h3>
            <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-relaxed">
              From Current Class through College, Skill Building, Projects, and Career Launch. Track your live progress.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#101413] dark:text-[#C7F36B]">
              <span>View My Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/dashboard/school/assessments"
            className="group p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] hover:border-[#101413] dark:hover:border-[#C7F36B] transition-all"
          >
            <ClipboardCheck className="w-8 h-8 text-[#C7F36B] mb-3 group-hover:scale-105 transition-transform" />
            <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
              Aptitude & Diagnostics
            </h3>
            <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-relaxed">
              Take verified assessments in Quantitative Aptitude, Technical Fundamentals, and Communication to update your fit scores.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#101413] dark:text-[#C7F36B]">
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};
