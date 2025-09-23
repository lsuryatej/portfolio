'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { RiseIn, StaggerChildren } from '@/lib/motion/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
}

interface SkillsProps {
  skills?: Skill[];
}

const defaultSkills: Skill[] = [
  // Frontend
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'Next.js', level: 90, category: 'Frontend' },
  { name: 'TypeScript', level: 88, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 92, category: 'Frontend' },
  { name: 'Framer Motion', level: 85, category: 'Frontend' },
  
  // Backend
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'Python', level: 75, category: 'Backend' },
  { name: 'PostgreSQL', level: 70, category: 'Backend' },
  
  // Tools & Others
  { name: 'Git', level: 90, category: 'Tools' },
  { name: 'Figma', level: 85, category: 'Design' },
  { name: 'Docker', level: 65, category: 'DevOps' },
  { name: 'AWS', level: 60, category: 'DevOps' }
];

interface SkillBarProps {
  skill: Skill;
  delay: number;
}

function SkillBar({ skill, delay }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        // Animate the number counting up
        const duration = 1200;
        const startTime = Date.now();
        const startLevel = 0;
        const endLevel = skill.level;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Use easing function for smooth animation
          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          const currentLevel = startLevel + (endLevel - startLevel) * easeOutCubic;
          
          setDisplayLevel(Math.round(currentLevel));
          setAnimatedLevel(currentLevel);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, delay * 100);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isInView, skill.level, delay]);

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{skill.name}</span>
        <motion.span 
          className="text-xs text-muted-foreground font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: delay * 0.1 + 0.5 }}
        >
          {displayLevel}%
        </motion.span>
      </div>
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: delay * 0.1 }}
        />
        
        {/* Main progress bar */}
        <motion.div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${animatedLevel}%` : 0 }}
          transition={{
            duration: 1.2,
            delay: delay * 0.1,
            ease: [0.23, 1, 0.320, 1]
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: isInView ? '200%' : '-100%' }}
            transition={{
              duration: 1.5,
              delay: delay * 0.1 + 0.3,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function Skills({ skills = defaultSkills }: SkillsProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category]!.push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(skillsByCategory).map(([category, categorySkills], categoryIndex) => (
        <RiseIn key={category} delay={categoryIndex * 0.1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorySkills.map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  skill={skill}
                  delay={categoryIndex * 2 + skillIndex}
                />
              ))}
            </CardContent>
          </Card>
        </RiseIn>
      ))}
    </StaggerChildren>
  );
}