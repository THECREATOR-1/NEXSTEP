import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { COLLEGES_DATA } from '../../data/colleges';
import { calculateCollegeFit } from '../../services/intelligence/recommendations';
import { SchoolProfile } from '../../types';
import {
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Info,
  Calendar,
  GraduationCap,
  Sparkles,
  DollarSign,
  Home,
  FlaskConical,
  Briefcase,
  Users,
  Compass,
} from 'lucide-react';

export const CollegeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;

  const college = COLLEGES_DATA.find((c) => c.id === id);

  if (!college) {
    return (
      <DashboardLayout activeRole="school">
        <div className="p-12 text-center bg-[#FFFFFF] dark:bg-[#151A18] rounded-2xl border border-[#DDE2DC] dark:border-[#29312D]">
          <h2 className="text-xl font-bold text-[#101413] dark:text-[#F4F7F2]">College Record Not Found</h2>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2">
            The requested institutional profile does not exist in the database.
          </p>
          <Link
            to="/dashboard/school/colleges"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-[#101413] dark:text-[#C7F36B]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to College Directory
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const fit = calculateCollegeFit(college, schoolProfile);

  return (
    <DashboardLayout activeRole="school">
      <div className="space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/dashboard/school/colleges"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to College Directory
          </Link>
        </div>

        {/* Header Banner */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-semibold">
                  {college.type} Institution
                </span>
                <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                  Est. {college.established}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                {college.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#68716D] dark:text-[#9AA49F] mt-2">
                <MapPin className="w-4 h-4 text-[#C7F36B]" />
                <span>{college.city}, {college.state}</span>
              </div>
            </div>

            {/* Overall Fit Badge */}
            <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-right shrink-0">
              <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Personalized Fit Score</div>
              <div className="text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                {fit.overallFit}%
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                Diagnostic Verified Match
              </span>
            </div>
          </div>

          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-6 leading-relaxed border-t border-[#DDE2DC] dark:border-[#29312D] pt-4">
            {college.overview}
          </p>
        </div>

        {/* 7-Dimensional Compatibility Breakdown */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2] mb-4">
            7-Dimensional Personalized Compatibility Analysis
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            {[
              { label: 'Academic', score: fit.academicCompatibility },
              { label: 'Course Match', score: fit.courseCompatibility },
              { label: 'Interest Match', score: fit.interestCompatibility },
              { label: 'Admission Fit', score: fit.admissionCompatibility },
              { label: 'Career Align', score: fit.careerAlignment },
              { label: 'Budget Fit', score: fit.budgetCompatibility },
              { label: 'Location Fit', score: fit.locationCompatibility },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">{item.label}</div>
                <div className="text-lg font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                  {item.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Matches & Things to Consider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#101413] dark:text-[#F4F7F2] mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C7F36B]" />
              Why this college matches you
            </h3>
            <ul className="space-y-2.5">
              {fit.matchReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B] shrink-0 mt-1.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#101413] dark:text-[#F4F7F2] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Things to Consider Carefully
            </h3>
            <ul className="space-y-2.5">
              {(college.thingsToConsider || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Institutional Specifications Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Academics & Courses */}
          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">
              <GraduationCap className="w-4 h-4 text-[#C7F36B]" />
              <span>Academics & Courses</span>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-1.5">Offered Programs</div>
              <div className="flex flex-wrap gap-1">
                {(college.coursesOffered || []).map(c => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-1.5">Departmental Strengths</div>
              <p className="text-xs text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                {college.strongDepartments?.join(', ')}
              </p>
            </div>
          </div>

          {/* Admission & Fees */}
          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">
              <DollarSign className="w-4 h-4 text-[#C7F36B]" />
              <span>Admission & Fees</span>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-0.5">Entrance Exams</div>
              <div className="text-xs font-bold text-[#101413] dark:text-[#F4F7F2]">
                {college.entranceExams?.join(', ')}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-0.5">Cutoff Guidance</div>
              <p className="text-xs text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                {college.cutoffTrends}
              </p>
            </div>

            <div className="pt-2 border-t border-[#DDE2DC] dark:border-[#29312D]">
              <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Tuition Fees: <strong>{college.annualFees}</strong></div>
              <div className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1">Hostel Fees: <strong>{college.hostelFees}</strong></div>
            </div>
          </div>

          {/* Research & Placement */}
          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">
              <Briefcase className="w-4 h-4 text-[#C7F36B]" />
              <span>Research & Career Output</span>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-0.5">Labs & Research</div>
              <p className="text-xs text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                {college.labsAndFacilities?.join(', ')}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-0.5">Placement Landscape</div>
              <p className="text-xs text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                {college.placementHighlights}
              </p>
            </div>
          </div>
        </div>

        {/* What to do before joining */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#101413] dark:text-[#F4F7F2] mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C7F36B]" />
            What to do before joining this college
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(college.whatToDoBeforeJoining || []).map((action, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-xs font-medium text-[#101413] dark:text-[#F4F7F2] flex items-start gap-2">
                <span className="font-mono text-[#68716D] dark:text-[#9AA49F] shrink-0">0{idx + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reference Disclaimer */}
        <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-center text-xs text-[#68716D] dark:text-[#9AA49F]">
          Reference Institutional Material • Curated from public filings and university academic calendars.
        </div>
      </div>
    </DashboardLayout>
  );
};
