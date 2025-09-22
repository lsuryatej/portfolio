# Design Document

## Overview

The portfolio website will be built as a high-performance Next.js 14+ application using the App Router architecture. The design emphasizes smooth scroll animations, modular components, and exceptional user experience while maintaining accessibility and SEO best practices. The system will feature a content-driven architecture with strongly-typed data models and a sophisticated animation system built on GSAP and Framer Motion.

## Architecture

### Application Structure

```
/app (Next.js App Router)
├── /(site)/                 # Main site routes
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── projects/
│   │   ├── page.tsx        # Projects grid
│   │   └── [slug]/page.tsx # Project case studies
│   ├── about/page.tsx      # About page with timeline
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Blog posts
│   ├── contact/page.tsx    # Contact form
│   ├── now/page.tsx        # Now page (optional)
│   └── styleguide/page.tsx # Component showcase
└── /api/
    └── contact/route.ts    # Contact form handler

/components
├── /ui/                    # shadcn/ui base components
└── /site/                  # Portfolio-specific components

/lib
├── contentlayer.ts         # Content configuration
├── motion/                 # Animation system
│   ├── tokens.ts          # Motion design tokens
│   ├── primitives.tsx     # Reusable motion components
│   ├── scroll.ts          # GSAP scroll utilities
│   └── lenis.ts           # Smooth scrolling setup
├── seo.ts                 # SEO utilities
├── analytics.ts           # Analytics tracking
└── utils.ts               # General utilities

/content                   # MDX content files
├── /projects/
├── /blog/
└── /testimonials/

/public
├── /og/                   # Open Graph images
├── /logos/                # Client/company logos
└── /lottie/               # Lottie animation files
```

### Technology Stack Integration

- **Next.js 14+ App Router**: Server-side rendering, static generation, and API routes
- **TypeScript**: Full type safety across the application
- **Tailwind CSS + shadcn/ui**: Utility-first styling with consistent component library
- **Contentlayer**: Type-safe MDX processing with hot reloading
- **GSAP + ScrollTrigger**: Advanced scroll-driven animations
- **Framer Motion**: Component-level animations and transitions
- **Lenis**: Smooth scrolling implementation
- **Zod**: Runtime schema validation for content and forms

## Components and Interfaces

### Core Layout Components

#### Navigation System

```typescript
interface NavigationProps {
  currentPath: string;
  isScrolled: boolean;
}

// Sticky navigation with scroll-aware styling
// Command palette integration (⌘K)
// Mobile-responsive hamburger menu
```

#### Footer

```typescript
interface FooterProps {
  socialLinks: SocialLink[];
  email: string;
  siteMap: NavItem[];
}
```

### Content Components

#### Project Components

```typescript
interface ProjectCardProps {
  project: Project;
  priority?: boolean; // For above-fold loading
  variant?: 'grid' | 'featured' | 'minimal';
}

interface ProjectFilterBarProps {
  tags: string[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

interface ProjectCaseStudyProps {
  project: Project;
  tableOfContents: TOCItem[];
}
```

#### Blog Components

```typescript
interface BlogPostProps {
  post: Post;
  readingTime: number;
  tableOfContents: TOCItem[];
}

interface ReadingProgressProps {
  target: RefObject<HTMLElement>;
}
```

### Animation Components

#### Motion Primitives

```typescript
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // -1 to 1
  disabled?: boolean; // For reduced motion
}

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  disabled?: boolean;
}
```

### Form Components

#### Contact Form

```typescript
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  honeypotField?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}
```

## Data Models

### Content Types (Contentlayer + Zod)

#### Project Schema

```typescript
export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    coverImage: { type: 'string', required: true },
    gallery: { type: 'list', of: { type: 'string' } },
    tags: { type: 'list', of: { type: 'string' } },
    role: { type: 'string', required: true },
    tools: { type: 'list', of: { type: 'string' } },
    client: { type: 'string' },
    year: { type: 'number' },
    outcome: { type: 'string' },
    featured: { type: 'boolean', default: false },
    chapters: {
      type: 'list',
      of: {
        type: 'nested',
        fields: {
          title: { type: 'string', required: true },
          anchor: { type: 'string', required: true },
        },
      },
    },
  },
}));
```

