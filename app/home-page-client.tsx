'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, ArrowDown, Mail, ExternalLink } from 'lucide-react';
import { FadeIn, RiseIn, ScaleIn, StaggerChildren } from '@/lib/motion';

export default function HomePageClient() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Initialize hero animations after component mounts
    const initHeroAnimations = async () => {
      try {
        const { createParallaxEffect } = await import('@/lib/motion');
        
        // Create parallax background layers
        createParallaxEffect('.hero-bg-layer-1', 0.2);
        createParallaxEffect('.hero-bg-layer-2', 0.5);
        createParallaxEffect('.hero-bg-layer-3', 0.8);
        
        // Animate hero title with kerning effects
        if (titleRef.current) {
          const { gsap } = await import('gsap');
          
          // Split text into characters for kerning animation
          const text = titleRef.current.textContent || '';
          const chars = text.split('').map(char => 
            char === ' ' ? '<span class="char"> </span>' : 
            char === '\n' ? '<br>' : 
            `<span class="char">${char}</span>`
          ).join('');
          
          titleRef.current.innerHTML = chars;
          
          // Animate each character
          gsap.fromTo('.char', {
            opacity: 0,
            y: 100,
            rotationX: -90,
          }, {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: 'back.out(1.7)',
            delay: 0.5,
          });
        }
        
        console.log('🎭 Hero animations initialized');
      } catch (error) {
        console.warn('Failed to initialize hero animations:', error);
      }
    };

    initHeroAnimations();
  }, []);

  return (
    <div className="bg-background overflow-hidden">
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="hero-bg-layer-1 absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="hero-bg-layer-2 absolute inset-0 bg-gradient-to-tl from-accent/5 to-transparent" />
        <div className="hero-bg-layer-3 absolute inset-0 bg-gradient-to-tr from-muted/10 to-transparent" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center perspective-1000">
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <FadeIn delay={0.3}>
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6 font-medium">
              Portfolio & Creative Studio
            </p>
          </FadeIn>

          <h1 
            ref={titleRef}
            className="text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em] font-bold mb-8 font-display"
            style={{ perspective: '1000px' }}
          >
            Creative Developer
          </h1>

          <RiseIn delay={1.5}>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-12 hero-text text-center">
              Crafting exceptional digital experiences through innovative design, cutting-edge technology, and meticulous attention to detail.
            </p>
          </RiseIn>

          <StaggerChildren stagger={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <MagneticButton 
                size="lg" 
                variant="primary"
                strength={0.4}
                className="text-lg px-8 py-6"
              >
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </MagneticButton>

              <MagneticButton 
                size="lg" 
                variant="outline"
                strength={0.4}
                className="text-lg px-8 py-6"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                View Work
              </MagneticButton>
            </div>
          </StaggerChildren>

          <ScaleIn delay={2.5}>
            <div className="animate-bounce cursor-pointer" onClick={() => {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }}>
              <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto hover:text-primary transition-colors" />
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-24">
          {/* Components showcase */}
          <section className="space-y-12" data-animate>
            <RiseIn>
              <div className="text-center">
                <h2 className="mb-4">Component Showcase</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto description-text">
                  A comprehensive set of UI components built with shadcn/ui, featuring custom theming, fluid typography, and a complete motion system.
                </p>
              </div>
            </RiseIn>

            {/* Buttons */}
            <RiseIn delay={0.2}>
              <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and sizes with magnetic effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <MagneticButton variant="primary">Default</MagneticButton>
                  <MagneticButton variant="secondary">Secondary</MagneticButton>
                  <MagneticButton variant="outline">Outline</MagneticButton>
                  <MagneticButton variant="ghost">Ghost</MagneticButton>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <MagneticButton size="sm">Small</MagneticButton>
                  <MagneticButton size="md">Default</MagneticButton>
                  <MagneticButton size="lg">Large</MagneticButton>
                  <MagneticButton size="sm" className="w-10 h-10 p-0">
                    <Star className="h-4 w-4" />
                  </MagneticButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  <MagneticButton>
                    <Github className="mr-2 h-4 w-4" />
                    With Icon
                  </MagneticButton>
                  <Button disabled>Disabled</Button>
                </div>
              </CardContent>
            </Card>

            </RiseIn>

            {/* Badges */}
            <RiseIn delay={0.4}>
              <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
              </Card>
            </RiseIn>
          </section>
        </div>
      </div>
    </div>
  );
}