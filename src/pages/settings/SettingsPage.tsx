import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { exportAllUserData, clearAllUserData, saveUserProfile } from '../../services/storage/localStorage';
import { SchoolProfile, CollegeProfile } from '../../types';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Download,
  Trash2,
  RefreshCw,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, profile, activeRole, switchTrack, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = { ...user, name };
    localStorage.setItem('nexstep_auth_user', JSON.stringify(updatedUser));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportData = () => {
    if (!user) return;
    const jsonStr = exportAllUserData(user.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexstep_backup_${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    clearAllUserData();
    window.location.href = '/';
  };

  return (
    <DashboardLayout activeRole={activeRole}>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            Platform Settings & Data Controls
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Manage your active role track, profile details, UI themes, and local storage data persistence.
          </p>
        </div>

        {/* Track Switcher Section */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                Active Track Switcher
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-0.5">
                Switch seamlessly between the School Track (Career discovery) and College Track (Skill Passport).
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#C7F36B] text-[#101413]">
              Active: {activeRole.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => switchTrack('school')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeRole === 'school'
                  ? 'border-[#101413] dark:border-[#C7F36B] bg-[#EEF1EB] dark:bg-[#1B211E] shadow-xs'
                  : 'border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] hover:border-[#101413]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#101413] dark:text-[#F4F7F2]">
                  School Track
                </span>
                {activeRole === 'school' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#C7F36B]" />}
              </div>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1 leading-relaxed">
                Stream diagnostic, career recommendations, college intelligence directory, side-by-side comparison, and 7-stage roadmap.
              </p>
            </button>

            <button
              onClick={() => switchTrack('college')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeRole === 'college'
                  ? 'border-[#101413] dark:border-[#C7F36B] bg-[#EEF1EB] dark:bg-[#1B211E] shadow-xs'
                  : 'border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] hover:border-[#101413]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#101413] dark:text-[#F4F7F2]">
                  College Track
                </span>
                {activeRole === 'college' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#C7F36B]" />}
              </div>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1 leading-relaxed">
                Skill Passport, evidence attachments, job role matching, gap diagnostics, and AI voice Interview Arena.
              </p>
            </button>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
          <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2] border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
            Account & User Profile
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'student@nexstep.edu'}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved successfully!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Display Appearance / Theme Toggle */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                Interface Theme
              </h2>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-0.5">
                Switch between high-contrast daylight theme and dark midnight palette.
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] cursor-pointer"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-[#C7F36B]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </button>
          </div>
        </div>

        {/* Local Storage & Data Management */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
          <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
            <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
              Local Persistence & Privacy
            </h2>
            <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-0.5">
              All data is stored directly in your browser's private local storage. Export full backups or reset anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C7F36B]" />
              Export Full User Backup (JSON)
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Local Storage Data
            </button>
          </div>

          {showClearConfirm && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 space-y-3">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Reset</span>
              </div>
              <p>
                Are you sure you want to clear all local data? This will erase your Skill Passport, assessments, interview transcripts, and roadmap checkmarks.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearData}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs cursor-pointer"
                >
                  Yes, Clear Everything
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-red-500/30 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
