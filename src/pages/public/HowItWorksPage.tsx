import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { TrueFocus } from '../../components/brand/TrueFocus';
import {
  Compass,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Target,
  Mic,
  TrendingUp,
  Building2,
  CheckCircle2,
  HelpCircle,
  Code2,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'school' | 'college'>('school');

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] transition-colors">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-bold text-[#68716D] dark:text-[#9AA49F] border border-[#DDE2DC] dark:border-[#29312D]">
            System Architecture & Methodology
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            How NEXSTEP Works
          </h1>
          <p className="text-base sm:text-lg text-[#68716D] dark:text-[#9AA49F] max-w-2xl mx-auto">
            "From choosing the right career to proving you're ready for it — one AI platform."
          </p>
        </div>

        {/* The Core Loop Explained */}
        <div className="mt-14 p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
          <h2 className="text-xl font-bold text-[#101413] dark:text-[#F4F7F2] mb-3">
            The Continuous Intelligence Loop
          </h2>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] leading-relaxed mb-6">
            Unlike static job boards or questionnaire quizzes that give one-off scores, NEXSTEP operates as a continuous closed loop:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: '1. Profile Diagnostic', desc: 'Captures academic performance, subject affinities, claimed skills, and preferences.' },
              { title: '2. Transparent Fit', desc: 'Computes explainable scores: Academic Fit, Interest Fit, and Target Alignment.' },
              { title: '3. Evidence Attribution', desc: 'Requires real artifacts (GitHub repositories, live demos, documented projects).' },
              { title: '4. Skill Gap Targeting', desc: 'Compares your current verified level against real job role requirements.' },
              { title: '5. Modular Learning', desc: 'Generates study notes, technical practice tasks, and flashcard recall.' },
              { title: '6. AI Interview Defense', desc: 'Evaluates your technical depth, observable confidence, and cadence via voice/text.' },
              { title: '7. Verification Confidence', desc: 'Upgrades your Skill Passport from unverified claim to empirical verification.' },
              { title: '8. Real Progress Log', desc: 'Visualizes historical growth using only completed assessments and sessions.' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110]">
                <h3 className="text-xs font-mono font-bold text-[#68716D] dark:text-[#9AA49F]">{s.title}</h3>
                <p className="text-xs text-[#101413] dark:text-[#F4F7F2] mt-1.5 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Track Selector Tabs */}
        <div className="mt-16">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('school')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'school'
                  ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] shadow-xs'
                  : 'border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#68716D] dark:text-[#9AA49F]'
              }`}
            >
              <Compass className="w-4 h-4" />
              School Student Journey
            </button>
            <button
              onClick={() => setActiveTab('college')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'college'
                  ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] shadow-xs'
                  : 'border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#68716D] dark:text-[#9AA49F]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              College Student Journey
            </button>
          </div>

          {/* School Track Details */}
          {activeTab === 'school' && (
            <div className="mt-8 space-y-6">
              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 1: Academic & Cognitive Profiling
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  You enter your current class (10 or 12), board, subject-wise marks, strongest and weakest subjects, and extracurricular activities. We never assume a single percentage tells the full story.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 2: Career Discovery & Calculated Fit
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  Our recommendation engine breaks down every career into Academic Fit (do you enjoy and excel in the required subjects?), Interest Fit (do you like building or analyzing?), and Aptitude (speed and spatial reasoning). You get a transparent rationale for each score.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 3: College Intelligence & Comparison
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  Search structured reference data on institutions (IIT Bombay, BITS Pilani, NIT Trichy, IIIT Hyderabad, DTU, VIT). Compare course departments, fee brackets, and campus labs side-by-side with clear reference disclaimers.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 4: The 7-Stage Visual Roadmap
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  Follow a concrete milestone sequence: Current Class → Stream Selection → Entrance & College → Skill Building → Projects → Internship → Career Launch. Check off real milestones as you advance.
                </p>
              </div>
            </div>
          )}

          {/* College Track Details */}
          {activeTab === 'college' && (
            <div className="mt-8 space-y-6">
              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 1: Skill Inventory & Evidence Binding
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  Add your skills (C, C++, Python, Embedded C, React, SQL, etc.) and your claimed level. Attach real evidence: GitHub repositories, live demo URLs, hackathon certificates, or internship details.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 2: Target Role & Skill Gap Analysis
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  Select your dream role (e.g. Embedded Systems Engineer, Firmware Engineer, Frontend Developer, AI/ML Engineer). NEXSTEP benchmarks your verified skills against industry requirements and categorizes them into Strong Skills, Improvement Areas, and Critical Gaps.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 3: AI Interview Arena & Speech Recognition
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  Put your skills to the test in a live simulated technical or behavioral interview. Use microphone voice input or text. Our Communication Coach provides immediate feedback on filler words, speaking cadence (WPM), answer structure (STAR method), and technical accuracy.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
                <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                  Step 4: The Verified Skill Passport
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                  As you attach evidence, pass diagnostic assessments, and defend code in interviews, your NEXSTEP Verification Confidence grows. Recruiters see verified proof rather than unsubstantiated claims.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] shadow-xs transition-colors"
          >
            Start Your Journey Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
