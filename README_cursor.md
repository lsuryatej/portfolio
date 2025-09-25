# Particle Cursor System

A sophisticated, production-ready particle cursor system with WebGL fluid effects, magnetic interactions, and graceful accessibility fallbacks.

## Features

- **🎨 Multiple Modes**: Particles, Fluid (WebGL), or Hybrid
- **🧲 Magnetic Interactions**: Automatic attraction to interactive elements
- **⚡ Performance Optimized**: Adaptive quality based on device capabilities
- **♿ Accessibility First**: Respects `prefers-reduced-motion` and maintains focus indicators
- **📱 Mobile Friendly**: Optimized for touch devices with reduced particle counts
- **🎯 Spring Physics**: Realistic cursor movement with configurable stiffness and damping

## Installation

### 1. Install Dependencies

```bash
npm install pixi.js
```

### 2. Add CSS Styles

```html
<link rel="stylesheet" href="/styles/cursor.css">
```

### 3. Import and Initialize

```typescript
import { initCursor } from './lib/cursor';

const destroy = initCursor({
  mode: 'particles',
  particleCount: 120,
  spring: { stiffness: 0.22, damping: 0.82 },
  magnetic: { enabled: true, radius: 60, strength: 0.12 }
});

// Clean up when needed
destroy();
```

## API Reference

### `initCursor(options?, events?)`

Initialize the particle cursor system.

**Parameters:**
- `options` (optional): Configuration object
- `events` (optional): Event callbacks

**Returns:** Destroy function to clean up the cursor

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `'particles' \| 'fluid' \| 'hybrid'` | `'particles'` | Rendering mode |
| `baseSize` | `number` | `10` | Base cursor size in pixels |
| `haloSize` | `number` | `28` | Halo size in pixels |
| `particleCount` | `number` | `120` | Maximum number of particles |
| `trailBlend` | `'additive' \| 'normal'` | `'additive'` | Trail blending mode |
| `spring.stiffness` | `number` | `0.22` | Spring stiffness (0-1) |
| `spring.damping` | `number` | `0.82` | Spring damping (0-1) |
| `colors.base` | `string` | `'#3b82f6'` | Base cursor color |
| `colors.halo` | `string` | `'#8b5cf6'` | Halo color |
| `colors.particle` | `string[]` | `['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']` | Particle colors |
| `magnetic.enabled` | `boolean` | `true` | Enable magnetic interactions |
| `magnetic.radius` | `number` | `60` | Magnetic attraction radius |
| `magnetic.strength` | `number` | `0.12` | Magnetic attraction strength |
| `reducedMotion` | `boolean` | `false` | Force reduced motion mode |

### Event Callbacks

| Event | Type | Description |
|-------|------|-------------|
| `onBurst` | `(x: number, y: number) => void` | Called on mouse click with burst effect |
| `onHoverEnter` | `(element: Element) => void` | Called when hovering over interactive element |
| `onHoverLeave` | `(element: Element) => void` | Called when leaving interactive element |

## Usage Examples

### Basic Usage

```typescript
import { initCursor } from './lib/cursor';

// Simple particle cursor
const destroy = initCursor();

// Clean up
destroy();
```

### Advanced Configuration

```typescript
import { initCursor } from './lib/cursor';

const destroy = initCursor({
  mode: 'hybrid',
  particleCount: 200,
  baseSize: 12,
  haloSize: 32,
  spring: {
    stiffness: 0.25,
    damping: 0.75
  },
  colors: {
    base: '#ff6b6b',
    halo: '#4ecdc4',
    particle: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
  },
  magnetic: {
    enabled: true,
    radius: 80,
    strength: 0.15
  }
}, {
  onBurst: (x, y) => {
    console.log(`Burst at ${x}, ${y}`);
  },
  onHoverEnter: (element) => {
    console.log('Hovering:', element);
  },
  onHoverLeave: (element) => {
    console.log('Leaving:', element);
  }
});
```

### React Integration

