import { Metadata } from 'next';
import { RiseIn, FadeIn } from '@/lib/motion/primitives';
import { Timeline, Skills, PressLogos, ResumeDownload } from '@/components/about';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about my background, experience, and skills in web development and design.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <RiseIn>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              About Me
            </h1>
          </RiseIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              I&apos;m a passionate frontend developer with a love for creating beautiful, 
              performant web experiences. With expertise in modern technologies and 
              a keen eye for design, I bring ideas to life through code.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <RiseIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">My Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A timeline of my professional experience, education, and key milestones 
                that have shaped my career in web development.
              </p>
            </div>
          </RiseIn>
          <Timeline />
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <RiseIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Skills & Expertise</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Technologies and tools I work with to create exceptional digital experiences.
              </p>
            </div>
          </RiseIn>
          <Skills />
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Press/Recognition Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <PressLogos />
        </div>
      </section>

      <Separator className="container mx-auto" />

      {/* Resume Download Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <ResumeDownload />
        </div>
      </section>
    </div>
  );
}