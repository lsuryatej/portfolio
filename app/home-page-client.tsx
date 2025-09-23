'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, ArrowDown, Mail, ExternalLink } from 'lucide-react';
import { FadeIn, RiseIn, ScaleIn, StaggerChildren, Magnetic } from '@/lib/motion';

export default function HomePageClient() {
  return (
    <div className="bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <FadeIn delay={0.3}>
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-6 font-medium">
              Portfolio & Creative Studio
            </p>
          </FadeIn>

          <h1 className="text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.04em] font-bold mb-8">
            Creative <br />
            Developer
          </h1>

          <RiseIn delay={1.5}>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed text-center">
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

      {/* Main content */}
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-24">
          {/* Components showcase */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="mb-4">Component Showcase</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A comprehensive set of UI components built with shadcn/ui, featuring custom theming,
                fluid typography, and a complete motion system.
              </p>
            </div>

            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and sizes with magnetic effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Magnetic><Button>Default</Button></Magnetic>
                  <Magnetic><Button variant="secondary">Secondary</Button></Magnetic>
                  <Magnetic><Button variant="outline">Outline</Button></Magnetic>
                  <Magnetic><Button variant="ghost">Ghost</Button></Magnetic>
                  <Magnetic><Button variant="destructive">Destructive</Button></Magnetic>
                </div>
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

            {/* Badges */}
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
          </section>
        </div>
      </div>
    </div>
  );
}