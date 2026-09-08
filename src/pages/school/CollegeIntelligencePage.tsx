import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { calculateCollegeFit } from '../../services/intelligence/recommendations';
import { SchoolProfile } from '../../types';
import { COLLEGES_DATA } from '../../data/colleges';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Scale,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const CollegeIntelligencePage: React.FC = () => {
  const { profile } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [comparisonList, setComparisonList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexstep_comparison_colleges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const collegesWithFit = COLLEGES_DATA.map((college) => {
    const fit = calculateCollegeFit(college, schoolProfile);
    return { college, fit };
  }).sort((a, b) => b.fit.overallFit - a.fit.overallFit);

  const toggleCompare = (collegeId: string) => {
    let updated: string[];
    if (comparisonList.includes(collegeId)) {
      updated = comparisonList.filter(id => id !== collegeId);
    } else {
      if (comparisonList.length >= 3) {
        alert('You can compare up to 3 colleges at once.');
        return;
      }
      updated = [...comparisonList, collegeId];
    }
    setComparisonList(updated);
    localStorage.setItem('nexstep_comparison_colleges', JSON.stringify(updated));
  };

  const filteredColleges = collegesWithFit.filter(({ college }) => {
    const matchesSearch =
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.coursesOffered.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      college.strongDepartments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || college.type === selectedType;
    const matchesLocation = selectedLocation === 'All' || college.state === selectedLocation;

    return matchesSearch && matchesType && matchesLocation;
  });

  const locations = ['All', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Delhi'];

  return (
    <DashboardLayout activeRole="school">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              College Intelligence Directory
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Factual, structured institutional intelligence with multi-dimensional compatibility fit.
            </p>
          </div>

          {comparisonList.length > 0 && (
            <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D]">
              <span className="text-xs font-semibold text-[#101413] dark:text-[#F4F7F2]">
                {comparisonList.length} Selected to Compare
              </span>
              <button
                onClick={() => navigate('/dashboard/school/compare')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C7F36B] text-[#101413] hover:bg-[#b5e458] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Scale className="w-3.5 h-3.5" />
                Compare Now
              </button>
            </div>
          )}
        </div>

        {/* Reference Data Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#151A18] border border-[#DDE2DC] dark:border-[#29312D] flex items-start gap-2.5 text-xs text-[#68716D] dark:text-[#9AA49F] leading-relaxed">
          <Info className="w-4 h-4 text-[#C7F36B] shrink-0 mt-0.5" />
          <span>
            <strong>Reference Integrity Notice:</strong> Institutional metrics, tuition bands, and placement summaries are curated from public NIRF filings and published institutional records for reference purposes.
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68716D] dark:text-[#9AA49F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name, course, state, or strong department..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2] placeholder-[#68716D]/50 focus:outline-hidden focus:border-[#101413] dark:focus:border-[#C7F36B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
            >
              <option value="All">All Types</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Autonomous">Autonomous</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc === 'All' ? 'All States' : loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map(({ college, fit }) => {
            const isComparing = comparisonList.includes(college.id);
            return (
              <div
                key={college.id}
                className="p-6 rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F]">
                      {college.type} • Est. {college.established}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#C7F36B] text-[#101413]">
                      {fit.overallFit}% Fit
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#101413] dark:text-[#F4F7F2] leading-snug">
                    {college.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#68716D] dark:text-[#9AA49F] mt-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{college.city}, {college.state}</span>
                  </div>

                  {/* 7-Fit Metrics Mini-Pills */}
                  <div className="grid grid-cols-3 gap-1.5 mt-4 p-2.5 rounded-xl bg-[#F6F7F2] dark:bg-[#0D1110] border border-[#DDE2DC] dark:border-[#29312D] text-center text-[10px]">
                    <div>
                      <span className="text-[#68716D] dark:text-[#9AA49F] block">Academic</span>
                      <span className="font-bold text-[#101413] dark:text-[#F4F7F2]">{fit.academicCompatibility}%</span>
                    </div>
                    <div>
                      <span className="text-[#68716D] dark:text-[#9AA49F] block">Admission</span>
                      <span className="font-bold text-[#101413] dark:text-[#F4F7F2]">{fit.admissionCompatibility}%</span>
                    </div>
                    <div>
                      <span className="text-[#68716D] dark:text-[#9AA49F] block">Budget</span>
                      <span className="font-bold text-[#101413] dark:text-[#F4F7F2]">{fit.budgetCompatibility}%</span>
                    </div>
                  </div>

                  {/* Departments & Key Strengths */}
                  <div className="mt-4 space-y-2">
                    <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                      <strong>Strong Departments:</strong> {college.strongDepartments?.slice(0, 3).join(', ') || 'N/A'}
                    </div>
                    <div className="text-xs text-[#68716D] dark:text-[#9AA49F]">
                      <strong>Tuition:</strong> {college.annualFees}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="mt-6 pt-4 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCompare(college.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      isComparing
                        ? 'bg-[#101413] text-[#F4F7F2] dark:bg-[#C7F36B] dark:text-[#101413] border-transparent'
                        : 'border-[#DDE2DC] dark:border-[#29312D] text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413]'
                    }`}
                  >
                    {isComparing ? '✓ Comparing' : '+ Compare'}
                  </button>

                  <Link
                    to={`/dashboard/school/colleges/${college.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#101413] dark:text-[#C7F36B] hover:underline"
                  >
                    View Intelligence →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};
