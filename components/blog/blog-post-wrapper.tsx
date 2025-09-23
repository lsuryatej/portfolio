'use client';

import { ReactNode } from 'react';
import { ReadingProgress } from './reading-progress';

interface BlogPostWrapperProps {
  children: ReactNode;
}

export function BlogPostWrapper({ children }: BlogPostWrapperProps) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}