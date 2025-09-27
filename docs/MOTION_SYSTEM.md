# 🎭 Advanced Motion System Documentation

## Overview

This portfolio features a comprehensive motion system built with GSAP, Framer Motion, Lenis, and Three.js, providing smooth animations, WebGL effects, and performance monitoring.

## Architecture

### Core Components

1. **ScrollProvider** - Manages smooth scrolling with Lenis and velocity tracking
2. **Motion Tokens** - Centralized animation configuration
3. **Feature Flags** - Motion level controls (basic/enhanced/max)
4. **Performance Telemetry** - Frame drop monitoring and analytics

### Background System

- **GradientMesh** - Animated CSS gradient backgrounds
- **ParticleField** - Canvas-based particle system with mouse interaction
- **PatternOverlay** - SVG pattern backgrounds with parallax
- **GLField** - WebGL shader backgrounds with Three.js (max level only)

### Advanced Components

- **HorizontalScroller** - Apple-style horizontal scroll sections
- **Card3D** - 3D transforming cards with scroll triggers
- **MorphText** - Character-by-character text animations
- **CanvasSequence** - Image sequence scrubbing (Apple-style)
- **ProgressRail** - Section navigation with scroll progress

## Configuration

### Motion Levels

Set via `NEXT_PUBLIC_MOTION_LEVEL` environment variable:

- **basic** - Simple fades and transitions only
- **enhanced** - Particles, gradients, 3D effects (default)
- **max** - WebGL shaders, complex sequences, all features

### Feature Flags

```typescript
import { MOTION_FEATURES, isEnhanced, isMax } from '@/lib/config/motion';

// Check if WebGL is enabled
if (MOTION_FEATURES.webglShaders) {
  // Render WebGL content
}

// Check motion level
if (isEnhanced()) {
  // Enable enhanced features
}
```

### Performance Budgets

Automatically adjusted based on device capabilities:

```typescript
import { getPerformanceBudget } from '@/lib/config/motion';

const budget = getPerformanceBudget();
// { maxParticles: 150, maxAnimations: 10, targetFPS: 60 }
```

## Usage Examples

### Basic Animation

```tsx
import { RiseIn } from '@/lib/motion/primitives';

<RiseIn>
  <div>Content that rises in on scroll</div>
</RiseIn>
```

### Horizontal Scroll Section

```tsx
import HorizontalScroller from '@/components/sections/HorizontalScroller';

<HorizontalScroller>
  <div>Section 1</div>
  <div>Section 2</div>
  <div>Section 3</div>
</HorizontalScroller>
```

### 3D Card

```tsx
import Card3D from '@/components/cards/Card3D';

<Card3D intensity={1.2}>
  <div className="p-6 bg-card rounded-lg">
    Card content with 3D hover effects
  </div>
</Card3D>
```

### Canvas Image Sequence

```tsx
import CanvasSequence from '@/components/sequence/CanvasSequence';

<CanvasSequence
  frameUrl={(i) => `/sequences/project/${i.toString().padStart(4, '0')}.jpg`}
  frameCount={120}
  width={1920}
  height={1080}
  preload={0.3}
  fallbackVideo="/sequences/project.mp4"
/>
```

### Progress Navigation

```tsx
import ProgressRail from '@/components/nav/ProgressRail';

<ProgressRail
  sections={[
    { id: 'hero', label: 'Hero', href: '#hero' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Projects', href: '#projects' },
  ]}
/>
```

## Performance Monitoring

### Automatic Telemetry

The system automatically tracks:
- Frame drops per section
- Scroll stall events
- Animation performance metrics

### Manual Tracking

```typescript
import { useAnimationMetrics } from '@/lib/metrics';

function MyComponent() {
  const { startTracking, stopTracking, recordFrame } = useAnimationMetrics('my-section');
  
  useEffect(() => {
    startTracking();
    return stopTracking;
  }, []);
  
  // In animation loop
  recordFrame();
}
```

## Accessibility

### Reduced Motion Support

All animations respect `prefers-reduced-motion: reduce`:

- Disables smooth scrolling
- Removes complex animations
- Falls back to simple fades
- Maintains functionality

### Keyboard Navigation

- Progress rail is fully keyboard accessible
- Focus management for scroll sections
- ARIA labels and current indicators

## Browser Support

- **Modern browsers** - Full feature set
- **Safari iOS** - Automatic video fallbacks for sequences
- **Low-end devices** - Automatic performance downgrading
- **Reduced motion** - Graceful degradation

## Development

### Adding New Animations

1. Create component in appropriate directory
2. Use motion tokens for consistency
3. Add feature flag if complex
4. Include reduced motion fallback
5. Add performance tracking if needed

### Testing

```bash
# Type checking
npm run type-check

# Build test
npm run build

# Performance test
npm run verify:performance
```

### Environment Variables

```bash
# Motion level (basic/enhanced/max)
NEXT_PUBLIC_MOTION_LEVEL=enhanced

# Analytics endpoint for telemetry
NEXT_PUBLIC_METRICS_ENDPOINT=https://api.example.com/metrics
```

## Troubleshooting

### Common Issues

1. **WebGL not loading** - Check motion level and browser support
2. **Poor performance** - System auto-downgrades based on device
3. **Animations not triggering** - Check reduced motion settings
4. **Build errors** - Run type-check first

### Debug Mode

Set `NODE_ENV=development` to enable:
- Console logging for performance metrics
- Animation debug information
- Feature flag status logging

## Future Enhancements

- [ ] Scroll-synced 3D camera movements
- [ ] Per-section color theming
- [ ] Lottie animation integration
- [ ] Advanced cursor magnetism
- [ ] Scrollytelling components