import { AssessmentQuestion, InterviewQuestionItem } from '../types';

// ================= ASSESSMENTS QUESTION BANK =================

export const APTITUDE_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'apt_1',
    question: 'A train traveling at 72 km/h crosses a 250-meter-long platform in 25 seconds. What is the length of the train?',
    options: ['200 meters', '250 meters', '300 meters', '350 meters'],
    correctIndex: 1,
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance in 25s = 20 * 25 = 500m. Length of train = 500 - 250 = 250 meters.',
    skillOrDomain: 'Quantitative Aptitude - Speed & Distance',
  },
  {
    id: 'apt_2',
    question: 'If 8 men or 12 women can reap a field in 25 days, how many days will 6 men and 11 women take to reap the same field?',
    options: ['15 days', '18 days', '20 days', '22 days'],
    correctIndex: 0,
    explanation: '8 men = 12 women => 1 man = 1.5 women. 6 men + 11 women = (6 * 1.5) + 11 = 20 women. Time = (12 * 25) / 20 = 15 days.',
    skillOrDomain: 'Quantitative Aptitude - Time & Work',
  },
  {
    id: 'apt_3',
    question: 'Find the missing number in the series: 4, 18, 48, 100, 180, ?',
    options: ['294', '280', '290', '312'],
    correctIndex: 0,
    explanation: 'Pattern: (1^2 * 4) = 4; (2^2 * 4.5)=18; or n^3 - n^2: 2^3 - 2^2 = 4; 3^3 - 3^2 = 18; 4^3 - 4^2 = 48; 5^3 - 5^2 = 100; 6^3 - 6^2 = 180; 7^3 - 7^2 = 343 - 49 = 294.',
    skillOrDomain: 'Logical Reasoning - Number Series',
  },
  {
    id: 'apt_4',
    question: 'Statement: "Most engineering graduates struggle with verbal presentation." Conclusion I: Engineering curricula lack adequate presentation workshops. Conclusion II: All engineers are bad communicators.',
    options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both follow', 'Neither follows'],
    correctIndex: 0,
    explanation: 'Conclusion II uses an extreme generalized claim ("All") which is invalid. Conclusion I reasonably accounts for the struggle.',
    skillOrDomain: 'Critical Reasoning - Deductive Logic',
  },
  {
    id: 'apt_5',
    question: 'A gear with 30 teeth drives a gear with 15 teeth at 100 RPM. What is the rotational speed of the 15-tooth gear?',
    options: ['50 RPM', '100 RPM', '150 RPM', '200 RPM'],
    correctIndex: 3,
    explanation: 'Gear ratio is inverse to tooth count: Speed2 = Speed1 * (Teeth1 / Teeth2) = 100 * (30 / 15) = 200 RPM.',
    skillOrDomain: 'Mechanical & Spatial Reasoning',
  },
];

export const TECHNICAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'tech_1',
    question: 'In C or C++, what is the primary consequence of modifying a variable declared with the "const" qualifier via an explicit pointer cast?',
    options: ['Compile-time error only', 'Undefined behavior at runtime', 'Automatic memory reallocation', 'Safe mutation on the stack'],
    correctIndex: 1,
    explanation: 'Modifying an object that was originally defined as const produces Undefined Behavior (UB) in both C and C++ standards.',
    skillOrDomain: 'C / C++ Memory Model',
  },
  {
    id: 'tech_2',
    question: 'Which serial communication protocol uses a 2-wire synchronous bus with bidirectional open-drain lines pulled up by resistors?',
    options: ['SPI', 'UART', 'I2C', 'RS-232'],
    correctIndex: 2,
    explanation: 'I2C (Inter-Integrated Circuit) utilizes two lines: SDA (Serial Data) and SCL (Serial Clock) with open-drain pull-up resistors.',
    skillOrDomain: 'Hardware Communication Protocols',
  },
  {
    id: 'tech_3',
    question: 'Why is the "volatile" keyword essential when declaring a pointer to a hardware memory-mapped peripheral register in embedded firmware?',
    options: [
      'It prevents the compiler from optimizing away repeated reads or writes',
      'It moves the variable into high-speed L1 cache',
      'It automatically acquires a mutex lock',
      'It encrypts register communication',
    ],
    correctIndex: 0,
    explanation: 'The volatile keyword tells the compiler that the value may change asynchronously outside program flow, preventing dead-store elimination or register caching.',
    skillOrDomain: 'Embedded Firmware Best Practices',
  },
  {
    id: 'tech_4',
    question: 'What is the time complexity of searching for a key in a balanced binary search tree (like Red-Black or AVL) with N nodes?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 1,
    explanation: 'Because the height of a self-balancing binary search tree is strictly bounded by O(log N), search operations run in O(log N) worst-case.',
    skillOrDomain: 'Data Structures & Algorithms',
  },
  {
    id: 'tech_5',
    question: 'In React 18+, which hook is specifically recommended to memoize expensive mathematical calculations across component re-renders?',
    options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
    correctIndex: 1,
    explanation: 'useMemo recalculates a cached value only when one of its specified dependencies changes.',
    skillOrDomain: 'Modern React State & Performance',
  },
];

