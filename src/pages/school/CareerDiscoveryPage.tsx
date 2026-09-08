import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { calculateSchoolCareerFit } from '../../services/intelligence/recommendations';
import { SchoolProfile, CareerRecommendation } from '../../types';
import {
  Compass,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  Code2,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const CareerDiscoveryPage: React.FC = () => {
  const { profile } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;
  const careerFits = calculateSchoolCareerFit(schoolProfile);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>((careerFits && careerFits.length > 0 ? careerFits[0] : null) || null);

  const categories = ['All', 'Hardware & Embedded', 'Software & AI', 'Robotics & Automation', 'Design & Physical', 'Science & Healthcare'];

  const filtered = careerFits.filter((fit) => {
    const matchesSearch = fit.career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fit.career.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fit.career.coreSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || fit.career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout activeRole="school">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
            Career Discovery Engine
          </h1>
          <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
            Deterministic fit scores calculated across Academic Compatibility, Natural Interests, and Cognitive Aptitude.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68716D] dark:text-[#9AA49F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, skills, or subjects (e.g. Embedded, Python, Physics)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413]'
                    : 'border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#68716D] dark:text-[#9AA49F] hover:bg-[#EEF1EB] dark:hover:bg-[#1B211E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Career Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-sm text-[#68716D]">
                No matching careers found. Try clearing filters.
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedCareer?.career.id === item.career.id;
                return (
                  <button
                    key={item.career.id}
                    onClick={() => setSelectedCareer(item)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#101413] dark:border-[#C7F36B] bg-[#FFFFFF] dark:bg-[#151A18] shadow-xs'
                        : 'border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] hover:border-[#68716D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F]">
                        {item.career.category}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C7F36B] text-[#101413]">
                        {item.overallFit}% Fit
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">
                      {item.career.name}
                    </h3>
                    <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1 line-clamp-2 leading-relaxed">
                      {item.career.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#68716D] dark:text-[#9AA49F] pt-2 border-t border-[#DDE2DC] dark:border-[#29312D]">
                      <span>Acad: {item.academicFit}%</span>
                      <span>Interest: {item.interestFit}%</span>
                      <span>Apt: {item.aptitudeFit}%</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Career Deep Dive (7 cols) */}
          <div className="lg:col-span-7">
            {selectedCareer ? (
              <div className="p-6 sm:p-8 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F]">
                      {selectedCareer.career.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">Overall Fit Score</span>
                      <span className="text-base font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-[#C7F36B] text-[#101413]">
                        {selectedCareer.overallFit}%
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2] mt-1">
                    {selectedCareer.career.name}
                  </h2>
                  <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-2 leading-relaxed">
                    {selectedCareer.career.description}
                  </p>
                </div>

                {/* Score Breakdown Bar */}
                <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-center">
                  <div>
                    <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">Academic Fit</div>
                    <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">{selectedCareer.academicFit}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">Interest Fit</div>
                    <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">{selectedCareer.interestFit}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">Aptitude Fit</div>
                    <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">{selectedCareer.aptitudeFit}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#68716D] dark:text-[#9AA49F]">Alignment</div>
                    <div className="text-sm font-bold text-[#101413] dark:text-[#F4F7F2] mt-0.5">{selectedCareer.careerAlignment}%</div>
                  </div>
                </div>

                {/* Why this matches you */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-2.5">
                    Why This Matches Your Diagnostic Profile
                  </h3>
                  <div className="space-y-2">
                    {selectedCareer.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#101413] dark:text-[#F4F7F2] p-2.5 rounded-lg bg-[#F6F7F2] dark:bg-[#0D1110]">
                        <CheckCircle2 className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Prerequisites & Important Subjects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#101413] dark:text-[#F4F7F2] mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#C7F36B]" />
                      <span>Important Subjects</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.career.importantSubjects.map(s => (
                        <span key={s} className="text-xs px-2 py-1 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#F4F7F2] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#DDE2DC] dark:border-[#29312D]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#101413] dark:text-[#F4F7F2] mb-2">
                      <Code2 className="w-3.5 h-3.5 text-[#C7F36B]" />
                      <span>Core Skills to Develop</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCareer.career.coreSkills.map(s => (
                        <span key={s} className="text-xs px-2 py-1 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#101413] dark:text-[#F4F7F2] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Typical Responsibilities */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-2">
                    Typical Day-to-Day Responsibilities
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#101413] dark:text-[#F4F7F2]">
                    {selectedCareer.career.typicalResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#101413] dark:bg-[#C7F36B] shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Projects to Build */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] mb-2">
                    Recommended Hands-on Projects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCareer.career.recommendedProjects.map((proj, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110] text-xs font-medium text-[#101413] dark:text-[#F4F7F2]">
                        {proj}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Relevance */}
                <div className="pt-2 border-t border-[#DDE2DC] dark:border-[#29312D] text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
                  <strong>Industry Landscape:</strong> {selectedCareer.career.industryRelevance}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-sm text-[#68716D]">
                Select a career from the left to view comprehensive fit diagnostics.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
