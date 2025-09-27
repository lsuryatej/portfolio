'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GradientMeshProps {
  className?: string;
  disabled?: boolean;
}

export default function GradientMesh({ className = '', disabled = false }: GradientMeshProps) {
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || !meshRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate gradient angle based on scroll progress
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      }
    });

    tl.to(meshRef.current, {
      '--grad-angle': '225deg',
      '--grad-stop1': 'hsl(240, 100%, 70%)',
      '--grad-stop2': 'hsl(280, 100%, 70%)',
      '--grad-stop3': 'hsl(320, 100%, 70%)',
      ease: 'none',
    });

    return () => {
      tl.kill();
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div
      ref={meshRef}
      className={`fixed inset-0 -z-10 opacity-20 ${className}`}
      style={{
        '--grad-angle': '45deg',
        '--grad-stop1': 'hsl(200, 100%, 70%)',
        '--grad-stop2': 'hsl(240, 100%, 70%)',
        '--grad-stop3': 'hsl(280, 100%, 70%)',
        background: `
          radial-gradient(circle at 20% 80%, var(--grad-stop1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, var(--grad-stop2) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, var(--grad-stop3) 0%, transparent 50%),
          linear-gradient(var(--grad-angle), 
            hsl(200, 100%, 50%) 0%, 
            hsl(240, 100%, 50%) 50%, 
            hsl(280, 100%, 50%) 100%
          )
        `,
        filter: 'blur(40px)',
        willChange: 'transform, filter',
      } as React.CSSProperties}
    />
  );
}