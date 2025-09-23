import dynamic from 'next/dynamic';

/**
 * Dynamic Component Loader
 * 
 * Utilities for code splitting heavy components and animation libraries
 */

// Dynamic loading utilities

// Removed createDynamicComponent function - using direct dynamic imports instead

/**
 * Dynamically loaded heavy animation components
 */
export const DynamicScrollSequence = dynamic(
  () => import('@/components/projects/scroll-sequence').then(m => ({ default: m.ScrollSequence })),
  { ssr: false }
);

export const DynamicBeforeAfterSlider = dynamic(
  () => import('@/components/projects/before-after-slider').then(m => ({ default: m.BeforeAfterSlider })),
  { ssr: false }
);

export const DynamicMediaGallery = dynamic(
  () => import('@/components/projects/media-gallery').then(m => ({ default: m.MediaGallery })),
  { ssr: false }
);

export const DynamicBackToTop = dynamic(
  () => import('@/components/projects/back-to-top').then(m => ({ default: m.BackToTop })),
  { ssr: false }
);

/**
 * Dynamically loaded blog components
 */
export const DynamicCodeBlock = dynamic(
  () => import('@/components/blog/code-block').then(m => ({ default: m.CodeBlock })),
  { ssr: true }
);

/**
 * Preload critical dynamic components
 */
export function preloadCriticalComponents() {
  if (typeof window === 'undefined') return;

  // Preload components that are likely to be needed soon
  const preloadPromises = [
    import('@/components/projects/back-to-top'),
    import('@/components/blog/code-block'),
  ];

  // Don't await - just start the preloading
  Promise.all(preloadPromises).catch(console.warn);
}

/**
 * Conditionally load animation libraries based on user preferences
 */
export async function loadAnimationLibraries() {
  if (typeof window === 'undefined') return null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return null;
  }

  try {
    // Dynamically import GSAP and Lenis only when needed
    const [gsapModule, scrollTriggerModule, lenisModule] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]);

    return {
      gsap: gsapModule.gsap,
      ScrollTrigger: scrollTriggerModule.ScrollTrigger,
      Lenis: lenisModule.default,
    };
  } catch (error) {
    console.warn('Failed to load animation libraries:', error);
    return null;
  }
}