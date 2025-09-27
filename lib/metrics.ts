/**
 * Performance Telemetry & Analytics
 * Tracks animation performance and user experience metrics
 */

interface FrameDropEvent {
  sectionId: string;
  dropsPer10s: number;
  timestamp: number;
  userAgent: string;
  viewport: { width: number; height: number };
  motionLevel: string;
}

interface ScrollStallEvent {
  sectionId: string;
  stallMs: number;
  timestamp: number;
  scrollVelocity: number;
}

interface AnimationMetrics {
  frameDrops: number;
  lastFrameTime: number;
  frameCount: number;
  startTime: number;
}

class MetricsCollector {
  private frameMetrics = new Map<string, AnimationMetrics>();
  private reportQueue: (FrameDropEvent | ScrollStallEvent)[] = [];
  private lastReportTime = 0;
  private readonly REPORT_INTERVAL = 10000; // 10 seconds
  private readonly THROTTLE_LIMIT = 5; // Max 5 reports per interval

  /**
   * Start tracking frame drops for a section
   */
  startTracking(sectionId: string) {
    this.frameMetrics.set(sectionId, {
      frameDrops: 0,
      lastFrameTime: performance.now(),
      frameCount: 0,
      startTime: performance.now(),
    });
  }

  /**
   * Stop tracking frame drops for a section
   */
  stopTracking(sectionId: string) {
    this.frameMetrics.delete(sectionId);
  }

  /**
   * Record a frame for performance tracking
   */
  recordFrame(sectionId: string) {
    const metrics = this.frameMetrics.get(sectionId);
    if (!metrics) return;

    const now = performance.now();
    const frameDelta = now - metrics.lastFrameTime;
    
    // Consider a frame drop if delta > 16.67ms (60fps) + 5ms tolerance
    if (frameDelta > 21.67) {
      metrics.frameDrops++;
    }
    
    metrics.frameCount++;
    metrics.lastFrameTime = now;

    // Report every 10 seconds
    if (now - metrics.startTime >= this.REPORT_INTERVAL) {
      this.reportFrameDrops(sectionId, metrics.frameDrops);
      
      // Reset metrics
      metrics.frameDrops = 0;
      metrics.frameCount = 0;
      metrics.startTime = now;
    }
  }

  /**
   * Report frame drops for a section
   */
  reportFrameDrops(sectionId: string, dropsPer10s: number) {
    if (dropsPer10s === 0) return; // Don't report perfect performance

    const event: FrameDropEvent = {
      sectionId,
      dropsPer10s,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      motionLevel: process.env.NEXT_PUBLIC_MOTION_LEVEL || 'enhanced',
    };

    this.queueEvent(event);
  }

  /**
   * Report scroll stall event
   */
  reportScrollStall(sectionId: string, stallMs: number, scrollVelocity: number) {
    const event: ScrollStallEvent = {
      sectionId,
      stallMs,
      timestamp: Date.now(),
      scrollVelocity,
    };

    this.queueEvent(event);
  }

  /**
   * Queue event for batched reporting
   */
  private queueEvent(event: FrameDropEvent | ScrollStallEvent) {
    this.reportQueue.push(event);

    // Throttle reporting
    const now = Date.now();
    if (now - this.lastReportTime >= this.REPORT_INTERVAL) {
      this.flushEvents();
      this.lastReportTime = now;
    }
  }

  /**
   * Send queued events to analytics
   */
  private async flushEvents() {
    if (this.reportQueue.length === 0) return;

    // Take only the first N events to avoid spamming
    const eventsToSend = this.reportQueue.splice(0, this.THROTTLE_LIMIT);

    try {
      // Send to your analytics service
      await this.sendToAnalytics(eventsToSend);
    } catch (error) {
      console.warn('Failed to send metrics:', error);
    }
  }

  /**
   * Send events to analytics service (Plausible, GA, etc.)
   */
  private async sendToAnalytics(events: (FrameDropEvent | ScrollStallEvent)[]) {
    // Example: Send to Plausible
    if (typeof window !== 'undefined' && (window as Window & { plausible?: (...args: unknown[]) => void }).plausible) {
      events.forEach(event => {
        if ('dropsPer10s' in event) {
          (window as Window & { plausible?: (...args: unknown[]) => void }).plausible!('Animation Performance', {
            props: {
              section: event.sectionId,
              drops: event.dropsPer10s,
              motion_level: event.motionLevel,
              viewport: `${event.viewport.width}x${event.viewport.height}`,
            }
          });
        } else {
          (window as Window & { plausible?: (...args: unknown[]) => void }).plausible!('Scroll Stall', {
            props: {
              section: event.sectionId,
              stall_ms: event.stallMs,
              velocity: Math.round(event.scrollVelocity),
            }
          });
        }
      });
    }

    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      events.forEach(event => {
        if ('dropsPer10s' in event) {
          (window as Window & { gtag?: (...args: unknown[]) => void }).gtag!('event', 'animation_performance', {
            section_id: event.sectionId,
            frame_drops: event.dropsPer10s,
            motion_level: event.motionLevel,
            custom_map: {
              dimension1: event.motionLevel,
              metric1: event.dropsPer10s,
            }
          });
        }
      });
    }

    // Example: Send to custom endpoint
    if (process.env.NEXT_PUBLIC_METRICS_ENDPOINT) {
      await fetch(process.env.NEXT_PUBLIC_METRICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    }
  }
}

// Global metrics collector instance
export const metricsCollector = new MetricsCollector();

/**
 * Hook for tracking animation performance in React components
 */
export function useAnimationMetrics(sectionId: string) {
  const startTracking = () => metricsCollector.startTracking(sectionId);
  const stopTracking = () => metricsCollector.stopTracking(sectionId);
  const recordFrame = () => metricsCollector.recordFrame(sectionId);

  return { startTracking, stopTracking, recordFrame };
}

/**
 * Report frame drops for a section (legacy function)
 */
export function reportFrameDrops(sectionId: string, dropsPer10s: number) {
  metricsCollector.reportFrameDrops(sectionId, dropsPer10s);
}

/**
 * Report scroll stall event
 */
export function reportScrollStall(sectionId: string, stallMs: number, scrollVelocity: number) {
  metricsCollector.reportScrollStall(sectionId, stallMs, scrollVelocity);
}