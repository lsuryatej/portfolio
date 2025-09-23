'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/lib/motion/primitives';

interface Chapter {
  title: string;
  anchor: string;
}

interface TableOfContentsProps {
  chapters: Chapter[] | undefined;
}

export function TableOfContents({ chapters }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (!chapters || chapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0.1,
      }
    );

    // Observe all heading elements
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading);
      }
    });

    return () => {
      headings.forEach((heading) => {
        if (heading.id) {
          observer.unobserve(heading);
        }
      });
    };
  }, [chapters]);

  const scrollToSection = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!chapters || chapters.length === 0) {
    return null;
  }

  return (
    <FadeIn>
      <nav className="space-y-1" role="navigation" aria-label="Table of contents">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Table of Contents
        </h3>
        <ul className="space-y-2" role="list">
          {chapters.map((chapter, index) => (
            <li key={chapter.anchor}>
              <button
                onClick={() => scrollToSection(chapter.anchor)}
                className={cn(
                  'block w-full text-left text-sm py-2 px-3 rounded-md transition-all duration-200',
                  'hover:bg-muted hover:text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  activeSection === chapter.anchor
                    ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                    : 'text-muted-foreground border-l-2 border-transparent'
                )}
                aria-current={activeSection === chapter.anchor ? 'location' : undefined}
                aria-label={`Go to section: ${chapter.title}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs opacity-60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {chapter.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </FadeIn>
  );
}