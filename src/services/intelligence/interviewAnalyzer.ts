import { InterviewAnalysis, InterviewQuestionItem } from '../../types';

const COMMON_FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'actually',
  'basically',
  'you know',
  'sort of',
  'kind of',
  'literally',
  'honestly',
  'i mean',
  'right',
];

const UNCERTAIN_PHRASES = [
  'i guess',
  'maybe',
  'probably',
  'not sure but',
  'i think sort of',
  'kind of like',
  'perhaps',
  'i suppose',
];

export function analyzeInterviewResponse(
  arg1: string | InterviewQuestionItem,
  arg2: string | InterviewQuestionItem,
  durationSeconds: number = 30
): InterviewAnalysis {
  const userAnswer = typeof arg1 === 'string' ? arg1 : (typeof arg2 === 'string' ? arg2 : '');
  const question = typeof arg1 === 'object' ? arg1 : (typeof arg2 === 'object' ? (arg2 as InterviewQuestionItem) : ({} as InterviewQuestionItem));

  const cleanAnswer = (userAnswer || '').trim();
  const words = cleanAnswer.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Detect filler words
  const lowerAnswer = cleanAnswer.toLowerCase();
  const foundFillers: string[] = [];
  let fillerCount = 0;

  COMMON_FILLER_WORDS.forEach(filler => {
    // Regex boundary check
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerAnswer.match(regex);
    if (matches && matches.length > 0) {
      foundFillers.push(filler);
      fillerCount += matches.length;
    }
  });

  // 2. Speaking pace (words per minute)
  const effectiveMinutes = Math.max(0.2, durationSeconds / 60);
  const paceWpm = Math.round(wordCount / effectiveMinutes);

  // 3. Technical Keyword & Concept Overlap
  let matchedKeyPoints = 0;
  question.idealKeyPoints.forEach(kp => {
    const keyTerms = kp.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    const hasOverlap = keyTerms.some(t => lowerAnswer.includes(t));
    if (hasOverlap) matchedKeyPoints += 1;
  });

  const technicalAccuracyRatio = question.idealKeyPoints.length > 0
    ? matchedKeyPoints / question.idealKeyPoints.length
    : 0.6;

  // If answer is too short (under 15 words)
  const isTooShort = wordCount < 15;

  // 4. Compute Scores
  let technicalScore = Math.round(technicalAccuracyRatio * 75 + Math.min(25, wordCount * 0.4));
  if (isTooShort) technicalScore = Math.min(40, technicalScore);

  let clarityScore = 85;
  if (fillerCount > 5) clarityScore -= 20;
  else if (fillerCount > 2) clarityScore -= 10;
  if (wordCount < 20) clarityScore -= 15;

  let structureScore = 75;
  // Check for structural signal words (First, Then, Finally, Because, For example, In summary, In my project)
  const structuralMarkers = ['first', 'then', 'because', 'for example', 'in my project', 'result', 'specifically', 'furthermore'];
  const markerHits = structuralMarkers.filter(m => lowerAnswer.includes(m)).length;
  structureScore += Math.min(20, markerHits * 5);
  if (isTooShort) structureScore = Math.min(45, structureScore);

  let communicationScore = Math.round((clarityScore * 0.5) + (structureScore * 0.5));
  if (paceWpm < 90 || paceWpm > 200) communicationScore -= 10;

  const overallScore = Math.round(
    technicalScore * 0.45 +
    communicationScore * 0.25 +
    clarityScore * 0.15 +
    structureScore * 0.15
  );

  // 5. Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (matchedKeyPoints >= 2) {
    strengths.push('Identified core architectural concepts relevant to the prompt.');
  }
  if (fillerCount <= 2 && wordCount >= 30) {
    strengths.push('Maintained crisp delivery with minimal filler hesitation.');
  }
  if (markerHits >= 2) {
    strengths.push('Employed logical sequencing and clear structural transitions.');
  }
  if (paceWpm >= 120 && paceWpm <= 165) {
    strengths.push(`Measured, professional cadence (~${paceWpm} WPM).`);
  }

  if (fillerCount > 3) {
    weaknesses.push(`Observed ${fillerCount} filler word occurrences (${foundFillers.slice(0, 3).join(', ')}).`);
  }
  if (isTooShort) {
    weaknesses.push('Response lacks sufficient depth. Elaborate on implementation details and trade-offs.');
  }
  const hasUncertainty = UNCERTAIN_PHRASES.some(u => lowerAnswer.includes(u));
  if (hasUncertainty) {
    weaknesses.push('Hesitant framing detected ("I guess", "maybe"). State engineering decisions with affirmative ownership.');
  }
  if (matchedKeyPoints < 2 && !isTooShort) {
    weaknesses.push(`Missed technical key points: consider addressing ${question.idealKeyPoints[0] || 'core tradeoffs'}.`);
  }

  // 6. Observable Communication Signals
  const observableSignals: string[] = [];
  observableSignals.push(`Delivery cadence: ${paceWpm} words/min (Recommended: 130–160 WPM).`);
  observableSignals.push(`Directness ratio: ${fillerCount === 0 ? 'High' : fillerCount <= 2 ? 'Moderate' : 'Needs tightening'}.`);
  if (markerHits > 0) {
    observableSignals.push('Structured progression detected (used transitional signposts).');
  } else {
    observableSignals.push('Unstructured stream-of-consciousness: recommend STAR method structure.');
  }

  // 7. Improved Answer Suggestion
  const improvedAnswerSuggestion = generateImprovedAnswer(question, cleanAnswer);

  return {
    technicalScore: Math.min(98, Math.max(20, technicalScore)),
    communicationScore: Math.min(98, Math.max(25, communicationScore)),
    clarityScore: Math.min(98, Math.max(30, clarityScore)),
    structureScore: Math.min(98, Math.max(25, structureScore)),
    overallScore: Math.min(98, Math.max(25, overallScore)),
    fillerWords: foundFillers,
    fillerCount,
    paceWpm,
    strengths: strengths.length > 0 ? strengths : ['Spoke clearly and engaged directly with the question.'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Continue building confidence with rapid technical recall.'],
    improvedAnswerSuggestion,
    observableSignals,
  };
}

