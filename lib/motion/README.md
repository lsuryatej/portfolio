# Motion System

A comprehensive animation system for the portfolio website, featuring smooth scroll animations, motion primitives, and accessibility-first design.

## Features

- **Motion Tokens**: Centralized animation constants for consistent timing and easing
- **Motion Primitives**: Reusable React components for common animations
- **Smooth Scrolling**: Lenis-powered smooth scrolling with reduced motion support
- **GSAP Integration**: Advanced scroll-triggered animations and effects
- **Accessibility**: Automatic reduced motion detection and graceful degradation

## Quick Start

### 1. Initialize the Motion System

The motion system is automatically initialized in the root layout via the `MotionProvider`:

```tsx
import { MotionProvider } from '@/components/motion-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
```

### 2. Use Motion Primitives

```tsx
import { FadeIn, RiseIn, ScaleIn, SlideIn, StaggerChildren, Magnetic } from '@/lib/motion';

function MyComponent() {
  return (
    <div>
      {/* Basic fade in animation */}
      <FadeIn>
        <h1>This will fade in</h1>
      </FadeIn>

      {/* Rise in with delay */}
      <RiseIn delay={0.2}>
        <p>This will slide up after a delay</p>
      </RiseIn>

      {/* Scale in with custom duration */}
      <ScaleIn duration={600}>
        <div>This will scale in slowly</div>
      </ScaleIn>

      {/* Slide in from different directions */}
      <SlideIn direction="left">
        <div>Slides in from left</div>
      </SlideIn>

      {/* Staggered children animations */}
      <StaggerChildren stagger={0.1}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerChildren>

      {/* Magnetic cursor effect */}
      <Magnetic>
        <button>Hover me!</button>
      </Magnetic>
    </div>
  );
}
```

### 3. Use GSAP Utilities

```tsx
import { 
  createScrollAnimation, 
  createStaggeredScrollAnimation,
  createParallaxEffect,
  createScrollProgress 
} from '@/lib/motion';

// Create scroll-triggered animation
createScrollAnimation('.my-element', {
  opacity: 1,
  y: 0,
});

// Create staggered animations
createStaggeredScrollAnimation('.my-cards', {
  opacity: 1,
  y: 0,
}, { stagger: 0.1 });

// Create parallax effect
createParallaxEffect('.parallax-bg', 0.5);

// Create scroll progress bar
createScrollProgress('.progress-bar');
```

## Motion Tokens

The motion system uses centralized tokens for consistent animations:

```typescript
import { motionTokens } from '@/lib/motion';

// Durations (in milliseconds)
motionTokens.durations.fast      // 100ms
motionTokens.durations.normal    // 200ms
motionTokens.durations.slow      // 300ms
motionTokens.durations.slower    // 500ms
motionTokens.durations.slowest   // 800ms

// Easing curves
motionTokens.easings.standard    // [0.4, 0.0, 0.2, 1]
motionTokens.easings.entrance    // [0.0, 0.0, 0.2, 1]
motionTokens.easings.exit        // [0.4, 0.0, 1, 1]
motionTokens.easings.bounce      // [0.68, -0.55, 0.265, 1.55]

// GSAP easing strings
motionTokens.gsapEasings.standard  // 'power2.out'
motionTokens.gsapEasings.bounce    // 'back.out(1.7)'

// Spring physics (for Framer Motion)
motionTokens.springs.gentle      // { type: 'spring', stiffness: 120, damping: 14 }
motionTokens.springs.bouncy      // { type: 'spring', stiffness: 400, damping: 10 }
```

## Motion Primitives

### FadeIn
Simple opacity transition animation.

```tsx
<FadeIn delay={0.2} duration={400}>
  <div>Content</div>
</FadeIn>
```

### RiseIn
Slides up from below with opacity transition.

```tsx
<RiseIn delay={0.1}>
  <div>Content</div>
</RiseIn>
```

### ScaleIn
Scales up from smaller size with opacity transition.

```tsx
<ScaleIn duration={500}>
  <div>Content</div>
</ScaleIn>
```

### SlideIn
Slides in from specified direction.

```tsx
<SlideIn direction="left" delay={0.3}>
  <div>Content</div>
</SlideIn>
```

### StaggerChildren
Animates children with staggered delays.

```tsx
<StaggerChildren stagger={0.1}>
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</StaggerChildren>
```

### Magnetic
Creates magnetic cursor attraction effect.

```tsx
<Magnetic strength={0.3}>
  <button>Interactive element</button>
</Magnetic>
```

## Smooth Scrolling

The system includes Lenis smooth scrolling with automatic reduced motion detection:

```typescript
import { scrollTo, useLenis } from '@/lib/motion';

// Scroll to element
scrollTo('#section', { offset: -100, duration: 1.5 });

// Use in React component
function MyComponent() {
  const { lenis, scrollTo } = useLenis();
  
  const handleClick = () => {
    scrollTo('#target');
  };
  
  return <button onClick={handleClick}>Scroll to target</button>;
}
```

## GSAP Utilities

### Scroll Animations

```typescript
// Basic scroll animation
createScrollAnimation('.element', {
  opacity: 1,
  y: 0,
  duration: 0.8,
});

// Staggered scroll animations
createStaggeredScrollAnimation('.cards', {
  opacity: 1,
  y: 0,
}, {
  stagger: 0.1,
  start: 'top 80%',
});
```

### Parallax Effects

```typescript
// Create parallax background
createParallaxEffect('.bg-image', 0.5);

// Custom parallax with options
createParallaxEffect('.element', 0.3, {
  start: 'top bottom',
  end: 'bottom top',
});
```

### Magnetic Effects

```typescript
// Add magnetic cursor effect
const cleanup = createMagneticEffect('.button', 0.3);

// Cleanup when component unmounts
useEffect(() => cleanup, []);
```

## Accessibility

The motion system automatically respects user preferences:

- **Reduced Motion**: Automatically detects `prefers-reduced-motion: reduce` and disables animations
- **Graceful Degradation**: Shows final animation states immediately when motion is disabled
- **Performance**: Uses GPU-accelerated properties (transform, opacity) for smooth 60fps animations

## Performance

- **GPU Acceleration**: All animations use transform and opacity properties
- **Intersection Observer**: Efficient viewport detection for scroll animations
- **RequestAnimationFrame**: Smooth animation loops
- **Code Splitting**: Animation libraries are loaded dynamically

## Best Practices

1. **Use Motion Tokens**: Always use predefined durations and easings for consistency
2. **Respect Reduced Motion**: The system handles this automatically, but test with reduced motion enabled
3. **Optimize Performance**: Prefer transform and opacity over layout-affecting properties
4. **Progressive Enhancement**: Ensure content is accessible even without animations
5. **Test on Devices**: Test animations on various devices and connection speeds

## Troubleshooting

### Animations Not Working

1. Check if reduced motion is enabled in system preferences
2. Verify the MotionProvider is wrapping your app
3. Ensure elements are in viewport when animations should trigger

### Performance Issues

1. Check if too many animations are running simultaneously
2. Use `will-change: transform` sparingly and remove after animations
3. Consider reducing animation complexity on lower-end devices

### TypeScript Errors

1. Import types from the motion system: `import type { MotionDuration } from '@/lib/motion'`
2. Use the provided type exports for better type safety

## Examples

See the home page (`app/page.tsx`) for comprehensive examples of all motion primitives in action.