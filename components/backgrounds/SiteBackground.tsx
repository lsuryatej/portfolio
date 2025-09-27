'use client';

import { useEffect, useState } from 'react';
import GradientMesh from './GradientMesh';
import ParticleField from './ParticleField';
import PatternOverlay from './PatternOverlay';

interface SiteBackgroundProps {
  disabled?: boolean;
  variant?: 'gradient' | 'particles' | 'pattern' | 'all';
}

export default function SiteBackground({ 
  disabled = false, 
  variant = 'all' 
}: SiteBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Disable all backgrounds if user prefers reduced motion or explicitly disabled
  const shouldDisable = disabled || prefersReducedMotion;

  return (
    <>
      {(variant === 'gradient' || variant === 'all') && (
        <GradientMesh disabled={shouldDisable} />
      )}
      
      {(variant === 'particles' || variant === 'all') && (
        <ParticleField 
          disabled={shouldDisable} 
          particleCount={typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 150}
        />
      )}
      
      {(variant === 'pattern' || variant === 'all') && (
        <PatternOverlay 
          disabled={shouldDisable} 
          pattern="grid" 
        />
      )}
    </>
  );
}