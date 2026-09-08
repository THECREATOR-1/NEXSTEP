import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CollegeProfile, StudentSkill, SkillEvidence, SkillLevel } from '../../types';
import { saveUserProfile } from '../../services/storage/localStorage';
import { SKILLS_LIST } from '../../data/skills';
import {
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Code2,
  X,
  FileCheck,
  Info,
} from 'lucide-react';

export const SkillPassportPage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const collegeProfile = profile as CollegeProfile | null;

  const [skills, setSkills] = useState<StudentSkill[]>(collegeProfile?.skills || []);
  const [activeEvidenceModalSkill, setActiveEvidenceModalSkill] = useState<StudentSkill | null>(null);

  // New evidence form state
  const [evidenceType, setEvidenceType] = useState<SkillEvidence['type']>('Project');
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');

  // Add new skill state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');

  const updateProfileSkills = (updatedSkills: StudentSkill[]) => {
    if (!collegeProfile) return;
    const updatedProfile: CollegeProfile = {
      ...collegeProfile,
      skills: updatedSkills,
      updatedAt: new Date().toISOString(),
    };
    saveUserProfile(updatedProfile);
    setSkills(updatedSkills);
    refreshProfile();
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvidenceModalSkill || !evidenceTitle.trim()) return;

    const newEvidence: SkillEvidence = {
      id: `ev_${Date.now()}`,
      type: evidenceType,
      title: evidenceTitle.trim(),
      url: evidenceUrl.trim() || undefined,
      description: evidenceDesc.trim() || undefined,
      dateAdded: new Date().toISOString(),
    };

    const updatedSkills = skills.map((s) => {
      if (s.id === activeEvidenceModalSkill.id) {
        const evidence = [...(s.evidence || []), newEvidence];
        // Recalculate verification confidence: baseline + evidence (+35%)
        const base = s.claimedLevel === 'Advanced' ? 30 : s.claimedLevel === 'Intermediate' ? 25 : 20;
        const confidence = Math.min(100, base + 35);
        return {
          ...s,
          evidence,
          verifiedConfidence: confidence,
          verificationStatus: 'Evidence Added' as const,
        };
      }
      return s;
    });

    updateProfileSkills(updatedSkills);
    setActiveEvidenceModalSkill(null);
    setEvidenceTitle('');
    setEvidenceUrl('');
    setEvidenceDesc('');
  };

  const handleRemoveEvidence = (skillId: string, evidenceId: string) => {
    const updatedSkills = skills.map((s) => {
      if (s.id === skillId) {
        const evidence = s.evidence.filter(e => e.id !== evidenceId);
        const base = s.claimedLevel === 'Advanced' ? 30 : s.claimedLevel === 'Intermediate' ? 25 : 20;
        const confidence = evidence.length > 0 ? base + 35 : base;
        return {
          ...s,
          evidence,
          verifiedConfidence: confidence,
          verificationStatus: evidence.length > 0 ? ('Evidence Added' as const) : ('Unverified' as const),
        };
      }
      return s;
    });
    updateProfileSkills(updatedSkills);
  };

  const handleCreateSkill = () => {
    if (!newSkillName.trim()) return;
    const exists = skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (exists) return;

    const base = newSkillLevel === 'Advanced' ? 30 : newSkillLevel === 'Intermediate' ? 25 : 20;
    const newSkill: StudentSkill = {
      id: newSkillName.toLowerCase().replace(/\s+/g, '-'),
      name: newSkillName.trim(),
      claimedLevel: newSkillLevel,
      evidence: [],
      verifiedConfidence: base,
      verificationStatus: 'Unverified',
    };

    const updated = [...skills, newSkill];
    updateProfileSkills(updated);
    setNewSkillName('');
    setIsAddingSkill(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    const updated = skills.filter(s => s.id !== skillId);
    updateProfileSkills(updated);
  };

  const getStatusBadge = (status: StudentSkill['verificationStatus']) => {
    switch (status) {
      case 'Fully Verified':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">Fully Verified</span>;
      case 'Interview Verified':
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs">Interview Verified</span>;
      case 'Assessment Passed':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold text-xs">Assessment Passed</span>;
      case 'Evidence Added':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs">Evidence Attached</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-semibold text-xs">Unverified Claim</span>;
    }
  };

  return (
    <DashboardLayout activeRole="college">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Verified Skill Passport
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              "Claimed Skill ≠ Verified Skill" — Attach project evidence and pass diagnostics to build confidence.
            </p>
          </div>

          <button
            onClick={() => setIsAddingSkill(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Skill to Passport
          </button>
        </div>

        {/* Confidence Calculation Rationale Banner */}
        <div className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#C7F36B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
            <strong className="text-[#101413] dark:text-[#F4F7F2]">NEXSTEP Empirical Verification Formula:</strong>{' '}
            Claimed Baseline (20-30%) + Project / GitHub Proof (+35%) + Diagnostic Score (+20%) + Verbal AI Interview Defense (+15%). Unsubstantiated claims never exceed 30% confidence.
          </div>
        </div>

        {/* Add Skill Drawer / Modal */}
        {isAddingSkill && (
          <div className="p-6 rounded-2xl border-2 border-[#101413] dark:border-[#C7F36B] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
              <h3 className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">
                Add a Technical Skill to Your Passport
              </h3>
              <button onClick={() => setIsAddingSkill(false)} className="text-[#68716D] hover:text-[#101413]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Select Skill or Type Custom Name
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. STM32, FreeRTOS, Rust, Docker..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Your Current Claimed Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Project experience)</option>
                  <option value="Advanced">Advanced (Production / In-depth)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#DDE2DC] dark:border-[#29312D]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSkill}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-[#C7F36B] text-[#101413]"
              >
                Save Skill
              </button>
            </div>
          </div>
        )}

        {/* Skills Cards Grid */}
        <div className="space-y-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#C7F36B] flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                        {skill.name}
                      </h3>
                      {getStatusBadge(skill.verificationStatus)}
                    </div>
                    <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                      Claimed Level: <strong>{skill.claimedLevel}</strong>
                    </span>
                  </div>
                </div>

                {/* Verification Confidence Bar */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F] block">
                      Verification Confidence
                    </span>
                    <span className="text-lg font-mono font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                      {skill.verifiedConfidence}%
                    </span>
                  </div>
                  <div className="w-28 h-2 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        skill.verifiedConfidence >= 75 ? 'bg-emerald-500' : skill.verifiedConfidence >= 45 ? 'bg-[#C7F36B]' : 'bg-amber-400'
                      }`}
                      style={{ width: `${skill.verifiedConfidence}%` }}
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="p-2 text-[#68716D] hover:text-red-500 transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="pt-3 border-t border-[#DDE2DC] dark:border-[#29312D]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                    Documented Evidence ({skill.evidence?.length || 0})
                  </span>
                  <button
                    onClick={() => setActiveEvidenceModalSkill(skill)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#101413] dark:text-[#C7F36B] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Attach Evidence (Project / GitHub)
                  </button>
                </div>

                {skill.evidence && skill.evidence.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {skill.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] font-bold text-[#68716D] dark:text-[#9AA49F]">
                              {ev.type}
                            </span>
                            <span className="text-xs font-bold text-[#101413] dark:text-[#F4F7F2]">
                              {ev.title}
                            </span>
                          </div>
                          {ev.description && (
                            <p className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1 line-clamp-2">
                              {ev.description}
                            </p>
                          )}
                          {ev.url && (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-mono text-[#101413] dark:text-[#C7F36B] hover:underline flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {ev.url}
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveEvidence(skill.id, ev.id)}
                          className="text-[#68716D] hover:text-red-500 p-1"
                          title="Remove evidence"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl border border-dashed border-[#DDE2DC] dark:border-[#29312D] text-center text-xs text-[#68716D]">
                    No evidence attached yet. Unverified claims remain at 20-30% confidence.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Attach Evidence Modal */}
        {activeEvidenceModalSkill && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] dark:bg-[#151A18] rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Attach Evidence for {activeEvidenceModalSkill.name}
                </h3>
                <button
                  onClick={() => setActiveEvidenceModalSkill(null)}
                  className="text-[#68716D] hover:text-[#101413]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddEvidence} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Evidence Category
                  </label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  >
                    <option value="Project">Project Implementation</option>
                    <option value="GitHub">GitHub Repository</option>
                    <option value="Demo">Live Hosted Demo</option>
                    <option value="Hackathon">Hackathon / Competition</option>
                    <option value="Certification">Industry Certification</option>
                    <option value="Internship">Internship Deliverable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Evidence Title
                  </label>
                  <input
                    type="text"
                    required
                    value={evidenceTitle}
                    onChange={(e) => setEvidenceTitle(e.target.value)}
                    placeholder="e.g. FreeRTOS Task Synchronization Driver"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Public Link / Repository URL
                  </label>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://github.com/yourname/project"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                    Technical Description & Architecture
                  </label>
                  <textarea
                    rows={3}
                    value={evidenceDesc}
                    onChange={(e) => setEvidenceDesc(e.target.value)}
                    placeholder="Describe how you implemented this, algorithms used, hardware tested on..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#DDE2DC] dark:border-[#29312D]">
                  <button
                    type="button"
                    onClick={() => setActiveEvidenceModalSkill(null)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#DDE2DC] dark:border-[#29312D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-[#C7F36B] text-[#101413]"
                  >
                    Save & Boost Confidence
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
