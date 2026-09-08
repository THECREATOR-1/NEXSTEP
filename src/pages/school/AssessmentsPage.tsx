import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { QUESTIONS_DATABASE } from '../../data/questions';
import { Assessment, AssessmentQuestion } from '../../types';
import { saveAssessment, getAssessments } from '../../services/storage/localStorage';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const { user, activeRole } = useAuth();
  const [assessmentsHistory, setAssessmentsHistory] = useState<Assessment[]>([]);

  // Active quiz state
  const [activeType, setActiveType] = useState<'Aptitude' | 'Technical' | 'Interest' | 'Communication' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<Assessment | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 mins

  useEffect(() => {
    if (user) {
      setAssessmentsHistory(getAssessments(user.id));
    }
  }, [user]);

  // Questions for chosen activeType
  const currentQuestions = activeType ? QUESTIONS_DATABASE[activeType] || [] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const startQuiz = (type: 'Aptitude' | 'Technical' | 'Interest' | 'Communication') => {
    setActiveType(type);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
    setTimeRemaining(300);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (quizSubmitted || !currentQuestion) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleFinishQuiz = () => {
    if (!user || !activeType) return;

    let scoreCount = 0;
    currentQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === (q.correctIndex ?? q.correctOption)) {
        scoreCount += 1;
      }
    });

    const scorePercentage = Math.round((scoreCount / currentQuestions.length) * 100);

    const assessment: Assessment = {
      id: `as_${Date.now()}`,
      userId: user.id,
      title: `${activeType} Assessment`,
      type: activeType,
      score: scorePercentage,
      totalQuestions: currentQuestions.length,
      correctAnswers: scoreCount,
      completedAt: new Date().toISOString(),
      breakdown: {
        rawScore: scoreCount,
        accuracy: scorePercentage,
      },
    };

    saveAssessment(assessment);
    setQuizResult(assessment);
    setQuizSubmitted(true);
    setAssessmentsHistory(getAssessments(user.id));
  };

  return (
    <DashboardLayout activeRole={activeRole}>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            Diagnostic Assessments & Skill Checks
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Empirical testing to benchmark your quantitative aptitude, core concepts, and communication readiness.
          </p>
        </div>

        {/* If Quiz is in progress */}
        {activeType && !quizSubmitted && currentQuestion && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6">
            <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#68716D] dark:text-[#9AA49F]">
                  {activeType} Diagnostic • Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </span>
                <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                  Category: {currentQuestion.category || currentQuestion.skillOrDomain}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#68716D] dark:text-[#9AA49F] px-3 py-1.5 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                <Clock className="w-3.5 h-3.5 text-[#C7F36B]" />
                <span>Question {currentQuestionIndex + 1}/{currentQuestions.length}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base font-bold text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
              {currentQuestion.question || currentQuestion.text}
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#101413] dark:border-[#C7F36B] bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#F4F7F2] shadow-xs'
                        : 'border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#68716D] dark:text-[#9AA49F] hover:border-[#101413] dark:hover:border-[#C7F36B]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="pt-4 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] disabled:opacity-40"
              >
                Previous Question
              </button>

              {currentQuestionIndex < currentQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] hover:opacity-90 shadow-xs"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] shadow-xs"
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        )}

        {/* If Quiz is Submitted (Review Screen) */}
        {quizSubmitted && quizResult && (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-[#C7F36B]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                    Diagnostic Completed
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                  {quizResult.title} Results
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-right">
                <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Score Achieved</div>
                <div className="text-3xl font-extrabold font-mono text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                  {quizResult.score}%
                </div>
                <span className="text-xs text-[#68716D] dark:text-[#9AA49F] block mt-0.5">
                  {quizResult.correctAnswers} of {quizResult.totalQuestions} correct
                </span>
              </div>
            </div>

            {/* Explanations for all questions */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#101413] dark:text-[#F4F7F2]">
                Detailed Question Review & Explanations
              </h3>

              {currentQuestions.map((q, qIdx) => {
                const userChoice = selectedAnswers[q.id];
                const correctIdx = q.correctIndex ?? q.correctOption ?? 0;
                const isCorrect = userChoice === correctIdx;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                      isCorrect
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-red-500/20 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-sm text-[#101413] dark:text-[#F4F7F2]">
                        {qIdx + 1}. {q.question || q.text}
                      </div>
                      {isCorrect ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-[#68716D] dark:text-[#9AA49F]">
                      Your Answer: <strong>{userChoice !== undefined ? q.options[userChoice] : 'None'}</strong> | Correct Answer: <strong>{q.options[correctIdx]}</strong>
                    </div>

                    <div className="pt-2 border-t border-[#DDE2DC]/60 dark:border-[#29312D]/60 text-[#101413] dark:text-[#F4F7F2]">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setActiveType(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413]"
              >
                Back to Diagnostics Catalog
              </button>
            </div>
          </div>
        )}

        {/* Assessment Options Grid (when not actively taking a test) */}
        {!activeType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                type: 'Aptitude',
                title: 'Quantitative & Logical Aptitude',
                desc: 'Diagnostic on speed math, logical deduction, spatial reasoning, and probability.',
                questionsCount: QUESTIONS_DATABASE.Aptitude.length,
                timeEst: '10 Mins',
              },
              {
                type: 'Technical',
                title: 'Core Technical Diagnostics (C & Electronics)',
                desc: 'Memory pointers, bitwise manipulation, microcontrollers, and synchronous systems.',
                questionsCount: QUESTIONS_DATABASE.Technical.length,
                timeEst: '10 Mins',
              },
              {
                type: 'Interest',
                title: 'Engineering & Creative Interest Alignment',
                desc: 'Diagnose whether your natural working archetype favors firmware, physical labs, or software.',
                questionsCount: QUESTIONS_DATABASE.Interest.length,
                timeEst: '5 Mins',
              },
              {
                type: 'Communication',
                title: 'Communication & Problem Explanation',
                desc: 'Structure assessment on explaining technical topics, STAR framework, and trade-off synthesis.',
                questionsCount: QUESTIONS_DATABASE.Communication.length,
                timeEst: '5 Mins',
              },
            ].map((item) => (
              <div
                key={item.type}
                className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-semibold">
                      {item.timeEst}
                    </span>
                    <span className="text-xs text-[#68716D] dark:text-[#9AA49F] font-mono">
                      {item.questionsCount} Questions
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between">
                  <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                    Updates your verified readiness
                  </span>
                  <button
                    onClick={() => startQuiz(item.type as any)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors cursor-pointer shadow-xs"
                  >
                    Start Diagnostic
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Table */}
        {!activeType && assessmentsHistory.length > 0 && (
          <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
            <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
              Historical Diagnostic Records
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F]">
                  <tr>
                    <th className="py-2.5 pr-4 font-bold uppercase">Assessment</th>
                    <th className="py-2.5 px-4 font-bold uppercase">Date Completed</th>
                    <th className="py-2.5 px-4 font-bold uppercase">Score</th>
                    <th className="py-2.5 pl-4 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE2DC] dark:divide-[#29312D]">
                  {assessmentsHistory.map((as) => (
                    <tr key={as.id}>
                      <td className="py-3 pr-4 font-semibold text-[#101413] dark:text-[#F4F7F2]">{as.title}</td>
                      <td className="py-3 px-4 text-[#68716D] dark:text-[#9AA49F]">
                        {new Date(as.completedAt).toLocaleDateString()} {new Date(as.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#101413] dark:text-[#F4F7F2]">{as.score}%</td>
                      <td className="py-3 pl-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
