# Performance Optimization Guide

This document outlines the performance optimizations implemented in the portfolio website to achieve excellent Core Web Vitals scores.

## Overview

The portfolio website implements comprehensive performance optimizations including:

- **Code Splitting**: Dynamic imports for heavy components and animation libraries
- **Image Optimization**: Next.js Image with AVIF/WebP formats and proper loading strategies
- **Resource Preloading**: Critical assets, fonts, and route prefetching
- **Bundle Optimization**: Tree shaking, chunk splitting, and unused code elimination
- **Performance Monitoring**: Core Web Vitals tracking and custom metrics

## Code Splitting Implementation

### Dynamic Component Loading

Heavy animation components are loaded dynamically to reduce initial bundle size:

```typescript
// lib/dynamic-loader.ts
export const DynamicScrollSequence = createDynamicComponent(
  () => import('@/components/projects/scroll-sequence'),
  { ssr: false }
);
```

### Animation Library Splitting

Animation libraries (GSAP, Lenis, Framer Motion) are loaded conditionally:

```typescript
// Only load if user doesn't prefer reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  const { initMotionSystem } = await import('@/lib/motion');
  initMotionSystem();
}
```

### Bundle Analysis

Use these commands to analyze bundle size:

```bash
npm run build:analyze  # Build with bundle analyzer
npm run bundle:analyze # Analyze existing build
```

## Image Optimization

### Next.js Image Configuration

```typescript
// next.config.ts
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 31536000, // 1 year
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" }
  ],
}
```

### Optimized Image Component

```typescript
// components/ui/optimized-image.tsx
<OptimizedImage
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority={true}
  quality={85}
  placeholder="blur"
  sizes="100vw"
/>
```

### Loading Strategies

- **Above-fold images**: `priority={true}` and `loading="eager"`
- **Below-fold images**: `loading="lazy"` with intersection observer
- **Blur placeholders**: Generated SVG placeholders for better UX
- **Responsive sizing**: Proper `sizes` attribute for different viewports

## Resource Preloading

### Critical Font Preloading

```typescript
// lib/typography.ts
export const fontSans = Inter({
  preload: true,
  weight: ['400', '500', '600', '700'],
  fallback: ['system-ui', 'arial'],
});
```

### Asset Preloading

```typescript
// lib/preloader.ts
export function preloadCriticalImages(images: string[]) {
  images.forEach(src => {
    preloadResource(src, {
      as: 'image',
      fetchPriority: 'high',
    });
  });
}
```

### Route Prefetching

```typescript
// Preload common routes after initial load
setTimeout(() => {
  preloadRoutes(['/projects', '/about', '/contact']);
}, 2000);
```

## Bundle Optimization

### Webpack Configuration

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['gsap', 'framer-motion', 'lenis'],
},
swcMinify: true,
compress: true,
```

### Tree Shaking

```typescript
// lib/bundle-optimizer.ts
export const icons = {
  Menu: () => import('lucide-react').then(m => m.Menu),
  // Only import icons that are actually used
};
```

### Chunk Splitting

```typescript
splitChunks: {
  cacheGroups: {
    animations: {
      test: /[\\/]node_modules[\\/](gsap|framer-motion|lenis)[\\/]/,
      name: 'animations',
      chunks: 'all',
      priority: 20,
    },
  },
}
```

## Performance Monitoring

### Core Web Vitals

The website monitors all Core Web Vitals metrics:

- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **FCP (First Contentful Paint)**: Target < 1.8s
- **TTFB (Time to First Byte)**: Target < 800ms

### Custom Metrics

Additional performance metrics are tracked:

- **Bundle loading times**
- **Memory usage**
- **Animation FPS**
- **Resource loading times**

### Performance Debugging

```typescript
// Debug performance in development
import { performanceDebug } from '@/lib/performance-metrics';

performanceDebug.logCurrentMetrics();
```

## Performance Targets

### Lighthouse Scores

Target scores for all pages:

- **Performance**: ≥95
- **Accessibility**: ≥95
- **Best Practices**: ≥95
- **SEO**: ≥95

### Core Web Vitals Thresholds

- **LCP**: Good < 2.5s, Poor > 4.0s
- **FID**: Good < 100ms, Poor > 300ms
- **CLS**: Good < 0.1, Poor > 0.25

### Bundle Size Targets

- **Initial bundle**: < 200KB gzipped
- **Animation chunk**: < 150KB gzipped
- **Total JavaScript**: < 500KB gzipped

## Optimization Checklist

### Images
- [ ] Use Next.js Image component
- [ ] Set proper `sizes` attribute
- [ ] Use `priority` for above-fold images
- [ ] Implement blur placeholders
- [ ] Optimize image formats (AVIF/WebP)

### Fonts
- [ ] Preload critical font weights
- [ ] Use `font-display: swap`
- [ ] Define fallback fonts
- [ ] Minimize font variations

### JavaScript
- [ ] Code split heavy components
- [ ] Dynamic import animation libraries
- [ ] Tree shake unused code
- [ ] Minimize third-party scripts

### CSS
- [ ] Remove unused CSS
- [ ] Use CSS-in-JS for component styles
- [ ] Minimize critical CSS
- [ ] Defer non-critical CSS

### Network
- [ ] Enable compression
- [ ] Set proper cache headers
- [ ] Use CDN for static assets
- [ ] Minimize HTTP requests

## Monitoring and Alerts

### Development
```bash
npm run perf:audit  # Run Lighthouse audit
npm run build:analyze  # Analyze bundle size
```

### Production
- Monitor Core Web Vitals in real-time
- Set up alerts for performance regressions
- Track bundle size changes in CI/CD
- Monitor memory usage and FPS

## Best Practices

1. **Measure First**: Always measure before optimizing
2. **Progressive Enhancement**: Ensure basic functionality without JavaScript
3. **Lazy Loading**: Load resources only when needed
4. **Caching Strategy**: Implement proper caching at all levels
5. **Regular Audits**: Run performance audits regularly
6. **User-Centric Metrics**: Focus on metrics that affect user experience

## Troubleshooting

### Common Issues

1. **High LCP**: Check image optimization and preloading
2. **High CLS**: Ensure proper image dimensions and avoid layout shifts
3. **High FID**: Reduce JavaScript execution time and use code splitting
4. **Large Bundle**: Analyze bundle and remove unused code

### Debug Commands

```bash
# Analyze bundle size
npm run build:analyze

# Run performance audit
npm run perf:audit

# Check memory usage
node --inspect-brk npm run build
```

This comprehensive performance optimization ensures the portfolio website delivers exceptional user experience with fast loading times and smooth interactions.