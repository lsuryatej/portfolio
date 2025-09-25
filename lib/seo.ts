import { Metadata } from 'next';
import { Project, Post } from 'contentlayer/generated';

const siteConfig = {
  name: 'Portfolio',
  description: 'A modern personal portfolio showcasing creative work and technical expertise',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com',
  ogImage: '/og/default.png',
  creator: '@portfolio',
};

// Generate dynamic OG image URL
function generateOGImageUrl({
  title,
  type,
  tags,
  subtitle,
}: {
  title: string;
  type: 'project' | 'blog' | 'page';
  tags?: string[];
  subtitle?: string;
}): string {
  const params = new URLSearchParams({
    title,
    type,
  });
  
  if (tags && tags.length > 0) {
    params.set('tags', tags.join(','));
  }
  
  if (subtitle) {
    params.set('subtitle', subtitle);
  }
  
  return `${siteConfig.url}/api/og?${params.toString()}`;
}

// Generate structured data for SEO
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Portfolio Owner',
    jobTitle: 'Creative Developer',
    url: siteConfig.url,
    sameAs: [
      // Add social media URLs here
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
  };
}

export function generateArticleStructuredData(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: generateOGImageUrl({
      title: post.title,
      type: 'blog',
      tags: post.tags,
      subtitle: post.excerpt,
    }),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Portfolio Owner',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
  };
}

export function generateCreativeWorkStructuredData(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    image: generateOGImageUrl({
      title: project.title,
      type: 'project',
      tags: project.tags,
      subtitle: project.summary,
    }),
    creator: {
      '@type': 'Person',
      name: 'Portfolio Owner',
      url: siteConfig.url,
    },
    dateCreated: project.year ? `${project.year}-01-01` : undefined,
    keywords: project.tags?.join(', '),
    url: `${siteConfig.url}/projects/${project.slug}`,
  };
}

export function generateProjectMetadata(project: Project): Metadata {
  const title = `${project.title} | ${siteConfig.name}`;
  const description = project.summary;
  const url = `${siteConfig.url}/projects/${project.slug}`;
  const ogImage = generateOGImageUrl({
    title: project.title,
    type: 'project',
    tags: project.tags,
    subtitle: project.summary,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'article',
      publishedTime: project.year ? `${project.year}-01-01` : undefined,
      tags: project.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generateBlogMetadata(post: Post): Metadata {
  const title = `${post.title} | ${siteConfig.name}`;
  const description = post.excerpt || siteConfig.description;
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const ogImage = generateOGImageUrl({
    title: post.title,
    type: 'blog',
    tags: post.tags,
    subtitle: post.excerpt,
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: post.canonicalUrl || url,
    },
  };
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const pageTitle = `${title} | ${siteConfig.name}`;
  const pageDescription = description || siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || generateOGImageUrl({
    title,
    type: 'page',
    subtitle: pageDescription,
  });

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [image],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: url,
    },
  };
}