'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  text: string;
}

const skipLinks: SkipLink[] = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#footer', text: 'Skip to footer' },
];

export function SkipLinks() {
  return (
    <div className="skip-links">
      {skipLinks.map(({ href, text }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'skip-link',
            'absolute left-4 top-4 z-[9999]',
            'bg-primary text-primary-foreground',
            'px-4 py-2 rounded-md font-medium text-sm',
            'transform -translate-y-full opacity-0',
            'focus:translate-y-0 focus:opacity-100',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          {text}
        </Link>
      ))}
    </div>
  );
}