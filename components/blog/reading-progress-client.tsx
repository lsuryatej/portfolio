'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function ReadingProgressClient() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  
  // Only show on blog post pages
  const isBlogPost = pathname?.startsWith('/blog/') && pathname !== '/blog';

  useEffect(() => {
    if (!isBlogPost) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = 200;
      
      // Calculate progress
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalDocScrollLength = docHeight - winHeight;
      const scrollPostion = Math.floor(scrolled / totalDocScrollLength * 100);
      
      setProgress(Math.min(scrollPostion, 100));
      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBlogPost]);

  if (!isBlogPost || !isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary to-primary/60 origin-left transition-opacity duration-300"
      style={{ 
        transform: `scaleX(${progress / 100})`,
        opacity: isVisible ? 1 : 0 
      }}
    />
  );
}