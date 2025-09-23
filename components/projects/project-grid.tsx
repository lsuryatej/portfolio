'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from './project-card';
import { StaggerChildren } from '@/lib/motion/primitives';
import type { Project } from 'contentlayer/generated';

interface ProjectGridProps {
  projects: Project[];
  activeFilters: string[];
}

export function ProjectGrid({ projects, activeFilters }: ProjectGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter projects based on active filters
  const filteredProjects = useMemo(() => {
    if (activeFilters.length === 0) {
      return projects;
    }

    return projects.filter((project) =>
      activeFilters.every((filter) =>
        project.tags?.some((tag) => tag.toLowerCase() === filter.toLowerCase())
      )
    );
  }, [projects, activeFilters]);

  // Sort projects: featured first, then by year (newest first)
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by year (newest first)
      const yearA = a.year || 0;
      const yearB = b.year || 0;
      return yearB - yearA;
    });
  }, [filteredProjects]);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] bg-muted animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeFilters.join('-')}-${sortedProjects.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StaggerChildren stagger={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
              <AnimatePresence mode="popLayout">
                {sortedProjects.map((project, index) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      layout: { duration: 0.3 }
                    }}
                    className="w-full"
                  >
                    <ProjectCard
                      project={project}
                      priority={index < 3}
                      index={index}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </StaggerChildren>
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {sortedProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}