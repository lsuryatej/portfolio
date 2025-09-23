# Motion System Documentation

A comprehensive animation system for the portfolio website, featuring smooth scroll animations, motion primitives, and accessibility-first design.

## 🎭 Overview

The motion system provides a unified approach to animations across the portfolio, combining the power of GSAP for complex scroll-driven animations with Framer Motion for component-level interactions. The system is designed with performance, accessibility, and developer experience in mind.

### Key Features

- **🎨 Motion Tokens**: Centralized animation constants for consistent timing and easing
- **🧩 Motion Primitives**: Reusable React components for common animations
- **📜 Smooth Scrolling**: Lenis-powered smooth scrolling with reduced motion support
- **🎪 GSAP Integration**: Advanced scroll-triggered animations and effects
- **♿ Accessibility**: Automatic reduced motion detection and graceful degradation
- **⚡ Performance**: GPU-accelerated animations with 60fps targeting

## 🚀 Quick Start

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

## 🎨 Motion Tokens

The motion system uses centralized tokens for consistent animations across the site:

```typescript
import { motionTokens } from '@/lib/motion';

// Durations (in milliseconds)
motionTokens.durations.fast      // 100ms - Quick micro-interactions
motionTokens.durations.normal    // 200ms - Standard UI animations
motionTokens.durations.slow      // 300ms - Deliberate transitions
motionTokens.durations.slower    // 500ms - Dramatic reveals
motionTokens.durations.slowest   // 800ms - Hero animations

// Easing curves
motionTokens.easings.standard    // [0.4, 0.0, 0.2, 1] - Material Design standard
motionTokens.easings.entrance    // [0.0, 0.0, 0.2, 1] - Elements entering
motionTokens.easings.exit        // [0.4, 0.0, 1, 1] - Elements leaving
motionTokens.easings.bounce      // [0.68, -0.55, 0.265, 1.55] - Playful interactions
motionTokens.easings.sharp       // [0.4, 0.0, 0.6, 1] - Quick, decisive actions

// GSAP easing strings
motionTokens.gsapEasings.standard  // 'power2.out'
motionTokens.gsapEasings.bounce    // 'back.out(1.7)'
motionTokens.gsapEasings.elastic   // 'elastic.out(1, 0.3)'

// Spring physics (for Framer Motion)
motionTokens.springs.gentle      // { type: 'spring', stiffness: 120, damping: 14 }
motionTokens.springs.bouncy      // { type: 'spring', stiffness: 400, damping: 10 }
motionTokens.springs.snappy      // { type: 'spring', stiffness: 300, damping: 30 }
```

### When to Use Each Duration

- **Fast (100ms)**: Hover states, button presses, small UI changes
- **Normal (200ms)**: Modal opens/closes, dropdown menus, tab switches
- **Slow (300ms)**: Page transitions, card reveals, form submissions
- **Slower (500ms)**: Section reveals, image galleries, major state changes
- **Slowest (800ms)**: Hero animations, full-page transitions, dramatic reveals

### When to Use Each Easing

- **Standard**: Most UI animations, general purpose
- **Entrance**: Elements appearing (fade in, slide in)
- **Exit**: Elements disappearing (fade out, slide out)
- **Bounce**: Playful interactions, success states, call-to-action buttons
- **Sharp**: Quick actions, error states, urgent notifications

## 🧩 Motion Primitives

### FadeIn
Simple opacity transition animation for subtle reveals.

```tsx
<FadeIn 
  delay={0.2}           // Delay before animation starts (seconds)
  duration={400}        // Animation duration (milliseconds)
  threshold={0.1}       // Intersection observer threshold
>
  <div>Content that fades in</div>
</FadeIn>
```

**Use Cases**: Text reveals, image loading, subtle content appearances

### RiseIn
Slides up from below with opacity transition for dynamic reveals.

```tsx
<RiseIn 
  delay={0.1}           // Delay before animation
  distance={24}         // Distance to slide (pixels)
  duration={500}        // Animation duration
>
  <div>Content that rises up</div>
</RiseIn>
```