function generateImprovedAnswer(question: InterviewQuestionItem, originalAnswer: string): string {
  if (question.category === 'Technical') {
    return `A concise, high-impact response structure: "The fundamental difference lies in resource utilization and determinism. First, ${question.idealKeyPoints[0] || 'polling wastes CPU cycles, whereas interrupts are hardware-triggered'}. Second, in production we ensure that ${question.idealKeyPoints[1] || 'critical sections remain minimal'}. For example, in my implementation I verified this using ${question.idealKeyPoints[2] || 'telemetry diagnostics'}, reducing latency significantly."`;
  } else {
    return `Structured STAR response: "In my previous project, the Situation was ${question.idealKeyPoints[0] || 'a tight deadline with ambiguous constraints'}. My Task was to clarify system requirements and define deliverables. The Action I took was establishing daily technical syncs, benchmarking trade-offs directly, and documenting core assumptions. As a Result, we delivered the project on schedule with zero breaking regressions."`;
  }
}

export function updateSkillVerificationAfterInterview(
  skills: any[],
  responses: any[]
): any[] {
  if (!skills || !Array.isArray(skills)) return [];

  // Calculate average interview score
  const avgScore = responses.length > 0
    ? Math.round(responses.reduce((sum, r) => sum + (r.analysis?.overallScore || 70), 0) / responses.length)
    : 70;

  return skills.map(skill => {
    // Check if interview touched on this skill
    const isRelevant = responses.some(r =>
      (r.questionText || '').toLowerCase().includes(skill.name.toLowerCase()) ||
      (r.userAnswer || '').toLowerCase().includes(skill.name.toLowerCase())
    );

    if (isRelevant || avgScore >= 75) {
      const newConfidence = Math.min(100, Math.max(skill.verifiedConfidence || 20, (skill.verifiedConfidence || 20) + 15));
      const newStatus = newConfidence >= 80 ? 'Fully Verified' : 'Interview Verified';
      return {
        ...skill,
        verifiedConfidence: newConfidence,
        verificationStatus: newStatus,
        lastAssessed: new Date().toISOString(),
      };
    }
    return skill;
  });
}

