'use client';

import { motion } from 'framer-motion';
import { RiseIn, StaggerChildren } from '@/lib/motion/primitives';
import { Card } from '@/components/ui/card';

interface PressItem {
  id: string;
  name: string;
  logo: string;
  url?: string;
  description?: string;
}

interface PressLogosProps {
  items?: PressItem[];
  title?: string;
}

// Default press/client logos - in a real implementation, these would be actual logos
const defaultPressItems: PressItem[] = [
  {
    id: '1',
    name: 'TechCrunch',
    logo: '/logos/techcrunch.svg',
    url: 'https://techcrunch.com',
    description: 'Featured in TechCrunch article'
  },
  {
    id: '2',
    name: 'Wired',
    logo: '/logos/wired.svg',
    url: 'https://wired.com',
    description: 'Project showcase in Wired'
  },
  {
    id: '3',
    name: 'The Verge',
    logo: '/logos/verge.svg',
    url: 'https://theverge.com',
    description: 'Interview with The Verge'
  },
  {
    id: '4',
    name: 'Dribbble',
    logo: '/logos/dribbble.svg',
    url: 'https://dribbble.com',
    description: 'Featured designer on Dribbble'
  },
  {
    id: '5',
    name: 'Awwwards',
    logo: '/logos/awwwards.svg',
    url: 'https://awwwards.com',
    description: 'Site of the Day winner'
  },
  {
    id: '6',
    name: 'CSS Design Awards',
    logo: '/logos/cssda.svg',
    url: 'https://cssdesignawards.com',
    description: 'CSS Design Awards recognition'
  }
];

interface LogoCardProps {
  item: PressItem;
}

function LogoCard({ item }: LogoCardProps) {
  const content = (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300">
      <motion.div
        className="p-6 flex items-center justify-center h-24"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo display - shows name as placeholder when logo is not available */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
            {item.name}
          </div>
        </div>
        
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
      </motion.div>
      
      {/* Tooltip on hover */}
      {item.description && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          {item.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </motion.div>
      )}
    </Card>
  );

  if (item.url) {
    return (
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {content}
      </motion.a>
    );
  }

  return content;
}

export function PressLogos({ items = defaultPressItems, title = "Featured In" }: PressLogosProps) {
  return (
    <div className="space-y-8">
      <RiseIn>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">
            Recognition and features from industry publications
          </p>
        </div>
      </RiseIn>
      
      <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item, index) => (
          <RiseIn key={item.id} delay={index * 0.1}>
            <LogoCard item={item} />
          </RiseIn>
        ))}
      </StaggerChildren>
    </div>
  );
}