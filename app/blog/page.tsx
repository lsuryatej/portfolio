import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { Metadata } from 'next'
import { BlogGrid } from '@/components/blog/blog-grid'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on design, development, and the creative process.',
}

export default function BlogPage() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Thoughts on design, development, and the creative process.
          </p>
        </div>

        <BlogGrid posts={posts} />
      </div>
    </div>
  )
}