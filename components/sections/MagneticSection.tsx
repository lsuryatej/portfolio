'use client';

import { useEffect, useRef } from 'react';
import { magneticSections } from '@/lib/motion/scroll';

interface MagneticSectionProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export default function MagneticSection({ 
  children, 
  className = '',
  disabled = false,
  id
}: MagneticSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (disabled || !sectionRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add magnetic-section class and apply magnetic behavior
    sectionRef.current.classList.add('magnetic-section');
    magneticSections('.magnetic-section');
  }, [disabled]);

  return (
    <section 
      ref={sectionRef}
      id={id}
      className={`${className} ${disabled ? '' : 'magnetic-section'}`}
    >
      {children}
    </section>
  );
}