export const COMMUNICATION_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'comm_1',
    question: 'When asked in an interview: "Tell me about a challenging technical bug you encountered", what is the most effective structural framework to use?',
    options: [
      'Chronological list of all team meetings held that week',
      'STAR method: Situation, Task, Action taken, and measurable Result',
      'Blame hardware vendors first, then describe the fix',
      'Immediate code walkthrough without context',
    ],
    correctIndex: 1,
    explanation: 'The STAR method (Situation, Task, Action, Result) ensures structured, concise, and impact-oriented narrative delivery.',
    skillOrDomain: 'Interview Answer Structuring',
  },
  {
    id: 'comm_2',
    question: 'Which of the following phrases conveys high professional clarity and confidence without filler hesitation?',
    options: [
      '"I basically kind of think our database sort of crashed because of load..."',
      '"Our telemetry indicated a connection pool exhaustion under 2,000 peak RPS; we mitigated this by provisioning a Redis write-through cache."',
      '"Um, well, like, we had this super weird bug and nobody really knew why."',
      '"I guess you could say we solved it pretty nicely somehow."',
    ],
    correctIndex: 1,
    explanation: 'Option 2 is direct, uses factual metrics, avoids conversational fillers, and clearly outlines the root cause and remedy.',
    skillOrDomain: 'Verbal Precision & Impact',
  },
  {
    id: 'comm_3',
    question: 'If you do not know the answer to a deep technical question in an engineering interview, what is the best approach?',
    options: [
      'Guess confidently and pretend to know the exact internal details',
      'Stay completely silent until the interviewer moves on',
      'Acknowledge the boundary of your current knowledge, outline your first-principles deduction, and explain how you would verify it',
      'Change the subject immediately to an unrelated project you know well',
    ],
    correctIndex: 2,
    explanation: 'Engineers respect transparency, intellectual honesty, and structured first-principles reasoning when tackling unknowns.',
    skillOrDomain: 'Executive Presence & Honesty',
  },
  {
    id: 'comm_4',
    question: 'What is the optimal speaking pace for technical presentations and remote video interviews?',
    options: ['Under 80 WPM (very slow)', '130 - 160 WPM (clear, measured, natural)', '220 - 250 WPM (rapid fire)', 'Varying erratically between whisper and shouting'],
    correctIndex: 1,
    explanation: 'A rate of 130–160 words per minute allows listeners to process complex technical concepts comfortably without cognitive fatigue.',
    skillOrDomain: 'Pacing & Cadence',
  },
];

