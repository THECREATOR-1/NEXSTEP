import {
  SchoolProfile,
  CollegeProfile,
  CareerOption,
  CollegeReference,
  CollegeFitScore,
  JobRoleDefinition,
  StudentSkill,
  SkillLevel,
} from '../../types';
import { CAREER_OPTIONS } from '../../data/careers';
import { COLLEGES_DATA } from '../../data/colleges';
import { JOB_ROLES } from '../../data/jobs';
import { getAssessments, getInterviews } from '../storage/localStorage';

// ================= SCHOOL CAREER FIT CALCULATION =================

export interface CareerFitResult {
  career: CareerOption;
  overallFit: number;
  academicFit: number;
  interestFit: number;
  aptitudeFit: number;
  careerAlignment: number;
  matchReasons: string[];
  sufficientData: boolean;
}

export function calculateSchoolCareerFit(profile: SchoolProfile | null): CareerFitResult[] {
  if (!profile || !profile.onboardingCompleted) {
    return CAREER_OPTIONS.map(c => ({
      career: c,
      overallFit: 0,
      academicFit: 0,
      interestFit: 0,
      aptitudeFit: 0,
      careerAlignment: 0,
      matchReasons: ['Not enough data yet. Complete your academic and interest profile to see your calculated fit.'],
      sufficientData: false,
    }));
  }

  const assessments = getAssessments(profile.userId);
  const aptitudeAssessment = assessments.find(a => a.category === 'Aptitude');
  const baseAptitude = aptitudeAssessment ? aptitudeAssessment.percentage : Math.min(95, Math.max(50, profile.overallPercentage || 70));

  return CAREER_OPTIONS.map(career => {
    // 1. Academic Fit (0-100)
    let academicMatchCount = 0;
    const strongLower = (profile.strongestSubjects || []).map(s => s.toLowerCase());
    career.importantSubjects.forEach(subj => {
      if (strongLower.some(s => s.includes(subj.toLowerCase()) || subj.toLowerCase().includes(s))) {
        academicMatchCount += 1;
      }
    });
    const academicRatio = career.importantSubjects.length > 0 ? academicMatchCount / career.importantSubjects.length : 0.5;
    const academicFit = Math.round((academicRatio * 60) + ((profile.overallPercentage || 70) * 0.4));

    // 2. Interest Fit (0-100)
    const userInterestsAndActs = [...(profile.interests || []), ...(profile.activities || [])].map(i => i.toLowerCase());
    let interestHits = 0;
    const targetKeywords = [...career.importantSubjects, ...career.coreSkills, career.category].map(k => k.toLowerCase());
    targetKeywords.forEach(kw => {
      if (userInterestsAndActs.some(ui => kw.includes(ui) || ui.includes(kw))) {
        interestHits += 1;
      }
    });
    const interestFit = Math.min(100, Math.max(25, Math.round((interestHits / Math.max(2, targetKeywords.length * 0.4)) * 100)));

    // 3. Aptitude Fit (0-100)
    const aptitudeFit = baseAptitude;

    // 4. Career Alignment (0-100)
    let careerAlignment = 50;
    const targetLower = (profile.targetCareers || []).map(t => t.toLowerCase());
    if (targetLower.some(t => t.includes(career.name.toLowerCase()) || career.name.toLowerCase().includes(t))) {
      careerAlignment = 95;
    } else if (profile.careerGoalType === 'Exploring') {
      careerAlignment = 70;
    }

    // Weighted Overall Fit
    const overallFit = Math.round(academicFit * 0.35 + interestFit * 0.35 + aptitudeFit * 0.15 + careerAlignment * 0.15);

    // Explainable reasons
    const matchReasons: string[] = [];
    if (academicMatchCount > 0) {
      matchReasons.push(`Strong academic alignment in core subjects: ${career.importantSubjects.filter(subj => strongLower.some(s => s.includes(subj.toLowerCase()))).join(', ')}.`);
    }
    if (interestHits > 0) {
      matchReasons.push(`High affinity with your recorded interests in ${career.category}.`);
    }
    if (careerAlignment > 80) {
      matchReasons.push(`Explicitly matches your selected target direction.`);
    }
    if (matchReasons.length === 0) {
      matchReasons.push(`Broad foundational alignment with secondary subjects and analytical problem solving.`);
    }

    return {
      career,
      overallFit: Math.min(99, Math.max(30, overallFit)),
      academicFit: Math.min(99, academicFit),
      interestFit: Math.min(99, interestFit),
      aptitudeFit: Math.min(99, aptitudeFit),
      careerAlignment: Math.min(99, careerAlignment),
      matchReasons,
      sufficientData: true,
    };
  }).sort((a, b) => b.overallFit - a.overallFit);
}

