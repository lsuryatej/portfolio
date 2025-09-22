import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn, RiseIn } from '@/lib/motion';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <FadeIn>
          <h1 className="mb-4 text-6xl font-bold">404</h1>
        </FadeIn>
        <RiseIn delay={0.2}>
          <h2 className="mb-6 text-2xl font-semibold">Page Not Found</h2>
        </RiseIn>
        <RiseIn delay={0.4}>
          <p className="mb-8 text-lg text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </RiseIn>
        <RiseIn delay={0.6}>
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>
        </RiseIn>
      </div>
    </div>
  );
}