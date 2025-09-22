'use client';

import { ReactNode, useEffect } from 'react';
import { initMotionSystem, cleanupMotionSystem } from '@/lib/motion';

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * Motion Provider Component
 * 
 * Initializes the motion system (GSAP, Lenis, reduced motion detection)
 * when the app mounts and cleans up when it unmounts.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    // Initialize motion system on mount
    initMotionSystem();

    // Cleanup on unmount
    return () => {
      cleanupMotionSystem();
    };
  }, []);

  return <>{children}</>;
}