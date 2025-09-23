'use client';

// Timeline component with scroll-triggered animations
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
    title: 'Senior Frontend Developer',
    company: 'Tech Company',
    description: 'Leading frontend development for modern web applications using React, Next.js, and TypeScript. Focused on performance optimization and user experience.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    type: 'work'
  },
  {
    id: '2',
    year: '2023',
    title: 'Frontend Developer',
    company: 'Digital Agency',
    description: 'Developed responsive web applications and collaborated with design teams to create engaging user interfaces.',
    technologies: ['React', 'JavaScript', 'SCSS', 'Figma'],
    type: 'work'
  },
  {
    id: '3',
    year: '2022',
    title: 'Computer Science Degree',
    company: 'University',
    description: 'Bachelor of Science in Computer Science with focus on web technologies and software engineering principles.',
    type: 'education'
  },
  {
    id: '4',
    year: '2021',
    title: 'Junior Developer',
    company: 'Startup',
    description: 'Started career building web applications and learning modern development practices in an agile environment.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
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
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-8" />
      
      <StaggerChildren className="space-y-8">
        {items.map((item, index) => (
          <RiseIn key={item.id} delay={index * 0.1}>
            <div className="relative flex items-start gap-6 md:gap-8">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${typeColors[item.type]} flex items-center justify-center`}>
                  <div className="w-3 h-3 bg-white rounded-full" />
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
                  <p className="text-sm leading-relaxed mb-4">{item.description}</p>
                  
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