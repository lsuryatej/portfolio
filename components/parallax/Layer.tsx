'use client';

import { useEffect, useRef } from 'react';
import { parallax } from '@/lib/motion/scroll';

interface LayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  disabled?: boolean;
}

export default function Layer({ 
  children, 
  speed = 0.2, 
  className = '',
  disabled = false 
}: LayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !layerRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Set data-speed attribute and apply parallax
    layerRef.current.setAttribute('data-speed', speed.toString());
    parallax('[data-speed]');
  }, [speed, disabled]);

  return (
    <div 
      ref={layerRef}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}