export const CAREER_INTEREST_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'int_1',
    question: 'When you are given an electronic gadget that stopped functioning, what is your immediate instinct?',
    options: [
      'Unscrew the casing to inspect the PCB circuit, solder joints, and burnt components',
      'Read the user manual and check customer service warranty policies',
      'Write a software script or look for alternative digital apps',
      'Design a 3D printable aesthetic cover to refresh its look',
    ],
    correctIndex: 0,
    explanation: 'Desire to dismantle and inspect hardware signals an alignment with Electronics & Hardware Engineering.',
    skillOrDomain: 'Hardware Affinity',
  },
  {
    id: 'int_2',
    question: 'Which task sounds most engaging for an entire uninterrupted weekend hackathon?',
    options: [
      'Writing an algorithmic trading simulator or full-stack web app from scratch',
      'Designing and soldering an autonomous obstacle-avoiding rover with ultrasonic sensors',
      'Conducting chemical lab tests on water samples and recording titration curves',
      'Writing long-form investigative articles on technological ethics',
    ],
    correctIndex: 1,
    explanation: 'Building autonomous rovers signals strong aptitude for Robotics and Embedded Systems.',
    skillOrDomain: 'Robotics & Systems Affinity',
  },
  {
    id: 'int_3',
    question: 'Which type of problem energizes you more?',
    options: [
      'Abstract mathematical puzzles, logic riddles, and data analytics',
      'Physical building: wood, metal, wires, 3D printing, and motors',
      'Visual layout, typography, colors, and human-computer interactions',
      'Team negotiation, debate, and coordinating cross-functional projects',
    ],
    correctIndex: 0,
    explanation: 'A passion for mathematical riddles and data aligns closely with Computer Science and AI/ML careers.',
    skillOrDomain: 'Analytical & Software Affinity',
  },
];

// ================= INTERVIEW ARENA QUESTIONS =================

