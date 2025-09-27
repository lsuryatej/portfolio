'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollerProps {
  children: React.ReactNode[];
  className?: string;
  disabled?: boolean;
}

export default function HorizontalScroller({ 
  children, 
  className = '',
  disabled = false 
}: HorizontalScrollerProps) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !container.current || !track.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sections = track.current.children;
    const total = sections.length;

    if (total === 0) return;

    const tween = gsap.to(track.current, {
      xPercent: -100 * (total - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        pin: true,
        scrub: 1,
        snap: 1 / (total - 1),
        end: () => '+=' + (container.current?.offsetWidth || 0),
        onUpdate: (self) => {
          // Optional: Add progress indicator
          const progress = self.progress;
          container.current?.style.setProperty('--scroll-progress', progress.toString());
        }
      }
    });

    return () => {
      tween.kill();
    };
  }, [disabled, children.length]);

  // Fallback for reduced motion: vertical layout
  if (disabled) {
    return (
      <section className={`space-y-8 ${className}`}>
        {children.map((child, index) => (
          <div key={index} className="w-full">
            {child}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section 
      ref={container} 
      className={`relative w-screen h-screen overflow-hidden ${className}`}
      role="region"
      aria-label="Horizontal scrolling section"
    >
      <div 
        ref={track} 
        className="flex h-full will-change-transform"
        style={{ width: `${children.length * 100}vw` }}
      >
        {children.map((child, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-screen h-full flex items-center justify-center"
          >
            {child}
          </div>
        ))}
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {children.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${
                Math.abs((parseFloat(container.current?.style.getPropertyValue('--scroll-progress') || '0') * (children.length - 1)) - index) < 0.5 
                  ? '1' 
                  : '0.3'
              })`
            }}
          />
        ))}
      </div>
    </section>
  );
}