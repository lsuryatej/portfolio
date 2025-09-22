import { z } from 'zod'

// Zod schemas for content validation
export const ProjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  coverImage: z.string(),
  gallery: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  role: z.string(),
  tools: z.array(z.string()).optional(),
  client: z.string().optional(),
  year: z.number().optional(),
  outcome: z.string().optional(),
  featured: z.boolean().default(false),
  chapters: z.array(z.object({
    title: z.string(),
    anchor: z.string(),
  })).optional(),
  url: z.string(),
  body: z.object({
    code: z.string(),
  }),
  _id: z.string(),
  _raw: z.object({
    sourceFilePath: z.string(),
    sourceFileName: z.string(),
    sourceFileDir: z.string(),
    contentType: z.string(),
    flattenedPath: z.string(),
  }),
  type: z.literal('Project'),
})

export const PostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  date: z.string().transform((str) => new Date(str)),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  readingTime: z.number().optional(),
  url: z.string(),
  body: z.object({
    code: z.string(),
  }),
  _id: z.string(),
  _raw: z.object({
    sourceFilePath: z.string(),
    sourceFileName: z.string(),
    sourceFileDir: z.string(),
    contentType: z.string(),
    flattenedPath: z.string(),
  }),
  type: z.literal('Post'),
})

export const TestimonialSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  company: z.string().optional(),
  quote: z.string(),
  avatar: z.string().optional(),
  featured: z.boolean().default(false),
  body: z.object({
    raw: z.string(),
    html: z.string(),
  }),
  _id: z.string(),
  _raw: z.object({
    sourceFilePath: z.string(),
    sourceFileName: z.string(),
    sourceFileDir: z.string(),
    contentType: z.string(),
    flattenedPath: z.string(),
  }),
  type: z.literal('Testimonial'),
})

// Type exports
export type Project = z.infer<typeof ProjectSchema>
export type Post = z.infer<typeof PostSchema>
export type Testimonial = z.infer<typeof TestimonialSchema>

// Validation functions
export const validateProject = (data: unknown): Project => {
  return ProjectSchema.parse(data)
}

export const validatePost = (data: unknown): Post => {
  return PostSchema.parse(data)
}

export const validateTestimonial = (data: unknown): Testimonial => {
  return TestimonialSchema.parse(data)
}

// Content utilities
export const getAllProjects = async (): Promise<Project[]> => {
  const { allProjects } = await import('contentlayer/generated')
  return allProjects.map(validateProject)
}

export const getAllPosts = async (): Promise<Post[]> => {
  const { allPosts } = await import('contentlayer/generated')
  return allPosts
    .map(validatePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const { allTestimonials } = await import('contentlayer/generated')
  return allTestimonials.map(validateTestimonial)
}

export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const projects = await getAllProjects()
  return projects.find((project) => project.slug === slug)
}

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug)
}

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const projects = await getAllProjects()
  return projects.filter((project) => project.featured)
}

export const getFeaturedTestimonials = async (): Promise<Testimonial[]> => {
  const testimonials = await getAllTestimonials()
  return testimonials.filter((testimonial) => testimonial.featured)
}

export const getProjectsByTag = async (tag: string): Promise<Project[]> => {
  const projects = await getAllProjects()
  return projects.filter((project) => project.tags?.includes(tag))
}

export const getPostsByTag = async (tag: string): Promise<Post[]> => {
  const posts = await getAllPosts()
  return posts.filter((post) => post.tags?.includes(tag))
}

export const getAllTags = async (): Promise<string[]> => {
  const projects = await getAllProjects()
  const posts = await getAllPosts()
  
  const projectTags = projects.flatMap((project) => project.tags || [])
  const postTags = posts.flatMap((post) => post.tags || [])
  
  return Array.from(new Set([...projectTags, ...postTags]))
}