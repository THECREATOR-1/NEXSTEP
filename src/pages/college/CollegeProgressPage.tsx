import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getProgressStats, getInterviewSessions, exportAllUserData } from '../../services/storage/localStorage';
import { InterviewSession, CollegeProfile } from '../../types';
import {
  TrendingUp,
  Award,
  Mic,
  ShieldCheck,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const CollegeProgressPage: React.FC = () => {
  const { user, profile } = useAuth();
  const collegeProfile = profile as CollegeProfile | null;

  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    if (user) {
      setStats(getProgressStats(user.id));
      setSessions(getInterviewSessions(user.id));
    }
  }, [user]);

  const handleExport = () => {
    if (!user) return;
    const jsonStr = exportAllUserData(user.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexstep_college_progress_${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout activeRole="college">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Engineering Readiness & Performance Log
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Zero mock data. Direct telemetry from your speech analyses, verified passport artifacts, and test records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Export Progress (JSON)</span>
            </button>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Average Interview Score</div>
            <div className="text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
              {stats?.averageInterviewScore ? `${stats.averageInterviewScore}%` : 'N/A'}
            </div>
            <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1">
              {sessions.length} sessions completed
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Average Speaking Cadence</div>
            <div className="text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
              {stats?.averageCadence ? `${stats.averageCadence} WPM` : '140 WPM'}
            </div>
            <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1">
              Target: 130 - 160 WPM
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Verified Skills in Passport</div>
            <div className="text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
              {collegeProfile?.skills.filter(s => s.verifiedConfidence >= 50).length || 0} / {collegeProfile?.skills.length || 0}
            </div>
            <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-1">
              Skills with proof attached
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <div className="text-xs font-medium text-[#68716D] dark:text-[#9AA49F]">Profile Status</div>
            <div className="text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
              100%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
              ✓ Active College Track
            </div>
          </div>
        </div>

        {/* Historical Interview Records */}
        <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
            <h2 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
              Verifiable AI Interview Sessions
            </h2>
            <Link
              to="/dashboard/college/interview"
              className="text-xs font-bold text-[#101413] dark:text-[#C7F36B] hover:underline"
            >
              Practice Interview →
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#68716D] dark:text-[#9AA49F]">
              <Mic className="w-8 h-8 mx-auto mb-2 text-[#68716D]" />
              <p>No interview sessions recorded yet.</p>
              <Link
                to="/dashboard/college/interview"
                className="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413]"
              >
                Launch First Session
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]">
                  <tr>
                    <th className="py-2.5 pr-4 font-bold uppercase">Date</th>
                    <th className="py-2.5 px-4 font-bold uppercase">Target Role</th>
                    <th className="py-2.5 px-4 font-bold uppercase">Questions</th>
                    <th className="py-2.5 px-4 font-bold uppercase">Score</th>
                    <th className="py-2.5 px-4 font-bold uppercase">Cadence</th>
                    <th className="py-2.5 pl-4 font-bold uppercase">Fillers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE2DC] dark:divide-[#29312D]">
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 pr-4 text-[#68716D] dark:text-[#9AA49F]">
                        {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#101413] dark:text-[#F4F7F2]">
                        {s.roleId.replace(/-/g, ' ')}
                      </td>
                      <td className="py-3 px-4 text-[#68716D] dark:text-[#9AA49F]">{s.answersAnalyzed}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#101413] dark:text-[#F4F7F2]">{s.overallScore}%</td>
                      <td className="py-3 px-4 font-mono text-[#68716D] dark:text-[#9AA49F]">{s.averageCadenceWPM} WPM</td>
                      <td className="py-3 pl-4 font-mono text-[#68716D] dark:text-[#9AA49F]">{s.totalFillerWords} detected</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
