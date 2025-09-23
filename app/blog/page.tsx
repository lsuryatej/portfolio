import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, PenTool } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - Coming Soon',
  description: 'Blog feature is currently under development and will be available soon.',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back to home */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="group -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Coming Soon Content */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <PenTool className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Blog Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              I&apos;m currently working on bringing you insightful articles about web development, 
              design, and technology. Stay tuned for updates!
            </p>
          </div>

          {/* Feature Preview */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                What to Expect
              </CardTitle>
              <CardDescription>
                The blog will feature content about:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li>• Modern web development techniques</li>
                <li>• React and Next.js best practices</li>
                <li>• UI/UX design insights</li>
                <li>• Performance optimization tips</li>
                <li>• Project case studies and lessons learned</li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="space-y-4">
            <p className="text-muted-foreground">
              In the meantime, feel free to explore my projects or get in touch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/projects">View Projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}