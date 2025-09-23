'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { FadeIn } from '@/lib/motion/primitives';
import { KeyboardNavigation, ScreenReader } from '@/lib/accessibility';

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
  const [, setFocusedTagIndex] = useState(-1);
  const tagRefs = useRef<HTMLButtonElement[]>([]);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const handleTagClick = (tag: string) => {
    const newFilters = activeFilters.includes(tag)
      ? activeFilters.filter((f) => f !== tag)
      : [...activeFilters, tag];
    
    onFilterChange(newFilters);
    
    // Announce filter change to screen readers
    const action = activeFilters.includes(tag) ? 'removed' : 'added';
    ScreenReader.announce(`Filter ${tag} ${action}. Showing ${projectCount} projects.`);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
    ScreenReader.announce(`All filters cleared. Showing all ${totalCount} projects.`);
  };

  // Handle keyboard navigation for filter tags
  const handleTagKeyDown = (e: React.KeyboardEvent, tagIndex: number) => {
    const visibleTagElements = tagRefs.current.slice(0, visibleTags.length).filter(Boolean);
    
    KeyboardNavigation.handleArrowKeys(
      e.nativeEvent,
      visibleTagElements,
      tagIndex,
      setFocusedTagIndex,
      { loop: true, horizontal: true }
    );

    KeyboardNavigation.handleHomeEnd(
      e.nativeEvent,
      visibleTagElements,
      setFocusedTagIndex
    );

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const tag = visibleTags[tagIndex];
      if (tag) {
        handleTagClick(tag);
      }
    }
  };

  const visibleTags = isExpanded ? tags : tags.slice(0, 8);
  const hasMoreTags = tags.length > 8;

  // Create live region for filter announcements
  useEffect(() => {
    ScreenReader.createLiveRegion('filter-announcements', 'polite');
  }, []);

  return (
    <FadeIn>
      <div 
        ref={filterContainerRef}
        className="space-y-4"
        role="region"
        aria-label="Project filters"
      >
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span aria-live="polite" aria-atomic="true">
                Showing {projectCount} of {totalCount} projects
              </span>
            </div>
            
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                aria-label={`Clear all ${activeFilters.length} active filters`}
              >
                Clear all
                <X className="ml-1 h-3 w-3" aria-hidden="true" />
              </Button>
            )}
          </div>

          {hasMoreTags && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              aria-expanded={isExpanded}
              aria-controls="filter-tags"
              aria-label={isExpanded ? 'Show fewer filter options' : `Show all ${tags.length} filter options`}
            >
              {isExpanded ? 'Show less' : `Show all (${tags.length})`}
            </Button>
          )}
        </div>

        {/* Filter Tags */}
        <motion.div 
          id="filter-tags"
          className="flex flex-wrap gap-2"
          layout
          role="group"
          aria-label="Filter by technology or category"
        >
          <AnimatePresence mode="popLayout">
            {visibleTags.map((tag, index) => {
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
                  <button
                    ref={(el) => {
                      if (el) tagRefs.current[index] = el;
                    }}
                    onClick={() => handleTagClick(tag)}
                    onKeyDown={(e) => handleTagKeyDown(e, index)}
                    className={`
                      inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                      cursor-pointer transition-all duration-200 hover:scale-105
                      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground'
                      }
                    `}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${tag}${isActive ? ' (active)' : ''}`}
                    type="button"
                  >
                    {tag}
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-1"
                        aria-hidden="true"
                      >
                        <X className="h-3 w-3" />
                      </motion.span>
                    )}
                  </button>
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