import { notFound } from 'next/navigation';
import { allProjects } from 'contentlayer/generated';
import { ProjectCaseStudy } from '@/components/projects/project-case-study';
import { generateProjectMetadata } from '@/lib/seo';
import { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return allProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return generateProjectMetadata(project);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectCaseStudy project={project} />;
}