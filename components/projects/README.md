# Advanced Project Components

This directory contains advanced interactive components for project case study pages, implementing sophisticated animations and user interactions.

## Components Overview

### BeforeAfterSlider

An interactive slider component that allows users to compare two images by dragging a handle.

**Features:**
- Smooth drag interactions with spring physics
- Responsive design with touch support
- Automatic centering with snap-to-center functionality
- Accessibility support with proper ARIA labels
- Reduced motion support

**Usage:**
```tsx
<BeforeAfterSlider
  beforeImage="/path/to/before.jpg"
  afterImage="/path/to/after.jpg"
  beforeLabel="Before"
  afterLabel="After"
/>
```

**Props:**
- `beforeImage`: Path to the before image
- `afterImage`: Path to the after image
- `beforeLabel`: Label for the before state (default: "Before")
- `afterLabel`: Label for the after state (default: "After")
- `className`: Additional CSS classes

### ScrollSequence

A component that displays a sequence of images that scrub through based on scroll position using GSAP.

**Features:**
- GSAP ScrollTrigger integration for smooth scrubbing
- Preloading of all images for smooth playback
- Canvas-based rendering for optimal performance
- Progress indicator showing current frame
- Reduced motion fallback

**Usage:**
```tsx
<ScrollSequence
  images={[
    "/sequence/frame-001.jpg",
    "/sequence/frame-002.jpg",
    "/sequence/frame-003.jpg"
  ]}
  alt="Product assembly sequence"
/>
```

**Props:**
- `images`: Array of image paths for the sequence
- `alt`: Alt text for accessibility
- `className`: Additional CSS classes
- `trigger`: Custom ScrollTrigger element selector
- `start`: ScrollTrigger start position (default: "top bottom")
- `end`: ScrollTrigger end position (default: "bottom top")
- `scrub`: ScrollTrigger scrub value (default: 1)

### VideoScrollSequence

Similar to ScrollSequence but for video content, scrubbing through video frames based on scroll position.

**Features:**
- Video timeline scrubbing tied to scroll position
- Automatic metadata loading
- Poster image support
- Reduced motion fallback

**Usage:**
```tsx
<VideoScrollSequence
  videoSrc="/path/to/video.mp4"
  poster="/path/to/poster.jpg"
/>
```

### ChapterNavigation

A floating navigation component that provides chapter-based navigation with scroll progress tracking.

**Features:**
- Automatic active chapter detection using Intersection Observer
- Circular progress indicator showing reading progress
- Expandable chapter menu with smooth animations
- Previous/next navigation buttons
- Responsive design with mobile optimization

**Usage:**
```tsx
<ChapterNavigation
  chapters={[
    { id: "intro", title: "Introduction", anchor: "introduction" },
    { id: "process", title: "Design Process", anchor: "design-process" },
    { id: "results", title: "Results", anchor: "results" }
  ]}
/>
```

**Props:**
- `chapters`: Array of chapter objects with id, title, and anchor
- `className`: Additional CSS classes

### BackToTop

A floating action button that appears after scrolling past a threshold, with morphing animations and scroll progress.

**Features:**
- Scroll progress ring animation
- Morphing icon animation based on scroll position
- Smooth scroll to top functionality
- Hover effects with ripple animation
- Tooltip on hover

**Usage:**
```tsx
<BackToTop threshold={0.25} />
```

**Props:**
- `threshold`: Scroll percentage threshold to show button (default: 0.25)
- `className`: Additional CSS classes

### FloatingProgress

A minimal floating progress indicator showing scroll progress.

**Features:**
- Circular progress ring
- Percentage display
- Smooth animations
- Minimal design

**Usage:**
```tsx
<FloatingProgress />
```

## Integration with MDX

All components are automatically available in MDX content through the `MDXComponents` configuration:

```mdx
# My Project

Here's a before/after comparison:

<BeforeAfterSlider
  beforeImage="/before.jpg"
  afterImage="/after.jpg"
/>

And here's an interactive sequence:

<ScrollSequence
  images={["/frame1.jpg", "/frame2.jpg", "/frame3.jpg"]}
  alt="Process sequence"
/>
```

## Performance Considerations

- **Image Preloading**: ScrollSequence preloads all images for smooth playback
- **Canvas Rendering**: Uses canvas for efficient image sequence rendering
- **Reduced Motion**: All components respect `prefers-reduced-motion` settings
- **Intersection Observer**: Efficient viewport detection for animations
- **GSAP Optimization**: Uses hardware-accelerated transforms and optimized timelines

## Accessibility Features

- **Keyboard Navigation**: All interactive elements support keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Reduced Motion**: Automatic fallbacks for users with motion sensitivity
- **Focus Management**: Visible focus indicators and logical tab order
- **Alt Text**: Required alt text for all image sequences

## Browser Support

- Modern browsers with ES2020+ support
- Framer Motion and GSAP compatibility
- Canvas API support for image sequences
- Intersection Observer API (with polyfill fallback)

## Dependencies

- `framer-motion`: For component-level animations and spring physics
- `gsap`: For scroll-triggered animations and timeline scrubbing
- `lucide-react`: For icons
- `next/image`: For optimized image loading