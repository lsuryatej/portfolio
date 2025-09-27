'use client';

import { useState, useMemo } from 'react';
import { allProjects } from 'contentlayer/generated';
import { ProjectGrid, ProjectFilterBar } from '@/components/projects';

export default function ProjectsPageClient() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allProjects.forEach((project) => {
      project.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  // Filter projects based on active filters
  const filteredProjects = useMemo(() => {
    if (activeFilters.length === 0) {
      return allProjects;
    }

    return allProjects.filter((project) =>
      activeFilters.every((filter) =>
        project.tags?.some((tag) => tag.toLowerCase() === filter.toLowerCase())
      )
    );
  }, [activeFilters]);



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto hero-text">
              A curated collection of projects showcasing modern web development, 
              user experience design, and technical innovation.
            </p>
          </div>



          {/* Filter Bar */}
          <div className="mb-8">
            <ProjectFilterBar
              tags={allTags}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              projectCount={filteredProjects.length}
              totalCount={allProjects.length}
            />
          </div>

          {/* Projects Grid */}
          <ProjectGrid
            projects={filteredProjects}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    </div>
  );
}