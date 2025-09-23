import { Metadata } from 'next';
import { Project, Post } from 'contentlayer/generated';

const siteConfig = {
  name: 'Portfolio',
  description: 'A modern portfolio showcasing creative work and technical expertise',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com',
  ogImage: '/og/default.png',
  creator: '@portfolio',
};

export function generateProjectMetadata(project: Project): Metadata {
  const title = `${project.title} | ${siteConfig.name}`;
  const description = project.summary;
  const url = `${siteConfig.url}/projects/${project.slug}`;
  const ogImage = project.coverImage || siteConfig.ogImage;

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
  const ogImage = post.coverImage || siteConfig.ogImage;

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
  const image = ogImage || siteConfig.ogImage;

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