// ================= COLLEGE INTELLIGENCE FIT CALCULATION =================

export function calculateCollegeFit(college: CollegeReference, profile: SchoolProfile | null): CollegeFitScore {
  if (!profile || !profile.onboardingCompleted) {
    return {
      collegeId: college.id,
      overallFit: 0,
      academicFit: 0,
      courseFit: 0,
      interestFit: 0,
      admissionFit: 0,
      budgetFit: 0,
      locationFit: 0,
      reasonsToMatch: ['Not enough profile data yet to calculate personalized fit.'],
      thingsToConsider: ['Explore official institute guidelines and eligibility requirements.'],
      whatToDoBeforeJoining: ['Take fundamental aptitude and stream diagnostics on NEXSTEP.'],
    };
  }

  // 1. Academic Fit
  const acadPercent = profile.overallPercentage || 70;
  const academicFit = Math.min(98, Math.round(acadPercent * 1.05));

  // 2. Course Fit
  let courseFit = 70;
  const targetLower = (profile.targetCareers || []).join(' ').toLowerCase();
  const hasMatchingCourse = college.courses.some(c =>
    targetLower.includes(c.department.toLowerCase()) ||
    c.name.toLowerCase().includes('computer') ||
    c.name.toLowerCase().includes('electronics')
  );
  if (hasMatchingCourse) courseFit = 92;

  // 3. Interest Fit
  const interestFit = 85;

  // 4. Admission Fit based on percentage
  let admissionFit = 75;
  if (college.type === 'Government' && acadPercent >= 85) admissionFit = 88;
  else if (college.type === 'Government' && acadPercent < 75) admissionFit = 60;
  else if (college.type === 'Private') admissionFit = 85;

  // 5. Budget Fit
  let budgetFit = 80;
  if (profile.budgetRange && profile.budgetRange.includes('Under 2 Lakhs') && college.type === 'Government') {
    budgetFit = 95;
  } else if (profile.budgetRange && profile.budgetRange.includes('Under 2 Lakhs') && college.type === 'Private') {
    budgetFit = 55;
  }

  // 6. Location Fit
  let locationFit = 75;
  if (profile.preferredLocations && profile.preferredLocations.some(loc => college.location.toLowerCase().includes(loc.toLowerCase()) || college.state.toLowerCase().includes(loc.toLowerCase()))) {
    locationFit = 95;
  }

  const overallFit = Math.round(academicFit * 0.25 + courseFit * 0.25 + admissionFit * 0.2 + budgetFit * 0.15 + locationFit * 0.15);

  const reasonsToMatch: string[] = [];
  if (college.strongDepartments && college.strongDepartments.length > 0) {
    reasonsToMatch.push(`Strong departmental presence in ${college.strongDepartments.slice(0, 2).join(' and ')}.`);
  }
  if (academicFit >= 80) reasonsToMatch.push(`Your academic marks (${profile.overallPercentage}%) meet strong competitive ranges for related programs.`);
  if (locationFit >= 90) reasonsToMatch.push(`Located in your preferred geographical zone (${college.location}).`);
  if (college.keyStrengths.length > 0) reasonsToMatch.push(college.keyStrengths[0]);

  const thingsToConsider: string[] = [
    `Annual tuition ranges roughly ${(college.courses && college.courses.length > 0 && college.courses[0]) ? college.courses[0].annualFeesApprox : 'per reference data'} based on current reference dataset.`,
    college.type === 'Government'
      ? 'Admission requires national competitive entrance exams (e.g. JEE Main/Advanced).'
      : 'Review scholarship criteria and category-based tuition brackets.',
  ];

  const whatToDoBeforeJoining: string[] = [
    'Review the first-year mathematics and programming syllabus.',
    'Build a foundational microcontroller or software project to showcase during club interviews.',
    'Connect with current student seniors via alumni networks to understand campus culture.',
  ];

  return {
    collegeId: college.id,
    overallFit: Math.min(99, Math.max(40, overallFit)),
    academicFit,
    academicCompatibility: academicFit,
    courseFit,
    courseCompatibility: courseFit,
    interestFit,
    interestCompatibility: interestFit,
    admissionFit,
    admissionCompatibility: admissionFit,
    budgetFit,
    budgetCompatibility: budgetFit,
    locationFit,
    locationCompatibility: locationFit,
    reasonsToMatch,
    matchReasons: reasonsToMatch,
    thingsToConsider,
    whatToDoBeforeJoining,
  };
}