```tsx
import { useEffect } from 'react';
import { initCursor } from './lib/cursor';

function App() {
  useEffect(() => {
    const destroy = initCursor({
      mode: 'particles',
      particleCount: 120,
      magnetic: { enabled: true }
    });

    return destroy;
  }, []);

  return (
    <div>
      <button data-interactive>Hover me!</button>
      <a href="#" data-interactive>Magnetic link</a>
    </div>
  );
}
```

### Next.js Integration

```tsx
// pages/_app.tsx
import { useEffect } from 'react';
import { initCursor } from '../lib/cursor';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const destroy = initCursor({
      mode: 'particles',
      particleCount: 120
    });

    return destroy;
  }, []);

  return <Component {...pageProps} />;
}
```

## Rendering Modes

### Particles Mode
- Canvas 2D rendering
- Optimized particle system
- Best performance and compatibility
- Recommended for most use cases

### Fluid Mode
- WebGL rendering with PIXI.js
- Fluid simulation effects
- Higher visual impact
- Requires WebGL support

### Hybrid Mode
- Combines particles and fluid effects
- Best of both worlds
- Highest visual quality
- Most resource intensive

## Performance Optimization

### Adaptive Quality
The cursor automatically adjusts particle count based on device performance:
- **Desktop**: 120+ particles
- **Mobile**: 60-80 particles
- **Low-end devices**: Minimum 60 particles

### Frame Budget
- Target: 1.5-3ms per frame
- Auto-reduction if exceeded
- Maintains 60fps on most devices

### Memory Management
- Automatic particle cleanup
- Efficient canvas rendering
- Proper WebGL resource disposal

## Accessibility

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  /* Cursor automatically disabled */
  /* Focus indicators remain visible */
}
```

### Focus Management
- Maintains all focus indicators
- Keyboard navigation preserved
- Screen reader compatible

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  /* Enhanced focus indicators */
  /* High contrast cursor colors */
}
```

## Browser Support

### Full Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Fallback Support
- Canvas 2D fallback for older browsers
- Graceful degradation for WebGL
- Reduced motion fallback

## Troubleshooting

### Common Issues

**Cursor not appearing:**
```typescript
// Check if reduced motion is enabled
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  console.log('Cursor disabled due to reduced motion preference');
}
```

**Performance issues:**
```typescript
// Reduce particle count
const destroy = initCursor({
  particleCount: 60, // Reduced from default 120
  mode: 'particles'  // Use Canvas 2D instead of WebGL
});
```

**WebGL not working:**
```typescript
// Check WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
if (!gl) {
  console.log('WebGL not supported, using Canvas 2D fallback');
}
```

### Debug Mode

```typescript
// Enable debug logging
const destroy = initCursor({
  mode: 'particles',
  particleCount: 120
}, {
  onBurst: (x, y) => console.log('Burst:', x, y),
  onHoverEnter: (el) => console.log('Hover enter:', el),
  onHoverLeave: (el) => console.log('Hover leave:', el)
});
```

## Customization

### Custom Colors
```typescript
const destroy = initCursor({
  colors: {
    base: '#your-color',
    halo: '#your-halo-color',
    particle: ['#color1', '#color2', '#color3']
  }
});
```

### Custom Magnetic Elements
```html
<!-- Add data-interactive to any element -->
<button data-interactive>Magnetic Button</button>
<a href="#" data-interactive>Magnetic Link</a>
<div data-interactive>Custom Interactive Element</div>
```

### CSS Customization
```css
/* Custom cursor styles */
.cursor-canvas {
  mix-blend-mode: multiply; /* Different blend mode */
}

/* Custom focus styles */
*:focus-visible {
  outline: 3px solid #your-color;
  outline-offset: 3px;
}
```

## Performance Metrics

### Typical Performance
- **Desktop**: 60fps with 120 particles
- **Mobile**: 60fps with 60-80 particles
- **Memory**: ~5-10MB for particle system
- **CPU**: <5% on modern devices

### Optimization Tips
1. Use `mode: 'particles'` for best performance
2. Reduce `particleCount` on mobile devices
3. Lower `spring.stiffness` for smoother movement
4. Use `trailBlend: 'normal'` for better performance

## License

MIT License - feel free to use in your projects!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Particle and fluid modes
- Magnetic interactions
- Accessibility support
- Performance optimization
