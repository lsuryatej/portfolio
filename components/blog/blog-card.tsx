import { Post } from 'contentlayer/generated'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Clock, Calendar } from 'lucide-react'

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={post.url} className="group block">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          {post.coverImage && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMM dd, yyyy')}
                </time>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>

            <h3 className="mb-2 text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="mb-4 text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>
      </Link>
  )
}