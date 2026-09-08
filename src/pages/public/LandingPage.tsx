import React from 'react';
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
  AlertCircle,
  FileCheck,
  Layers,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const journeySteps = [
    { name: 'DISCOVER', desc: 'Identify natural aptitude and real interests' },
    { name: 'DECIDE', desc: 'Select careers and colleges with transparent fit' },
    { name: 'DEVELOP', desc: 'Target critical skill gaps with modular learning' },
    { name: 'VERIFY', desc: 'Attach project evidence and pass diagnostics' },
    { name: 'PREPARE', desc: 'Simulate high-pressure AI technical interviews' },
    { name: 'PROVE', desc: 'Graduate with an untamperable Skill Passport' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0D1110] text-[#101413] dark:text-[#F4F7F2] transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#DDE2DC] dark:border-[#29312D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF1EB] dark:bg-[#1B211E] border border-[#DDE2DC] dark:border-[#29312D] text-xs font-semibold text-[#68716D] dark:text-[#9AA49F]">
              <Sparkles className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Your next step, backed by intelligence.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#101413] dark:text-[#F4F7F2] leading-[1.1]">
              Your career shouldn't be a guess.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#68716D] dark:text-[#9AA49F] max-w-2xl mx-auto font-normal leading-relaxed">
              NEXSTEP helps students discover the right direction, build the right skills, and prove they're ready for what's next. From choosing the right career to proving you're ready for it — one AI platform.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/auth/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] shadow-xs transition-colors"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] transition-colors"
              >
                Explore How It Works
              </Link>
            </div>

            {/* Core Philosophy Banner */}
            <div className="pt-10">
              <div className="inline-block px-5 py-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D] shadow-xs">
                <span className="text-xs uppercase tracking-widest text-[#68716D] dark:text-[#9AA49F] font-semibold">
                  Core NEXSTEP Philosophy:
                </span>{' '}
                <strong className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] tracking-wide ml-1">
                  Claimed Skill ≠ Verified Skill
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Sequence Tracker */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {journeySteps.map((step, idx) => (
              <div
                key={step.name}
                className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-[#68716D] dark:text-[#9AA49F] font-mono mb-2">
                  <span>0{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B]" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold tracking-wider text-[#101413] dark:text-[#F4F7F2]">
                    {step.name}
                  </h2>
                  <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: The Problem */}
      <section className="py-20 border-b border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-[#68716D] dark:text-[#9AA49F]">
              The Crisis in Education & Hiring
            </span>
            <h2 className="text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-2">
              Career choices based on rumor. Skills claimed on paper.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110]">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold mb-4">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                Blind Stream Selection
              </h3>
              <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                School students pick high school streams and college majors based on family pressure or peer gossip, without ever diagnosing their cognitive aptitude or subject compatibility.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110]">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                Unverified Resumes
              </h3>
              <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                College students paste 20 keywords onto a PDF resume. Recruiters cannot tell who wrote real firmware or algorithms versus who simply skimmed a tutorial.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110]">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2]">
                The Interview Blindspot
              </h3>
              <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                Students freeze in technical interviews due to unmeasured verbal pacing, filler words, and lack of structured communication frameworks (STAR method).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: The NEXSTEP Solution */}
      <section className="py-20 border-b border-[#DDE2DC] dark:border-[#29312D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-[#68716D] dark:text-[#9AA49F]">
              The Integrated Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-2">
              From Profile to Proof — The NEXSTEP Closed Loop
            </h2>
            <p className="text-base text-[#68716D] dark:text-[#9AA49F] mt-3">
              One unified architecture that continuously measures, diagnoses gaps, prescribes training, and verifies capability.
            </p>
          </div>

          <div className="mt-12 p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
              {[
                { label: 'Profile', desc: 'Academics & Claims' },
                { label: 'Recommendation', desc: 'Explainable Fit' },
                { label: 'Evidence', desc: 'GitHub & Demos' },
                { label: 'Skill Gap', desc: 'Critical Deficits' },
                { label: 'Training', desc: 'Modular Tasks' },
                { label: 'AI Interview', desc: 'Voice Defense' },
                { label: 'Verification', desc: 'Confidence Score' },
                { label: 'Progress', desc: 'Real Growth' },
              ].map((item, idx) => (
                <div key={item.label} className="p-3 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D]">
                  <div className="text-xs font-mono text-[#68716D] dark:text-[#9AA49F] mb-1">0{idx + 1}</div>
                  <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2]">{item.label}</div>
                  <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F] mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: School vs College Track Comparison */}
      <section className="py-20 border-b border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* School Track Card */}
            <div className="p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-bold text-[#101413] dark:text-[#F4F7F2] border border-[#DDE2DC] dark:border-[#29312D]">
                  <Compass className="w-3.5 h-3.5 text-[#C7F36B]" />
                  For School Students (Class 10 & 12)
                </div>
                <h3 className="text-2xl font-bold text-[#101413] dark:text-[#F4F7F2] mt-4">
                  Discover Direction with Zero Guesswork
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2">
                  Systematic career exploration that connects subject-wise marks, aptitude diagnostics, and interests into deterministic fit scores.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    'Calculated Academic Fit, Interest Fit, and Aptitude Alignment',
                    'Factual College Intelligence with transparent departmental strengths',
                    'Side-by-side multi-college comparison matrix',
                    'Visual step-by-step academic roadmap to target careers',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#101413] dark:text-[#F4F7F2]">
                      <CheckCircle2 className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#DDE2DC] dark:border-[#29312D]">
                <Link
                  to="/onboarding/school"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#101413] text-[#F4F7F2] dark:bg-[#F4F7F2] dark:text-[#101413] hover:opacity-90 transition-opacity"
                >
                  Start School Onboarding
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* College Track Card */}
            <div className="p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF1EB] dark:bg-[#1B211E] text-xs font-bold text-[#101413] dark:text-[#F4F7F2] border border-[#DDE2DC] dark:border-[#29312D]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#C7F36B]" />
                  For College Students & Grads
                </div>
                <h3 className="text-2xl font-bold text-[#101413] dark:text-[#F4F7F2] mt-4">
                  Prove You're Ready with Verifiable Evidence
                </h3>
                <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2">
                  Target industry roles, analyze critical skill deficits, practice live technical interview questions, and build an untamperable Skill Passport.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    'Career Explorer matching skills against real job requirements',
                    'Automated Skill Gap Analysis with concrete practice tasks',
                    'Voice-enabled AI Interview Arena with speech recognition',
                    'Communication Coach tracking cadence, filler words, and structure',
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-[#101413] dark:text-[#F4F7F2]">
                      <CheckCircle2 className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#DDE2DC] dark:border-[#29312D]">
                <Link
                  to="/onboarding/college"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#101413] text-[#F4F7F2] dark:bg-[#F4F7F2] dark:text-[#101413] hover:opacity-90 transition-opacity"
                >
                  Start College Onboarding
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: College Intelligence Preview */}
      <section className="py-20 border-b border-[#DDE2DC] dark:border-[#29312D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-bold text-[#68716D] dark:text-[#9AA49F]">
              Factual Guidance
            </span>
            <h2 className="text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-2">
              College Intelligence with Reference Integrity
            </h2>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2">
              No fabricated placement statistics or fake rankings. We present structured reference data curated from public institutional records, labeled clearly with personalized fit scores.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <Building2 className="w-6 h-6 text-[#C7F36B] mb-3" />
              <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                7-Dimensional Compatibility
              </h3>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-relaxed">
                Evaluates academic fit, course match, admission likelihood, budget parameters, and location preference.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <Target className="w-6 h-6 text-[#C7F36B] mb-3" />
              <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                Departmental Strengths
              </h3>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-relaxed">
                Highlights lab facilities, industrial research partnerships, and student technical competition societies.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
              <FileCheck className="w-6 h-6 text-[#C7F36B] mb-3" />
              <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                Actionable Next Steps
              </h3>
              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5 leading-relaxed">
                Provides explicit checklists: "Things to Consider" and "What to do before joining" for each institution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: Skill Passport & AI Interview Arena */}
      <section className="py-20 border-b border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Skill Passport */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#68716D] dark:text-[#9AA49F]">
                Proof Over Paper
              </span>
              <h2 className="text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
                The NEXSTEP Skill Passport
              </h2>
              <p className="text-sm text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
                Anyone can write "Expert in Embedded C" on LinkedIn. NEXSTEP calculates a transparent Verification Confidence score based strictly on:
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  { label: 'Claimed Level Baseline', val: '20-30%' },
                  { label: 'Documented Project Evidence (GitHub / Demos)', val: '+35%' },
                  { label: 'Diagnostic Assessment Performance', val: '+20%' },
                  { label: 'Verbal AI Interview Defense', val: '+15%' },
                ].map((crit, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110]">
                    <span className="text-sm font-medium text-[#101413] dark:text-[#F4F7F2]">{crit.label}</span>
                    <span className="text-xs font-mono font-bold text-[#68716D] dark:text-[#9AA49F]">{crit.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Interview Arena */}
            <div className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[#C7F36B]" />
                  <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                    AI Interview Arena & Communication Coach
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Voice Enabled
                </span>
              </div>

              <p className="text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
                Practice technical, behavioral, and HR questions using real browser speech recognition. Our coach evaluates observable communication signals:
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D]">
                  <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Pacing & Cadence</div>
                  <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">130–160 WPM Target</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D]">
                  <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Filler Word Detection</div>
                  <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">um, like, basically</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D]">
                  <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Structure Score</div>
                  <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">STAR Framework</div>
                </div>
                <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D]">
                  <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">Technical Overlap</div>
                  <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">Key Point Check</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Real Progress History */}
      <section className="py-20 border-b border-[#DDE2DC] dark:border-[#29312D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs uppercase tracking-widest font-bold text-[#68716D] dark:text-[#9AA49F]">
            Data Integrity
          </span>
          <h2 className="text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-2">
            No Invented Graphs. Real Progress Recorded Locally.
          </h2>
          <p className="text-base text-[#68716D] dark:text-[#9AA49F] mt-3">
            Every metric on NEXSTEP is backed by real assessments you completed, interviews you practiced, and code repositories you verified. Your data stays securely stored in your browser with full JSON export capability.
          </p>
        </div>
      </section>

      {/* SECTION 9: Final CTA */}
      <section className="py-20 md:py-28 bg-[#FFFFFF] dark:bg-[#151A18]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block">
            <TrueFocus sentence="NEX STEP" animationDuration={0.4} className="text-2xl" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#101413] dark:text-[#F4F7F2] leading-tight">
            Don't choose blindly.<br />
            Don't claim blindly.<br />
            Take your next step with evidence.
          </h2>

          <p className="text-base text-[#68716D] dark:text-[#9AA49F] max-w-xl mx-auto">
            Experience the full career intelligence engine. Complete assessments, practice in the AI interview arena, and verify your skills today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] shadow-xs transition-colors"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base border border-[#DDE2DC] dark:border-[#29312D] text-[#101413] dark:text-[#F4F7F2] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E] transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-center text-xs text-[#68716D] dark:text-[#9AA49F]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} NEXSTEP. Your next step, backed by intelligence. Running locally in browser.</p>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-[#101413] dark:hover:text-[#F4F7F2]">How It Works</Link>
            <Link to="/auth/login" className="hover:text-[#101413] dark:hover:text-[#F4F7F2]">Sign In</Link>
            <Link to="/settings" className="hover:text-[#101413] dark:hover:text-[#F4F7F2]">Local Storage Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
