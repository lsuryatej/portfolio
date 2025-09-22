/**
 * Motion Design Tokens
 * 
 * Centralized animation constants for consistent motion design
 * across the portfolio website.
 */

export const motionTokens = {
  // Animation durations in milliseconds
  durations: {
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 800,
  },

  // Easing curves for different animation types
  easings: {
    // Standard easing for most animations
    standard: [0.4, 0.0, 0.2, 1] as const,
    // Entrance animations (elements coming into view)
    entrance: [0.0, 0.0, 0.2, 1] as const,
    // Exit animations (elements leaving view)
    exit: [0.4, 0.0, 1, 1] as const,
    // Bouncy animations for playful interactions
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    // Sharp animations for quick interactions
    sharp: [0.4, 0.0, 0.6, 1] as const,
  },

  // GSAP-compatible easing strings
  gsapEasings: {
    standard: 'power2.out',
    entrance: 'power2.out',
    exit: 'power2.in',
    bounce: 'back.out(1.7)',
    sharp: 'power3.out',
    elastic: 'elastic.out(1, 0.3)',
  },

  // Reveal animation settings
  reveal: {
    distance: 24, // Distance elements move during reveal
    stagger: 0.1, // Delay between staggered elements
    threshold: 0.1, // Intersection observer threshold
  },

  // Parallax settings
  parallax: {
    subtle: 0.2,   // Subtle background movement
    moderate: 0.5, // Moderate parallax effect
    strong: 0.8,   // Strong parallax effect
  },

  // Magnetic cursor settings
  magnetic: {
    strength: 0.3,     // Attraction strength
    ease: 'power2.out', // Easing for magnetic movement
    duration: 0.3,     // Animation duration
  },

  // Scroll animation settings
  scroll: {
    // ScrollTrigger defaults
    start: 'top 80%',
    end: 'bottom 20%',
    // Smooth scrolling settings
    lerp: 0.1,        // Linear interpolation factor
    multiplier: 1,    // Scroll speed multiplier
  },

  // Spring physics settings (for Framer Motion)
  springs: {
    gentle: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 14,
    },
    bouncy: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 10,
    },
    snappy: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },

  // Transform values
  transforms: {
    slideDistance: 50,  // Distance for slide animations
    scaleStart: 0.8,   // Starting scale for scale animations
    rotateAngle: 5,    // Rotation angle for tilt effects
  },
} as const;

// Type exports for TypeScript support
export type MotionDuration = keyof typeof motionTokens.durations;
export type MotionEasing = keyof typeof motionTokens.easings;
export type GSAPEasing = keyof typeof motionTokens.gsapEasings;
export type SpringPreset = keyof typeof motionTokens.springs;