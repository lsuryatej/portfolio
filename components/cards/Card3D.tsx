'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  intensity?: number;
}

export default function Card3D({ 
  children, 
  className = '',
  disabled = false,
  intensity = 1
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    
    // Calculate rotation with clamping
    const rotateX = Math.max(-15, Math.min(15, (y / rect.height) * -30 * intensity));
    const rotateY = Math.max(-15, Math.min(15, (x / rect.width) * 30 * intensity));
    
    gsap.to(cardRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [disabled, intensity]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (cardRef.current && !disabled) {
      gsap.to(cardRef.current, {
        z: 50,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current && !disabled) {
      gsap.to(cardRef.current, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [disabled]);

  useEffect(() => {
    if (disabled || !cardRef.current) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scroll-triggered 3D entrance animation
    const tl = gsap.fromTo(cardRef.current,
      {
        rotationY: -45,
        z: -200,
        opacity: 0,
      },
      {
        rotationY: 0,
        z: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    return () => {
      tl.kill();
    };
  }, [disabled]);

  if (disabled) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className="perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        className={`transform-gpu will-change-transform ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
        
        {/* Optional glow effect */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              filter: 'blur(20px)',
              zIndex: -1,
            }}
          />
        )}
      </div>
    </div>
  );
}