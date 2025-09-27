'use client';

import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MorphTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  disabled?: boolean;
  trigger?: 'scroll' | 'immediate';
}

export default function MorphText({ 
  text, 
  className = '',
  as: Component = 'h1',
  disabled = false,
  trigger = 'scroll'
}: MorphTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const splitInstanceRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (disabled || !textRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Split text into characters
    const splitInstance = new SplitType(textRef.current, { 
      types: 'chars',
      tagName: 'span'
    });
    splitInstanceRef.current = splitInstance;

    if (!splitInstance.chars) return;

    // Create animation timeline
    const tl = gsap.fromTo(splitInstance.chars,
      {
        y: 40,
        opacity: 0,
        rotateX: -90,
        transformOrigin: '50% 100%',
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.02,
        duration: 0.6,
        ease: 'power3.out',
      }
    );

    if (trigger === 'scroll') {
      // Scroll-triggered animation
      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        animation: tl,
        toggleActions: 'play none none reverse',
      });
    } else {
      // Immediate animation
      tl.play();
    }

    return () => {
      tl.kill();
      splitInstance.revert();
    };
  }, [text, disabled, trigger]);

  if (disabled) {
    return <Component className={className}>{text}</Component>;
  }

  // Use a wrapper div to avoid ref conflicts
  return (
    <div 
      ref={textRef} 
      className={`${className} will-change-transform`}
      style={{ perspective: '1000px' }}
    >
      <Component>{text}</Component>
    </div>
  );
}