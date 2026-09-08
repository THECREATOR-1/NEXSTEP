import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { INTERVIEW_QUESTIONS } from '../../data/questions';
import { JOB_ROLES } from '../../data/jobs';
import { analyzeInterviewResponse, updateSkillVerificationAfterInterview } from '../../services/intelligence/interviewAnalyzer';
import { InterviewQuestion, InterviewResponseAnalysis, InterviewSession, CollegeProfile } from '../../types';
import { saveInterviewSession, saveUserProfile, getInterviewSessions } from '../../services/storage/localStorage';
import {
  Mic,
  MicOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  Award,
  Zap,
  BookOpen,
  Send,
  History,
} from 'lucide-react';

export const InterviewArenaPage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const collegeProfile = profile as CollegeProfile | null;
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const [selectedRole, setSelectedRole] = useState<string>(
    roleParam || collegeProfile?.targetRole || 'embedded-systems-engineer'
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Analysis result state for current question
  const [currentAnalysis, setCurrentAnalysis] = useState<InterviewResponseAnalysis | null>(null);
  const [sessionResponses, setSessionResponses] = useState<InterviewResponseAnalysis[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [finalSessionRecord, setFinalSessionRecord] = useState<InterviewSession | null>(null);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Filter interview questions by selected role (or general fallback)
  const roleQuestions = INTERVIEW_QUESTIONS.filter(
    q => q.targetRole === selectedRole || q.roleId === selectedRole || q.targetRole === 'General' || q.roleId === 'general'
  );
  const currentQuestion = roleQuestions[questionIndex] || (INTERVIEW_QUESTIONS && INTERVIEW_QUESTIONS.length > 0 ? INTERVIEW_QUESTIONS[0] : undefined);

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result && result[0]) {
            currentTranscript += result[0].transcript;
          }
        }
        setTranscript(prev => `${prev} ${currentTranscript}`.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Timer counter
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not natively supported in this browser. You can type your response below.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsRecording(false);
      setIsTimerRunning(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsTimerRunning(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleStartTyping = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
  };

  const handleSubmitResponse = () => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsRecording(false);
    }
    setIsTimerRunning(false);

    if (!transcript.trim()) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    const duration = Math.max(timerSeconds, 15);
    const analysis = analyzeInterviewResponse(currentQuestion, transcript, duration);
    setCurrentAnalysis(analysis);
    setSessionResponses(prev => [...prev, analysis]);
  };

  const handleNextQuestion = () => {
    setTranscript('');
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setCurrentAnalysis(null);

    if (questionIndex < roleQuestions.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      finishInterviewSession();
    }
  };

  const finishInterviewSession = () => {
    if (!user) return;
    const all = [...sessionResponses];
    if (currentAnalysis && !all.some(a => a.questionId === currentAnalysis.questionId)) {
      all.push(currentAnalysis);
    }

    const avgOverall = Math.round(all.reduce((acc, a) => acc + a.overallScore, 0) / (all.length || 1));
    const avgTech = Math.round(all.reduce((acc, a) => acc + a.technicalScore, 0) / (all.length || 1));
    const avgComm = Math.round(all.reduce((acc, a) => acc + a.communicationScore, 0) / (all.length || 1));
    const totalFillers = all.reduce((acc, a) => acc + a.fillerWordsCount, 0);
    const avgWpm = Math.round(all.reduce((acc, a) => acc + a.cadenceWPM, 0) / (all.length || 1));

    const session: InterviewSession = {
      id: `session_${Date.now()}`,
      userId: user.id,
      roleId: selectedRole,
      date: new Date().toISOString(),
      overallScore: avgOverall,
      technicalScore: avgTech,
      communicationScore: avgComm,
      answersAnalyzed: all.length,
      averageCadenceWPM: avgWpm,
      totalFillerWords: totalFillers,
      responses: all,
    };

    saveInterviewSession(session);
    setFinalSessionRecord(session);
    setIsSessionFinished(true);

    // Boost verified skills in passport for tested technologies
    if (collegeProfile && collegeProfile.skills) {
      const updatedSkills = updateSkillVerificationAfterInterview(collegeProfile.skills, all);
      saveUserProfile({
        ...collegeProfile,
        skills: updatedSkills,
        updatedAt: new Date().toISOString(),
      });
      refreshProfile();
    }
  };

  const handleRestart = () => {
    setQuestionIndex(0);
    setTranscript('');
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setCurrentAnalysis(null);
    setSessionResponses([]);
    setIsSessionFinished(false);
    setFinalSessionRecord(null);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <DashboardLayout activeRole="college">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Voice & Technical Defense Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              AI Interview Arena & Communication Coach
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Live browser voice recording, pacing analysis (WPM), filler word auditing, and STAR answer structuring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setQuestionIndex(0);
                setCurrentAnalysis(null);
                setTranscript('');
              }}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
            >
              {JOB_ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FINISHED SESSION REVIEW SCREEN */}
        {isSessionFinished && finalSessionRecord ? (
          <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-[#C7F36B]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                    Session Completed
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                  Interview Defense Performance Report
                </h2>
                <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1">
                  Your Skill Passport has been updated with verified interview confidence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-right">
                <span className="text-xs text-[#68716D] dark:text-[#9AA49F] block">Overall Arena Score</span>
                <span className="text-3xl font-mono font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                  {finalSessionRecord.overallScore}%
                </span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Technical Depth</div>
                <div className="text-xl font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                  {finalSessionRecord.technicalScore}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Communication Score</div>
                <div className="text-xl font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                  {finalSessionRecord.communicationScore}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Average Speaking Cadence</div>
                <div className="text-xl font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                  {finalSessionRecord.averageCadenceWPM} WPM
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Total Filler Words</div>
                <div className="text-xl font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-1">
                  {finalSessionRecord.totalFillerWords}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] shadow-xs cursor-pointer"
              >
                Practice Another Interview
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE INTERVIEW QUESTION & ARENA WORKSPACE */
          <div className="space-y-6">
            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
              <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F]">
                    Question {questionIndex + 1} of {roleQuestions.length}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#C7F36B]/20 text-[#101413] dark:text-[#C7F36B] font-semibold">
                    {currentQuestion.type || currentQuestion.category} • {currentQuestion.targetRole}
                  </span>
                </div>

                {/* Live Timer */}
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#68716D] dark:text-[#9AA49F] px-3 py-1 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                  <Clock className="w-3.5 h-3.5 text-[#C7F36B]" />
                  <span>{formatSeconds(timerSeconds)}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="text-xs text-[#68716D] dark:text-[#9AA49F] flex items-center gap-1.5 bg-[#F6F7F2] dark:bg-[#0D1110] p-3 rounded-xl border border-[#DDE2DC] dark:border-[#29312D]">
                <Sparkles className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                <span>
                  <strong>Coach Tip:</strong> {currentQuestion.coachTip || 'Structure your answer clearly with context, action, and verifiable outcomes.'}
                </span>
              </div>
            </div>

            {/* Answer Input & Voice Transcription Workspace */}
            <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-4">
              <div className="flex items-center justify-between border-b border-[#DDE2DC] dark:border-[#29312D] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                  Your Verbal or Written Defense
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#F4F7F2] border border-[#DDE2DC] dark:border-[#29312D]'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#C7F36B]" />}
                    <span>{isRecording ? 'Stop Recording' : 'Start Voice Input'}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  handleStartTyping();
                }}
                placeholder="Speak using the microphone button or type your technical response here. Structure using the STAR method..."
                className="w-full p-4 text-sm rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B] leading-relaxed"
              />

              {/* Submit / Analyze Button */}
              {!currentAnalysis && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!transcript.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Answer for Analysis
                  </button>
                </div>
              )}
            </div>

            {/* LIVE FEEDBACK CARD (Communication Coach Signals) */}
            {currentAnalysis && (
              <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#101413] dark:border-[#C7F36B] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                      Communication Coach Diagnostics
                    </span>
                    <h3 className="text-xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                      Response Score: {currentAnalysis.overallScore}%
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNextQuestion}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                    >
                      <span>{questionIndex < roleQuestions.length - 1 ? 'Next Question' : 'Complete Interview Session'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Score Breakdown Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3.5 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                    <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F] block">Technical Accuracy</span>
                    <span className="text-lg font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                      {currentAnalysis.technicalScore}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                    <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F] block">Speaking Cadence</span>
                    <span className="text-lg font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                      {currentAnalysis.cadenceWPM} WPM
                    </span>
                    <span className="text-[10px] text-[#68716D] dark:text-[#9AA49F] block mt-0.5">
                      {currentAnalysis.cadenceAssessment}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                    <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F] block">Filler Words</span>
                    <span className="text-lg font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                      {currentAnalysis.fillerWordsCount}
                    </span>
                    <span className="text-[10px] text-[#68716D] dark:text-[#9AA49F] block mt-0.5">
                      {currentAnalysis.fillerWords?.slice(0, 2)?.join(', ') || 'Clean flow'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                    <span className="text-[11px] text-[#68716D] dark:text-[#9AA49F] block">STAR Structure</span>
                    <span className="text-lg font-bold font-mono text-[#101413] dark:text-[#F4F7F2] mt-0.5">
                      {currentAnalysis.structureScore}%
                    </span>
                  </div>
                </div>

                {/* Observable Confidence Signals */}
                <div className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] space-y-2">
                  <span className="text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] block">
                    Observable Confidence Signals:
                  </span>
                  <div className="space-y-1.5 text-xs text-[#101413] dark:text-[#F4F7F2]">
                    {currentAnalysis.confidenceSignals.map((sig, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B] shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Coaching Suggestions */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-[#68716D] dark:text-[#9AA49F] block">
                    Coaching Feedback & Areas for Improvement:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#101413] dark:text-[#F4F7F2]">
                    {currentAnalysis.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#101413] dark:bg-[#C7F36B] shrink-0 mt-1.5" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
