/**
 * Accessibility testing utilities for development and automated testing
 */

import { ColorContrast } from './accessibility';

/**
 * Color contrast testing utilities
 */
export const ContrastTesting = {
  /**
   * Test all color combinations in the design system
   */
  testDesignSystemContrast: () => {
    const results: Array<{
      combination: string;
      ratio: number;
      passes: {
        aa: boolean;
        aaa: boolean;
      };
      isLargeText?: boolean;
    }> = [];

    // Define color combinations to test
    const colorCombinations: Array<{
      name: string;
      fg: [number, number, number];
      bg: [number, number, number];
    }> = [
      // Light theme
      { name: 'Primary on Background (Light)', fg: [33, 39, 55], bg: [255, 255, 255] },
      { name: 'Secondary on Background (Light)', fg: [100, 116, 139], bg: [255, 255, 255] },
      { name: 'Muted on Background (Light)', fg: [100, 116, 139], bg: [248, 250, 252] },
      { name: 'Primary on Card (Light)', fg: [33, 39, 55], bg: [255, 255, 255] },
      
      // Dark theme
      { name: 'Primary on Background (Dark)', fg: [248, 250, 252], bg: [33, 39, 55] },
      { name: 'Secondary on Background (Dark)', fg: [148, 163, 184], bg: [33, 39, 55] },
      { name: 'Muted on Background (Dark)', fg: [148, 163, 184], bg: [51, 65, 85] },
      { name: 'Primary on Card (Dark)', fg: [248, 250, 252], bg: [51, 65, 85] },
      
      // Interactive states
      { name: 'Link on Background (Light)', fg: [59, 130, 246], bg: [255, 255, 255] },
      { name: 'Link on Background (Dark)', fg: [96, 165, 250], bg: [33, 39, 55] },
      { name: 'Error on Background (Light)', fg: [239, 68, 68], bg: [255, 255, 255] },
      { name: 'Error on Background (Dark)', fg: [248, 113, 113], bg: [33, 39, 55] },
      { name: 'Success on Background (Light)', fg: [34, 197, 94], bg: [255, 255, 255] },
      { name: 'Success on Background (Dark)', fg: [74, 222, 128], bg: [33, 39, 55] },
    ];

    colorCombinations.forEach(({ name, fg, bg }) => {
      const ratio = ColorContrast.getContrastRatio(fg, bg);
      results.push({
        combination: name,
        ratio: Math.round(ratio * 100) / 100,
        passes: {
          aa: ColorContrast.meetsWCAGAA(ratio),
          aaa: ColorContrast.meetsWCAGAAA(ratio),
        },
      });
    });

    return results;
  },

  /**
   * Generate a contrast report
   */
  generateContrastReport: () => {
    const results = ContrastTesting.testDesignSystemContrast();
    const failedAA = results.filter(r => !r.passes.aa);
    const failedAAA = results.filter(r => !r.passes.aaa);

    return {
      summary: {
        total: results.length,
        passedAA: results.length - failedAA.length,
        passedAAA: results.length - failedAAA.length,
        failedAA: failedAA.length,
        failedAAA: failedAAA.length,
      },
      results,
      failedAA,
      failedAAA,
    };
  },
};

/**
 * Keyboard navigation testing utilities
 */