**Use Cases**: Card reveals, section content, list items, hero text

### ScaleIn
Scales up from smaller size with opacity transition for emphasis.

```tsx
<ScaleIn 
  duration={500}        // Animation duration
  scale={0.8}          // Starting scale (0-1)
  delay={0.3}          // Delay before animation
>
  <div>Content that scales in</div>
</ScaleIn>
```

**Use Cases**: Modal dialogs, featured content, call-to-action elements, images

### SlideIn
Slides in from specified direction for directional reveals.

```tsx
<SlideIn 
  direction="left"      // 'left' | 'right' | 'up' | 'down'
  delay={0.3}          // Delay before animation
  distance={50}        // Distance to slide
  duration={400}       // Animation duration
>
  <div>Content that slides in</div>
</SlideIn>
```

**Use Cases**: Navigation menus, sidebar content, sequential reveals

### StaggerChildren
Animates children with staggered delays for sequential reveals.

```tsx
<StaggerChildren 
  stagger={0.1}        // Delay between each child (seconds)
  animation="fadeIn"   // 'fadeIn' | 'riseIn' | 'scaleIn'
>
  <div>Child 1</div>   {/* Animates first */}
  <div>Child 2</div>   {/* Animates 0.1s later */}
  <div>Child 3</div>   {/* Animates 0.2s later */}
</StaggerChildren>
```

**Use Cases**: Lists, grids, navigation items, feature sections

### Magnetic
Creates magnetic cursor attraction effect for interactive elements.

```tsx
<Magnetic 
  strength={0.3}       // Attraction strength (0-1)
  disabled={false}     // Disable on mobile/reduced motion
>
  <button>Interactive element</button>
</Magnetic>
```

**Use Cases**: Buttons, links, interactive cards, call-to-action elements

## 📜 Smooth Scrolling

The system includes Lenis smooth scrolling with automatic reduced motion detection:

```typescript
import { scrollTo, useLenis } from '@/lib/motion';

// Programmatic scrolling
scrollTo('#section', { 
  offset: -100,         // Offset from target (pixels)
  duration: 1.5,        // Scroll duration (seconds)
  easing: 'power2.out'  // Easing function
});

// Use in React component
function MyComponent() {
  const { lenis, scrollTo } = useLenis();
  
  const handleClick = () => {
    scrollTo('#target');
  };
  
  return <button onClick={handleClick}>Scroll to target</button>;
}
```

### Smooth Scrolling Configuration

```typescript
// lib/motion/lenis.ts
const lenis = new Lenis({
  lerp: 0.1,           // Linear interpolation factor (0-1)
  duration: 1.2,       // Scroll duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,  // Disable on touch devices
  touchMultiplier: 2,
  infinite: false,
});
```

## 🎪 GSAP Utilities

### Scroll Animations

Create scroll-triggered animations that activate when elements enter the viewport:

```typescript
// Basic scroll animation
createScrollAnimation('.element', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power2.out'
});

// Advanced scroll animation with custom trigger
createScrollAnimation('.element', {
  opacity: 1,
  y: 0,
  rotation: 0,
  scale: 1,
}, {
  trigger: '.custom-trigger',
  start: 'top 80%',
  end: 'bottom 20%',
  scrub: false,
  markers: false // Set to true for debugging
});
```

### Staggered Scroll Animations

Animate multiple elements with staggered timing:

```typescript
createStaggeredScrollAnimation('.cards', {
  opacity: 1,
  y: 0,
  scale: 1,
}, {
  stagger: 0.1,         // Delay between elements
  start: 'top 80%',     // When to start animation
  duration: 0.6,        // Individual animation duration
});
```

### Parallax Effects

Create depth and movement with parallax scrolling:

```typescript
// Simple parallax
createParallaxEffect('.bg-image', 0.5);

// Advanced parallax with custom settings
createParallaxEffect('.element', 0.3, {
  start: 'top bottom',
  end: 'bottom top',
  ease: 'none',
  invalidateOnRefresh: true
});
```

