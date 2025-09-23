'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, Zap, ArrowDown, Mail, ExternalLink } from 'lucide-react';
import { FadeIn, RiseIn, ScaleIn, SlideIn, StaggerChildren, Magnetic } from '@/lib/motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createParallaxEffect, createScrollAnimation, shouldAnimate } from '@/lib/motion/scroll';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxBg1Ref = useRef<HTMLDivElement>(null);
  const parallaxBg2Ref = useRef<HTMLDivElement>(null);
  const parallaxBg3Ref = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate()) return;

    // Multi-layer parallax background
    if (parallaxBg1Ref.current) {
      createParallaxEffect(parallaxBg1Ref.current, 0.2);
    }
    if (parallaxBg2Ref.current) {
      createParallaxEffect(parallaxBg2Ref.current, 0.5);
    }
    if (parallaxBg3Ref.current) {
      createParallaxEffect(parallaxBg3Ref.current, 0.8);
    }

    // Animated headline with kerning effects
    if (headlineRef.current) {
      const chars = headlineRef.current.querySelectorAll('.char');
      gsap.fromTo(chars, 
        {
          opacity: 0,
          y: 100,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
          stagger: {
            amount: 0.8,
            from: 'center',
          },
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Kerning animation
      gsap.to(chars, {
        letterSpacing: '0.02em',
        duration: 2,
        ease: 'power2.out',
        delay: 1,
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Scroll-triggered section reveals with staggered animations
    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('.reveal-section');
      sections.forEach((section, index) => {
        createScrollAnimation(section, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
        }, {
          start: 'top 85%',
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Split text into characters for animation
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block" style={{ transformOrigin: '50% 100%' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section with Multi-layer Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Parallax Background Layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Layer 1 - Subtle background texture */}
          <div 
            ref={parallaxBg1Ref}
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            }}
          />
          
          {/* Layer 2 - Geometric shapes */}
          <div 
            ref={parallaxBg2Ref}
            className="absolute inset-0 opacity-20"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-brand/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          {/* Layer 3 - Floating elements */}
          <div 
            ref={parallaxBg3Ref}
            className="absolute inset-0 opacity-10"
          >
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-brand rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-brand rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <FadeIn delay={0.3}>
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6 font-medium">
              Portfolio & Creative Studio
            </p>
          </FadeIn>
          
          {/* Animated Headline with Kerning Effects */}
          <h1 
            ref={headlineRef}
            className="text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em] font-bold mb-8 perspective-1000"
          >
            {splitText('Creative')} <br />
            {splitText('Developer')}
          </h1>
          
          <RiseIn delay={1.5}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Crafting exceptional digital experiences through innovative design, 
              cutting-edge technology, and meticulous attention to detail.
            </p>
          </RiseIn>

          <StaggerChildren stagger={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Magnetic>
                <Button size="lg" className="text-lg px-8 py-6 rounded-2xl">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </Button>
              </Magnetic>
              
              <Magnetic>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Work
                </Button>
              </Magnetic>
            </div>
          </StaggerChildren>

          <ScaleIn delay={2}>
            <div className="animate-bounce">
              <ArrowDown className="h-6 w-6 text-muted-foreground mx-auto" />
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Main content with scroll-triggered reveals */}
      <div ref={sectionsRef} className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-24">
          {/* Components showcase */}
          <section className="space-y-12 reveal-section" style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <div className="text-center">
              <h2 className="mb-4">Component Showcase</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A comprehensive set of UI components built with shadcn/ui, featuring custom theming, 
                fluid typography, and a complete motion system.
              </p>
            </div>
            
            {/* Buttons */}
            <div className="reveal-section" style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Various button styles and sizes with magnetic effects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StaggerChildren stagger={0.05}>
                    <div className="flex flex-wrap gap-2">
                      <Magnetic><Button>Default</Button></Magnetic>
                      <Magnetic><Button variant="secondary">Secondary</Button></Magnetic>
                      <Magnetic><Button variant="outline">Outline</Button></Magnetic>
                      <Magnetic><Button variant="ghost">Ghost</Button></Magnetic>
                      <Magnetic><Button variant="destructive">Destructive</Button></Magnetic>
                    </div>
                  </StaggerChildren>
                  <div className="flex flex-wrap gap-2">
                    <Magnetic><Button size="sm">Small</Button></Magnetic>
                    <Magnetic><Button>Default</Button></Magnetic>
                    <Magnetic><Button size="lg">Large</Button></Magnetic>
                    <Magnetic>
                      <Button size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </Magnetic>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Magnetic>
                      <Button>
                        <Github className="mr-2 h-4 w-4" />
                        With Icon
                      </Button>
                    </Magnetic>
                    <Button disabled>Disabled</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <div className="reveal-section" style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription>Status indicators and labels</CardDescription>
                </CardHeader>
                <CardContent>
                  <StaggerChildren stagger={0.1}>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </StaggerChildren>
                </CardContent>
              </Card>
            </div>

            {/* Typography */}
            <div className="reveal-section" style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Fluid typography system with display and body fonts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h1>Display 4XL Heading</h1>
                    <h2>Display 3XL Heading</h2>
                    <h3>Display 2XL Heading</h3>
                    <h4>Display XL Heading</h4>
                    <h5>Display LG Heading</h5>
                    <h6>Display Base Heading</h6>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl">Extra large body text for emphasis</p>
                    <p className="text-lg">Large body text for readability</p>
                    <p>Default body text with optimal line height</p>
                    <p className="text-sm">Small text for captions and metadata</p>
                    <p className="text-xs">Extra small text for fine print</p>
                  </div>
                  <div>
                    <code>Inline code example</code>
                    <pre className="mt-2 rounded-md bg-muted p-4">
                      <code>{`// Code block example
const greeting = "Hello, World!";
console.log(greeting);`}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Motion System Demo */}
            <div className="reveal-section" style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Motion System</CardTitle>
                  <CardDescription>Smooth animations with reduced motion support and magnetic interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <FadeIn delay={0.1}>
                      <Magnetic>
                        <div className="rounded-lg border p-4 text-center cursor-pointer hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold">FadeIn</h4>
                          <p className="text-sm text-muted-foreground">Opacity transition</p>
                        </div>
                      </Magnetic>
                    </FadeIn>
                    <RiseIn delay={0.2}>
                      <Magnetic>
                        <div className="rounded-lg border p-4 text-center cursor-pointer hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold">RiseIn</h4>
                          <p className="text-sm text-muted-foreground">Slide up effect</p>
                        </div>
                      </Magnetic>
                    </RiseIn>
                    <ScaleIn delay={0.3}>
                      <Magnetic>
                        <div className="rounded-lg border p-4 text-center cursor-pointer hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold">ScaleIn</h4>
                          <p className="text-sm text-muted-foreground">Scale transition</p>
                        </div>
                      </Magnetic>
                    </ScaleIn>
                    <SlideIn direction="right" delay={0.4}>
                      <Magnetic>
                        <div className="rounded-lg border p-4 text-center cursor-pointer hover:shadow-lg transition-shadow">
                          <h4 className="font-semibold">SlideIn</h4>
                          <p className="text-sm text-muted-foreground">Directional slide</p>
                        </div>
                      </Magnetic>
                    </SlideIn>
                  </div>
                  
                  <div className="text-center">
                    <Magnetic>
                      <Button size="lg" className="cursor-pointer">
                        <Zap className="mr-2 h-4 w-4" />
                        Magnetic Button
                      </Button>
                    </Magnetic>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Hover over elements to see the magnetic cursor effect
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cards */}
            <div className="reveal-section" style={{ opacity: 0, transform: 'translateY(50px)' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Cards</CardTitle>
                  <CardDescription>Flexible content containers with interactive effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <StaggerChildren stagger={0.15}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Magnetic>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Zap className="h-5 w-5" />
                              Feature Card
                            </CardTitle>
                            <CardDescription>
                              A sample feature card with icon and description
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              This demonstrates how cards can be nested and styled consistently with magnetic effects.
                            </p>
                          </CardContent>
                        </Card>
                      </Magnetic>
                      
                      <Magnetic>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle>Interactive Card</CardTitle>
                            <CardDescription>
                              Cards with magnetic cursor attraction
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2">
                              <Badge>React</Badge>
                              <Badge variant="secondary">TypeScript</Badge>
                              <Badge variant="outline">Tailwind</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Magnetic>
                    </div>
                  </StaggerChildren>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional showcase section */}
          <section className="reveal-section text-center py-16" style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <h2 className="mb-6">Experience the Magic</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
              Every element on this page demonstrates the power of our motion system. 
              Scroll, hover, and interact to see the animations in action.
            </p>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <Magnetic>
                <div className="p-6 rounded-2xl border bg-card hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Zap className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-semibold mb-2">Smooth Animations</h3>
                  <p className="text-sm text-muted-foreground">
                    60fps scroll animations with reduced motion support
                  </p>
                </div>
              </Magnetic>
              
              <Magnetic>
                <div className="p-6 rounded-2xl border bg-card hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Star className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-semibold mb-2">Magnetic Interactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Cursor attraction effects for enhanced user engagement
                  </p>
                </div>
              </Magnetic>
              
              <Magnetic>
                <div className="p-6 rounded-2xl border bg-card hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Github className="h-6 w-6 text-brand" />
                  </div>
                  <h3 className="font-semibold mb-2">Modern Stack</h3>
                  <p className="text-sm text-muted-foreground">
                    Built with Next.js, GSAP, and Framer Motion
                  </p>
                </div>
              </Magnetic>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
