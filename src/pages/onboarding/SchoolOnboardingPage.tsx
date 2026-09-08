import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SchoolProfile, SubjectMark } from '../../types';
import { saveUserProfile, getCurrentUser } from '../../services/storage/localStorage';
import { TrueFocus } from '../../components/brand/TrueFocus';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Heart,
  Settings2,
  Target,
} from 'lucide-react';

const INTERESTS_LIST = [
  'Technology', 'Electronics', 'Coding', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'Business', 'Finance', 'Design', 'Arts', 'Psychology',
  'Communication', 'Research', 'Robotics', 'Problem Solving', 'Building Things',
  'Writing', 'Entrepreneurship',
];

const ACTIVITIES_LIST = [
  'Solving problems', 'Building things', 'Designing', 'Working with people',
  'Numbers', 'Technology', 'Research', 'Helping people', 'Explaining',
];

const PRIORITIES_LIST = [
  'Placement', 'Fees', 'Campus', 'Academics', 'Research', 'Internships',
  'Industry exposure', 'Hostel', 'Sports', 'Clubs', 'International opportunities',
];

export const SchoolOnboardingPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Academics
  const [currentClass, setCurrentClass] = useState<'10' | '12' | 'Other'>('12');
  const [board, setBoard] = useState('CBSE');
  const [stream, setStream] = useState<'Science (PCM)' | 'Science (PCB)' | 'Science (PCMB)' | 'Commerce' | 'Arts/Humanities' | 'Vocational'>('Science (PCM)');
  const [overallPercentage, setOverallPercentage] = useState(85);
  const [completionYear, setCompletionYear] = useState(2025);
  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([
    { subject: 'Mathematics', marks: 88, maxMarks: 100 },
    { subject: 'Physics', marks: 84, maxMarks: 100 },
    { subject: 'Chemistry', marks: 80, maxMarks: 100 },
    { subject: 'Computer Science', marks: 92, maxMarks: 100 },
    { subject: 'English', marks: 85, maxMarks: 100 },
  ]);
  const [strongestSubjects, setStrongestSubjects] = useState<string[]>(['Mathematics', 'Computer Science']);
  const [weakestSubjects, setWeakestSubjects] = useState<string[]>(['Chemistry']);

  // Step 2: Interests & Activities
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Technology', 'Electronics', 'Robotics', 'Problem Solving']);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['Solving problems', 'Building things', 'Technology']);

  // Step 3: Preferences
  const [preferredLocations, setPreferredLocations] = useState<string[]>(['Maharashtra', 'Karnataka', 'Delhi']);
  const [budgetRange, setBudgetRange] = useState('₹1 - 3 Lakhs / year');
  const [hostelRequired, setHostelRequired] = useState(true);
  const [collegeType, setCollegeType] = useState<'Government' | 'Private' | 'Any'>('Government');
  const [priorities, setPriorities] = useState<string[]>(['Academics', 'Placement', 'Research', 'Internships']);

  // Step 4: Career Goals
  const [careerGoalType, setCareerGoalType] = useState<'Known' | 'Multiple' | 'Exploring' | 'Custom'>('Known');
  const [targetCareers, setTargetCareers] = useState<string[]>(['Electronics Engineer', 'Embedded Systems Engineer']);
  const [customCareerInput, setCustomCareerInput] = useState('');

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleActivity = (item: string) => {
    setSelectedActivities(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const togglePriority = (item: string) => {
    setPriorities(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleComplete = () => {
    const current = user || getCurrentUser();
    if (!current) {
      navigate('/auth/login');
      return;
    }

    const profile: SchoolProfile = {
      userId: current.id,
      accountType: 'school',
      currentClass,
      board,
      stream: currentClass === '12' ? stream : undefined,
      subjectMarks,
      overallPercentage: Number(overallPercentage) || 80,
      strongestSubjects,
      weakestSubjects,
      completionYear: Number(completionYear) || 2025,
      interests: selectedInterests,
      activities: selectedActivities,
      preferredLocations,
      budgetRange,
      hostelRequired,
      collegeType,
      priorities,
      careerGoalType,
      targetCareers: customCareerInput.trim() ? [...targetCareers, customCareerInput.trim()] : targetCareers,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    saveUserProfile(profile);
    refreshProfile();
    navigate('/dashboard/school');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-2xl" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-3">
            School Student Profile Diagnostics
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Step {step} of 4: {step === 1 ? 'Academics' : step === 2 ? 'Interests & Activities' : step === 3 ? 'College Preferences' : 'Target Career Direction'}
          </p>

          {/* Stepper indicator */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-10 bg-[#101413] dark:bg-[#C7F36B]' : s < step ? 'w-6 bg-[#C7F36B]' : 'w-6 bg-[#DDE2DC] dark:bg-[#29312D]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-[#FFFFFF] dark:bg-[#151A18] rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] p-6 sm:p-8 shadow-xs">
          {/* STEP 1: Academics */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <BookOpen className="w-4 h-4 text-[#C7F36B]" />
                <span>Academic Record</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Current Class
                  </label>
                  <select
                    value={currentClass}
                    onChange={(e) => setCurrentClass(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="10">Class 10</option>
                    <option value="12">Class 12</option>
                    <option value="Other">Other / Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Education Board
                  </label>
                  <input
                    type="text"
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    placeholder="CBSE / ICSE / State"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Completion Year
                  </label>
                  <input
                    type="number"
                    value={completionYear}
                    onChange={(e) => setCompletionYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>
              </div>

              {currentClass === '12' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Class 12 Stream
                  </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Science (PCM)">Science (PCM - Physics, Chemistry, Math)</option>
                    <option value="Science (PCB)">Science (PCB - Physics, Chemistry, Biology)</option>
                    <option value="Science (PCMB)">Science (PCMB - All Sciences)</option>
                    <option value="Commerce">Commerce with/without Math</option>
                    <option value="Arts/Humanities">Arts / Humanities</option>
                    <option value="Vocational">Vocational / Applied</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Overall Academic Percentage (% or Expected)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="40"
                    max="99"
                    value={overallPercentage}
                    onChange={(e) => setOverallPercentage(Number(e.target.value))}
                    className="flex-1 accent-[#101413] dark:accent-[#C7F36B]"
                  />
                  <span className="w-14 text-right font-mono font-bold text-base text-[#101413] dark:text-[#C7F36B]">
                    {overallPercentage}%
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-2">
                  Strongest Subjects (Select up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'English', 'Social Studies'].map(subj => {
                    const isSelected = strongestSubjects.includes(subj);
                    return (
                      <button
                        type="button"
                        key={subj}
                        onClick={() => {
                          setStrongestSubjects(prev =>
                            isSelected ? prev.filter(s => s !== subj) : prev.length < 3 ? [...prev, subj] : prev
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                            : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Interests & Activities */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <Heart className="w-4 h-4 text-[#C7F36B]" />
                <span>Interests & Working Styles</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-2">
                  Domains You Genuinely Enjoy
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_LIST.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                            : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3">
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-2">
                  Activities That Energize You
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITIES_LIST.map(act => {
                    const isSelected = selectedActivities.includes(act);
                    return (
                      <button
                        type="button"
                        key={act}
                        onClick={() => toggleActivity(act)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                            : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <Settings2 className="w-4 h-4 text-[#C7F36B]" />
                <span>College & Location Preferences</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    College Type
                  </label>
                  <select
                    value={collegeType}
                    onChange={(e) => setCollegeType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Government">Government / Public (IITs, NITs, DTU)</option>
                    <option value="Private">Private / Autonomous (BITS, VIT)</option>
                    <option value="Any">Any / Open to Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Annual Tuition Budget
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Under 2 Lakhs">Under ₹2 Lakhs / year</option>
                    <option value="₹1 - 3 Lakhs / year">₹1 - 3 Lakhs / year</option>
                    <option value="₹3 - 6 Lakhs / year">₹3 - 6 Lakhs / year</option>
                    <option value="Flexible / Scholarship Seeking">Flexible / Seeking Scholarships</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="hostelReq"
                  checked={hostelRequired}
                  onChange={(e) => setHostelRequired(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#101413] dark:accent-[#C7F36B]"
                />
                <label htmlFor="hostelReq" className="text-sm font-medium text-[#101413] dark:text-[#F4F7F2]">
                  Hostel / On-campus residential accommodation is required
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-2">
                  Institutional Priorities (Select top factors)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES_LIST.map(p => {
                    const isSelected = priorities.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => togglePriority(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                            : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Career Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <Target className="w-4 h-4 text-[#C7F36B]" />
                <span>Target Career Alignment</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  How clear is your target career right now?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'Known', label: 'I know exactly' },
                    { id: 'Multiple', label: 'Between 2-3 choices' },
                    { id: 'Exploring', label: 'Exploring options' },
                    { id: 'Custom', label: 'Custom path' },
                  ].map(item => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCareerGoalType(item.id as any)}
                      className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                        careerGoalType === item.id
                          ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                          : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-2">
                  Candidate Target Careers of Interest
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Electronics Engineer',
                    'Embedded Systems Engineer',
                    'Robotics Engineer',
                    'Computer Software Engineer',
                    'Data Scientist & AI Specialist',
                    'Biomedical Engineer',
                    'Aerospace & Aviation Engineer',
                    'Product & Industrial Designer',
                  ].map(careerName => {
                    const isSelected = targetCareers.includes(careerName);
                    return (
                      <button
                        type="button"
                        key={careerName}
                        onClick={() => {
                          setTargetCareers(prev =>
                            isSelected ? prev.filter(c => c !== careerName) : [...prev, careerName]
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                            : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]'
                        }`}
                      >
                        {careerName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Or specify a custom dream career:
                </label>
                <input
                  type="text"
                  value={customCareerInput}
                  onChange={(e) => setCustomCareerInput(e.target.value)}
                  placeholder="e.g. Quantum Computing Researcher"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] hover:opacity-90 cursor-pointer shadow-xs"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] cursor-pointer shadow-xs"
              >
                Complete Onboarding & View Fit
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