// ================= COLLEGE CAREER READINESS & SKILL GAP =================

export interface CollegeReadinessBreakdown {
  overallReadiness: number;
  technicalScore: number;
  projectsScore: number;
  assessmentsScore: number;
  aptitudeScore: number;
  communicationScore: number;
  interviewScore: number;
  targetRoleReadiness?: number;
  averageVerificationConfidence?: number;
  verifiedSkillsCount?: number;
  totalSkillsCount?: number;
  explanation: string[];
  sufficientData: boolean;
}

export function calculateCollegeReadiness(profile: CollegeProfile | null): CollegeReadinessBreakdown {
  if (!profile || !profile.onboardingCompleted) {
    return {
      overallReadiness: 0,
      technicalScore: 0,
      projectsScore: 0,
      assessmentsScore: 0,
      aptitudeScore: 0,
      communicationScore: 0,
      interviewScore: 0,
      targetRoleReadiness: 0,
      averageVerificationConfidence: 0,
      verifiedSkillsCount: 0,
      totalSkillsCount: 0,
      explanation: ['Not enough data yet. Complete your college onboarding and add skills to compute career readiness.'],
      sufficientData: false,
    };
  }

  const assessments = getAssessments(profile.userId);
  const interviews = getInterviews(profile.userId);

  // Technical Score: based on verified skills & levels
  const skills = profile.skills || [];
  let techPoints = 0;
  skills.forEach(s => {
    let base = s.claimedLevel === 'Advanced' ? 30 : s.claimedLevel === 'Intermediate' ? 20 : 10;
    // Add verified confidence bonus
    techPoints += base * (0.5 + (s.verifiedConfidence / 200));
  });
  const technicalScore = Math.min(100, Math.round((techPoints / Math.max(1, 80)) * 100));

  // Projects Score: verified evidence
  const projects = profile.projects || [];
  let projScore = 0;
  projects.forEach(p => {
    projScore += 25;
    if (p.githubUrl) projScore += 10;
    if (p.liveUrl) projScore += 15;
  });
  const projectsScore = Math.min(100, projScore);

  // Assessments Score
  const techOrAptAssessments = assessments.filter(a => a.category === 'Technical Basics' || a.category === 'Aptitude');
  const assessmentsScore = techOrAptAssessments.length > 0
    ? Math.round(techOrAptAssessments.reduce((sum, a) => sum + a.percentage, 0) / techOrAptAssessments.length)
    : 0;

  // Aptitude Score
  const aptOnly = assessments.find(a => a.category === 'Aptitude');
  const aptitudeScore = aptOnly ? aptOnly.percentage : (profile.cgpa ? Math.min(95, Math.round(profile.cgpa * 10)) : 0);

  // Interview & Communication
  const interviewScore = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + i.overallScore, 0) / interviews.length)
    : 0;
  const communicationScore = interviews.length > 0
    ? Math.round(interviews.reduce((sum, i) => sum + i.communicationScore, 0) / interviews.length)
    : 0;

  // Compute weighted overall readiness
  // If no interviews taken yet, redistribute weights so user isn't unfairly zeroed out, but explain clearly
  let overallReadiness = 0;
  const explanation: string[] = [];

  if (interviews.length === 0 && assessments.length === 0) {
    overallReadiness = Math.round(technicalScore * 0.6 + projectsScore * 0.4);
    explanation.push('Initial readiness score based exclusively on claimed skills and documented projects.');
    explanation.push('Take an Assessment and complete an AI Interview to verify your claimed skills and raise readiness.');
  } else if (interviews.length === 0) {
    overallReadiness = Math.round(technicalScore * 0.4 + projectsScore * 0.35 + assessmentsScore * 0.25);
    explanation.push('Readiness incorporates technical skills, project evidence, and completed diagnostic assessments.');
    explanation.push('Practice in the AI Interview Arena to unlock verified communication and interview scores.');
  } else {
    overallReadiness = Math.round(
      technicalScore * 0.25 +
      projectsScore * 0.2 +
      assessmentsScore * 0.2 +
      interviewScore * 0.2 +
      communicationScore * 0.15
    );
    explanation.push('Fully multi-dimensional score incorporating verified skills, project code, written assessments, and verbal interview performance.');
  }

  if (technicalScore >= 75) {
    explanation.push('Strong core technical foundations with verified skill items.');
  } else {
    explanation.push('Technical depth can be strengthened by adding more evidence to your Skill Passport.');
  }

  const verifiedSkillsCount = skills.filter(s => s.verifiedConfidence >= 60).length;
  const totalSkillsCount = skills.length;
  const averageVerificationConfidence = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.verifiedConfidence, 0) / skills.length)
    : 0;

  return {
    overallReadiness: Math.min(100, Math.max(10, overallReadiness)),
    targetRoleReadiness: Math.min(100, Math.max(10, overallReadiness)),
    technicalScore,
    projectsScore,
    assessmentsScore,
    aptitudeScore,
    communicationScore,
    interviewScore,
    averageVerificationConfidence,
    verifiedSkillsCount,
    totalSkillsCount,
    explanation,
    sufficientData: true,
  };
}

