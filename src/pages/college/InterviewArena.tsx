import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useProfile } from '../../context/ProfileContext';
import { Mic, Square, Loader2, FileAudio, Play } from 'lucide-react';

export default function InterviewArena() {
  const { profile } = useProfile();
  const [isRecording, setIsRecording] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const questions = [
    "Explain the difference between a microcontroller and a microprocessor, and when you would choose one over the other.",
    "Can you describe a challenging bug you encountered in a recent C++ project and how you solved it?",
    "How does I2C differ from SPI in embedded communications?"
  ];

  const handleStart = () => setHasStarted(true);
  
  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      // Simulate AI analysis delay
      setTimeout(() => {
        setIsAnalyzing(false);
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(prev => prev + 1);
        } else {
          // Finish
        }
      }, 2000);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <DashboardLayout type="college">
      <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
        <header className="shrink-0">
          <h1 className="text-3xl font-bold">AI Interview Arena</h1>
          <p className="text-text-muted mt-2">Target Role: {profile?.targetJob || 'Software Engineer'}</p>
        </header>

        <div className="flex-1 bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {!hasStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-surface-secondary rounded-full flex items-center justify-center mb-6">
                <FileAudio className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready for your interview?</h2>
              <p className="text-text-muted max-w-md mb-8">
                This is a simulated technical interview for {profile?.targetJob}. 
                We will ask you questions based on your stated skills. Please enable your microphone.
              </p>
              <button 
                onClick={handleStart}
                className="px-8 py-4 bg-accent text-background font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Interview
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="border-b border-border p-4 bg-surface-secondary flex justify-between items-center shrink-0">
                <div className="text-sm font-medium">Question {questionIndex + 1} of {questions.length}</div>
                <div className="text-sm font-medium text-text-muted">01:32</div>
              </div>
              
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
                <h3 className="text-2xl font-semibold leading-relaxed mb-12">
                  "{questions[questionIndex]}"
                </h3>
                
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    <span className="text-text-muted font-medium animate-pulse">Analyzing response...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleRecordToggle}
                    className={`group relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                        : 'bg-surface-secondary border-2 border-border hover:border-accent'
                    }`}
                  >
                    {isRecording && (
                      <span className="absolute inset-0 rounded-full border-[3px] border-red-500 animate-[ping_1.5s_ease-in-out_infinite] opacity-20"></span>
                    )}
                    {isRecording ? (
                      <Square className="w-8 h-8 text-white fill-current" />
                    ) : (
                      <Mic className="w-8 h-8 text-text group-hover:text-accent transition-colors" />
                    )}
                  </button>
                )}
                
                <p className="mt-6 text-sm font-medium text-text-muted">
                  {isAnalyzing ? '' : isRecording ? 'Listening... Tap square to finish' : 'Tap microphone to start answering'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}