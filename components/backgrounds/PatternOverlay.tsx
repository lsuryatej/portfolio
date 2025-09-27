'use client';

import { useEffect, useRef } from 'react';
import { parallax } from '@/lib/motion/scroll';

interface PatternOverlayProps {
  className?: string;
  disabled?: boolean;
  pattern?: 'grid' | 'dots' | 'lines';
}

export default function PatternOverlay({ 
  className = '', 
  disabled = false,
  pattern = 'grid'
}: PatternOverlayProps) {
  const patternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !patternRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Apply parallax effect
    patternRef.current.setAttribute('data-speed', '0.1');
    parallax('[data-speed]');
  }, [disabled]);

  if (disabled) return null;

  const renderPattern = () => {
    switch (pattern) {
      case 'dots':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        );
      
      case 'lines':
        return (
          <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50h100M50 0v100" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines)" />
          </svg>
        );
      
      default: // grid
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" className="w-full h-full">
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path 
                  d="M 40 0 L 0 0 0 40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  opacity="0.1"
                  vectorEffect="non-scaling-stroke"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        );
    }
  };

  return (
    <div
      ref={patternRef}
      className={`fixed inset-0 -z-10 text-foreground/5 ${className}`}
      style={{ willChange: 'transform' }}
    >
      {renderPattern()}
    </div>
  );
}