export const KeyboardTesting = {
  /**
   * Test if all interactive elements are keyboard accessible
   */
  testKeyboardAccessibility: () => {
    const interactiveSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="tab"]',
    ];

    const elements = document.querySelectorAll(interactiveSelectors.join(', '));
    const results: Array<{
      element: string;
      hasTabIndex: boolean;
      isVisible: boolean;
      hasAriaLabel: boolean;
      hasAccessibleName: boolean;
    }> = [];

    elements.forEach((element, index) => {
      const el = element as HTMLElement;
      const computedStyle = window.getComputedStyle(el);
      const isVisible = computedStyle.display !== 'none' && 
                       computedStyle.visibility !== 'hidden' &&
                       el.offsetWidth > 0 && 
                       el.offsetHeight > 0;

      const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
      const accessibleName = el.getAttribute('aria-label') || 
                            el.textContent?.trim() || 
                            el.getAttribute('title') || 
                            el.getAttribute('alt');

      results.push({
        element: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ').join('.') : ''} (${index + 1})`,
        hasTabIndex: el.hasAttribute('tabindex'),
        isVisible,
        hasAriaLabel,
        hasAccessibleName: !!accessibleName,
      });
    });

    return results;
  },

  /**
   * Test tab order and focus management
   */
  testTabOrder: () => {
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const tabOrder: Array<{
      index: number;
      element: string;
      tabIndex: number;
      isVisible: boolean;
    }> = [];

    focusableElements.forEach((element, index) => {
      const el = element as HTMLElement;
      const computedStyle = window.getComputedStyle(el);
      const isVisible = computedStyle.display !== 'none' && 
                       computedStyle.visibility !== 'hidden' &&
                       el.offsetWidth > 0 && 
                       el.offsetHeight > 0;

      tabOrder.push({
        index: index + 1,
        element: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`,
        tabIndex: parseInt(el.getAttribute('tabindex') || '0'),
        isVisible,
      });
    });

    return tabOrder;
  },
};

/**
 * ARIA and semantic testing utilities
 */
export const ARIATesting = {
  /**
   * Test for proper ARIA labels and roles
   */
  testARIAImplementation: () => {
    const results: Array<{
      element: string;
      issues: string[];
      suggestions: string[];
    }> = [];

    // Test headings hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const issues: string[] = [];
      const suggestions: string[] = [];

      if (index === 0 && level !== 1) {
        issues.push('First heading should be h1');
      }

      if (level > previousLevel + 1) {
        issues.push(`Heading level jumps from h${previousLevel} to h${level}`);
        suggestions.push('Use sequential heading levels');
      }

      if (!heading.textContent?.trim()) {
        issues.push('Empty heading');
        suggestions.push('Provide descriptive heading text');
      }

      if (issues.length > 0 || suggestions.length > 0) {
        results.push({
          element: `${heading.tagName.toLowerCase()}: "${heading.textContent?.trim()}"`,
          issues,
          suggestions,
        });
      }

      previousLevel = level;
    });

    // Test form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const el = input as HTMLInputElement;
      const issues: string[] = [];
      const suggestions: string[] = [];

      if (el.type !== 'hidden' && el.type !== 'submit' && el.type !== 'button') {
        const hasLabel = document.querySelector(`label[for="${el.id}"]`) ||
                        el.hasAttribute('aria-label') ||
                        el.hasAttribute('aria-labelledby');

        if (!hasLabel) {
          issues.push('Missing label');
          suggestions.push('Add a label element or aria-label attribute');
        }

        if (el.hasAttribute('required') && !el.hasAttribute('aria-required')) {
          suggestions.push('Add aria-required="true" for required fields');
        }
      }

      if (issues.length > 0 || suggestions.length > 0) {
        results.push({
          element: `${el.tagName.toLowerCase()}[type="${el.type}"]${el.id ? '#' + el.id : ''}`,
          issues,
          suggestions,
        });
      }
    });

    // Test images
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      const issues: string[] = [];
      const suggestions: string[] = [];

      if (!img.hasAttribute('alt')) {
        issues.push('Missing alt attribute');
        suggestions.push('Add descriptive alt text or empty alt="" for decorative images');
      }

      if (issues.length > 0 || suggestions.length > 0) {
        results.push({
          element: `img[src="${img.src}"]`,
          issues,
          suggestions,
        });
      }
    });

    return results;
  },

  /**
   * Test landmark regions
   */
  testLandmarks: () => {
    const landmarks = {
      main: document.querySelectorAll('main, [role="main"]').length,
      navigation: document.querySelectorAll('nav, [role="navigation"]').length,
      banner: document.querySelectorAll('header, [role="banner"]').length,
      contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length,
      complementary: document.querySelectorAll('aside, [role="complementary"]').length,
      search: document.querySelectorAll('[role="search"]').length,
    };

    const issues: string[] = [];
    const suggestions: string[] = [];

    if (landmarks.main === 0) {
      issues.push('No main landmark found');
      suggestions.push('Add a <main> element or role="main"');
    } else if (landmarks.main > 1) {
      issues.push('Multiple main landmarks found');
      suggestions.push('Use only one main landmark per page');
    }

    if (landmarks.banner === 0) {
      suggestions.push('Consider adding a banner landmark (header)');
    }

    if (landmarks.contentinfo === 0) {
      suggestions.push('Consider adding a contentinfo landmark (footer)');
    }

    return {
      landmarks,
      issues,
      suggestions,
    };
  },
};

/**
 * Performance and motion testing
 */
export const MotionTesting = {
  /**
   * Test for reduced motion compliance
   */
  testReducedMotion: () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animatedElements = document.querySelectorAll('[data-animate], .animate-spin, .animate-pulse, .animate-bounce');
    
    const results = {
      prefersReducedMotion,
      animatedElementsCount: animatedElements.length,
      issues: [] as string[],
      suggestions: [] as string[],
    };

    if (prefersReducedMotion && animatedElements.length > 0) {
      results.issues.push('Animations detected while user prefers reduced motion');
      results.suggestions.push('Disable or reduce animations when prefers-reduced-motion is set');
    }

    return results;
  },
};

/**
 * Generate comprehensive accessibility report
 */
export const generateAccessibilityReport = () => {
  const contrastReport = ContrastTesting.generateContrastReport();
  const keyboardReport = KeyboardTesting.testKeyboardAccessibility();
  const tabOrderReport = KeyboardTesting.testTabOrder();
  const ariaReport = ARIATesting.testARIAImplementation();
  const landmarkReport = ARIATesting.testLandmarks();
  const motionReport = MotionTesting.testReducedMotion();

  return {
    timestamp: new Date().toISOString(),
    summary: {
      colorContrast: {
        total: contrastReport.summary.total,
        passedAA: contrastReport.summary.passedAA,
        failedAA: contrastReport.summary.failedAA,
      },
      keyboard: {
        total: keyboardReport.length,
        accessible: keyboardReport.filter(r => r.hasAccessibleName && r.isVisible).length,
      },
      aria: {
        issues: ariaReport.reduce((sum, r) => sum + r.issues.length, 0),
        suggestions: ariaReport.reduce((sum, r) => sum + r.suggestions.length, 0),
      },
      landmarks: {
        issues: landmarkReport.issues.length,
        suggestions: landmarkReport.suggestions.length,
      },
      motion: {
        issues: motionReport.issues.length,
        suggestions: motionReport.suggestions.length,
      },
    },
    details: {
      colorContrast: contrastReport,
      keyboard: keyboardReport,
      tabOrder: tabOrderReport,
      aria: ariaReport,
      landmarks: landmarkReport,
      motion: motionReport,
    },
  };
};

/**
 * Development helper to log accessibility report to console
 */
export const logAccessibilityReport = () => {
  if (process.env.NODE_ENV === 'development') {
    const report = generateAccessibilityReport();
    
    console.group('🔍 Accessibility Report');
    console.log('Generated at:', report.timestamp);
    
    console.group('📊 Summary');
    console.log('Color Contrast:', report.summary.colorContrast);
    console.log('Keyboard Navigation:', report.summary.keyboard);
    console.log('ARIA Implementation:', report.summary.aria);
    console.log('Landmarks:', report.summary.landmarks);
    console.log('Motion:', report.summary.motion);
    console.groupEnd();
    
    if (report.details.colorContrast.failedAA.length > 0) {
      console.group('❌ Color Contrast Failures (AA)');
      report.details.colorContrast.failedAA.forEach(failure => {
        console.log(`${failure.combination}: ${failure.ratio}:1`);
      });
      console.groupEnd();
    }
    
    if (report.details.aria.length > 0) {
      console.group('⚠️ ARIA Issues');
      report.details.aria.forEach(issue => {
        if (issue.issues.length > 0) {
          console.log(`${issue.element}:`, issue.issues);
        }
      });
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return report;
  }
  
  return undefined;
};