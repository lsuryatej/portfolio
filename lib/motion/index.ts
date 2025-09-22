/**
 * Motion System
 * 
 * Centralized animation system for the portfolio website.
 * Includes motion tokens, primitives, smooth scrolling, and GSAP utilities.
 */

// Export motion tokens
export { motionTokens } from './tokens';
export type { 
  MotionDuration, 
  MotionEasing, 
  GSAPEasing, 
  SpringPreset 
} from './tokens';

// Export motion primitives
export {
  FadeIn,
  RiseIn,
  ScaleIn,
  SlideIn,
  StaggerChildren,
  Magnetic,
} from './primitives';

// Export Lenis smooth scrolling utilities
export {
  initLenis,
  getLenis,
  scrollTo,
  stopLenis,
  startLenis,
  destroyLenis,
  useLenis,
  isSmoothScrollEnabled,
  setupReducedMotionListener,
} from './lenis';

// Export GSAP scroll utilities
export {
  initGSAP,
  createScrollAnimation,
  createStaggeredScrollAnimation,
  createParallaxEffect,
  createScrollProgress,
  createMagneticEffect,
  batchRefreshScrollTrigger,
  killAllScrollTriggers,
  refreshScrollTrigger,
  shouldAnimate,
  setupGSAPReducedMotionListener,
} from './scroll';

// Import functions for the utility functions
import { initGSAP, killAllScrollTriggers, setupGSAPReducedMotionListener } from './scroll';
import { initLenis, destroyLenis, setupReducedMotionListener } from './lenis';

// Utility function to initialize the entire motion system
export function initMotionSystem() {
  if (typeof window === 'undefined') return;

  // Initialize GSAP
  initGSAP();
  
  // Initialize Lenis smooth scrolling
  initLenis();
  
  // Setup reduced motion listeners
  setupReducedMotionListener();
  setupGSAPReducedMotionListener();
  
  console.log('Motion system initialized');
}

// Utility function to cleanup the motion system
export function cleanupMotionSystem() {
  if (typeof window === 'undefined') return;

  // Cleanup Lenis
  destroyLenis();
  
  // Cleanup GSAP
  killAllScrollTriggers();
  
  console.log('Motion system cleaned up');
}