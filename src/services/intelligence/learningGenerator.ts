export interface GeneratedMaterial {
  type: 'notes' | 'ppt' | 'practice' | 'flashcards' | 'interview_prep';
  title: string;
  subtitle: string;
  topic: string;
  sections: {
    title: string;
    content: string[];
    codeBlock?: string;
  }[];
  generatedAt: string;
}

export function generateMaterialForTopic(
  topic: string,
  type: 'notes' | 'ppt' | 'practice' | 'flashcards' | 'interview_prep'
): GeneratedMaterial {
  const cleanTopic = topic || 'Embedded Systems';
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (type === 'notes') {
    return {
      type: 'notes',
      title: `${cleanTopic} — Master Study Notes`,
      subtitle: 'Structured technical summary, architectural principles, and core implementation patterns.',
      topic: cleanTopic,
      generatedAt: now,
      sections: [
        {
          title: '1. Executive Overview & Core Philosophy',
          content: [
            `${cleanTopic} forms an essential foundation in modern engineering systems.`,
            'Claimed theoretical knowledge must be backed by hands-on determinism, verifiable metrics, and reproducible code.',
            'Always design with memory bounds, failure recovery, and architectural modularity in mind.',
          ],
        },
        {
          title: '2. Foundational Concepts & Terminology',
          content: [
            'State Machine Architecture: Model asynchronous workflows using explicit finite state machines (FSM) rather than scattered boolean flags.',
            'Latency & Throughput Tradeoffs: Differentiate between instantaneous response deadlines and sustained data bandwidth.',
            'Defensive Design: Implement input sanitization, error boundaries, and graceful degradation for unforeseen hardware/network conditions.',
          ],
          codeBlock: `// Example Clean State Transition\ntype SystemState = 'IDLE' | 'PROCESSING' | 'ERROR';\nfunction transition(current: SystemState, event: string): SystemState {\n  switch (current) {\n    case 'IDLE': return event === 'START' ? 'PROCESSING' : current;\n    case 'PROCESSING': return event === 'FAIL' ? 'ERROR' : current;\n    default: return 'IDLE';\n  }\n}`,
        },
        {
          title: '3. Production Best Practices & Common Pitfalls',
          content: [
            'Avoid hardcoded magical numbers — use explicit enumerations and configuration constants.',
            'Profile bottlenecks with real instrumentation before attempting premature algorithmic optimization.',
            'Maintain comprehensive automated test coverage for boundary cases (e.g., buffer underflow, null pointers, rate limit bursts).',
          ],
        },
        {
          title: '4. Summary Checklist for Verification',
          content: [
            'Can you explain the core tradeoffs without reading from notes?',
            'Have you implemented at least one working prototype repository demonstrating this skill?',
            'Are you prepared to answer edge-case debugging questions in an AI interview session?',
          ],
        },
      ],
    };
  }

  if (type === 'ppt') {
    return {
      type: 'ppt',
      title: `${cleanTopic} — Slide Deck Outline`,
      subtitle: 'A 5-slide executive presentation structure for technical reviews or project defenses.',
      topic: cleanTopic,
      generatedAt: now,
      sections: [
        {
          title: 'Slide 1: Title & The Engineering Problem',
          content: [
            `Headline: Modern Challenges in ${cleanTopic}`,
            'Key Bullet: Why legacy approaches fail under scale and real-time constraints',
            'Takeaway: The goal of this technical architecture is verified stability and minimal latency.',
          ],
        },
        {
          title: 'Slide 2: Architectural Deep Dive',
          content: [
            'Visual Diagram: Modular component hierarchy and data flow boundaries',
            'Sub-point: Clear separation of concerns between business logic and peripheral I/O',
            'Metric Target: Sub-10ms response time and zero unhandled exceptions',
          ],
        },
        {
          title: 'Slide 3: Implementation & Empirical Verification',
          content: [
            'Evidence: Benchmarked results against baseline implementations',
            'Code Highlights: Memory safety, thread synchronization, and clean interfaces',
            'Testing Matrix: Unit tests, stress tests, and hardware-in-the-loop validation',
          ],
        },
        {
          title: 'Slide 4: Production Tradeoffs & Failure Modes',
          content: [
            'Tradeoff 1: Memory footprint vs. computation speed',
            'Tradeoff 2: Complexity of asynchronous concurrency vs. deterministic polling',
            'Mitigation Strategy: Comprehensive telemetry and defensive watchdog timers',
          ],
        },
        {
          title: 'Slide 5: Conclusion & Next Steps',
          content: [
            'Summary of key architectural wins',
            'Skill verification milestones completed on NEXSTEP',
            'Q&A opening and live prototype demonstration',
          ],
        },
      ],
    };
  }

  if (type === 'practice') {
    return {
      type: 'practice',
      title: `${cleanTopic} — Technical Practice Exercises`,
      subtitle: 'Hand-crafted real-world problem sets designed to bridge the gap between theory and code.',
      topic: cleanTopic,
      generatedAt: now,
      sections: [
        {
          title: 'Exercise 1: Algorithmic Implementation (Intermediate)',
          content: [
            `Prompt: Implement a thread-safe circular ring buffer for ${cleanTopic} telemetry.`,
            'Constraints: Fixed capacity of 64 elements, O(1) push and pop operations, no memory allocations in the hot path.',
            'Verification Tip: Test with concurrent producer and consumer threads simulating high-frequency sensor interrupts.',
          ],
        },
        {
          title: 'Exercise 2: Debugging & Root Cause Analysis',
          content: [
            'Scenario: A remote node intermittently drops packets after 48 hours of continuous runtime.',
            'Task: Identify whether this is an integer overflow in a 32-bit timestamp counter, memory fragmentation, or a priority inversion deadlock.',
            'Deliverable: Write a concise incident report specifying the root cause and a pull request patch.',
          ],
        },
        {
          title: 'Exercise 3: System Design & Architecture',
          content: [
            `Prompt: Design the end-to-end data pipeline connecting 500 edge nodes running ${cleanTopic} to a centralized monitoring server.`,
            'Requirements: Offline buffering during network outages, mutual TLS authentication, and automatic over-the-air (OTA) updates.',
          ],
        },
      ],
    };
  }

  if (type === 'flashcards') {
    return {
      type: 'flashcards',
      title: `${cleanTopic} — Rapid Recall Flashcards`,
      subtitle: 'Bite-sized question and answer pairs for fast technical reinforcement.',
      topic: cleanTopic,
      generatedAt: now,
      sections: [
        {
          title: 'Card 1: Core Definition',
          content: [
            `Q: What is the primary objective of mastering ${cleanTopic}?`,
            'A: To architect robust, performant systems that operate deterministically under strict real-world constraints.',
          ],
        },
        {
          title: 'Card 2: Critical Pitfall',
          content: [
            'Q: What is the most dangerous anti-pattern when designing this system?',
            'A: Ignoring concurrency race conditions and relying on arbitrary sleep delays instead of deterministic event synchronization.',
          ],
        },
        {
          title: 'Card 3: Verification Metric',
          content: [
            'Q: How does NEXSTEP verify readiness for this skill?',
            'A: Through documented project repositories, code testbenches, and real-time verbal technical interview defenses.',
          ],
        },
      ],
    };
  }

  // Default: interview prep
  return {
    type: 'interview_prep',
    title: `${cleanTopic} — Interview Preparation Guide`,
    subtitle: 'High-frequency technical questions, STAR framing templates, and interviewer evaluation rubrics.',
    topic: cleanTopic,
    generatedAt: now,
    sections: [
      {
        title: 'Top Technical Question 1',
        content: [
          `Question: "How do you ensure reliability and memory safety when working with ${cleanTopic}?"`,
          'Ideal Key Points: Static code analysis, defensive bounds checking, RAII / smart memory ownership, and automated regression testing.',
          'Interviewer looks for: First-principles understanding rather than vague buzzwords.',
        ],
      },
      {
        title: 'Behavioral Project Defense',
        content: [
          `Question: "Tell me about the hardest bug you tracked down while building a ${cleanTopic} project."`,
          'STAR Framework:',
          '• Situation: Describe the project scope and when the bug manifested.',
          '• Task: What was your explicit role in resolving it?',
          '• Action: What diagnostic tools, telemetry logs, or isolation benchmarks did you use?',
          '• Result: Quantifiable outcome (e.g., restored 99.9% uptime, reduced latency by 40%).',
        ],
      },
    ],
  };
}

