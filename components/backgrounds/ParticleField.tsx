'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import { velocityBus } from '@/lib/motion/scroll';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleFieldProps {
  className?: string;
  disabled?: boolean;
  particleCount?: number;
}

export default function ParticleField({ 
  className = '', 
  disabled = false,
  particleCount = 150 
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);
  const animationRef = useRef<number>(0);

  const colors = useMemo(() => [
    'rgba(59, 130, 246, 0.6)',   // blue
    'rgba(139, 92, 246, 0.6)',   // purple
    'rgba(236, 72, 153, 0.6)',   // pink
    'rgba(6, 182, 212, 0.6)',    // cyan
  ], []);

  const createParticle = useCallback((): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, vx: 0, vy: 0, size: 0, opacity: 0, color: colors[0] || 'rgba(59, 130, 246, 0.6)' };

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)] || 'rgba(59, 130, 246, 0.6)',
    };
  }, [colors]);

  const initParticles = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.min(particleCount, 75) : particleCount;
    
    particlesRef.current = Array.from({ length: count }, createParticle);
  }, [particleCount, createParticle]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const velocity = Math.abs(velocityRef.current);

    particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= (dx / distance) * force * 0.01;
        particle.vy -= (dy / distance) * force * 0.01;
      }

      // Velocity-based movement
      particle.vy += velocity * 0.001;

      // Boundary wrapping
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    });
  }, []);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw connections
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const particleA = particles[i];
        const particleB = particles[j];
        if (!particleA || !particleB) continue;
        
        const dx = particleA.x - particleB.x;
        const dy = particleA.y - particleB.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.save();
          ctx.globalAlpha = (120 - distance) / 120 * 0.1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particleA.x, particleA.y);
          ctx.lineTo(particleB.x, particleB.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }, []);

  const animate = useCallback(() => {
    updateParticles();
    drawParticles();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }, [initParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Setup canvas
    handleResize();

    // Subscribe to velocity updates
    const unsubscribeVelocity = velocityBus.subscribe((velocity) => {
      velocityRef.current = velocity;
    });

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeVelocity();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [disabled, animate, handleResize, handleMouseMove]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      style={{ willChange: 'transform' }}
    />
  );
}