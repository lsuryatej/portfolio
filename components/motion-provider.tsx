'use client';

import { ReactNode, useEffect, useState } from 'react';

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Motion Provider Component
 * 
 * Dynamically loads and initializes the motion system (GSAP, Lenis, reduced motion detection)
 * when the app mounts and cleans up when it unmounts.
 * Uses code splitting to reduce initial bundle size.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const [isMotionLoaded, setIsMotionLoaded] = useState(false);

  useEffect(() => {
    let cleanupFn: (() => void) | null = null;

    // Dynamically import and initialize motion system
    const initializeMotion = async () => {
      try {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        console.log('🎭 Initializing Motion System...', { prefersReducedMotion });
        
        // Always initialize the motion system, but with different configurations
        const { initMotionSystem, cleanupMotionSystem } = await import('@/lib/motion');
        initMotionSystem();
        cleanupFn = cleanupMotionSystem;
        
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
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, []);

  // Add a data attribute to track motion system status
  useEffect(() => {
    if (isMotionLoaded) {
      document.documentElement.setAttribute('data-motion-loaded', 'true');
    }
  }, [isMotionLoaded]);

  return <>{children}</>;
}