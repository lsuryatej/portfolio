/**
 * Resource Preloader
 * 
 * Utilities for preloading critical assets and optimizing resource loading
 */

interface PreloadOptions {
  as: 'script' | 'style' | 'font' | 'image' | 'video' | 'audio' | 'document';
  crossOrigin?: 'anonymous' | 'use-credentials';
  type?: string;
  media?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Preload a resource with proper attributes
 */
export function preloadResource(href: string, options: PreloadOptions) {
  if (typeof window === 'undefined') return;

  // Check if already preloaded
  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existing) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = options.as;
  
  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }
  
  if (options.type) {
    link.type = options.type;
  }
  
  if (options.media) {
    link.media = options.media;
  }
  
  if (options.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority);
  }

  document.head.appendChild(link);
}

/**
 * Preload critical fonts
 */
export function preloadFonts() {
  const fonts = [
    {
      href: '/_next/static/media/inter-latin-400-normal.woff2',
      type: 'font/woff2',
    },
    {
      href: '/_next/static/media/inter-latin-600-normal.woff2',
      type: 'font/woff2',
    },
    {
      href: '/_next/static/media/playfair-display-latin-700-normal.woff2',
      type: 'font/woff2',
    },
  ];

  fonts.forEach(font => {
    preloadResource(font.href, {
      as: 'font',
      type: font.type,
      crossOrigin: 'anonymous',
      fetchPriority: 'high',
    });
  });
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: string[]) {
  images.forEach(src => {
    preloadResource(src, {
      as: 'image',
      fetchPriority: 'high',
    });
  });
}

/**
 * Preload route chunks for faster navigation
 */
export function preloadRoutes(routes: string[]) {
  if (typeof window === 'undefined') return;

  routes.forEach(route => {
    // Use Next.js router prefetch if available
    if ('__NEXT_DATA__' in window) {
      import('next/router').then(({ default: router }) => {
        router.prefetch(route);
      }).catch(console.warn);
    }
  });
}

/**
 * Preload animation libraries when user shows intent to interact
 */
export function setupAnimationPreloading() {
  if (typeof window === 'undefined') return;

  let hasPreloaded = false;

  const preloadAnimations = () => {
    if (hasPreloaded) return;
    hasPreloaded = true;

    // Preload GSAP and Lenis
    Promise.all([
      import('gsap'),
      import('lenis'),
    ]).catch(console.warn);
  };

  // Preload on first user interaction
  const events = ['mouseenter', 'touchstart', 'scroll'];
  
  const handleInteraction = () => {
    preloadAnimations();
    events.forEach(event => {
      document.removeEventListener(event, handleInteraction);
    });
  };

  events.forEach(event => {
    document.addEventListener(event, handleInteraction, { passive: true });
  });

  // Fallback: preload after 3 seconds
  setTimeout(preloadAnimations, 3000);
}

/**
 * Initialize all preloading strategies
 */
export function initializePreloading() {
  if (typeof window === 'undefined') return;

  // Preload critical fonts immediately
  preloadFonts();

  // Setup animation preloading on interaction
  setupAnimationPreloading();

  // Preload common routes after initial load
  setTimeout(() => {
    preloadRoutes(['/projects', '/about', '/contact']);
  }, 2000);
}

/**
 * Preload resources for specific pages
 */
export const pagePreloaders = {
  home: () => {
    preloadCriticalImages([
      '/hero-bg.jpg', // Replace with actual hero image
    ]);
  },
  
  projects: () => {
    // Preload project thumbnails
    preloadRoutes(['/projects/[slug]']);
  },
  
  project: (slug: string) => {
    // Preload project-specific assets
    preloadCriticalImages([
      `/projects/${slug}/hero.jpg`,
      `/projects/${slug}/gallery-1.jpg`,
    ]);
  },
  
  blog: () => {
    // Preload code highlighting
    import('@/components/blog/code-block').catch(console.warn);
  },
};

/**
 * Resource hints for better loading performance
 */
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  const hints = [
    // DNS prefetch for external domains
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//images.unsplash.com' },
    
    // Preconnect to critical origins
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];

  hints.forEach(hint => {
    const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
    if (existing) return;

    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    
    if ('crossOrigin' in hint && hint.crossOrigin) {
      link.crossOrigin = hint.crossOrigin;
    }

    document.head.appendChild(link);
  });
}