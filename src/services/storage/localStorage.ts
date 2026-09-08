import {
  LocalUser,
  SchoolProfile,
  CollegeProfile,
  AssessmentResult,
  InterviewRecord,
  LearningModule,
  UserProgressStats,
  RoadmapMilestone,
} from '../../types';

const STORAGE_KEYS = {
  USERS: 'nexstep_users',
  CURRENT_USER: 'nexstep_current_user',
  PROFILES: 'nexstep_profiles',
  LEARNING: 'nexstep_learning',
  INTERVIEWS: 'nexstep_interviews',
  ASSESSMENTS: 'nexstep_assessments',
  PROGRESS: 'nexstep_progress',
  THEME: 'nexstep_theme',
};

// Safe JSON reading
function readFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

// Safe JSON writing
function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Simple hash simulation for local prototype
function simpleLocalHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return 'lh_' + Math.abs(hash).toString(16);
}

// ---------------- USER & AUTH ----------------

export function createLocalAccount(name: string, email: string, password: string): { success: boolean; user?: LocalUser; error?: string } {
  const users = readFromStorage<LocalUser[]>(STORAGE_KEYS.USERS, []);
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists on this browser.' };
  }

  const newUser: LocalUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: simpleLocalHash(password),
    role: null,
    accountType: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeToStorage(STORAGE_KEYS.USERS, users);
  writeToStorage(STORAGE_KEYS.CURRENT_USER, newUser);

  // Initialize and persist initial profile with accountType = null as required
  const initialProfile: any = {
    userId: newUser.id,
    accountType: null,
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const profilesMap = readFromStorage<Record<string, any>>(STORAGE_KEYS.PROFILES, {});
  profilesMap[newUser.id] = initialProfile;
  writeToStorage(STORAGE_KEYS.PROFILES, profilesMap);

  return { success: true, user: newUser };
}

export function loginLocalAccount(email: string, password: string): { success: boolean; user?: LocalUser; error?: string } {
  const users = readFromStorage<LocalUser[]>(STORAGE_KEYS.USERS, []);
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return { success: false, error: 'No account found with this email on this browser.' };
  }

  if (user.passwordHash !== simpleLocalHash(password)) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }

  writeToStorage(STORAGE_KEYS.CURRENT_USER, user);
  return { success: true, user };
}

