import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SimpleCodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export function SimpleCodeBlock({ children, language = 'text', filename }: SimpleCodeBlockProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden bg-muted border">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b text-sm">
          <span className="font-medium">{filename}</span>
          <Badge variant="secondary" className="text-xs">
            {language}
          </Badge>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-transparent border-0">
        <code className={`language-${language}`}>
          {children.trim()}
        </code>
      </pre>
    </div>
  );
}