export type UserRole = 'school' | 'college' | null;

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Stored locally for prototype authentication
  role: UserRole;
  accountType?: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectMark {
  subject: string;
  marks: number;
  maxMarks: number;
}

export interface SchoolProfile {
  userId: string;
  accountType?: UserRole;
  currentClass: '10' | '12' | 'Other';
  grade?: string; // alias for class/grade
  board: string;
  subjectMarks: SubjectMark[];
  overallPercentage: number;
  strongestSubjects: string[];
  weakestSubjects: string[];
  completionYear: number;
  stream?: 'Science (PCM)' | 'Science (PCB)' | 'Science (PCMB)' | 'Commerce' | 'Arts/Humanities' | 'Vocational' | string;
  interests: string[];
  activities: string[];
  preferredLocations: string[];
  budgetRange: string;
  hostelRequired: boolean;
  collegeType: 'Government' | 'Private' | 'Any';
  priorities: string[];
  careerGoalType: 'Known' | 'Multiple' | 'Exploring' | 'Custom';
  targetCareers: string[];
  onboardingCompleted: boolean;
  updatedAt: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SkillEvidence {
  id: string;
  type: 'Project' | 'GitHub' | 'Demo' | 'Hackathon' | 'Competition' | 'Certification' | 'Internship' | 'Research' | 'Freelancing';
  title: string;
  url?: string;
  description: string;
  dateAdded: string;
}

export type SkillVerificationStatus =
  | 'Unverified'
  | 'Evidence Added'
  | 'Assessment Verified'
  | 'Assessment Passed'
  | 'Interview Verified'
  | 'Fully Verified';

export interface StudentSkill {
  id: string;
  name: string;
  claimedLevel: SkillLevel;
  evidence: SkillEvidence[];
  verifiedConfidence: number; // 0 - 100 calculated deterministically
  verificationStatus: SkillVerificationStatus;
  lastAssessed?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  learnings: string;
}

export interface CollegeProfile {
  userId: string;
  accountType?: UserRole;
  university: string;
  degree: string;
  branch: string;
  year: number;
  semester: number;
  cgpa: number;
  graduationYear: number;
  skills: StudentSkill[];
  projects: ProjectItem[];
  internships: InternshipItem[];
  interests: string[];
  careerGoal: string;
  targetRole: string;
  targetCompanies: string[];
  workPreference: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  nextStep: 'Job' | 'Higher studies' | 'Entrepreneurship' | 'Exploring';
  onboardingCompleted: boolean;
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  text?: string;
  category?: string;
  options: string[];
  correctIndex: number;
  correctOption?: number;
  explanation: string;
  skillOrDomain: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  category?: 'Aptitude' | 'Technical Basics' | 'Career Interest' | 'Communication' | string;
  type?: string;
  title?: string;
  score: number;
  totalQuestions: number;
  correctAnswers?: number;
  percentage?: number;
  answers?: Record<string, number>;
  breakdown?: {
    rawScore?: number;
    accuracy?: number;
    [key: string]: any;
  };
  completedAt: string;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  strongAreas?: string[];
  weakAreas?: string[];
  recommendedSubjectsOrCareers?: string[];
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'General';
  type?: 'Technical' | 'HR' | 'Behavioral' | 'General';
  targetRole: string;
  roleId?: string;
  coachTip?: string;
  idealKeyPoints: string[];
}

export interface InterviewAnalysis {
  technicalScore: number;
  communicationScore: number;
  clarityScore: number;
  structureScore: number;
  overallScore: number;
  fillerWords: string[];
  fillerCount: number;
  paceWpm: number;
  strengths: string[];
  weaknesses: string[];
  improvedAnswerSuggestion: string;
  observableSignals: string[];
}

export interface InterviewResponseRecord {
  questionId: string;
  questionText: string;
  userAnswer: string;
  analysis: InterviewAnalysis;
}

export interface InterviewRecord {
  id: string;
  userId: string;
  targetRole?: string;
  roleId?: string;
  date?: string;
  companyTarget?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  type?: 'Technical' | 'HR' | 'Behavioral' | 'General';
  responses?: any[];
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  clarityScore?: number;
  structureScore?: number;
  completedAt?: string;
  answersAnalyzed?: number;
  averageCadenceWPM?: number;
  totalFillerWords?: number;
  knowledgeGaps?: string[];
  strongAnswers?: string[];
  weakAnswers?: string[];
  recommendedLearning?: string[];
}

export interface LearningModule {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  level: SkillLevel;
  durationMinutes: number;
  objective: string;
  contentSections: {
    heading: string;
    body: string;
    codeSnippet?: string;
  }[];
  practiceTask: {
    instructions: string;
    hint: string;
    solutionOutline: string;
  };
  quiz: AssessmentQuestion[];
  completed: boolean;
  quizScore?: number;
  completedAt?: string;
}

export interface CareerOption {
  id: string;
  name: string;
  category: string;
  description: string;
  importantSubjects: string[];
  coreSkills: string[];
  typicalResponsibilities: string[];
  learningPath: string[];
  recommendedProjects: string[];
  industryRelevance: string;
  startingRoles: string[];
  averageGrowth: string;
}

export interface CollegeReference {
  id: string;
  name: string;
  location: string;
  state: string;
  type: 'Government' | 'Private' | 'Deemed' | 'Autonomous';
  establishedYear: number;
  established?: number;
  city?: string;
  overview?: string;
  annualFees?: string;
  hostelFees?: string;
  entranceExams?: string[];
  cutoffTrends?: string;
  labsAndResearch?: string[];
  placementSummary?: string;
  thingsToConsider?: string[];
  whatToDoBeforeJoining?: string[];
  coursesOffered?: string[];
  courses: {
    name: string;
    department: string;
    durationYears: number;
    annualFeesApprox: string;
    eligibilityCriteria: string;
  }[];
  strongDepartments: string[];
  keyStrengths: string[];
  academicsOverview: string;
  labsAndFacilities: string[];
  researchOpportunities: string;
  industryExposure: string;
  internshipSupport: string;
  placementHighlights: string;
  campusAndHostel: string;
  clubsAndSports: string[];
  referenceDisclaimer: string;
}

export interface CollegeFitScore {
  collegeId: string;
  overallFit: number;
  academicFit: number;
  academicCompatibility?: number;
  courseFit: number;
  courseCompatibility?: number;
  interestFit: number;
  interestCompatibility?: number;
  admissionFit: number;
  admissionCompatibility?: number;
  careerAlignment?: number;
  budgetFit: number;
  budgetCompatibility?: number;
  locationFit: number;
  locationCompatibility?: number;
  reasonsToMatch: string[];
  matchReasons?: string[];
  thingsToConsider: string[];
  whatToDoBeforeJoining: string[];
}

// Aliases for compatibility
export type InterviewSession = InterviewRecord;
export type InterviewQuestion = InterviewQuestionItem;
export type InterviewResponseAnalysis = InterviewAnalysis;
export type Assessment = AssessmentResult;
export interface CareerRecommendation {
  career: CareerOption;
  overallFit: number;
  academicFit: number;
  interestFit: number;
  aptitudeFit: number;
  careerAlignment: number;
  matchReasons: string[];
  sufficientData: boolean;
}

export interface JobRoleDefinition {
  id: string;
  title: string;
  category: 'Hardware' | 'Software' | 'AI & Data' | 'Product' | 'Systems';
  description: string;
  salaryRange?: string;
  companyExpectations?: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  keyResponsibilities: string[];
  readinessThresholds: {
    beginner: number;
    jobReady: number;
  };
}

export interface RoadmapMilestone {
  id: string;
  phase: 'Current Academic' | 'Stream Selection' | 'Entrance & College' | 'Skill Building' | 'Projects' | 'Internship' | 'Career Launch' | string;
  title: string;
  description: string;
  actionItems: { id: string; text: string; completed: boolean }[];
  items: { id: string; text: string; completed: boolean }[];
  timeline: string;
}

export interface UserProgressStats {
  careerReadiness: number;
  skillsCount: number;
  verifiedSkillsCount: number;
  assessmentsCompleted: number;
  interviewsCompleted: number;
  learningModulesCompleted: number;
  avgInterviewScore: number;
  recentActivity: {
    id: string;
    type: 'assessment' | 'interview' | 'learning' | 'skill';
    title: string;
    date: string;
    badge?: string;
  }[];
}
