'use client';

import Lenis from 'lenis';
import { motionTokens } from './tokens';

let lenis: Lenis | null = null;

/**
 * Initialize Lenis smooth scrolling
 * Automatically detects reduced motion preferences and disables smooth scrolling accordingly
 */
export function initLenis(): Lenis | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return null;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Don't initialize smooth scrolling if user prefers reduced motion
  if (prefersReducedMotion) {
    console.log('Smooth scrolling disabled due to reduced motion preference');
    return null;
  }

  // Clean up existing instance
  if (lenis) {
    lenis.destroy();
  }

  // Initialize Lenis with optimized settings
  lenis = new Lenis({
    lerp: motionTokens.scroll.lerp,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
    touchMultiplier: 2,
    infinite: false,
  });

  // Start the animation loop
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Add scroll event listener for custom scroll events
  lenis.on('scroll', (e) => {
    // Dispatch custom scroll event for other components to listen to
    window.dispatchEvent(new CustomEvent('lenis-scroll', { 
      detail: { 
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      }
    }));
  });

  return lenis;
}

/**
 * Get the current Lenis instance
 */
export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Scroll to a specific element or position
 */
export function scrollTo(target: string | number | HTMLElement, options?: {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
}) {
  if (!lenis) return;

  lenis.scrollTo(target, {
    offset: options?.offset ?? 0,
    duration: options?.duration ?? 1,
    easing: options?.easing,
    immediate: options?.immediate ?? false,
  });
}

/**
 * Stop smooth scrolling
 */
export function stopLenis() {
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Start smooth scrolling
 */
export function startLenis() {
  if (lenis) {
    lenis.start();
  }
}

/**
 * Destroy Lenis instance
 */
export function destroyLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

/**
 * Hook for React components to use Lenis
 */
export function useLenis() {
  return {
    lenis: getLenis(),
    scrollTo,
    stop: stopLenis,
    start: startLenis,
    destroy: destroyLenis,
  };
}

/**
 * Utility to check if smooth scrolling is enabled
 */
export function isSmoothScrollEnabled(): boolean {
  return lenis !== null && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Listen for reduced motion changes and update Lenis accordingly
 */
export function setupReducedMotionListener() {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      // User now prefers reduced motion - destroy Lenis
      destroyLenis();
    } else {
      // User no longer prefers reduced motion - reinitialize Lenis
      initLenis();
    }
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.removeListener(handleChange);
    }
  };
}