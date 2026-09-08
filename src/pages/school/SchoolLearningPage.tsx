import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { generateLearningMaterials } from '../../services/intelligence/learningGenerator';
import { SchoolProfile } from '../../types';
import {
  BookOpen,
  Sparkles,
  Printer,
  Copy,
  Check,
  HelpCircle,
  RotateCw,
  FileText,
  Presentation,
  CheckCircle2,
} from 'lucide-react';

export const SchoolLearningPage: React.FC = () => {
  const { profile, activeRole } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;

  const [topic, setTopic] = useState("Microcontrollers & Embedded C Fundamentals");
  const [activeTab, setActiveTab] = useState<'notes' | 'ppt' | 'practice' | 'flashcards'>('notes');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const targetCareer = (schoolProfile?.targetCareers && schoolProfile.targetCareers.length > 0) ? schoolProfile.targetCareers[0] : 'Embedded Systems Engineer';
  const materials = generateLearningMaterials(topic, targetCareer);

  const handleCopy = () => {
    let content = '';
    if (activeTab === 'notes') {
      content = materials.studyNotes;
    } else if (activeTab === 'ppt') {
      content = materials.pptOutline.map(s => `Slide ${s.slideNumber}: ${s.title}\n${s.bulletPoints.map(b => `• ${b}`).join('\n')}\nNotes: ${s.speakerNotes}\n`).join('\n---\n');
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout activeRole={activeRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Modular Learning & Material Generator
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Generate structured study notes, presentation outlines, and flashcards for your curriculum.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Topic Selector / Input */}
        <div className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col sm:flex-row items-center gap-3">
          <label className="text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] shrink-0">
            Study Topic:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Microcontrollers, Digital Logic, Calculus, Thermodynamics..."
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2]"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {['Ohm\'s Law', 'Digital Logic', 'FreeRTOS', 'Git Basics'].map((sample) => (
              <button
                key={sample}
                onClick={() => setTopic(sample)}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
          {[
            { id: 'notes', label: 'Study Notes', icon: FileText },
            { id: 'ppt', label: 'Presentation Outline (PPT)', icon: Presentation },
            { id: 'flashcards', label: 'Recall Flashcards', icon: RotateCw },
            { id: 'practice', label: 'Practice Questions', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] shadow-xs'
                    : 'border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Views */}
        <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          {/* View 1: Study Notes */}
          {activeTab === 'notes' && (
            <div className="prose dark:prose-invert max-w-none text-sm text-[#101413] dark:text-[#F4F7F2] leading-relaxed whitespace-pre-wrap font-sans">
              {materials.studyNotes}
            </div>
          )}

          {/* View 2: PPT Outline */}
          {activeTab === 'ppt' && (
            <div className="space-y-6">
              <div className="text-xs text-[#68716D] dark:text-[#9AA49F] mb-4">
                Structured slide breakdown formatted for technical presentations and seminars:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.pptOutline.map((slide) => (
                  <div
                    key={slide.slideNumber}
                    className="p-5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-2">
                      <span className="text-xs font-mono font-bold text-[#68716D] dark:text-[#9AA49F]">
                        SLIDE 0{slide.slideNumber}
                      </span>
                      <span className="text-xs font-bold text-[#101413] dark:text-[#F4F7F2]">
                        {slide.title}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-[#101413] dark:text-[#F4F7F2]">
                      {slide.bulletPoints.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#101413] dark:bg-[#C7F36B] shrink-0 mt-1.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-[#DDE2DC] dark:border-[#29312D] text-[11px] text-[#68716D] dark:text-[#9AA49F]">
                      <strong>Speaker Notes:</strong> {slide.speakerNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View 3: Flashcards */}
          {activeTab === 'flashcards' && materials.flashcards.length > 0 && (
            <div className="max-w-xl mx-auto text-center space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-[#68716D] dark:text-[#9AA49F]">
                <span>Flashcard {currentFlashcardIndex + 1} of {materials.flashcards.length}</span>
                <span>Click card to reveal answer</span>
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[220px] p-8 rounded-2xl border-2 border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] hover:border-[#101413] dark:hover:border-[#C7F36B] transition-all cursor-pointer flex flex-col justify-center items-center select-none shadow-xs"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-3">
                  {isFlipped ? 'Answer' : 'Question / Concept'}
                </span>
                <p className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                  {isFlipped
                    ? materials.flashcards[currentFlashcardIndex].back
                    : materials.flashcards[currentFlashcardIndex].front}
                </p>
                <div className="mt-4 text-[11px] text-[#68716D] dark:text-[#9AA49F] flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Click to flip</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  disabled={currentFlashcardIndex === 0}
                  onClick={() => {
                    setCurrentFlashcardIndex(prev => prev - 1);
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-[#DDE2DC] dark:border-[#29312D] disabled:opacity-40"
                >
                  Previous Card
                </button>
                <button
                  disabled={currentFlashcardIndex === materials.flashcards.length - 1}
                  onClick={() => {
                    setCurrentFlashcardIndex(prev => prev + 1);
                    setIsFlipped(false);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] disabled:opacity-40"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}

          {/* View 4: Practice Questions */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              {materials.practiceQuestions.map((pq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] space-y-2 text-xs leading-relaxed"
                >
                  <div className="font-bold text-sm text-[#101413] dark:text-[#F4F7F2]">
                    Q{idx + 1}. {pq.question}
                  </div>
                  <div className="text-[#68716D] dark:text-[#9AA49F]">
                    <strong>Target Concept:</strong> {pq.answer}
                  </div>
                  <div className="text-[#101413] dark:text-[#F4F7F2] pt-1">
                    <strong>Guidance:</strong> {pq.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
