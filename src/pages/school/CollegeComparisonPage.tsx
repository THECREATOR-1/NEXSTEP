import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { COLLEGES_DATA } from '../../data/colleges';
import { calculateCollegeFit } from '../../services/intelligence/recommendations';
import { SchoolProfile } from '../../types';
import {
  Scale,
  ArrowLeft,
  X,
  Plus,
  Building2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  GraduationCap,
} from 'lucide-react';

export const CollegeComparisonPage: React.FC = () => {
  const { profile } = useAuth();
  const schoolProfile = profile as SchoolProfile | null;

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexstep_comparison_colleges');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['iit-bombay', 'bits-pilani']; // Default two colleges
  });

  useEffect(() => {
    localStorage.setItem('nexstep_comparison_colleges', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const removeCollege = (id: string) => {
    setSelectedIds(prev => prev.filter(cId => cId !== id));
  };

  const addCollege = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 3) return;
    setSelectedIds(prev => [...prev, id]);
  };

  const comparedColleges = selectedIds
    .map(id => COLLEGES_DATA.find(c => c.id === id))
    .filter(Boolean) as typeof COLLEGES_DATA;

  return (
    <DashboardLayout activeRole="school">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDE2DC] dark:border-[#29312D] pb-6">
          <div>
            <Link
              to="/dashboard/school/colleges"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#68716D] dark:text-[#9AA49F] hover:text-[#101413] dark:hover:text-[#F4F7F2] mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101413] dark:text-[#F4F7F2]">
              Side-by-Side College Comparison
            </h1>
            <p className="text-sm text-[#68716D] dark:text-[#9AA49F] mt-1">
              Compare 2 to 3 institutions across compatibility fit, fee structures, labs, and career pathways.
            </p>
          </div>

          {/* Quick Add Dropdown */}
          {selectedIds.length < 3 && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addCollege(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] text-[#101413] dark:text-[#F4F7F2]"
              >
                <option value="" disabled>+ Add college to compare...</option>
                {COLLEGES_DATA.filter(c => !selectedIds.includes(c.id)).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {comparedColleges.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18]">
            <Scale className="w-10 h-10 text-[#68716D] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2]">No colleges selected for comparison</h3>
            <p className="text-xs text-[#68716D] dark:text-[#9AA49F] mt-1">
              Choose up to 3 colleges from the dropdown or the College Intelligence Directory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[720px] rounded-2xl border border-[#DDE2DC] dark:border-[#29312D] bg-[#FFFFFF] dark:bg-[#151A18] overflow-hidden">
              {/* College Header Row */}
              <div className={`grid grid-cols-${comparedColleges.length + 1} border-b border-[#DDE2DC] dark:border-[#29312D] bg-[#F6F7F2] dark:bg-[#0D1110]`}>
                <div className="p-4 font-bold text-xs uppercase tracking-wider text-[#68716D] dark:text-[#9AA49F] flex items-center">
                  Institution
                </div>
                {comparedColleges.map((col) => {
                  const fit = calculateCollegeFit(col, schoolProfile);
                  return (
                    <div key={col.id} className="p-4 border-l border-[#DDE2DC] dark:border-[#29312D] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#EEF1EB] dark:bg-[#1B211E] text-[#68716D] dark:text-[#9AA49F] font-semibold">
                            {col.type}
                          </span>
                          <button
                            onClick={() => removeCollege(col.id)}
                            className="p-1 text-[#68716D] hover:text-red-500 transition-colors"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="text-base font-bold text-[#101413] dark:text-[#F4F7F2] mt-2">
                          {col.name}
                        </h3>
                        <div className="text-xs text-[#68716D] dark:text-[#9AA49F] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{col.city}, {col.state}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#DDE2DC] dark:border-[#29312D] flex items-center justify-between">
                        <span className="text-xs text-[#68716D] dark:text-[#9AA49F]">Personalized Fit</span>
                        <span className="text-sm font-mono font-bold px-2 py-0.5 rounded bg-[#C7F36B] text-[#101413]">
                          {fit.overallFit}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Data Rows */}
              {[
                {
                  label: 'Tuition Fees',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.annualFees,
                },
                {
                  label: 'Hostel Fees & Boarding',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.hostelFees,
                },
                {
                  label: 'Admission Criteria',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.entranceExams?.join(', ') || 'N/A',
                },
                {
                  label: 'Cutoff Guidance',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.cutoffTrends,
                },
                {
                  label: 'Strong Departments',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.strongDepartments?.join(', ') || 'N/A',
                },
                {
                  label: 'Labs & Research Facilities',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.labsAndFacilities?.join(', ') || 'N/A',
                },
                {
                  label: 'Industry Exposure & Ties',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.industryExposure,
                },
                {
                  label: 'Placement Landscape',
                  getValue: (c: typeof COLLEGES_DATA[0]) => c.placementHighlights,
                },
              ].map((row, idx) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-${comparedColleges.length + 1} border-b border-[#DDE2DC] dark:border-[#29312D] ${
                    idx % 2 === 0 ? 'bg-[#FFFFFF] dark:bg-[#151A18]' : 'bg-[#F6F7F2]/40 dark:bg-[#0D1110]/40'
                  }`}
                >
                  <div className="p-4 text-xs font-bold text-[#68716D] dark:text-[#9AA49F]">
                    {row.label}
                  </div>
                  {comparedColleges.map((col) => (
                    <div key={col.id} className="p-4 border-l border-[#DDE2DC] dark:border-[#29312D] text-xs text-[#101413] dark:text-[#F4F7F2] leading-relaxed">
                      {row.getValue(col)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Considerations & Strengths */}
              <div className={`grid grid-cols-${comparedColleges.length + 1} bg-[#FFFFFF] dark:bg-[#151A18]`}>
                <div className="p-4 text-xs font-bold text-[#68716D] dark:text-[#9AA49F]">
                  Key Considerations
                </div>
                {comparedColleges.map((col) => (
                  <div key={col.id} className="p-4 border-l border-[#DDE2DC] dark:border-[#29312D] text-xs text-[#68716D] dark:text-[#9AA49F] space-y-1.5">
                    {(col.thingsToConsider || []).map((t, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <span className="leading-snug">{t}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
