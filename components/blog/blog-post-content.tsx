import { Post } from 'contentlayer/generated'
import { format } from 'date-fns'
import { getMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react'

interface BlogPostContentProps {
  post: Post
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const MDXContent = getMDXComponent(post.body.code)

  return (
    <article className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back to blog link */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="group -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Post header */}
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM dd, yyyy')}
                </time>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {post.coverImage && (
              <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            )}

            {post.canonicalUrl && (
              <div className="mb-8 rounded-lg border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  This post was originally published on:
                </p>
                <a
                  href={post.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  {new URL(post.canonicalUrl).hostname}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </header>

          {/* Post content */}
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
            <MDXContent />
          </div>

          {/* Post footer */}
          <footer className="mt-16 pt-8">
            <Separator className="mb-8" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Published on {format(new Date(post.date), 'MMMM dd, yyyy')}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/blog">
                <Button variant="outline">
                  More Posts
                </Button>
              </Link>
            </div>
          </footer>
        </div>
      </article>
  )
}