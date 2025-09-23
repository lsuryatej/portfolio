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

// Export motion primitives with lazy loading
export {
  FadeIn,
  RiseIn,
  ScaleIn,
  SlideIn,
  StaggerChildren,
  Magnetic,
} from './primitives';

// Lazy-loaded heavy animation components
export const LazyScrollSequence = () => import('@/components/projects/scroll-sequence').then(m => m.ScrollSequence);
export const LazyBeforeAfterSlider = () => import('@/components/projects/before-after-slider').then(m => m.BeforeAfterSlider);
export const LazyMediaGallery = () => import('@/components/projects/media-gallery').then(m => m.MediaGallery);

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
import { initGSAP, killAllScrollTriggers, setupGSAPReducedMotionListener, batchRefreshScrollTrigger } from './scroll';
import { initLenis, destroyLenis, setupReducedMotionListener } from './lenis';

// Utility function to initialize the entire motion system
export function initMotionSystem() {
  if (typeof window === 'undefined') return;

  console.log('🎭 Initializing Motion System...');

  // Initialize GSAP
  initGSAP();
  
  // Initialize Lenis smooth scrolling
  const lenis = initLenis();
  
  // Setup reduced motion listeners
  setupReducedMotionListener();
  setupGSAPReducedMotionListener();
  
  // Initialize batch scroll animations for elements with data-animate
  setTimeout(() => {
    batchRefreshScrollTrigger();
  }, 100);
  
  // Add global scroll event for custom animations
  if (lenis) {
    lenis.on('scroll', ({ scroll, velocity, direction }) => {
      // Dispatch custom events for other components
      window.dispatchEvent(new CustomEvent('scroll-update', {
        detail: { scroll, velocity, direction }
      }));
    });
  }
  
  console.log('✅ Motion System Initialized Successfully');
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