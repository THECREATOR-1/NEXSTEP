import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { SchoolProfile, CollegeProfile } from '../../types';
import { saveUserProfile } from '../../services/storage/localStorage';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, activeRole, refreshProfile } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;
  const collegeProfile = profile as CollegeProfile | null;

  const [savedNotice, setSavedNotice] = useState(false);

  // Editable fields for school
  const [grade, setGrade] = useState(schoolProfile?.grade || '12th');
  const [stream, setStream] = useState(schoolProfile?.stream || 'PCM');

  // Editable fields for college
  const [university, setUniversity] = useState(collegeProfile?.university || '');
  const [degree, setDegree] = useState(collegeProfile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(collegeProfile?.branch || 'Computer Science');
  const [semester, setSemester] = useState(collegeProfile?.semester || 6);
  const [cgpa, setCgpa] = useState(collegeProfile?.cgpa || 8.4);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (activeRole === 'school' && schoolProfile) {
      const updated: SchoolProfile = {
        ...schoolProfile,
        grade: grade as any,
        stream: stream as any,
        updatedAt: new Date().toISOString(),
      };
      saveUserProfile(updated);
    } else if (activeRole === 'college' && collegeProfile) {
      const updated: CollegeProfile = {
        ...collegeProfile,
        university,
        degree,
        branch,
        semester: Number(semester),
        cgpa: Number(cgpa),
        updatedAt: new Date().toISOString(),
      };
      saveUserProfile(updated);
    }

    refreshProfile();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <DashboardLayout activeRole={activeRole}>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            Academic & Verification Profile
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Configure your institutional background, target goals, and verified student credentials.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#C7F36B] flex items-center justify-center font-bold text-2xl">
              {user?.name.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                {user?.name || 'Student Profile'}
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                {user?.email || 'student@nexstep.edu'} • Track: <strong className="uppercase">{activeRole}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D]">
            {activeRole === 'school' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Class / Grade Level
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="9th">9th Standard</option>
                    <option value="10th">10th Standard</option>
                    <option value="11th">11th Standard</option>
                    <option value="12th">12th Standard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Academic Stream
                  </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="PCM">Science (PCM)</option>
                    <option value="PCB">Science (PCB)</option>
                    <option value="PCMB">Science (PCMB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Humanities / Arts</option>
                    <option value="Undecided">Undecided / Exploring</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                      University / Institution Name
                    </label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                      Degree Program
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="B.Tech, B.E., B.Sc, BCA..."
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                      Branch / Department
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="ECE, EEE, CSE, Mechanical..."
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                      Current Semester
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                      Cumulative GPA / CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={10}
                      value={cgpa}
                      onChange={(e) => setCgpa(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#DDE2DC] dark:border-[#29312D]">
              {savedNotice && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Profile updated successfully!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  Update Profile Details
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
