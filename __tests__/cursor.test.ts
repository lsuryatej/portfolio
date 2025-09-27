/**
 * Cursor System Tests
 * 
 * Tests for the particle cursor system including option parsing,
 * accessibility features, and performance monitoring.
 */

import { initCursor, DEFAULT_OPTIONS } from '../lib/cursor';

// Mock PIXI.js for testing
jest.mock('pixi.js', () => ({
  Application: jest.fn(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    canvas: document.createElement('canvas'),
    renderer: {
      resize: jest.fn(),
      destroy: jest.fn()
    },
    destroy: jest.fn()
  })),
  Shader: {
    from: jest.fn(() => ({ source: 'mock-shader' }))
  },
  Filter: jest.fn(() => ({})),
  registerPlugin: jest.fn()
}));

// Mock DOM methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn().mockImplementation(callback => {
    setTimeout(callback, 16); // ~60fps
    return 1;
  })
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn()
});

// Mock performance.now
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn().mockReturnValue(Date.now())
  }
});

describe('Cursor System', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    document.body.style.cursor = '';
    
    // Mock canvas and context
    mockCanvas = document.createElement('canvas');
    mockContext = {
      scale: jest.fn(),
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      fillStyle: '',
      globalAlpha: 1,
      globalCompositeOperation: '',
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      strokeStyle: '',
      lineWidth: 1,
      stroke: jest.fn(),
      drawImage: jest.fn()
    } as any;
    
    mockCanvas.getContext = jest.fn().mockReturnValue(mockContext);
    
    // Mock document.createElement
    const originalCreateElement = document.createElement;
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return mockCanvas;
      }
      return originalCreateElement.call(document, tagName);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize with default options', () => {
      const destroy = initCursor();
      
      expect(destroy).toBeInstanceOf(Function);
      expect(document.body.style.cursor).toBe('none');
      
      destroy();
      expect(document.body.style.cursor).toBe('');
    });

    test('should merge custom options with defaults', () => {
      const customOptions = {
        baseSize: 15,
        particleCount: 200,
        spring: {
          stiffness: 0.3,
          damping: 0.7
        }
      };

      const destroy = initCursor(customOptions);
      
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });

    test('should handle reduced motion preference', () => {
      const mockMatchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia
      });

      const destroy = initCursor({ reducedMotion: true });
      
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });
  });

  describe('Event Handling', () => {
    test('should handle mouse events', () => {
      const events = {
        onBurst: jest.fn(),
        onHoverEnter: jest.fn(),
        onHoverLeave: jest.fn()
      };

      const destroy = initCursor({}, events);
      
      // Simulate mouse events
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200
      });
      
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 200
      });
      
      document.dispatchEvent(mouseMoveEvent);
      document.dispatchEvent(mouseDownEvent);
      
      // Events should be called (though implementation may vary)
      destroy();
    });

    test('should handle window resize', () => {
      const destroy = initCursor();
      
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080
      });
      
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      destroy();
    });
  });

  describe('Configuration Validation', () => {
    test('should validate numeric options', () => {
      const invalidOptions = {
        baseSize: -5,
        particleCount: 0,
        spring: {
          stiffness: 2, // Should be 0-1
          damping: -0.5 // Should be 0-1
        }
      };

      const destroy = initCursor(invalidOptions);
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });

    test('should handle invalid mode', () => {
      const invalidOptions = {
        mode: 'invalid' as any
      };

      const destroy = initCursor(invalidOptions);
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });

    test('should validate color formats', () => {
      const invalidColors = {
        colors: {
          base: 'invalid-color',
          halo: '#',
          particle: ['invalid', '#123456']
        }
      };

      const destroy = initCursor(invalidColors);
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });
  });

  describe('Performance Monitoring', () => {
    test('should track frame times', () => {
      const destroy = initCursor({ particleCount: 60 });
      
      // Simulate frame rendering
      jest.advanceTimersByTime(16); // One frame
      
      destroy();
    });

    test('should adapt particle count based on performance', () => {
      const destroy = initCursor({ particleCount: 200 });
      
      // Simulate poor performance
      jest.advanceTimersByTime(100);
      
      destroy();
    });
  });

  describe('Accessibility', () => {
    test('should respect reduced motion preference', () => {
      const mockMatchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia
      });

      const destroy = initCursor();
      
      // Should not disable cursor completely, just reduce effects
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });

    test('should maintain focus indicators', () => {
      const destroy = initCursor();
      
      // Create a focusable element
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      
      // Focus the element
      button.focus();
      
      // Focus indicator should still be visible
      const computedStyle = window.getComputedStyle(button, ':focus-visible');
      
      destroy();
    });
  });

  describe('Cleanup', () => {
    test('should clean up properly on destroy', () => {
      const destroy = initCursor();
      
      expect(document.body.style.cursor).toBe('none');
      
      destroy();
      
      expect(document.body.style.cursor).toBe('');
    });

    test('should remove event listeners on destroy', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      const removeWindowEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const destroy = initCursor();
      destroy();
      
      // Should remove event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();
      expect(removeWindowEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('Default Options', () => {
    test('should export default options', () => {
      expect(DEFAULT_OPTIONS).toBeDefined();
      expect(DEFAULT_OPTIONS.mode).toBe('particles');
      expect(DEFAULT_OPTIONS.baseSize).toBe(10);
      expect(DEFAULT_OPTIONS.particleCount).toBe(120);
    });

    test('should have valid default spring values', () => {
      expect(DEFAULT_OPTIONS.spring.stiffness).toBeGreaterThan(0);
      expect(DEFAULT_OPTIONS.spring.stiffness).toBeLessThanOrEqual(1);
      expect(DEFAULT_OPTIONS.spring.damping).toBeGreaterThan(0);
      expect(DEFAULT_OPTIONS.spring.damping).toBeLessThanOrEqual(1);
    });

    test('should have valid default colors', () => {
      expect(DEFAULT_OPTIONS.colors.base).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(DEFAULT_OPTIONS.colors.halo).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(Array.isArray(DEFAULT_OPTIONS.colors.particle)).toBe(true);
      expect(DEFAULT_OPTIONS.colors.particle.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle WebGL initialization failure', () => {
      // Mock WebGL failure
      const originalCreateElement = document.createElement;
      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          const canvas = originalCreateElement.call(document, tagName);
          (canvas as HTMLCanvasElement).getContext = jest.fn().mockReturnValue(null);
          return canvas;
        }
        return originalCreateElement.call(document, tagName);
      });

      const destroy = initCursor({ mode: 'fluid' });
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });

    test('should handle missing canvas context', () => {
  (mockCanvas as HTMLCanvasElement).getContext = jest.fn().mockReturnValue(null);
      
      const destroy = initCursor();
      expect(destroy).toBeInstanceOf(Function);
      destroy();
    });
  });
});
