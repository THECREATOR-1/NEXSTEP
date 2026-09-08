import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'NEX STEP',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1.8,
  className = '',
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [words.length, animationDuration, pauseBetweenAnimations]);

  return (
    <div className={`relative inline-flex items-center gap-2 font-bold tracking-tight select-none ${className}`}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            className="relative px-2 py-0.5 transition-all duration-300 rounded"
          >
            <span
              className={`transition-all duration-300 ${
                isActive
                  ? 'opacity-100'
                  : 'opacity-65 filter blur-[0.6px]'
              }`}
            >
              {word}
            </span>

            {isActive && (
              <motion.span
                layoutId="true-focus-box"
                className="absolute inset-0 border-2 border-[#C7F36B] rounded pointer-events-none"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  duration: animationDuration,
                }}
              >
                {/* Subtle corner brackets for high-tech precision aesthetic */}
                <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-[#101413] dark:bg-[#F4F7F2] border border-[#C7F36B]" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#101413] dark:bg-[#F4F7F2] border border-[#C7F36B]" />
                <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#101413] dark:bg-[#F4F7F2] border border-[#C7F36B]" />
                <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-[#101413] dark:bg-[#F4F7F2] border border-[#C7F36B]" />
              </motion.span>
            )}
          </span>
        );
      })}
    </div>
  );
};
