/**
 * Motion Design Tokens
 * Centralized configuration for all animations, transitions, and motion effects.
 */

// Duration tokens (in seconds for consistency)
export const DURATIONS = {
  xs: 0.25,
  sm: 0.4,
  md: 0.7,
  lg: 1.0,
} as const;

// Easing curves
export const EASING = {
  standard: 'power2.out',
  entrance: 'power3.out',
  exit: 'power3.in',
} as const;

// Viewport detection settings
export const VIEWPORT = {
  rootMargin: '-20% 0px',
  amount: 0.2,
} as const;

// Dynamic stagger calculation
export const STAGGER = (count: number) => Math.min(0.7, 0.04 * count + 0.2);

// Legacy tokens for backward compatibility
export const motionTokens = {
  durations: {
    fast: DURATIONS.xs * 1000,
    normal: DURATIONS.sm * 1000,
    slow: DURATIONS.md * 1000,
    slower: DURATIONS.lg * 1000,
    slowest: 1000,
  },
  easings: {
    standard: [0.4, 0.0, 0.2, 1] as const,
    entrance: [0.0, 0.0, 0.2, 1] as const,
    exit: [0.4, 0.0, 1, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    sharp: [0.4, 0.0, 0.6, 1] as const,
  },
  gsapEasings: {
    standard: EASING.standard,
    entrance: EASING.entrance,
    exit: EASING.exit,
    bounce: 'back.out(1.7)',
    sharp: 'power3.out',
    elastic: 'elastic.out(1, 0.3)',
  },
  reveal: {
    distance: 24,
    stagger: 0.1,
    threshold: VIEWPORT.amount,
  },
  parallax: {
    subtle: 0.2,
    moderate: 0.5,
    strong: 0.8,
  },
  magnetic: {
    strength: 0.3,
    ease: 'power2.out',
    duration: 0.3,
  },
  scroll: {
    start: 'top 80%',
    end: 'bottom 20%',
    lerp: 0.1,
    multiplier: 1,
  },
  springs: {
    gentle: { type: 'spring' as const, stiffness: 120, damping: 14 },
    bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
    snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  transforms: {
    slideDistance: 50,
    scaleStart: 0.8,
    rotateAngle: 5,
  },
} as const;

// Type exports
export type MotionTokens = typeof motionTokens;
export type Duration = keyof typeof DURATIONS;
export type Easing = keyof typeof EASING;
export type MotionDuration = keyof typeof motionTokens.durations;
export type MotionEasing = keyof typeof motionTokens.easings;
export type GSAPEasing = keyof typeof motionTokens.gsapEasings;
export type SpringPreset = keyof typeof motionTokens.springs;