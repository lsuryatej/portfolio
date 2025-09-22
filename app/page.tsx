import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Star, Zap } from 'lucide-react';
import { FadeIn, RiseIn, ScaleIn, SlideIn, StaggerChildren, Magnetic } from '@/lib/motion';

export default function Home() {
  return (
    <div className="bg-background">
      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Hero section */}
          <section className="text-center">
            <FadeIn>
              <h1 className="mb-6">
                Foundation UI Components
              </h1>
            </FadeIn>
            <RiseIn delay={0.2}>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A comprehensive set of UI components built with shadcn/ui, featuring custom theming, 
                fluid typography, and a complete motion system.
              </p>
            </RiseIn>
          </section>

          {/* Components showcase */}
          <section className="space-y-8">
            <SlideIn direction="up">
              <h2>Component Showcase</h2>
            </SlideIn>
            
            {/* Buttons */}
            <ScaleIn>
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Various button styles and sizes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StaggerChildren stagger={0.05}>
                    <div className="flex flex-wrap gap-2">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                  </StaggerChildren>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                    <Magnetic>
                      <Button size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </Magnetic>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <Github className="mr-2 h-4 w-4" />
                      With Icon
                    </Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </CardContent>
              </Card>
            </ScaleIn>

            {/* Badges */}
            <SlideIn direction="left">
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
            </SlideIn>

            {/* Typography */}
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

            {/* Motion System Demo */}
            <RiseIn>
              <Card>
                <CardHeader>
                  <CardTitle>Motion System</CardTitle>
                  <CardDescription>Smooth animations with reduced motion support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <FadeIn delay={0.1}>
                      <div className="rounded-lg border p-4 text-center">
                        <h4 className="font-semibold">FadeIn</h4>
                        <p className="text-sm text-muted-foreground">Opacity transition</p>
                      </div>
                    </FadeIn>
                    <RiseIn delay={0.2}>
                      <div className="rounded-lg border p-4 text-center">
                        <h4 className="font-semibold">RiseIn</h4>
                        <p className="text-sm text-muted-foreground">Slide up effect</p>
                      </div>
                    </RiseIn>
                    <ScaleIn delay={0.3}>
                      <div className="rounded-lg border p-4 text-center">
                        <h4 className="font-semibold">ScaleIn</h4>
                        <p className="text-sm text-muted-foreground">Scale transition</p>
                      </div>
                    </ScaleIn>
                    <SlideIn direction="right" delay={0.4}>
                      <div className="rounded-lg border p-4 text-center">
                        <h4 className="font-semibold">SlideIn</h4>
                        <p className="text-sm text-muted-foreground">Directional slide</p>
                      </div>
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
                      Hover over the button to see the magnetic effect
                    </p>
                  </div>
                </CardContent>
              </Card>
            </RiseIn>

            {/* Cards */}
            <SlideIn direction="right">
              <Card>
                <CardHeader>
                  <CardTitle>Cards</CardTitle>
                  <CardDescription>Flexible content containers</CardDescription>
                </CardHeader>
                <CardContent>
                  <StaggerChildren stagger={0.15}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
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
                            This demonstrates how cards can be nested and styled consistently.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Another Card</CardTitle>
                          <CardDescription>
                            Cards maintain consistent spacing and styling
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
                    </div>
                  </StaggerChildren>
                </CardContent>
              </Card>
            </SlideIn>
          </section>
        </div>
      </div>
    </div>
  );
}