export const INTERVIEW_QUESTIONS_DATA: InterviewQuestionItem[] = [
  // Embedded Systems / Firmware
  {
    id: 'emb_q1',
    category: 'Technical',
    targetRole: 'Embedded Systems Engineer',
    question: 'Can you explain the difference between polling and interrupt-driven I/O in a microcontroller? When would you choose one over the other?',
    idealKeyPoints: [
      'Polling constantly checks status flags in a loop, consuming CPU cycles and power',
      'Interrupts allow the CPU to execute other tasks or sleep until a hardware trigger occurs',
      'Interrupt Service Routines (ISRs) must remain short, deterministic, and non-blocking',
      'Polling can be acceptable for non-critical, ultra-low frequency or single-purpose boot setups',
    ],
  },
  {
    id: 'emb_q2',
    category: 'Technical',
    targetRole: 'Embedded Systems Engineer',
    question: 'Walk me through how you would troubleshoot an I2C sensor that is not responding on the bus. What steps and tools would you use?',
    idealKeyPoints: [
      'Check physical pull-up resistors (typically 4.7kΩ) and supply voltages with a multimeter',
      'Run an I2C address scanner loop to detect ACK/NACK responses on the address range',
      'Hook up an oscilloscope or logic analyzer to check SDA and SCL waveform integrity and rise times',
      'Verify clock frequency configuration and correct 7-bit vs 8-bit shifted address notation',
    ],
  },
  {
    id: 'emb_q3',
    category: 'Technical',
    targetRole: 'Firmware Engineer',
    question: 'What is a race condition in an RTOS or multithreaded firmware environment, and what synchronization primitives do you use to prevent it?',
    idealKeyPoints: [
      'A race condition occurs when two or more threads/ISRs concurrently access shared memory without atomicity',
      'Usage of Mutexes with priority inheritance to avoid priority inversion',
      'Binary or counting semaphores for task signaling',
      'Disabling interrupts or using critical sections for brief hardware register updates',
    ],
  },

  // Frontend Developer
  {
    id: 'fe_q1',
    category: 'Technical',
    targetRole: 'Frontend Developer',
    question: 'How does the React Virtual DOM diffing algorithm work, and why is key prop stability critical when rendering lists of dynamic components?',
    idealKeyPoints: [
      'Virtual DOM creates an in-memory representation of UI elements to compute minimal DOM mutations',
      'Heuristic O(N) diffing checks element types and keys',
      'Stable unique keys allow React to track which items changed, were added, or were removed',
      'Using array indices as keys can cause subtle state preservation bugs and unnecessary re-renders during reordering',
    ],
  },
  {
    id: 'fe_q2',
    category: 'Technical',
    targetRole: 'Frontend Developer',
    question: 'Explain how you approach web performance optimization for a client-side application with large bundle sizes and slow initial load.',
    idealKeyPoints: [
      'Code splitting with React.lazy and dynamic imports for route-level chunking',
      'Tree shaking, dead-code elimination, and inspecting bundle analyzer graphs',
      'Optimizing images (modern WebP/AVIF formats, responsive srcset, lazy loading)',
      'Minimizing blocking third-party scripts and optimizing Core Web Vitals (LCP, INP, CLS)',
    ],
  },

  // Backend Developer
  {
    id: 'be_q1',
    category: 'Technical',
    targetRole: 'Backend Developer',
    question: 'Explain the difference between SQL database normalization and denormalization. When would you intentionally denormalize a schema?',
    idealKeyPoints: [
      'Normalization (1NF to 3NF) removes redundancy and ensures data integrity via foreign keys',
      'Denormalization introduces redundant fields or precomputed aggregations to speed up heavy read queries',
      'Denormalization is preferred for read-heavy analytical dashboards, search caches, and reporting',
      'Tradeoff involves increased write complexity, larger disk footprint, and risk of data inconsistency',
    ],
  },

  // AI/ML Engineer
  {
    id: 'ai_q1',
    category: 'Technical',
    targetRole: 'AI/ML Engineer',
    question: 'How do you diagnose and address severe overfitting in a deep learning model when validation loss diverges from training loss?',
    idealKeyPoints: [
      'Overfitting occurs when model memorizes training noise rather than generalizable representations',
      'Techniques: Data augmentation, Dropout layers, L1/L2 weight regularization',
      'Early stopping with patience on validation loss checkpoint',
      'Simplifying model architecture or gathering more representative training samples',
    ],
  },

  // General Behavioral / HR questions
  {
    id: 'hr_q1',
    category: 'HR',
    targetRole: 'General',
    question: 'Tell me about a time when you experienced a disagreement with a team member regarding a technical decision or project deadline. How did you resolve it?',
    idealKeyPoints: [
      'Clear context without personal antagonism',
      'Focus on technical metrics, objective trade-offs, and project objectives',
      'Willingness to listen to alternative perspectives and run small benchmarks',
      'Professional consensus reached and successful outcome delivered',
    ],
  },
  {
    id: 'beh_q1',
    category: 'Behavioral',
    targetRole: 'General',
    question: 'Describe a project where requirements were vague or shifted midway through development. How did you manage the ambiguity and deliver results?',
    idealKeyPoints: [
      'Proactive breakdown of requirements into minimal viable iterations',
      'Frequent communication and rapid feedback checkpoints with stakeholders',
      'Documenting assumptions explicitly before executing deep implementation',
      'Delivering on time by managing scope and remaining adaptable',
    ],
  },
  {
    id: 'gen_q1',
    category: 'General',
    targetRole: 'General',
    question: 'Walk me through your most significant technical project to date. What was your personal contribution, what architectural choices did you make, and what would you improve today?',
    idealKeyPoints: [
      'High-level problem statement and direct business/user value',
      'Clear ownership: separating individual contributions from team scope',
      'Concrete architectural rationale (why this language, framework, or database)',
      'Self-reflective retrospective: real lessons learned and technical debt addressed',
    ],
  },
];

export const INTERVIEW_QUESTIONS = INTERVIEW_QUESTIONS_DATA;

export const QUESTIONS_DATABASE: Record<string, AssessmentQuestion[]> = {
  Aptitude: APTITUDE_ASSESSMENT_QUESTIONS.map(q => ({ ...q, correctOption: q.correctIndex })),
  Technical: TECHNICAL_ASSESSMENT_QUESTIONS.map(q => ({ ...q, correctOption: q.correctIndex })),
  Interest: CAREER_INTEREST_ASSESSMENT_QUESTIONS.map(q => ({ ...q, correctOption: q.correctIndex })),
  Communication: COMMUNICATION_ASSESSMENT_QUESTIONS.map(q => ({ ...q, correctOption: q.correctIndex })),
};