### Magnetic Effects

Add magnetic cursor attraction to interactive elements:

```typescript
// Basic magnetic effect
const cleanup = createMagneticEffect('.button', 0.3);

// Advanced magnetic effect
const cleanup = createMagneticEffect('.button', {
  strength: 0.4,
  ease: 'power2.out',
  duration: 0.3,
  skew: true,          // Add skew effect
  scale: 1.05,         // Scale on hover
});

// Cleanup when component unmounts
useEffect(() => cleanup, []);
```

### Scroll Progress

Create scroll-linked progress indicators:

```typescript
// Progress bar tied to page scroll
createScrollProgress('.progress-bar');

// Progress bar tied to specific section
createScrollProgress('.progress-bar', {
  trigger: '.content-section',
  start: 'top center',
  end: 'bottom center',
});
```

## ♿ Accessibility

The motion system automatically respects user preferences and provides accessible alternatives:

### Reduced Motion Detection

```typescript
// Automatic detection
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Manual override
<FadeIn respectReducedMotion={true}>
  <div>Content</div>
</FadeIn>
```

### Accessibility Features

- **Reduced Motion**: Automatically detects `prefers-reduced-motion: reduce`
- **Graceful Degradation**: Shows final animation states immediately when motion is disabled
- **Focus Management**: Maintains focus order during animations
- **Screen Reader Support**: Animations don't interfere with assistive technologies

### Testing Accessibility

```bash
# Enable reduced motion in macOS
# System Preferences > Accessibility > Display > Reduce motion

# Enable reduced motion in Windows
# Settings > Ease of Access > Display > Show animations in Windows

# Test in browser DevTools
# Rendering tab > Emulate CSS media feature prefers-reduced-motion
```

## ⚡ Performance

The motion system is optimized for smooth 60fps animations:

### Performance Features

- **GPU Acceleration**: All animations use `transform` and `opacity` properties
- **Intersection Observer**: Efficient viewport detection for scroll animations
- **RequestAnimationFrame**: Smooth animation loops
- **Code Splitting**: Animation libraries are loaded dynamically
- **Memory Management**: Automatic cleanup of animation instances

### Performance Best Practices

1. **Use GPU-Accelerated Properties**
   ```css
   /* ✅ Good - GPU accelerated */
   transform: translateX(100px);
   opacity: 0.5;
   
   /* ❌ Avoid - Causes layout/paint */
   left: 100px;
   background-color: red;
   ```

2. **Limit Concurrent Animations**
   ```typescript
   // ✅ Good - Staggered animations
   <StaggerChildren stagger={0.1}>
     {items.map(item => <Item key={item.id} />)}
   </StaggerChildren>
   
   // ❌ Avoid - All at once
   {items.map(item => <FadeIn><Item key={item.id} /></FadeIn>)}
   ```

3. **Use Will-Change Sparingly**
   ```css
   /* ✅ Good - Only during animation */
   .animating {
     will-change: transform;
   }
   
   /* ❌ Avoid - Always on */
   .element {
     will-change: transform;
   }
   ```

### Performance Monitoring

```typescript
// Monitor animation performance
import { measureAnimationPerformance } from '@/lib/motion';

const metrics = measureAnimationPerformance(() => {
  // Your animation code
});

console.log('FPS:', metrics.fps);
console.log('Frame drops:', metrics.frameDrops);
```

## 🎯 Best Practices

### 1. Animation Hierarchy

Use animations to guide user attention and create visual hierarchy:

```tsx
// ✅ Good - Clear hierarchy with staggered timing
<div>
  <FadeIn>
    <h1>Main Title</h1>
  </FadeIn>
  <RiseIn delay={0.2}>
    <p>Supporting text</p>
  </RiseIn>
  <ScaleIn delay={0.4}>
    <Button>Call to Action</Button>
  </ScaleIn>
</div>
```

### 2. Consistent Timing

Use motion tokens for consistent timing across the site:

