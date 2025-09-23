'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motionTokens } from '@/lib/motion/tokens';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export function BackToTop({ threshold = 0.25, className = '' }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      
      setScrollProgress(progress);
      setIsVisible(progress > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-6 right-6 z-50 ${className}`}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={motionTokens.springs.bouncy}
        >
          <Button
            onClick={scrollToTop}
            size="lg"
            className="relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
            aria-label="Back to top"
          >
            {/* Progress Ring Background */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 56 56"
            >
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/20"
              />
              
              {/* Progress circle */}
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-primary-foreground"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: scrollProgress }}
                transition={{ duration: 0.2 }}
                style={{
                  strokeDasharray: '150.8', // 2 * π * 24
                  strokeDashoffset: `${150.8 * (1 - scrollProgress)}`,
                }}
              />
            </svg>

            {/* Morphing Icon */}
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={motionTokens.springs.snappy}
            >
              <motion.div
                animate={{
                  rotate: scrollProgress > 0.8 ? 360 : 0,
                }}
                transition={{
                  duration: 0.5,
                  ease: motionTokens.easings.bounce,
                }}
              >
                <ArrowUp className="h-5 w-5" />
              </motion.div>
            </motion.div>

            {/* Ripple Effect on Hover */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{
                scale: 1.2,
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          </Button>

          {/* Tooltip */}
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-foreground text-background text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            Back to top
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FloatingProgressProps {
  className?: string;
}

export function FloatingProgress({ className = '' }: FloatingProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={`fixed top-6 right-6 z-40 ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: scrollProgress > 0.1 ? 1 : 0, scale: scrollProgress > 0.1 ? 1 : 0 }}
      transition={motionTokens.springs.gentle}
    >
      <div className="relative w-12 h-12">
        {/* Background Circle */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm border rounded-full" />
        
        {/* Progress Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground/20"
          />
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary"
            style={{
              strokeDasharray: '125.66',
              strokeDashoffset: `${125.66 * (1 - scrollProgress)}`,
            }}
            transition={{ duration: 0.1 }}
          />
        </svg>
        
        {/* Progress Percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}