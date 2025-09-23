/**
 * Accessibility utilities and focus management system
 */

import { RefObject, useEffect, useRef, useCallback } from 'react';

/**
 * Focus management utilities
 */
export class FocusManager {
  private static focusStack: HTMLElement[] = [];
  private static trapStack: HTMLElement[] = [];

  /**
   * Store the currently focused element
   */
  static storeFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  /**
   * Restore the previously focused element
   */
  static restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.isConnected) {
      element.focus();
    }
  }

  /**
   * Trap focus within a container
   */
  static trapFocus(container: HTMLElement): void {
    this.trapStack.push(container);
    this.setupFocusTrap(container);
  }

  /**
   * Release focus trap
   */
  static releaseFocusTrap(): void {
    const container = this.trapStack.pop();
    if (container) {
      this.removeFocusTrap(container);
    }
  }

  private static setupFocusTrap(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (!firstElement || !lastElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.setAttribute('data-focus-trap', 'true');

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }
  }

  private static removeFocusTrap(container: HTMLElement): void {
    container.removeAttribute('data-focus-trap');
    // Remove event listeners (they'll be garbage collected with the container)
  }

  /**
   * Get all focusable elements within a container
   */
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        const el = element as HTMLElement;
        return (
          el.offsetWidth > 0 &&
          el.offsetHeight > 0 &&
          !el.hasAttribute('hidden') &&
          window.getComputedStyle(el).visibility !== 'hidden'
        );
      }) as HTMLElement[];
  }
}

/**
 * Hook for managing focus traps
 */
export function useFocusTrap(isActive: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    FocusManager.storeFocus();
    FocusManager.trapFocus(containerRef.current as HTMLElement);

    return () => {
      FocusManager.releaseFocusTrap();
      FocusManager.restoreFocus();
    };
  }, [isActive, containerRef]);
}

/**
 * Hook for managing focus restoration
 */
export function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const storeFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current && previousFocusRef.current.isConnected) {
      previousFocusRef.current.focus();
    }
  }, []);

  return { storeFocus, restoreFocus };
}

/**
 * Keyboard navigation utilities
 */
export const KeyboardNavigation = {
  /**
   * Handle arrow key navigation for a list of elements
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    elements: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void,
    options: {
      loop?: boolean;
      horizontal?: boolean;
    } = {}
  ) => {
    const { loop = true, horizontal = false } = options;
    const upKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const downKey = horizontal ? 'ArrowRight' : 'ArrowDown';

    if (event.key === upKey) {
      event.preventDefault();
      const newIndex = currentIndex > 0 ? currentIndex - 1 : loop ? elements.length - 1 : 0;
      onIndexChange(newIndex);
      elements[newIndex]?.focus();
    } else if (event.key === downKey) {
      event.preventDefault();
      const newIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : loop ? 0 : elements.length - 1;
      onIndexChange(newIndex);
      elements[newIndex]?.focus();
    }
  },

  /**
   * Handle Home/End key navigation
   */
  handleHomeEnd: (
    event: KeyboardEvent,
    elements: HTMLElement[],
    onIndexChange: (index: number) => void
  ) => {
    if (event.key === 'Home') {
      event.preventDefault();
      onIndexChange(0);
      elements[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const lastIndex = elements.length - 1;
      onIndexChange(lastIndex);
      elements[lastIndex]?.focus();
    }
  },
};

/**
 * Reduced motion detection
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * High contrast detection
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Screen reader detection utilities
 */
export const ScreenReader = {
  /**
   * Announce text to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Create a live region for dynamic content updates
   */
  createLiveRegion: (id: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (document.getElementById(id)) return;

    const liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  },

  /**
   * Update live region content
   */
  updateLiveRegion: (id: string, message: string) => {
    const liveRegion = document.getElementById(id);
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  },
};

/**
 * Color contrast utilities
 */
export const ColorContrast = {
  /**
   * Calculate relative luminance of a color
   */
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const lum1 = ColorContrast.getLuminance(...color1);
    const lum2 = ColorContrast.getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Check if contrast ratio meets WCAG AA standards
   */
  meetsWCAGAA: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return contrastRatio >= (isLargeText ? 3 : 4.5);
  },

  /**
   * Check if contrast ratio meets WCAG AAA standards
   */
  meetsWCAGAAA: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return contrastRatio >= (isLargeText ? 4.5 : 7);
  },
};

/**
 * Skip link utilities
 */
export const SkipLinks = {
  /**
   * Create skip links for main navigation
   */
  createSkipLinks: () => {
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#footer', text: 'Skip to footer' },
    ];

    const container = document.createElement('div');
    container.className = 'skip-links';
    container.setAttribute('aria-label', 'Skip links');

    skipLinks.forEach(({ href, text }) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      link.className = 'skip-link';
      container.appendChild(link);
    });

    document.body.insertBefore(container, document.body.firstChild);
  },
};