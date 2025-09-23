import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import HomePageClient from './home-page-client';

export const metadata: Metadata = generatePageMetadata({
  title: 'Creative Developer',
  description: 'Crafting exceptional digital experiences through innovative design, cutting-edge technology, and meticulous attention to detail.',
  path: '',
});

export default function Page() {
  return <HomePageClient />;
}