```tsx
// ✅ Good - Using motion tokens
<FadeIn duration={motionTokens.durations.normal}>
  <div>Content</div>
</FadeIn>

// ❌ Avoid - Magic numbers
<FadeIn duration={250}>
  <div>Content</div>
</FadeIn>
```

### 3. Meaningful Motion

Ensure animations serve a purpose and enhance the user experience:

```tsx
// ✅ Good - Reveals content progressively
<StaggerChildren stagger={0.1}>
  {features.map(feature => (
    <FeatureCard key={feature.id} {...feature} />
  ))}
</StaggerChildren>

// ❌ Avoid - Gratuitous animation
<ScaleIn>
  <div>Random content that doesn't need emphasis</div>
</ScaleIn>
```

### 4. Mobile Considerations

Reduce animation complexity on mobile devices:

```tsx
// ✅ Good - Simplified mobile animations
<FadeIn 
  duration={isMobile ? motionTokens.durations.fast : motionTokens.durations.normal}
>
  <div>Content</div>
</FadeIn>
```

### 5. Loading States

Use animations to improve perceived performance:

```tsx
// ✅ Good - Skeleton loading with animation
<StaggerChildren stagger={0.05}>
  {loading ? (
    Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))
  ) : (
    data.map(item => <Card key={item.id} {...item} />)
  )}
</StaggerChildren>
```

## 🐛 Troubleshooting

### Common Issues

**Animations Not Working**
1. Check if reduced motion is enabled in system preferences
2. Verify the MotionProvider is wrapping your app
3. Ensure elements are in viewport when animations should trigger
4. Check browser console for GSAP license warnings

**Performance Issues**
1. Check if too many animations are running simultaneously
2. Use `will-change: transform` sparingly and remove after animations
3. Consider reducing animation complexity on lower-end devices
4. Monitor frame rate with browser DevTools

**TypeScript Errors**
1. Import types from the motion system: `import type { MotionDuration } from '@/lib/motion'`
2. Use the provided type exports for better type safety
3. Ensure all motion components have proper prop types

**GSAP ScrollTrigger Issues**
1. Refresh ScrollTrigger after dynamic content changes: `ScrollTrigger.refresh()`
2. Use `invalidateOnRefresh: true` for responsive layouts
3. Check trigger element exists before creating animations

### Debug Mode

Enable debug mode to visualize scroll triggers and animation boundaries:

```typescript
// Enable ScrollTrigger markers
ScrollTrigger.config({
  markers: true
});

// Log animation events
createScrollAnimation('.element', {
  opacity: 1,
  onStart: () => console.log('Animation started'),
  onComplete: () => console.log('Animation completed'),
});
```

## 📚 Advanced Usage

### Custom Motion Components

Create your own motion primitives:

```tsx
import { motion } from 'framer-motion';
import { motionTokens } from '@/lib/motion';

export function CustomReveal({ children, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -15 }}
      whileInView={{ opacity: 1, rotateX: 0 }}
      transition={{
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.easings.standard,
      }}
      viewport={{ once: true, margin: '-10%' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

### Complex GSAP Timelines

Create sophisticated animation sequences:

```typescript
import { gsap } from 'gsap';

export function createHeroAnimation() {
  const tl = gsap.timeline();
  
  tl.from('.hero-title', {
    y: 100,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })
  .from('.hero-subtitle', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4')
  .from('.hero-cta', {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.2');
  
  return tl;
}
```

### Scroll-Linked Animations

Create animations that progress with scroll position:

```typescript
export function createScrollLinkedAnimation() {
  gsap.to('.parallax-element', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-container',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
}
```

## 🔗 Resources

- [GSAP Documentation](https://gsap.com/docs/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lenis Smooth Scrolling](https://lenis.studiofreight.com/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [CSS Animation Performance](https://web.dev/animations-guide/)

---

The motion system is designed to be both powerful and approachable. Start with the basic primitives and gradually explore more advanced features as needed. Remember to always test animations across different devices and respect user accessibility preferences.