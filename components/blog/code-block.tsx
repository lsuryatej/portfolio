'use client';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/lib/motion/primitives';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ children, language = 'text', filename }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        const html = await codeToHtml(children.trim(), {
          lang: language,
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          defaultColor: false,
        });
        setHighlightedCode(html);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        // Fallback to plain text
        setHighlightedCode(`<pre><code>${children}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [children, language]);

  if (isLoading) {
    return (
      <FadeIn>
        <div className="my-6 rounded-lg overflow-hidden bg-muted border">
          {filename && (
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b text-sm">
              <span className="font-medium">{filename}</span>
              <Badge variant="secondary" className="text-xs">
                {language}
              </Badge>
            </div>
          )}
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="my-6 rounded-lg overflow-hidden bg-muted border">
        {filename && (
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b text-sm">
            <span className="font-medium">{filename}</span>
            <Badge variant="secondary" className="text-xs">
              {language}
            </Badge>
          </div>
        )}
        <div 
          className="[&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:leading-relaxed [&>pre]:bg-transparent [&>pre]:border-0"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </FadeIn>
  );
}