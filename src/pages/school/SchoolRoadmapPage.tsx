import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getRoadmapItems, toggleRoadmapItem } from '../../services/storage/localStorage';
import { RoadmapMilestone } from '../../types';
import {
  MapPin,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Code2,
  Briefcase,
  Layers,
  Award,
  Calendar,
} from 'lucide-react';

export const SchoolRoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);

  useEffect(() => {
    if (user) {
      setMilestones(getRoadmapItems(user.id, 'school'));
    }
  }, [user]);

  const handleToggle = (stageId: string, itemId: string) => {
    if (!user) return;
    const updated = toggleRoadmapItem(user.id, stageId, itemId);
    setMilestones(updated);
  };

  const totalItems = milestones.reduce((acc, stage) => acc + stage.items.length, 0);
  const completedItems = milestones.reduce(
    (acc, stage) => acc + stage.items.filter(i => i.completed).length,
    0
  );
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const getStageIcon = (index: number) => {
    switch (index) {
      case 0: return <BookOpen className="w-5 h-5" />;
      case 1: return <Layers className="w-5 h-5" />;
      case 2: return <GraduationCap className="w-5 h-5" />;
      case 3: return <Code2 className="w-5 h-5" />;
      case 4: return <Award className="w-5 h-5" />;
      case 5: return <Briefcase className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout activeRole="school">
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>7-Stage Career Progression</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Your Academic & Career Roadmap
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Structured step-by-step pathway from school fundamentals to your target engineering launch.
            </p>
          </div>

          {/* Progress Box */}
          <div className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold text-[#68716D] dark:text-[#9AA49F] mb-1.5">
              <span>Roadmap Progress</span>
              <span className="font-mono text-[#101413] dark:text-[#F4F7F2]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] overflow-hidden">
              <div
                className="h-full bg-[#C7F36B] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-2">
              {completedItems} of {totalItems} milestones achieved
            </div>
          </div>
        </div>

        {/* 7 Stages Vertical List */}
        <div className="space-y-6">
          {milestones.map((stage, idx) => {
            const stageCompleted = stage.items.every(i => i.completed);
            const stageProgress = Math.round(
              (stage.items.filter(i => i.completed).length / stage.items.length) * 100
            );

            return (
              <div
                key={stage.id}
                className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#C7F36B] flex items-center justify-center font-bold">
                      {getStageIcon(idx)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#68716D] dark:text-[#9AA49F]">
                          STAGE 0{idx + 1}
                        </span>
                        <span className="text-xs text-[#68716D] dark:text-[#9AA49F] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {stage.timeline}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#68716D] dark:text-[#9AA49F]">
                      {stageProgress}% Stage Completion
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-3">
                  {stage.description}
                </p>

                {/* Milestone Checklists */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stage.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleToggle(stage.id, item.id)}
                      className={`p-3 rounded-xl border text-left transition-colors flex items-start gap-2.5 cursor-pointer ${
                        item.completed
                          ? 'bg-[#EEF1EB]/50 dark:bg-[#1B211E]/40 border-transparent text-[#68716D] dark:text-[#9AA49F]'
                          : 'bg-[#F6F7F2] dark:bg-[#0D1110] border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] hover:border-[#101413] dark:hover:border-[#C7F36B]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#C7F36B]" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#68716D] dark:text-[#9AA49F]" />
                        )}
                      </div>
                      <div className="text-xs leading-relaxed">
                        <span className={item.completed ? 'line-through' : 'font-medium'}>
                          {item.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};