export function logoutLocalAccount(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

export function getCurrentUser(): LocalUser | null {
  return readFromStorage<LocalUser | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function updateCurrentUserAccountType(accountType: 'school' | 'college'): LocalUser | null {
  const current = getCurrentUser();
  if (!current) return null;

  current.role = accountType;
  current.accountType = accountType;
  current.updatedAt = new Date().toISOString();

  // Update in users list
  const users = readFromStorage<LocalUser[]>(STORAGE_KEYS.USERS, []);
  const idx = users.findIndex(u => u.id === current.id);
  if (idx !== -1) {
    users[idx] = current;
    writeToStorage(STORAGE_KEYS.USERS, users);
  }

  writeToStorage(STORAGE_KEYS.CURRENT_USER, current);

  // Save accountType to the current user's localStorage profile
  const profilesMap = readFromStorage<Record<string, any>>(STORAGE_KEYS.PROFILES, {});
  const existingProfile = profilesMap[current.id] || { userId: current.id };
  profilesMap[current.id] = {
    ...existingProfile,
    accountType,
    updatedAt: new Date().toISOString(),
  };
  writeToStorage(STORAGE_KEYS.PROFILES, profilesMap);

  return current;
}

export function updateCurrentUserRole(role: 'school' | 'college'): LocalUser | null {
  return updateCurrentUserAccountType(role);
}

export function resetPassword(email: string, newPassword: string): { success: boolean; error?: string } {
  const users = readFromStorage<LocalUser[]>(STORAGE_KEYS.USERS, []);
  const normalizedEmail = email.trim().toLowerCase();
  const idx = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (idx === -1) {
    return { success: false, error: 'No local account registered with this email address.' };
  }

  users[idx].passwordHash = simpleLocalHash(newPassword);
  users[idx].updatedAt = new Date().toISOString();
  writeToStorage(STORAGE_KEYS.USERS, users);

  const current = getCurrentUser();
  if (current && current.email.toLowerCase() === normalizedEmail) {
    current.passwordHash = users[idx].passwordHash;
    writeToStorage(STORAGE_KEYS.CURRENT_USER, current);
  }

  return { success: true };
}

// ---------------- PROFILES ----------------

interface ProfilesMap {
  [userId: string]: SchoolProfile | CollegeProfile;
}

export function getUserProfile<T extends SchoolProfile | CollegeProfile>(userId: string): T | null {
  const map = readFromStorage<ProfilesMap>(STORAGE_KEYS.PROFILES, {});
  return (map[userId] as T) || null;
}

export function saveUserProfile(profile: SchoolProfile | CollegeProfile): void {
  const map = readFromStorage<ProfilesMap>(STORAGE_KEYS.PROFILES, {});
  map[profile.userId] = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  writeToStorage(STORAGE_KEYS.PROFILES, map);
}

export function updateUserProfile<T extends SchoolProfile | CollegeProfile>(userId: string, partial: Partial<T>): T | null {
  const map = readFromStorage<ProfilesMap>(STORAGE_KEYS.PROFILES, {});
  const existing = map[userId] as T;
  if (!existing) return null;

  const updated = {
    ...existing,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  map[userId] = updated;
  writeToStorage(STORAGE_KEYS.PROFILES, map);
  return updated;
}

// ---------------- ASSESSMENTS ----------------

export function saveAssessment(assessment: AssessmentResult): void {
  const all = readFromStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENTS, []);
  all.push(assessment);
  writeToStorage(STORAGE_KEYS.ASSESSMENTS, all);
}

export function getAssessments(userId: string): AssessmentResult[] {
  const all = readFromStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENTS, []);
  return all.filter(a => a.userId === userId).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}

// ---------------- INTERVIEWS ----------------

export function saveInterview(interview: InterviewRecord): void {
  const all = readFromStorage<InterviewRecord[]>(STORAGE_KEYS.INTERVIEWS, []);
  all.push(interview);
  writeToStorage(STORAGE_KEYS.INTERVIEWS, all);
}

export function getInterviews(userId: string): InterviewRecord[] {
  const all = readFromStorage<InterviewRecord[]>(STORAGE_KEYS.INTERVIEWS, []);
  return all.filter(i => i.userId === userId).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
}

export function getInterviewById(interviewId: string): InterviewRecord | null {
  const all = readFromStorage<InterviewRecord[]>(STORAGE_KEYS.INTERVIEWS, []);
  return all.find(i => i.id === interviewId) || null;
}

// ---------------- LEARNING ----------------

interface UserLearningMap {
  [userId: string]: LearningModule[];
}

export function getLearningProgress(userId: string): LearningModule[] {
  const map = readFromStorage<UserLearningMap>(STORAGE_KEYS.LEARNING, {});
  return map[userId] || [];
}

export function saveLearningProgress(userId: string, module: LearningModule): void {
  const map = readFromStorage<UserLearningMap>(STORAGE_KEYS.LEARNING, {});
  const list = map[userId] || [];
  const idx = list.findIndex(m => m.id === module.id);
  if (idx >= 0) {
    list[idx] = module;
  } else {
    list.push(module);
  }
  map[userId] = list;
  writeToStorage(STORAGE_KEYS.LEARNING, map);
}

// ---------------- ROADMAP STATE ----------------

interface RoadmapStateMap {
  [userId: string]: { [milestoneId: string]: { [actionItemId: string]: boolean } };
}

const ROADMAP_KEY = 'nexstep_roadmap_progress';

const DEFAULT_SCHOOL_ROADMAP_STAGES: RoadmapMilestone[] = [
  {
    id: 'stage_1',
    phase: 'Current Academic',
    title: 'Core Academic Foundations',
    description: 'Master Class 10/12 curriculum subjects, target strong grades, and identify natural subject strengths.',
    timeline: 'Months 1 - 3',
    actionItems: [
      { id: 'item_1_1', text: 'Benchmark baseline marks across Math, Physics, and Chemistry / Computer Science', completed: true },
      { id: 'item_1_2', text: 'Identify and address any foundational conceptual gaps through targeted revision', completed: true },
      { id: 'item_1_3', text: 'Maintain consistent 80%+ marks in core STEM/Commerce subjects', completed: false },
    ],
    items: [],
  },
  {
    id: 'stage_2',
    phase: 'Stream Selection',
    title: 'Senior Secondary Stream Selection',
    description: 'Select the optimal academic stream aligned with your long-term career ambition.',
    timeline: 'Months 4 - 6',
    actionItems: [
      { id: 'item_2_1', text: 'Take the NEXSTEP Career Interest & Aptitude assessment battery', completed: true },
      { id: 'item_2_2', text: 'Consult with school career counselor or mentor on career trajectory', completed: false },
      { id: 'item_2_3', text: 'Finalize stream enrollment: Science (PCM/PCB), Commerce, or Humanities', completed: false },
    ],
    items: [],
  },
  {
    id: 'stage_3',
    phase: 'Entrance & College',
    title: 'Entrance Exam & Institutional Research',
    description: 'Map syllabus requirements and entrance examination schedules (JEE, State CET, BITSAT, CUET).',
    timeline: 'Months 7 - 12',
    actionItems: [
      { id: 'item_3_1', text: 'Compile list of 10 target colleges categorized by Dream, Target, and Safe', completed: false },
      { id: 'item_3_2', text: 'Register for relevant entrance tests and download official syllabus blueprints', completed: false },
      { id: 'item_3_3', text: 'Solve past 5 years official question papers under timed conditions', completed: false },
    ],
    items: [],
  },
  {
    id: 'stage_4',
    phase: 'Skill Building',
    title: 'Early Technical Skill Priming',
    description: 'Begin hands-on programming and circuit fundamentals before starting higher education.',
    timeline: 'Months 13 - 16',
    actionItems: [
      { id: 'item_4_1', text: 'Complete introductory C, Python, or Web development track', completed: false },
      { id: 'item_4_2', text: 'Set up GitHub profile and learn basic git commands (commit, push, branch)', completed: false },
      { id: 'item_4_3', text: 'Build a simple microcontroller or software script to solve a daily problem', completed: false },
    ],
    items: [],
  },
  {
    id: 'stage_5',
    phase: 'Projects',
    title: 'Hands-on Portfolio Projects',
    description: 'Construct verified practical evidence to support your college applications and skill claims.',
    timeline: 'Months 17 - 20',
    actionItems: [
      { id: 'item_5_1', text: 'Build first capstone project with clear documentation and code tests', completed: false },
      { id: 'item_5_2', text: 'Publish project repository with live demo or video walkthrough', completed: false },
      { id: 'item_5_3', text: 'Document design choices, circuit schematics, and performance metrics', completed: false },
    ],
    items: [],
  },
  {
    id: 'stage_6',
    phase: 'Internship',
    title: 'Hackathons & Real-World Exposure',
    description: 'Participate in student hackathons, science exhibitions, or shadow industry mentors.',
    timeline: 'Months 21 - 24',
    actionItems: [
      { id: 'item_6_1', text: 'Form or join a team for a regional hackathon or science competition', completed: false },
      { id: 'item_6_2', text: 'Engage with industry professionals and college seniors on LinkedIn', completed: false },
      { id: 'item_6_3', text: 'Practice explaining technical architecture concisely to peer reviewers', completed: false },
    ],
    items: [],
  },
  {
    id: 'stage_7',
    phase: 'Career Launch',
    title: 'Higher Education & Career Launchpad',
    description: 'Transition into your dream degree program with verified technical skills and roadmap clarity.',
    timeline: 'Ongoing',
    actionItems: [
      { id: 'item_7_1', text: 'Finalize college admission counseling and course registration', completed: false },
      { id: 'item_7_2', text: 'Transition Skill Passport into university profile and track semester milestones', completed: false },
      { id: 'item_7_3', text: 'Prepare for first-year engineering competitions and research lab recruitments', completed: false },
    ],
    items: [],
  },
];

export function getRoadmapProgress(userId: string): { [milestoneId: string]: { [actionItemId: string]: boolean } } {
  const map = readFromStorage<RoadmapStateMap>(ROADMAP_KEY, {});
  return map[userId] || {};
}

export function getRoadmapItems(userId: string, _track: string = 'school'): RoadmapMilestone[] {
  const map = readFromStorage<RoadmapStateMap>(ROADMAP_KEY, {});
  const userMap = map[userId] || {};

  return DEFAULT_SCHOOL_ROADMAP_STAGES.map(stage => {
    const stageProgress = userMap[stage.id] || {};
    const updatedActionItems = stage.actionItems.map(item => ({
      ...item,
      completed: stageProgress[item.id] !== undefined ? stageProgress[item.id] : item.completed,
    }));

    return {
      ...stage,
      actionItems: updatedActionItems,
      items: updatedActionItems,
    };
  });
}

export function toggleRoadmapItem(userId: string, milestoneId: string, actionItemId: string): RoadmapMilestone[] {
  const map = readFromStorage<RoadmapStateMap>(ROADMAP_KEY, {});
  if (!map[userId]) map[userId] = {};
  if (!map[userId][milestoneId]) map[userId][milestoneId] = {};

  let currentVal = map[userId][milestoneId][actionItemId];
  if (currentVal === undefined) {
    const stage = DEFAULT_SCHOOL_ROADMAP_STAGES.find(s => s.id === milestoneId);
    const item = stage?.actionItems.find(i => i.id === actionItemId);
    currentVal = !!item?.completed;
  }

  map[userId][milestoneId][actionItemId] = !currentVal;
  writeToStorage(ROADMAP_KEY, map);
  return getRoadmapItems(userId);
}

// ---------------- USER OVERALL PROGRESS ----------------

export function getProgressStats(userId: string): UserProgressStats {
  const profile = getUserProfile(userId);
  const assessments = getAssessments(userId);
  const interviews = getInterviews(userId);
  const learning = getLearningProgress(userId);

  const completedModules = learning.filter(m => m.completed).length;
  const avgInterviewScore = interviews.length > 0
    ? Math.round(interviews.reduce((acc, curr) => acc + curr.overallScore, 0) / interviews.length)
    : 0;

  let skillsCount = 0;
  let verifiedSkillsCount = 0;

  if (profile && 'skills' in profile) {
    const cp = profile as CollegeProfile;
    skillsCount = cp.skills?.length || 0;
    verifiedSkillsCount = cp.skills?.filter(s => s.verifiedConfidence >= 60).length || 0;
  }

  // Calculate readiness score deterministically
  let readiness = 0;
  if (profile) {
    if ('skills' in profile) {
      // College calculation
      const cp = profile as CollegeProfile;
      const skillsScore = Math.min(100, (verifiedSkillsCount / Math.max(1, skillsCount || 4)) * 100);
      const projectScore = Math.min(100, (cp.projects?.length || 0) * 25);
      const assessmentScore = assessments.length > 0 ? assessments[0].percentage : 0;
      const interviewScore = avgInterviewScore;
      readiness = Math.round(skillsScore * 0.35 + projectScore * 0.25 + assessmentScore * 0.2 + interviewScore * 0.2);
    } else {
      // School calculation
      const sp = profile as SchoolProfile;
      const acadScore = Math.min(100, sp.overallPercentage || 0);
      const assessmentScore = assessments.length > 0 ? assessments[0].percentage : 0;
      const interestsCount = Math.min(100, (sp.interests?.length || 0) * 20);
      readiness = Math.round(acadScore * 0.5 + assessmentScore * 0.3 + interestsCount * 0.2);
    }
  }

  // Build real recent activity list from stored records
  const recentActivity: UserProgressStats['recentActivity'] = [];

  interviews.slice(0, 3).forEach(item => {
    recentActivity.push({
      id: item.id,
      type: 'interview',
      title: `Interview Arena: ${item.targetRole} (${item.type})`,
      date: new Date(item.completedAt).toLocaleDateString(),
      badge: `${item.overallScore}% Score`,
    });
  });

  assessments.slice(0, 3).forEach(item => {
    recentActivity.push({
      id: item.id,
      type: 'assessment',
      title: `Assessment: ${item.category}`,
      date: new Date(item.completedAt).toLocaleDateString(),
      badge: `${item.percentage}%`,
    });
  });

  learning.filter(m => m.completed).slice(0, 3).forEach(item => {
    recentActivity.push({
      id: item.id,
      type: 'learning',
      title: `Completed module: ${item.title}`,
      date: item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Recently',
      badge: 'Verified',
    });
  });

  return {
    careerReadiness: Math.min(100, Math.max(0, readiness)),
    skillsCount,
    verifiedSkillsCount,
    assessmentsCompleted: assessments.length,
    interviewsCompleted: interviews.length,
    learningModulesCompleted: completedModules,
    avgInterviewScore,
    recentActivity,
  };
}

// ---------------- DATA EXPORT & RESET ----------------

export function exportUserData(userId?: string): string {
  const user = getCurrentUser();
  const targetId = userId || user?.id || '';
  const profile = getUserProfile(targetId);
  const assessments = getAssessments(targetId);
  const interviews = getInterviews(targetId);
  const learning = getLearningProgress(targetId);
  const roadmap = getRoadmapProgress(targetId);

  const payload = {
    exportedAt: new Date().toISOString(),
    platform: 'NEXSTEP',
    version: '1.0.0',
    user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
    profile,
    assessments,
    interviews,
    learning,
    roadmapProgress: roadmap,
  };

  return JSON.stringify(payload, null, 2);
}

export function clearLocalData(): void {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  localStorage.removeItem(ROADMAP_KEY);
}

// Compatibility Aliases
export const clearAllUserData = clearLocalData;
export const exportAllUserData = exportUserData;
export const saveInterviewSession = saveInterview;
export const getInterviewSessions = getInterviews;

export function getStoredTheme(): 'light' | 'dark' {
  const t = localStorage.getItem(STORAGE_KEYS.THEME);
  if (t === 'light' || t === 'dark') return t;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
