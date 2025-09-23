'use client';

import { Project } from 'contentlayer/generated';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FadeIn } from '@/lib/motion/primitives';
import {
  TableOfContents,
  ScrollProgress,
  MediaGallery,
  ProjectHeader,
  ProjectMeta,
  ProjectMDXContent
} from './index';

interface ProjectCaseStudyProps {
  project: Project;
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />

      {/* Back Navigation */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <TableOfContents chapters={project.chapters || []} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {/* Project Header */}
              <ProjectHeader project={project} />

              {/* Project Meta */}
              <ProjectMeta project={project} />

              {/* Media Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <FadeIn className="my-12">
                  <MediaGallery images={project.gallery} title={project.title} />
                </FadeIn>
              )}

              {/* MDX Content */}
              <div className="mt-12">
                <ProjectMDXContent project={project} />
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}