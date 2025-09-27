'use client';

import { ReactNode, useEffect, useState } from 'react';

interface MotionProviderProps {
  children: ReactNode;
  enableCursor?: boolean;
}

/**
 * Motion Provider Component
 * 
 * Dynamically loads and initializes the motion system (GSAP, Lenis, particle cursor, reduced motion detection)
 * when the app mounts and cleans up when it unmounts.
 * Uses code splitting to reduce initial bundle size.
 */
export function MotionProvider({ children, enableCursor = true }: MotionProviderProps) {
  const [isMotionLoaded, setIsMotionLoaded] = useState(false);

  useEffect(() => {
    let motionCleanupFn: (() => void) | null = null;
    let cursorCleanupFn: (() => void) | null = null;

    // Dynamically import and initialize motion system
    const initializeMotion = async () => {
      try {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        console.log('🎭 Initializing Motion System...', { prefersReducedMotion, enableCursor });
        
        // Initialize the motion system
        const { initMotionSystem, cleanupMotionSystem } = await import('@/lib/motion');
        initMotionSystem();
        motionCleanupFn = cleanupMotionSystem;
        
        // Initialize particle cursor if enabled
        if (enableCursor && !prefersReducedMotion) {
          try {
            const { initCursor } = await import('@/lib/cursor');
            cursorCleanupFn = initCursor({
              mode: 'particles',
              particleCount: 120,
              baseSize: 10,
              haloSize: 28,
              spring: {
                stiffness: 0.22,
                damping: 0.82
              },
              themeAware: true, // Enable theme-aware colors
              magnetic: {
                enabled: true,
                radius: 60,
                strength: 0.12
              }
            }, {
              onBurst: (x, y) => {
                console.log('🎆 Cursor burst at:', x, y);
              },
              onHoverEnter: (element) => {
                console.log('🧲 Magnetic hover enter:', element);
              },
              onHoverLeave: (element) => {
                console.log('🧲 Magnetic hover leave:', element);
              }
            });
            
            console.log('✨ Particle Cursor Initialized Successfully');
          } catch (cursorError) {
            console.warn('⚠️ Failed to initialize particle cursor:', cursorError);
          }
        }
        
        setIsMotionLoaded(true);
        console.log('✅ Motion System Initialized Successfully');
      } catch (error) {
        console.error('❌ Failed to initialize motion system:', error);
        setIsMotionLoaded(true); // Still mark as loaded to prevent blocking
      }
    };

    initializeMotion();

    // Cleanup on unmount
    return () => {
      if (motionCleanupFn) {
        motionCleanupFn();
      }
      if (cursorCleanupFn) {
        cursorCleanupFn();
      }
    };
  }, [enableCursor]);

  // Add a data attribute to track motion system status
  useEffect(() => {
    if (isMotionLoaded) {
      document.documentElement.setAttribute('data-motion-loaded', 'true');
      if (enableCursor) {
        document.documentElement.setAttribute('data-cursor-enabled', 'true');
      }
    }
  }, [isMotionLoaded, enableCursor]);

  return <>{children}</>;
}