'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

import { RiseIn, FadeIn } from '@/lib/motion/primitives';
import { cn } from '@/lib/utils';
// Import components directly to avoid circular dependencies
import { BeforeAfterSlider } from './before-after-slider';
import { ScrollSequence, VideoScrollSequence } from './scroll-sequence';

// Custom heading component with anchor links
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const HeadingComponent = ({ children, ...props }: { children: ReactNode; className?: string; id?: string }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : undefined;

    const className = cn(
      'scroll-mt-24', // Account for sticky header
      level === 1 && 'text-4xl font-bold mt-12 mb-6',
      level === 2 && 'text-3xl font-semibold mt-10 mb-5',
      level === 3 && 'text-2xl font-semibold mt-8 mb-4',
      level === 4 && 'text-xl font-semibold mt-6 mb-3',
      level === 5 && 'text-lg font-semibold mt-4 mb-2',
      level === 6 && 'text-base font-semibold mt-4 mb-2'
    );

    return (
      <RiseIn>
        {level === 1 && <h1 id={id} className={className} {...props}>{children}</h1>}
        {level === 2 && <h2 id={id} className={className} {...props}>{children}</h2>}
        {level === 3 && <h3 id={id} className={className} {...props}>{children}</h3>}
        {level === 4 && <h4 id={id} className={className} {...props}>{children}</h4>}
        {level === 5 && <h5 id={id} className={className} {...props}>{children}</h5>}
        {level === 6 && <h6 id={id} className={className} {...props}>{children}</h6>}
      </RiseIn>
    );
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

// Custom image component with enhanced styling
function CustomImage({ src, alt, ...props }: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <FadeIn>
      <div className="relative my-8 rounded-lg overflow-hidden bg-muted">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          {...props}
        />
      </div>
    </FadeIn>
  );
}

// Custom blockquote component
function CustomBlockquote({ children }: { children: ReactNode }) {
  return (
    <FadeIn>
      <Card className="my-6 p-6 border-l-4 border-primary bg-muted/50">
        <blockquote className="text-lg italic text-muted-foreground">
          {children}
        </blockquote>
      </Card>
    </FadeIn>
  );
}

// Custom code block component
function CustomPre({ children, ...props }: { children: ReactNode; className?: string }) {
  return (
    <FadeIn>
      <div className="my-6 rounded-lg overflow-hidden bg-muted border">
        <pre className="p-4 overflow-x-auto text-sm" {...props}>
          {children}
        </pre>
      </div>
    </FadeIn>
  );
}

// Custom paragraph component
function CustomParagraph({ children }: { children: ReactNode }) {
  return (
    <RiseIn>
      <p className="my-4 leading-7">
        {children}
      </p>
    </RiseIn>
  );
}

// Custom list components
function CustomUl({ children }: { children: ReactNode }) {
  return (
    <RiseIn>
      <ul className="my-4 ml-6 list-disc space-y-2">
        {children}
      </ul>
    </RiseIn>
  );
}

function CustomOl({ children }: { children: ReactNode }) {
  return (
    <RiseIn>
      <ol className="my-4 ml-6 list-decimal space-y-2">
        {children}
      </ol>
    </RiseIn>
  );
}

function CustomLi({ children }: { children: ReactNode }) {
  return (
    <li className="leading-7">
      {children}
    </li>
  );
}

// Custom table components
function CustomTable({ children }: { children: ReactNode }) {
  return (
    <FadeIn>
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse border border-border rounded-lg">
          {children}
        </table>
      </div>
    </FadeIn>
  );
}

function CustomTh({ children }: { children: ReactNode }) {
  return (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
      {children}
    </th>
  );
}

function CustomTd({ children }: { children: ReactNode }) {
  return (
    <td className="border border-border px-4 py-2">
      {children}
    </td>
  );
}

// Custom link component
function CustomLink({ href, children, ...props }: { href: string; children: ReactNode; className?: string; target?: string; rel?: string }) {
  const isExternal = href?.startsWith('http');
  
  return (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

// Custom strong component
function CustomStrong({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  );
}

// Custom emphasis component
function CustomEm({ children }: { children: ReactNode }) {
  return (
    <em className="italic text-muted-foreground">
      {children}
    </em>
  );
}

export const MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: CustomParagraph,
  img: CustomImage,
  Image: CustomImage,
  blockquote: CustomBlockquote,
  pre: CustomPre,
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi,
  table: CustomTable,
  th: CustomTh,
  td: CustomTd,
  a: CustomLink,
  strong: CustomStrong,
  em: CustomEm,
  // Advanced project components
  BeforeAfterSlider,
  ScrollSequence,
  VideoScrollSequence,
};