// ================= SKILL GAP ANALYSIS =================

export interface SkillGapItem {
  skill: string;
  currentLevel: SkillLevel | 'None';
  targetLevel: SkillLevel;
  status: 'Strong' | 'Improvement' | 'Critical Gap';
  whyItMatters: string;
  recommendedLearning: string;
  practiceTask: string;
  assessmentAvailable: boolean;
}

export interface SkillGapAnalysisResult {
  targetRole: JobRoleDefinition;
  strongSkills: SkillGapItem[];
  improvementAreas: SkillGapItem[];
  criticalGaps: SkillGapItem[];
  overallMatchPercentage: number;
  matchPercentage?: number;
  recommendations?: string[];
}

export function calculateSkillGap(profile: CollegeProfile | null, targetRoleId?: string): SkillGapAnalysisResult | null {
  if (!profile) return null;

  const roleId = targetRoleId || profile.targetRole || 'embedded-systems-engineer';
  const role = JOB_ROLES.find(r => r.id === roleId) || JOB_ROLES[0];

  const userSkillsMap = new Map<string, StudentSkill>();
  (profile.skills || []).forEach(s => userSkillsMap.set(s.name.toLowerCase(), s));

  const allRoleSkills = [
    ...role.requiredSkills.map(s => ({ name: s, required: true })),
    ...role.preferredSkills.map(s => ({ name: s, required: false })),
  ];

  const strongSkills: SkillGapItem[] = [];
  const improvementAreas: SkillGapItem[] = [];
  const criticalGaps: SkillGapItem[] = [];

  let matchedWeight = 0;
  let totalWeight = 0;

  allRoleSkills.forEach(req => {
    const weight = req.required ? 2 : 1;
    totalWeight += weight;

    const existing = userSkillsMap.get(req.name.toLowerCase());

    if (!existing) {
      // Missing completely
      const gapItem: SkillGapItem = {
        skill: req.name,
        currentLevel: 'None',
        targetLevel: req.required ? 'Intermediate' : 'Beginner',
        status: req.required ? 'Critical Gap' : 'Improvement',
        whyItMatters: req.required
          ? `Core mandatory requirement for ${role.title}. Industry recruiters screen for this on day one.`
          : `High-value differentiator that separates top candidates for ${role.title}.`,
        recommendedLearning: `Complete the ${req.name} fundamentals module in the Learning Center and verify in code.`,
        practiceTask: `Build a minimal working demonstration using ${req.name} and publish it with a clear README.`,
        assessmentAvailable: true,
      };

      if (req.required) {
        criticalGaps.push(gapItem);
      } else {
        improvementAreas.push(gapItem);
      }
    } else {
      // User has the skill - check level and verification
      const isHigh = existing.claimedLevel === 'Advanced' || (existing.claimedLevel === 'Intermediate' && existing.verifiedConfidence >= 50);
      matchedWeight += req.required ? (isHigh ? 2 : 1) : (isHigh ? 1 : 0.5);

      if (existing.claimedLevel === 'Beginner' && req.required) {
        improvementAreas.push({
          skill: req.name,
          currentLevel: existing.claimedLevel,
          targetLevel: 'Intermediate',
          status: 'Improvement',
          whyItMatters: `You have beginner familiarity, but ${role.title} requires independent implementation without hand-holding.`,
          recommendedLearning: `Practice advanced concurrency, memory patterns, and optimization with ${req.name}.`,
          practiceTask: `Refactor an existing project to follow production-grade architecture.`,
          assessmentAvailable: true,
        });
      } else {
        strongSkills.push({
          skill: req.name,
          currentLevel: existing.claimedLevel,
          targetLevel: existing.claimedLevel,
          status: 'Strong',
          whyItMatters: `Key asset in your profile directly aligning with ${role.title} responsibilities.`,
          recommendedLearning: `Maintain sharp problem-solving speed and interview question recall.`,
          practiceTask: `Contribute to open source or mentor peers on ${req.name}.`,
          assessmentAvailable: true,
        });
      }
    }
  });

  const overallMatchPercentage = totalWeight > 0 ? Math.min(100, Math.round((matchedWeight / totalWeight) * 100)) : 0;

  return {
    targetRole: role,
    strongSkills,
    improvementAreas,
    criticalGaps,
    overallMatchPercentage,
    matchPercentage: overallMatchPercentage,
    recommendations: [
      ...criticalGaps.map(c => `Mandatory requirement: Master ${c.skill} fundamentals and build a project.`),
      ...improvementAreas.map(i => `Upgrade ${i.skill} to ${i.targetLevel} level through production practice.`),
      ...strongSkills.slice(0, 2).map(s => `Keep ${s.skill} sharp for live technical interviews.`),
    ],
  };
}

