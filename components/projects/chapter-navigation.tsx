'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motionTokens } from '@/lib/motion/tokens';

interface Chapter {
  id: string;
  title: string;
  anchor: string;
}

interface ChapterNavigationProps {
  chapters: Chapter[];
  className?: string;
}

export function ChapterNavigation({ chapters, className = '' }: ChapterNavigationProps) {
  const [activeChapter, setActiveChapter] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup intersection observer for active chapter detection
  useEffect(() => {
    if (chapters.length === 0) return;

    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapterId = entry.target.id;
          setActiveChapter(chapterId);
        }
      });
    }, observerOptions);

    // Observe all chapter elements
    chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.anchor);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [chapters]);

  // Setup scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to chapter
  const scrollToChapter = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setIsExpanded(false);
    }
  };

  // Navigate to previous/next chapter
  const navigateChapter = (direction: 'prev' | 'next') => {
    const currentIndex = chapters.findIndex((chapter) => chapter.anchor === activeChapter);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    const targetChapter = chapters[targetIndex];
    if (targetChapter && targetIndex >= 0 && targetIndex < chapters.length) {
      scrollToChapter(targetChapter.anchor);
    }
  };

  const currentChapterIndex = chapters.findIndex((chapter) => chapter.anchor === activeChapter);
  const currentChapter = chapters[currentChapterIndex];

  if (chapters.length === 0) return null;

  return (
    <div className={`fixed right-6 top-1/2 -translate-y-1/2 z-30 ${className}`}>
      {/* Compact Navigation */}
      <motion.div
        className="bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={motionTokens.springs.gentle}
      >
        {/* Progress Ring */}
        <div className="relative p-4">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
            {/* Background circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground/20"
            />
            {/* Progress circle */}
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: scrollProgress }}
              transition={{ duration: 0.2 }}
              style={{
                pathLength: scrollProgress,
                strokeDasharray: '125.66', // 2 * π * 20
              }}
            />
          </svg>
          
          {/* Chapter indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium">
              {currentChapterIndex + 1}/{chapters.length}
            </span>
          </div>
        </div>

        {/* Current Chapter Info */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left group"
          >
            <div className="text-xs text-muted-foreground mb-1">Current</div>
            <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {currentChapter?.title || 'Introduction'}
            </div>
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter('prev')}
            disabled={currentChapterIndex <= 0}
            className="flex-1 rounded-none border-r"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 rounded-none border-r"
          >
            <span className="text-xs">Menu</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateChapter('next')}
            disabled={currentChapterIndex >= chapters.length - 1}
            className="flex-1 rounded-none"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Expanded Chapter List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute right-0 bottom-full mb-4 w-64 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={motionTokens.springs.gentle}
          >
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Chapters
              </div>
              
              <div className="space-y-1">
                {chapters.map((chapter, index) => (
                  <motion.button
                    key={chapter.anchor}
                    onClick={() => scrollToChapter(chapter.anchor)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors relative ${
                      activeChapter === chapter.anchor
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ x: 4 }}
                    transition={motionTokens.springs.snappy}
                  >
                    {/* Active indicator */}
                    {activeChapter === chapter.anchor && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r"
                        layoutId="activeChapter"
                        transition={motionTokens.springs.gentle}
                      />
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs opacity-60 min-w-[1.5rem]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="line-clamp-2">{chapter.title}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}