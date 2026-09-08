import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { Compass, GraduationCap, ArrowRight } from 'lucide-react';

export const AccountTypePage: React.FC = () => {
  const { user, setAccountType, setRole } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (selectedType: 'school' | 'college') => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Save accountType to current user and localStorage profile first
      const saveFn = setAccountType || setRole;
      const success = saveFn(selectedType);

      if (success) {
        if (selectedType === 'school') {
          navigate('/onboarding/school');
        } else {
          navigate('/onboarding/college');
        }
      } else {
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Failed to update accountType in localStorage', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-xl mx-auto w-full text-center space-y-4">
        <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-3xl" />
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101413] dark:text-[#F4F7F2]">
          Welcome, {user?.name || 'Student'}! Choose your track.
        </h1>
        <p className="text-sm text-[#68716D] dark:text-[#9AA49F] max-w-md mx-auto">
          NEXSTEP customizes your intelligence engine, roadmap, and diagnostics based on your current education level.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
          {/* School Track Option */}
          <button
            id="school-student-btn"
            type="button"
            disabled={submitting}
            onClick={() => handleSelect('school')}
            className="group p-6 rounded-2xl border-2 border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] hover:border-[#101413] dark:hover:border-[#C7F36B] transition-all cursor-pointer flex flex-col justify-between text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#C7F36B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                Class 10, 12 & High School
              </div>
              <h2 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2] mt-1">
                School Student
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                Academic compatibility, interest diagnosis, college intelligence, and 7-stage roadmap to launch your career.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#101413] dark:text-[#C7F36B]">
              <span>Choose School Student</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* College Track Option */}
          <button
            id="college-student-btn"
            type="button"
            disabled={submitting}
            onClick={() => handleSelect('college')}
            className="group p-6 rounded-2xl border-2 border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] hover:border-[#101413] dark:hover:border-[#C7F36B] transition-all cursor-pointer flex flex-col justify-between text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#C7F36B] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                Undergraduate / Degree / Masters
              </div>
              <h2 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2] mt-1">
                College Student
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                Skill Passport, verified evidence, critical skill gap analysis, AI interview arena, and communication coaching.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#101413] dark:text-[#C7F36B]">
              <span>Choose College Student</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
