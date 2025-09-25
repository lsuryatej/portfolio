import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: `projects/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    coverImage: { type: 'string', required: true },
    image: { type: 'string' }, // For backward compatibility
    gallery: { type: 'list', of: { type: 'string' } },
    tags: { type: 'list', of: { type: 'string' } },
    technologies: { type: 'list', of: { type: 'string' } }, // Added missing field
    role: { type: 'string', required: true },
    tools: { type: 'list', of: { type: 'string' } },
    client: { type: 'string' },
    year: { type: 'number' },
    outcome: { type: 'string' },
    featured: { type: 'boolean', default: false },
    github: { type: 'string' }, // Added missing field
    demo: { type: 'string' }, // Added missing field
    chapters: {
      type: 'json',
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (project) => `/projects/${project.slug}`,
    },
  },
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string' },
    coverImage: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' } },
    canonicalUrl: { type: 'string' },
    readingTime: { type: 'number' },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post.slug}`,
    },
  },
}))

export const Testimonial = defineDocumentType(() => ({
  name: 'Testimonial',
  filePathPattern: `testimonials/**/*.md`,
  contentType: 'markdown',
  fields: {
    name: { type: 'string', required: true },
    title: { type: 'string' },
    company: { type: 'string' },
    quote: { type: 'string', required: true },
    avatar: { type: 'string' },
    featured: { type: 'boolean', default: false },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Project, Post, Testimonial],
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
  },
})