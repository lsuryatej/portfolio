/**
 * Motion Configuration & Feature Flags
 * Controls which animation features are enabled based on environment and device capabilities
 */

export type MotionLevel = 'basic' | 'enhanced' | 'max';

// Get motion level from environment or default to 'enhanced'
export const MOTION_LEVEL: MotionLevel = (process.env.NEXT_PUBLIC_MOTION_LEVEL as MotionLevel) || 'enhanced';

/**
 * Check if motion level is at maximum (all features enabled)
 */
export function isMax(): boolean {
  return MOTION_LEVEL === 'max';
}

/**
 * Check if motion level is enhanced or higher (WebGL, complex animations)
 */
export function isEnhanced(): boolean {
  return MOTION_LEVEL === 'enhanced' || MOTION_LEVEL === 'max';
}

/**
 * Check if motion level is basic or higher (simple fades, basic animations)
 */
export function isBasic(): boolean {
  return MOTION_LEVEL === 'basic' || isEnhanced();
}

/**
 * Get device capabilities and adjust motion level accordingly
 */
export function getDeviceAdjustedMotionLevel(): MotionLevel {
  if (typeof window === 'undefined') return MOTION_LEVEL;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return 'basic';

  // Check device capabilities
  const isMobile = window.innerWidth < 768;
  const isLowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
  const isSlowConnection = (navigator as Navigator & { connection?: { effectiveType: string } }).connection && (navigator as Navigator & { connection?: { effectiveType: string } }).connection!.effectiveType === 'slow-2g';

  // Downgrade on low-end devices
  if (isMobile && (isLowMemory || isSlowConnection)) {
    return MOTION_LEVEL === 'max' ? 'enhanced' : 'basic';
  }

  return MOTION_LEVEL;
}

/**
 * Feature flags based on motion level
 */
export const MOTION_FEATURES = {
  // Basic features (always enabled)
  fadeAnimations: true,
  basicTransitions: true,
  
  // Enhanced features
  particleField: isEnhanced(),
  gradientMesh: isEnhanced(),
  patternOverlay: isEnhanced(),
  horizontalScroll: isEnhanced(),
  card3D: isEnhanced(),
  morphText: isEnhanced(),
  
  // Max features
  webglShaders: isMax(),
  canvasSequence: isMax(),
  complexParallax: isMax(),
  magneticCursor: isMax(),
} as const;

/**
 * Performance budgets based on motion level
 */
export const PERFORMANCE_BUDGETS = {
  basic: {
    maxParticles: 50,
    maxAnimations: 5,
    targetFPS: 30,
  },
  enhanced: {
    maxParticles: 150,
    maxAnimations: 10,
    targetFPS: 60,
  },
  max: {
    maxParticles: 300,
    maxAnimations: 20,
    targetFPS: 60,
  },
} as const;

/**
 * Get performance budget for current motion level
 */
export function getPerformanceBudget() {
  const adjustedLevel = getDeviceAdjustedMotionLevel();
  return PERFORMANCE_BUDGETS[adjustedLevel];
}