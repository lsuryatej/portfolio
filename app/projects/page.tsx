import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import ProjectsPageClient from './projects-page-client';

export const metadata: Metadata = generatePageMetadata({
  title: 'Projects',
  description: 'A collection of projects showcasing modern web development, user experience design, and technical innovation.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}