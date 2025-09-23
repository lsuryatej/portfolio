'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { FadeIn } from '@/lib/motion/primitives';

interface ProjectFilterBarProps {
  tags: string[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  projectCount: number;
  totalCount: number;
}

export function ProjectFilterBar({
  tags,
  activeFilters,
  onFilterChange,
  projectCount,
  totalCount,
}: ProjectFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagClick = (tag: string) => {
    const newFilters = activeFilters.includes(tag)
      ? activeFilters.filter((f) => f !== tag)
      : [...activeFilters, tag];
    
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  const visibleTags = isExpanded ? tags : tags.slice(0, 8);
  const hasMoreTags = tags.length > 8;

  return (
    <FadeIn>
      <div className="space-y-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing {projectCount} of {totalCount} projects
              </span>
            </div>
            
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
                <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>

          {hasMoreTags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? 'Show less' : `Show all (${tags.length})`}
            </Button>
          )}
        </div>

        {/* Filter Tags */}
        <motion.div 
          className="flex flex-wrap gap-2"
          layout
        >
          <AnimatePresence mode="popLayout">
            {visibleTags.map((tag) => {
              const isActive = activeFilters.includes(tag);
              
              return (
                <motion.div
                  key={tag}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={`
                      cursor-pointer transition-all duration-200 hover:scale-105
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground'
                      }
                    `}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </motion.span>
                    )}
                  </Badge>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Active Filters Summary */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span>Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="outline"
                    className="h-5 px-1.5 text-xs"
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}