'use client';

import { Project } from 'contentlayer/generated';
import { Badge } from '@/components/ui/badge';
import { RiseIn, StaggerChildren } from '@/lib/motion/primitives';
import Image from 'next/image';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="mb-12">
      <StaggerChildren className="space-y-6">
        <RiseIn>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {project.title}
          </h1>
        </RiseIn>

        <RiseIn delay={0.1}>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {project.summary}
          </p>
        </RiseIn>

        <RiseIn delay={0.2}>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </RiseIn>

        {project.coverImage && (
          <RiseIn delay={0.3}>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          </RiseIn>
        )}
      </StaggerChildren>
    </header>
  );
}