'use client';

// Timeline component with scroll-triggered animations
import * as React from 'react';
import { RiseIn, StaggerChildren } from '@/lib/motion/primitives';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  technologies?: string[];
  type: 'work' | 'education' | 'project';
}

interface TimelineProps {
  items?: TimelineItem[];
}

const timelineData: TimelineItem[] = [
  {
    id: '1',
    year: '2024',
    title: 'Data/Software Engineer',
    company: 'Leading UK Bank',
    description: 'Driving fraud prevention initiatives using GCP, BigQuery, and large-scale data pipeline architecture. Developing AI-powered solutions to combat financial crime and streamline workflows.',
    technologies: ['GCP BigQuery', 'Python', 'SQL', 'Dataflow', 'Pub/Sub', 'AI/ML'],
    type: 'work'
  },
  {
    id: '2',
    year: '2024',
    title: 'Bachelor of Technology',
    company: 'Indian Institute of Technology Guwahati',
    description: 'Graduated with degree in Electrical and Electronics Engineering. Developed strong foundation in problem-solving, analytical thinking, and technical implementation.',
    technologies: ['Engineering Mathematics', 'Signal Processing', 'Control Systems', 'Programming'],
    type: 'education'
  },
  {
    id: '3',
    year: '2023',
    title: 'Data Engineer Intern',
    company: 'Tech Company',
    description: 'Built data pipelines and analytics solutions. Gained hands-on experience with cloud platforms and data processing technologies.',
    technologies: ['Python', 'SQL', 'GCP', 'Data Analysis'],
    type: 'work'
  },
  {
    id: '4',
    year: '2022',
    title: 'Software Development Intern',
    company: 'Startup',
    description: 'Started career in software development, building web applications and learning modern development practices in an agile environment.',
    technologies: ['JavaScript', 'React', 'Node.js', 'Git'],
    type: 'work'
  }
];

const typeColors = {
  work: 'bg-blue-500',
  education: 'bg-green-500',
  project: 'bg-purple-500'
};

const typeLabels = {
  work: 'Work',
  education: 'Education',
  project: 'Project'
};

export function Timeline({ items = timelineData }: TimelineProps) {
  const timelineRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const initTimelineAnimations = async () => {
      try {
        const { createScrollAnimation } = await import('@/lib/motion');

        // Animate the timeline line
        createScrollAnimation('.timeline-line', {
          scaleY: 1,
          transformOrigin: 'top center',
        }, {
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        });

        console.log('📅 Timeline animations initialized');
      } catch (error) {
        console.warn('Failed to initialize timeline animations:', error);
      }
    };

    initTimelineAnimations();
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      {/* Animated Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/30 md:left-8">
        <div className="timeline-line absolute inset-0 w-full bg-gradient-to-b from-primary via-primary to-primary/50 origin-top scale-y-0" />
      </div>

      <StaggerChildren className="space-y-8">
        {items.map((item, index) => (
          <RiseIn key={item.id} delay={index * 0.15}>
            <div className="relative flex items-start gap-6 md:gap-8">
              {/* Enhanced Timeline dot with pulse animation */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${typeColors[item.type]} flex items-center justify-center relative`}>
                  <div className="w-3 h-3 bg-white rounded-full" />
                  {/* Pulse ring */}
                  <div className={`absolute inset-0 rounded-full ${typeColors[item.type]} animate-ping opacity-20`} />
                  <div className={`absolute inset-[-4px] rounded-full ${typeColors[item.type]} opacity-10 animate-pulse`} />
                </div>
              </div>

              {/* Content */}
              <Card className="flex-1 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[item.type]}
                      </Badge>
                      <span className="text-sm font-mono text-muted-foreground">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.company}</p>
                  <p className="text-sm leading-relaxed mb-4 text-pretty">{item.description}</p>

                  {item.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </RiseIn>
        ))}
      </StaggerChildren>
    </div>
  );
}