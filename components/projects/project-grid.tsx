'use client';

import { useMemo } from 'react';
import { ProjectCard } from './project-card';
import type { Project } from 'contentlayer/generated';

interface ProjectGridProps {
  projects: Project[];
  activeFilters: string[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  // Sort projects: featured first, then by year (newest first)
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by year (newest first)
      const yearA = a.year || 0;
      const yearB = b.year || 0;
      return yearB - yearA;
    });
  }, [projects]);



  if (sortedProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more projects.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProjects.map((project, index) => (
        <div key={project.slug} className="w-full">
          <ProjectCard
            project={project}
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}