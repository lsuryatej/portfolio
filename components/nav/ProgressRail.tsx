'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  label: string;
  href: string;
}

interface ProgressRailProps {
  sections: Section[];
  className?: string;
  disabled?: boolean;
}

export default function ProgressRail({ 
  sections, 
  className = '',
  disabled = false 
}: ProgressRailProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const railRef = useRef<HTMLElement>(null);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(sectionId);
    }
  }, [scrollToSection]);

  // Set up intersection observer
  useEffect(() => {
    if (disabled) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Show rail after a delay
    const showTimer = setTimeout(() => setIsVisible(true), 1000);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(showTimer);
    };
  }, [sections, disabled]);

  if (disabled || sections.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop: Sticky rail on the right */}
          <motion.nav
            ref={railRef}
            className={cn(
              'hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40',
              'flex-col gap-2 p-3 bg-background/80 backdrop-blur-sm',
              'border border-border/50 rounded-full shadow-lg',
              className
            )}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            role="navigation"
            aria-label="Page sections"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                onKeyDown={(e) => handleKeyDown(e, section.id)}
                className={cn(
                  'relative w-3 h-3 rounded-full transition-all duration-300',
                  'hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  activeSection === section.id
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to ${section.label}`}
                aria-current={activeSection === section.id ? 'true' : 'false'}
              >
                {/* Tooltip */}
                <span className={cn(
                  'absolute right-full mr-3 top-1/2 -translate-y-1/2',
                  'px-2 py-1 text-xs font-medium text-foreground',
                  'bg-background border border-border rounded shadow-md',
                  'opacity-0 pointer-events-none transition-opacity duration-200',
                  'group-hover:opacity-100 whitespace-nowrap'
                )}>
                  {section.label}
                </span>
              </button>
            ))}
          </motion.nav>

          {/* Mobile: Bottom mini-bar */}
          <motion.nav
            className={cn(
              'lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40',
              'flex gap-2 p-3 bg-background/90 backdrop-blur-sm',
              'border border-border/50 rounded-full shadow-lg',
              className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            role="navigation"
            aria-label="Page sections"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                onKeyDown={(e) => handleKeyDown(e, section.id)}
                className={cn(
                  'relative w-2 h-2 rounded-full transition-all duration-300',
                  'hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  activeSection === section.id
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to ${section.label}`}
                aria-current={activeSection === section.id ? 'true' : 'false'}
              />
            ))}
            
            {/* Progress indicator */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary/20 rounded-full"
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${((sections.findIndex(s => s.id === activeSection) + 1) / sections.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}