'use client';

import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

import { RiseIn, FadeIn } from '@/lib/motion/primitives';
import { cn } from '@/lib/utils';
import { ExternalLink, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { CodeBlock } from './code-block';

// Custom heading component with anchor links
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const HeadingComponent = ({ children, ...props }: { children: ReactNode; className?: string; id?: string }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : undefined;

    const className = cn(
      'scroll-mt-24 group relative', // Account for sticky header and reading progress
      level === 1 && 'text-4xl font-bold mt-12 mb-6',
      level === 2 && 'text-3xl font-semibold mt-10 mb-5 border-b border-border pb-2',
      level === 3 && 'text-2xl font-semibold mt-8 mb-4',
      level === 4 && 'text-xl font-semibold mt-6 mb-3',
      level === 5 && 'text-lg font-semibold mt-4 mb-2',
      level === 6 && 'text-base font-semibold mt-4 mb-2'
    );

    const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;

    return (
      <RiseIn>
        <HeadingTag id={id} className={className} {...props}>
          {children}
          {id && (
            <a
              href={`#${id}`}
              className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
              aria-label={`Link to ${children}`}
            >
              #
            </a>
          )}
        </HeadingTag>
      </RiseIn>
    );
  };

  HeadingComponent.displayName = `BlogHeading${level}`;
  return HeadingComponent;
}

// Custom image component with enhanced styling
function CustomImage({ src, alt, ...props }: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <FadeIn>
      <figure className="my-8">
        <div className="relative overflow-hidden rounded-lg bg-muted">
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
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    </FadeIn>
  );
}

// Custom blockquote component with different variants
function CustomBlockquote({ children, className }: { children: ReactNode; className?: string }) {
  // Check if it's a special callout (starts with specific text)
  const content = typeof children === 'string' ? children : '';
  const isWarning = content.includes('⚠️') || content.includes('Warning:');
  const isSuccess = content.includes('✅') || content.includes('Success:');

  let icon = <Info className="h-5 w-5" />;
  let variant = 'border-primary bg-primary/5';

  if (isWarning) {
    icon = <AlertTriangle className="h-5 w-5" />;
    variant = 'border-yellow-500 bg-yellow-500/5';
  } else if (isSuccess) {
    icon = <CheckCircle className="h-5 w-5" />;
    variant = 'border-green-500 bg-green-500/5';
  }

  return (
    <FadeIn>
      <Card className={cn('my-6 p-6 border-l-4', variant, className)}>
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <blockquote className="text-lg leading-relaxed [&>p]:m-0">
            {children}
          </blockquote>
        </div>
      </Card>
    </FadeIn>
  );
}

// Enhanced code block component with Shiki syntax highlighting
function CustomPre({ children, ...props }: { children: ReactNode; className?: string; 'data-language'?: string }) {
  // Extract code content and language from children
  const codeElement = React.Children.toArray(children).find(
    (child): child is React.ReactElement => 
      React.isValidElement(child) && child.type === 'code'
  );
  
  if (codeElement && codeElement.props && typeof codeElement.props === 'object') {
    const codeProps = codeElement.props as { children?: string; className?: string };
    if (typeof codeProps.children === 'string') {
      const language = codeProps.className?.replace('language-', '') || 'text';
      return <CodeBlock language={language}>{codeProps.children}</CodeBlock>;
    }
  }
  
  // Fallback to regular pre
  return (
    <FadeIn>
      <div className="my-6 rounded-lg overflow-hidden bg-muted border">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed" {...props}>
          {children}
        </pre>
      </div>
    </FadeIn>
  );
}

// Custom inline code component
function CustomCode({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium',
      className
    )}>
      {children}
    </code>
  );
}

// Custom paragraph component
function CustomParagraph({ children }: { children: ReactNode }) {
  return (
    <RiseIn>
      <p className="my-6 leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    </RiseIn>
  );
}

// Custom list components
function CustomUl({ children }: { children: ReactNode }) {
  return (
    <RiseIn>
      <ul className="my-6 ml-6 list-disc space-y-2 [&>li]:mt-2">
        {children}
      </ul>
    </RiseIn>
  );
}

function CustomOl({ children }: { children: ReactNode }) {
  return (
    <RiseIn>
      <ol className="my-6 ml-6 list-decimal space-y-2 [&>li]:mt-2">
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
    <th className="border border-border bg-muted px-4 py-3 text-left font-semibold">
      {children}
    </th>
  );
}

function CustomTd({ children }: { children: ReactNode }) {
  return (
    <td className="border border-border px-4 py-3">
      {children}
    </td>
  );
}

// Custom link component
function CustomLink({ href, children, ...props }: { href: string; children: ReactNode; className?: string; target?: string; rel?: string }) {
  const isExternal = href?.startsWith('http');
  const isInternal = href?.startsWith('/');
  
  if (isInternal) {
    return (
      <Link
        href={href}
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {isExternal && <ExternalLink className="h-3 w-3" />}
    </a>
  );
}

// Custom horizontal rule
function CustomHr() {
  return (
    <FadeIn>
      <hr className="my-8 border-border" />
    </FadeIn>
  );
}

// Custom strong and emphasis components
function CustomStrong({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  );
}

function CustomEm({ children }: { children: ReactNode }) {
  return (
    <em className="italic">
      {children}
    </em>
  );
}

export const BlogMDXComponents = {
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
  code: CustomCode,
  ul: CustomUl,
  ol: CustomOl,
  li: CustomLi,
  table: CustomTable,
  th: CustomTh,
  td: CustomTd,
  a: CustomLink,
  hr: CustomHr,
  strong: CustomStrong,
  em: CustomEm,
};