export interface ComprehensiveLearningMaterials {
  studyNotes: string;
  pptOutline: {
    slideNumber: number;
    title: string;
    bulletPoints: string[];
    speakerNotes: string;
  }[];
  flashcards: {
    front: string;
    back: string;
  }[];
  practiceQuestions: {
    question: string;
    answer: string;
    explanation: string;
  }[];
}

export function generateLearningMaterials(
  topic: string,
  targetDomain?: string
): ComprehensiveLearningMaterials {
  const cleanTopic = topic || 'Embedded Systems Engineering';
  const domain = targetDomain || 'Electronics & Embedded Technology';

  const studyNotes = `# ${cleanTopic} — Master Study Notes
**Target Domain**: ${domain}
**Generated Date**: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

---

### 1. Executive Concept Overview
${cleanTopic} is a cornerstone discipline within ${domain}. True industry mastery demands transitioning beyond theoretical definitions into verified, deterministic execution. Engineering systems in this domain prioritize correctness, safety margins, reproducible builds, and defensive failure boundaries.

Key tenets:
- **Zero Ambiguity**: Always specify numerical bounds, memory constraints, and deterministic response latency rather than guessing.
- **Fail-Safe Design**: When unexpected states arise, degrade gracefully to a known stable operating condition.
- **Measurable Verification**: Every architectural decision must be backed by benchmark metrics, automated unit tests, and empirical evidence.

---

### 2. Foundational Architecture & Formulas
1. **State Machine Modeling**: Use formal Finite State Machines (FSM) to structure asynchronous events. Separate inputs, state transitions, and peripheral side-effects into isolated handler routines.
2. **Resource Budgeting**: In production hardware and high-throughput systems, pre-allocate buffers statically to avoid fragmentation and undefined runtime memory exhaustion.
3. **Signal Integrity & Synchronization**: When interfacing asynchronous inputs, employ debouncing filters, double-buffering, and mutex guards to prevent race conditions.

---

### 3. Production Best Practices vs. Anti-Patterns
- **Avoid Busy-Waiting**: Never rely on blocking loops for timing. Use hardware interrupts, timer callbacks, or RTOS semaphore events.
- **Profile Before Optimizing**: Identify the true bottleneck with logic analyzers, profilers, or execution logs before altering working code.
- **Document Edge Cases**: Always verify boundary conditions (e.g. 0-byte packets, integer rollover, buffer overflow, sudden power fluctuation).

---

### 4. Technical Defense & Interview Preparation
When defending projects in this domain during technical interviews:
- Clarify trade-offs explicitly (e.g., speed vs. memory, cost vs. reliability).
- Walk through your debugging methodology using the STAR framework.
- Demonstrate familiarity with industry toolchains (compilers, debuggers, static analyzers, version control).`;

  const pptOutline = [
    {
      slideNumber: 1,
      title: `${cleanTopic}: Core Engineering Overview`,
      bulletPoints: [
        `Definition and strategic relevance within ${domain}`,
        'Core architectural objectives: high reliability, determinism, and performance',
        'Industry applications across automotive, aerospace, and connected smart systems',
      ],
      speakerNotes: 'Introduce the topic by connecting abstract fundamentals to real-world industrial demands. Highlight why reliable engineering matters.',
    },
    {
      slideNumber: 2,
      title: 'Architectural Framework & Component Layers',
      bulletPoints: [
        'Hardware abstraction, peripheral busses, and runtime execution models',
        'Interrupt handling, priority scheduling, and latency guarantees',
        'Memory management strategies: static allocation vs. dynamic safety',
      ],
      speakerNotes: 'Detail the multi-layer stack. Explain how each layer isolates complexity and prevents hardware-level race conditions.',
    },
    {
      slideNumber: 3,
      title: 'Implementation Patterns & Best Practices',
      bulletPoints: [
        'Deterministic state machine design over chaotic nested branches',
        'Defensive coding standards: bounds checking, watchdogs, and assertions',
        'Version control, modular decoupling, and continuous test automation',
      ],
      speakerNotes: 'Emphasize that top-tier companies hire for clean, maintainable, defensive code rather than quick unverified hacks.',
    },
    {
      slideNumber: 4,
      title: 'Common Bottlenecks & Debugging Protocols',
      bulletPoints: [
        'Diagnosing memory leaks, race conditions, and timing jitters',
        'Instrumentation techniques: hardware logic analyzers, oscilloscopes, and loggers',
        'Root cause isolation: systematic binary search and reproducible testbenches',
      ],
      speakerNotes: 'Walk the audience through a real troubleshooting workflow. Explain how you systematically pinpoint errors.',
    },
    {
      slideNumber: 5,
      title: 'Verification Milestone & Industry Readiness',
      bulletPoints: [
        'Demonstrating verified proficiency through reproducible public repositories',
        'Preparing for technical whiteboarding and peer code review defenses',
        'Continuous learning trajectory: transitioning from school basics to production roles',
      ],
      speakerNotes: 'Conclude with actionable steps for students to build their Skill Passport evidence and prepare for technical evaluations.',
    },
  ];

  const flashcards = [
    {
      front: `What is the primary architectural goal of ${cleanTopic}?`,
      back: 'To deliver predictable, deterministic execution with strict adherence to safety, resource constraints, and reliable state transitions.',
    },
    {
      front: 'Why should busy-waiting delay loops be avoided in production?',
      back: 'They waste valuable CPU cycles, prevent other tasks or interrupts from executing promptly, and create non-deterministic timing across different clock frequencies.',
    },
    {
      front: 'What is the STAR framework and why is it used in technical project reviews?',
      back: 'Situation, Task, Action, Result — a structured method to articulate real engineering challenges, personal contributions, diagnostic actions, and measurable outcomes.',
    },
    {
      front: 'How does NEXSTEP calculate skill verification confidence?',
      back: 'Deterministically based on verified evidence types: code repositories (+25%), live demos (+20%), passed assessments (+25%), and peer/mentor reviews (+15%).',
    },
    {
      front: `What is the difference between static allocation and dynamic allocation in ${cleanTopic}?`,
      back: 'Static allocation assigns memory at compile time guaranteeing availability with zero fragmentation risk, while dynamic allocation claims memory at runtime with potential heap exhaustion.',
    },
  ];

  const practiceQuestions = [
    {
      question: `How would you architect a fault-tolerant subsystem for ${cleanTopic}?`,
      answer: 'Implement a supervisor watchdog timer, state persistence, and clear input validation boundaries.',
      explanation: 'Fault tolerance requires isolating failures, saving critical state before reset, and validating all peripheral data before consumption.',
    },
    {
      question: 'What diagnostic steps do you take when a system behaves inconsistently under heavy load?',
      answer: 'Attach a profiler/logic analyzer to inspect timing jitter, check for race conditions, and inspect memory allocation headroom.',
      explanation: 'Intermittent bugs under load usually stem from race conditions or buffer exhaustion. Systematic instrumentation is required.',
    },
    {
      question: 'Why is modular code separation important when collaborating on engineering hardware/software projects?',
      answer: 'It decouples hardware drivers from business logic, allowing unit testing without physical hardware attached.',
      explanation: 'Using hardware abstraction layers (HAL) allows software simulation on host machines and accelerates team velocity.',
    },
  ];

  return {
    studyNotes,
    pptOutline,
    flashcards,
    practiceQuestions,
  };
}


