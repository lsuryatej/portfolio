'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiseIn } from '@/lib/motion/primitives';
import type { Project } from 'contentlayer/generated';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
  index?: number;
}

export function ProjectCard({ project, priority = false, index = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced mouse move handler for premium tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation with more sophisticated easing
    const rotateX = (y - centerY) / 8;
    const rotateY = (centerX - x) / 8;
    
    // Add subtle scale and glow effects
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const intensity = 1 - (distance / maxDistance);
    
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(${20 + intensity * 10}px)
      scale(${1 + intensity * 0.02})
    `;
    
    // Add dynamic shadow based on tilt
    const shadowX = rotateY * 0.5;
    const shadowY = rotateX * 0.5;
    cardRef.current.style.boxShadow = `
      ${shadowX}px ${shadowY + 10}px ${30 + intensity * 20}px rgba(0, 0, 0, 0.1),
      ${shadowX * 0.5}px ${shadowY * 0.5 + 5}px ${15 + intensity * 10}px rgba(0, 0, 0, 0.05)
    `;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.320, 1)';
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
    cardRef.current.style.boxShadow = '';
    
    setTimeout(() => setIsHovered(false), 100);
  };

  return (
    <RiseIn delay={index * 0.1}>
      <Link 
        href={project.url} 
        className="block group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
        aria-label={`View ${project.title} project details`}
      >
        <Card
          ref={cardRef}
          className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm cursor-pointer group-hover:shadow-2xl group-hover:shadow-primary/10"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ 
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <OptimizedImage
              src={project.coverImage}
              alt={`Cover image for ${project.title} project`}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.warn(`Image not found: ${project.coverImage}`);
                setImageLoaded(true);
              }}
            />

            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-4 left-4">
                <Badge 
                  variant="default" 
                  className="bg-primary/90 backdrop-blur-sm"
                  aria-label="Featured project"
                >
                  Featured
                </Badge>
              </div>
            )}

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.year && (
                <span className="text-sm text-muted-foreground font-medium shrink-0">
                  {project.year}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 text-pretty">
              {project.summary}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3" role="list" aria-label="Project technologies">
              {project.tags?.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  role="listitem"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags && project.tags.length > 4 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-secondary/50"
                  role="listitem"
                  aria-label={`${project.tags.length - 4} more technologies`}
                >
                  +{project.tags.length - 4}
                </Badge>
              )}
            </div>

            {/* Role */}
            {project.role && (
              <p className="text-xs text-muted-foreground font-medium">
                {project.role}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </RiseIn>
  );
}