import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CollegeProfile, StudentSkill, SkillLevel, SkillEvidence } from '../../types';
import { saveUserProfile, getCurrentUser } from '../../services/storage/localStorage';
import { TrueFocus } from '../../components/brand/TrueFocus';
import { SKILLS_LIST } from '../../data/skills';
import { JOB_ROLES } from '../../data/jobs';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Code2,
  Layers,
  Target,
  Plus,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';

export const CollegeOnboardingPage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Academic
  const [university, setUniversity] = useState('National Institute of Technology');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Electronics and Communication');
  const [year, setYear] = useState(3);
  const [semester, setSemester] = useState(6);
  const [cgpa, setCgpa] = useState(8.4);
  const [graduationYear, setGraduationYear] = useState(2026);

  // Step 2: Skills & Initial Evidence
  const [selectedSkills, setSelectedSkills] = useState<StudentSkill[]>([
    {
      id: 'c',
      name: 'C',
      claimedLevel: 'Intermediate',
      evidence: [],
      verifiedConfidence: 30,
      verificationStatus: 'Unverified',
    },
    {
      id: 'embedded-c',
      name: 'Embedded C',
      claimedLevel: 'Intermediate',
      evidence: [
        {
          id: 'ev_1',
          type: 'Project',
          title: 'STM32 UART Telemetry Driver',
          url: 'https://github.com/example/stm32-telemetry',
          description: 'Bare-metal UART ring buffer driver with interrupt service routine handling.',
          dateAdded: new Date().toISOString(),
        },
      ],
      verifiedConfidence: 55,
      verificationStatus: 'Evidence Added',
    },
    {
      id: 'esp32',
      name: 'ESP32',
      claimedLevel: 'Beginner',
      evidence: [],
      verifiedConfidence: 25,
      verificationStatus: 'Unverified',
    },
    {
      id: 'git',
      name: 'Git',
      claimedLevel: 'Intermediate',
      evidence: [],
      verifiedConfidence: 30,
      verificationStatus: 'Unverified',
    },
  ]);

  // Skill addition modal / quick selector
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');

  // Step 3: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Embedded', 'Robotics', 'IoT', 'Hardware',
  ]);

  // Step 4: Career Goals
  const [targetRole, setTargetRole] = useState('embedded-systems-engineer');
  const [dreamJob, setDreamJob] = useState('Senior Embedded Firmware Engineer');
  const [targetCompanies, setTargetCompanies] = useState('Qualcomm, Texas Instruments, Bosch, STMicroelectronics');
  const [workPreference, setWorkPreference] = useState<'Remote' | 'Hybrid' | 'On-site' | 'Flexible'>('Hybrid');
  const [nextStep, setNextStep] = useState<'Job' | 'Higher studies' | 'Entrepreneurship' | 'Exploring'>('Job');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = selectedSkills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) return;

    setSelectedSkills(prev => [
      ...prev,
      {
        id: newSkillName.toLowerCase().replace(/\s+/g, '-'),
        name: newSkillName.trim(),
        claimedLevel: newSkillLevel,
        evidence: [],
        verifiedConfidence: newSkillLevel === 'Advanced' ? 30 : newSkillLevel === 'Intermediate' ? 25 : 20,
        verificationStatus: 'Unverified',
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(s => s.id !== skillId));
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const handleComplete = () => {
    const current = user || getCurrentUser();
    if (!current) {
      navigate('/auth/login');
      return;
    }

    const profile: CollegeProfile = {
      userId: current.id,
      accountType: 'college',
      university,
      degree,
      branch,
      year: Number(year) || 3,
      semester: Number(semester) || 6,
      cgpa: Number(cgpa) || 8.0,
      graduationYear: Number(graduationYear) || 2026,
      skills: selectedSkills,
      projects: [
        {
          id: 'proj_1',
          title: 'Autonomous Rover with Sensor Interfacing',
          techStack: ['Embedded C', 'ESP32', 'FreeRTOS'],
          description: 'Obstacle-avoiding robot leveraging dual ultrasonic distance sensors and FreeRTOS task scheduling.',
          githubUrl: 'https://github.com/example/freertos-rover',
        },
      ],
      internships: [],
      interests: selectedInterests,
      careerGoal: dreamJob,
      targetRole,
      targetCompanies: targetCompanies.split(',').map(c => c.trim()).filter(Boolean),
      workPreference,
      nextStep,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    saveUserProfile(profile);
    refreshProfile();
    navigate('/dashboard/college');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-2xl" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-3">
            College Student Profile & Skill Passport Setup
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Step {step} of 4: {step === 1 ? 'University Record' : step === 2 ? 'Skills & Evidence' : step === 3 ? 'Technical Interests' : 'Target Career Direction'}
          </p>

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

        {/* Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#151A18] rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] p-6 sm:p-8 shadow-xs">
          {/* STEP 1: Academic */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <GraduationCap className="w-4 h-4 text-[#C7F36B]" />
                <span>University & Degree Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    College / University Name
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. NIT Trichy / DTU / VIT"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="B.Tech / B.E. / B.Sc / BCA"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="ECE / CSE / Mechatronics"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Current Year & Semester
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-2.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full px-2.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Sem {s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Current CGPA (out of 10)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="4.0"
                    max="10.0"
                    value={cgpa}
                    onChange={(e) => setCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Skills */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">
                  <Code2 className="w-4 h-4 text-[#C7F36B]" />
                  <span>Your Skill Inventory</span>
                </div>
                <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                  {selectedSkills.length} skills added
                </span>
              </div>

              {/* Add skill row */}
              <div className="p-3.5 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full">
                  <select
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="">-- Choose from standard skills --</option>
                    {SKILLS_LIST.filter(s => !selectedSkills.some(existing => existing.name.toLowerCase() === s.name.toLowerCase())).map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-36">
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!newSkillName}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-bold rounded-lg bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] hover:opacity-90 disabled:opacity-40 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Skill
                </button>
              </div>

              {/* Current Skills Table */}
              <div className="space-y-2">
                {selectedSkills.map(skill => (
                  <div
                    key={skill.id}
                    className="p-3 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">{skill.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-medium">
                          {skill.claimedLevel}
                        </span>
                        {skill.evidence && skill.evidence.length > 0 && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <LinkIcon className="w-3 h-3" />
                            {skill.evidence.length} Evidence Attached
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-0.5">
                        Verification Confidence: <strong>{skill.verifiedConfidence}%</strong> ({skill.verificationStatus})
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="p-1.5 text-[#68716D] hover:text-red-600 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <Layers className="w-4 h-4 text-[#C7F36B]" />
                <span>Technical Domains of Interest</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'AI/ML', 'Embedded', 'Robotics', 'IoT', 'Web', 'Cybersecurity',
                  'VLSI', 'Data Science', 'Cloud', 'Product Design', 'Research',
                  'Software', 'Hardware',
                ].map(interest => {
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
          )}

          {/* STEP 4: Career Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <Target className="w-4 h-4 text-[#C7F36B]" />
                <span>Target Role & Immediate Next Step</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Primary Target Engineering Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                >
                  {JOB_ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.title} ({role.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Dream Job Title
                  </label>
                  <input
                    type="text"
                    value={dreamJob}
                    onChange={(e) => setDreamJob(e.target.value)}
                    placeholder="e.g. Embedded Firmware Engineer"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Target Companies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={targetCompanies}
                    onChange={(e) => setTargetCompanies(e.target.value)}
                    placeholder="Qualcomm, Bosch, Intel, Google"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Work Location Preference
                  </label>
                  <select
                    value={workPreference}
                    onChange={(e) => setWorkPreference(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Hybrid">Hybrid (Edge lab + Remote)</option>
                    <option value="On-site">On-site (Hardware & cleanroom required)</option>
                    <option value="Remote">Remote</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Immediate Graduation Next Step
                  </label>
                  <select
                    value={nextStep}
                    onChange={(e) => setNextStep(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Job">Industry Job / Campus Placement</option>
                    <option value="Higher studies">Higher Studies (M.S. / M.Tech / PhD)</option>
                    <option value="Entrepreneurship">Hardware / Tech Startup</option>
                    <option value="Exploring">Exploring Options</option>
                  </select>
                </div>
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
                Activate Skill Passport & Dashboard
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