export const analyzeSkillGaps = calculateSkillGap;

// ================= NEXSTEP VERIFICATION CONFIDENCE CALCULATION =================

export function calculateSkillVerificationConfidence(
  skill: StudentSkill,
  assessments: any[],
  interviews: any[]
): { confidence: number; status: StudentSkill['verificationStatus'] } {
  // Claimed skill != verified skill philosophy
  let confidence = 0;

  // 1. Claimed level baseline
  if (skill.claimedLevel === 'Beginner') confidence += 20;
  if (skill.claimedLevel === 'Intermediate') confidence += 25;
  if (skill.claimedLevel === 'Advanced') confidence += 30;

  // 2. Evidence attached (up to +35%)
  const evidenceCount = skill.evidence?.length || 0;
  if (evidenceCount > 0) {
    confidence += Math.min(35, evidenceCount * 18);
  }

  // 3. Assessment performance (+20%)
  const hasAssessment = assessments.some(a =>
    a.feedback?.toLowerCase().includes(skill.name.toLowerCase()) ||
    a.category === 'Technical Basics'
  );
  if (hasAssessment) {
    confidence += 20;
  }

  // 4. Interview performance (+15%)
  const hasInterview = interviews.some(i =>
    i.targetRole?.toLowerCase().includes(skill.name.toLowerCase()) ||
    i.technicalScore >= 65
  );
  if (hasInterview) {
    confidence += 15;
  }

  confidence = Math.min(100, Math.max(15, confidence));

  let status: StudentSkill['verificationStatus'] = 'Unverified';
  if (confidence >= 80) status = 'Fully Verified';
  else if (hasInterview && confidence >= 60) status = 'Interview Verified';
  else if (hasAssessment && confidence >= 50) status = 'Assessment Verified';
  else if (evidenceCount > 0) status = 'Evidence Added';

  return { confidence, status };
}
