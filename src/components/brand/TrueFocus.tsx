import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
}

export function TrueFocus({
  sentence = "NEX STEP",
  separator = " ",
  manualMode = false,
  blurAmount = 4,
  borderColor = "#C7F36B",
  glowColor = "rgba(199, 243, 107, 0.45)",
  animationDuration = 0.7,
  pauseBetweenAnimations = 1.4,
}: TrueFocusProps) {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    if (!manualMode) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000);

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!containerRef.current || !words.length) return;

    const parent = containerRef.current;
    const activeWord = parent.querySelectorAll(".word")[currentIndex] as HTMLElement;

    if (!activeWord) return;

    const parentRect = parent.getBoundingClientRect();
    const activeRect = activeWord.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      w: activeRect.width,
      h: activeRect.height,
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(currentIndex);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center flex-wrap gap-4 cursor-pointer"
    >
      <motion.div
        className="absolute top-0 left-0 pointer-events-none rounded-lg border-2"
        style={{
          borderColor: borderColor,
          boxShadow: `0 0 15px ${glowColor}`,
        }}
        initial={false}
        animate={{
          x: focusRect.x - 8,
          y: focusRect.y - 8,
          width: focusRect.w + 16,
          height: focusRect.h + 16,
          opacity: focusRect.w > 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
          ease: "easeInOut",
        }}
      />
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            className="word font-bold text-5xl md:text-7xl transition-all duration-300"
            style={{
              filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.5,
              color: isActive ? "var(--text)" : "var(--text-muted)",
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