#### Blog Post Schema

```typescript
export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string' },
    coverImage: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' } },
    canonicalUrl: { type: 'string' },
    readingTime: { type: 'number' },
  },
}));
```

#### Testimonial Schema

```typescript
export const Testimonial = defineDocumentType(() => ({
  name: 'Testimonial',
  filePathPattern: `testimonials/**/*.md`,
  fields: {
    name: { type: 'string', required: true },
    title: { type: 'string' },
    company: { type: 'string' },
    quote: { type: 'string', required: true },
    avatar: { type: 'string' },
    featured: { type: 'boolean', default: false },
  },
}));
```

### Configuration Types

#### Site Configuration

```typescript
interface SiteConfig {
  name: string;
  role: string;
  email: string;
  location: string;
  availability: boolean;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    dribbble?: string;
  };
  analytics: {
    plausible?: string;
  };
}
```

#### Theme Configuration

```typescript
interface ThemeTokens {
  colors: {
    brand: string;
    accent: string;
    surface: Record<string, string>;
    text: Record<string, string>;
    success: string;
    warning: string;
    error: string;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  typography: {
    display: FontConfig;
    body: FontConfig;
  };
}
```

## Animation System Design

### Motion Tokens

```typescript
export const motionTokens = {
  durations: {
    fast: 100,
    normal: 200,
    slow: 300,
    slower: 500,
  },
  easings: {
    standard: [0.4, 0.0, 0.2, 1],
    entrance: [0.0, 0.0, 0.2, 1],
    exit: [0.4, 0.0, 1, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  reveal: {
    distance: 24,
    stagger: 0.1,
  },
  parallax: {
    subtle: 0.2,
    moderate: 0.5,
    strong: 0.8,
  },
};
```

### Scroll Animation Architecture

#### GSAP ScrollTrigger Integration

- **Section Reveals**: Viewport-based animations with intersection observer fallbacks
- **Parallax Layers**: Multi-speed background elements with performance optimization
- **Scrub Animations**: Timeline-based animations tied to scroll progress
- **Magnetic Cursor**: Mouse-following effects with smooth interpolation

#### Performance Considerations

- **GPU Acceleration**: All animations use transform and opacity properties
- **Reduced Motion**: Automatic detection and graceful degradation
- **Intersection Observer**: Efficient viewport detection for animation triggers
- **RequestAnimationFrame**: Smooth 60fps animation loops

### Scroll Effects Implementation

#### Hero Parallax System

```typescript
interface ParallaxLayer {
  element: HTMLElement;
  speed: number;
  direction: 'vertical' | 'horizontal';
}

// Multi-layer parallax with 3-5 layers
// Background texture, midground elements, foreground content
// Automatic disable on mobile and reduced motion
```

#### Scroll-Scrubbed Media

```typescript
interface ScrubMediaConfig {
  trigger: string;
  media: HTMLVideoElement | HTMLElement[];
  start: string;
  end: string;
  scrub: boolean;
}

// Video/image sequences tied to scroll position
// Smooth frame interpolation
// Preloading optimization
```

## Visual Design System

### Design Language

- **Modern Editorial**: High contrast, generous whitespace, premium feel
- **8-Point Grid**: Consistent spacing and alignment system
- **Rounded Corners**: 2xl radius for cards and interactive elements
- **Glassmorphism**: Subtle transparency effects for overlays and navigation

### Typography System

```typescript
interface TypographyScale {
  display: {
    '4xl': { fontSize: 'clamp(2.5rem, 5vw, 4rem)'; lineHeight: 1.1 };
    '3xl': { fontSize: 'clamp(2rem, 4vw, 3rem)'; lineHeight: 1.2 };
    // ... fluid scale
  };
  body: {
    lg: { fontSize: '1.125rem'; lineHeight: 1.6 };
    base: { fontSize: '1rem'; lineHeight: 1.6 };
    // ... responsive scale
  };
}
```

