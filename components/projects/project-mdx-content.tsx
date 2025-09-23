'use client';

import { useMDXComponent } from 'next-contentlayer/hooks';
import { Project } from 'contentlayer/generated';
import { MDXComponents } from './mdx-components';
import { useEffect, useState } from 'react';

interface ProjectMDXContentProps {
  project: Project;
}

export function ProjectMDXContent({ project }: ProjectMDXContentProps) {
  const [isClient, setIsClient] = useState(false);
  const MDXContent = useMDXComponent(project.body.code);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </div>
    );
  }

  return <MDXContent components={MDXComponents} />;
}