### Color System

```typescript
interface ColorTokens {
  light: {
    brand: 'hsl(220, 90%, 56%)';
    accent: 'hsl(280, 100%, 70%)';
    surface: {
      primary: 'hsl(0, 0%, 100%)';
      secondary: 'hsl(220, 13%, 97%)';
      tertiary: 'hsl(220, 13%, 91%)';
    };
    text: {
      primary: 'hsl(220, 9%, 9%)';
      secondary: 'hsl(220, 9%, 46%)';
      tertiary: 'hsl(220, 14%, 71%)';
    };
  };
  dark: {
    // Dark theme variants
  };
}
```

## Error Handling

### Content Validation

- **Zod Schemas**: Runtime validation for all content types
- **Build-time Checks**: Contentlayer validation during build process
- **Graceful Degradation**: Fallback content for missing or invalid data

### Animation Error Handling

- **Feature Detection**: Check for animation support before initializing
- **Reduced Motion**: Automatic fallbacks for accessibility preferences
- **Performance Monitoring**: FPS tracking and automatic quality adjustment

### Form Error Handling

- **Client-side Validation**: Real-time form validation with Zod
- **Server-side Validation**: API route validation and sanitization
- **Rate Limiting**: Prevent spam and abuse
- **Honeypot Protection**: Hidden field spam detection

## Testing Strategy

### Unit Testing (Vitest)

- **Utility Functions**: Content processing, animation helpers, form validation
- **Component Logic**: State management, event handlers, data transformations
- **Animation Tokens**: Motion configuration and timing validation

### Integration Testing (Playwright)

- **Route Navigation**: Smoke tests for all pages and transitions
- **Keyboard Navigation**: Full keyboard accessibility testing
- **Reduced Motion**: Animation behavior with accessibility preferences
- **Form Submission**: Contact form end-to-end workflows
- **Performance**: Core Web Vitals monitoring

### Performance Testing

- **Lighthouse CI**: Automated performance, accessibility, and SEO auditing
- **Bundle Analysis**: Code splitting and optimization verification
- **Animation Performance**: FPS monitoring and jank detection

## SEO and Metadata Strategy

### Dynamic Open Graph Images

```typescript
// /app/og/route.tsx - Dynamic OG image generation
interface OGImageProps {
  title: string;
  type: 'project' | 'blog' | 'page';
  tags?: string[];
}

// @vercel/og for dynamic image generation
// Consistent branding and typography
// Optimized file sizes and caching
```

### Structured Data

```typescript
interface StructuredData {
  person: PersonSchema;
  articles: ArticleSchema[];
  projects: CreativeWorkSchema[];
}

// JSON-LD structured data for rich snippets
// Person schema for professional information
// Article schema for blog posts
// CreativeWork schema for projects
```

### Sitemap and Robots

- **Dynamic Sitemap**: Auto-generated from content collections
- **Robots.txt**: Proper crawling directives
- **Canonical URLs**: Prevent duplicate content issues

## Performance Optimization

### Code Splitting Strategy

- **Route-based Splitting**: Automatic with Next.js App Router
- **Component Splitting**: Lazy loading for heavy components
- **Animation Library Splitting**: Dynamic imports for GSAP modules

### Image Optimization

- **Next.js Image**: Automatic optimization and responsive images
- **Preloading**: Critical images above the fold
- **Lazy Loading**: Intersection observer for below-fold content

### Caching Strategy

- **Static Generation**: Pre-render content at build time
- **Incremental Static Regeneration**: Update content without full rebuilds
- **CDN Caching**: Vercel Edge Network optimization

This design provides a comprehensive foundation for building the production-ready portfolio with all specified features while maintaining performance, accessibility, and developer experience standards.
