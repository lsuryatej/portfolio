'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { motionTokens } from '@/lib/motion/tokens';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Motion values for smooth dragging
  const x = useMotionValue(0);
  const sliderPosition = useSpring(x, motionTokens.springs.gentle);
  
  // Initialize slider at 50% position
  useEffect(() => {
    if (containerWidth > 0) {
      x.set(containerWidth / 2);
    }
  }, [containerWidth, x]);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        // Reset to center if this is the first measurement
        if (x.get() === 0) {
          x.set(width / 2);
        }
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [x]);

  // Handle drag constraints and snapping
  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(containerWidth, info.point.x - rect.left));
      x.set(newX);
    },
    [containerWidth, x]
  );

  // Handle drag end with subtle snapping to center
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) => {
      const currentX = x.get();
      const centerX = containerWidth / 2;
      const snapThreshold = 50;
      
      // Snap to center if close enough
      if (Math.abs(currentX - centerX) < snapThreshold) {
        x.set(centerX);
      }
    },
    [containerWidth, x]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg bg-muted ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Before Image (Full Width) */}
      <div className="absolute inset-0">
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Before Label */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {beforeLabel}
        </div>
      </div>

      {/* After Image (Clipped) */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${sliderPosition}px)`,
        }}
      >
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* After Label */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {afterLabel}
        </div>
      </motion.div>

      {/* Drag Handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
        style={{
          left: sliderPosition,
          x: '-50%',
        }}
        drag="x"
        dragConstraints={{ left: 0, right: containerWidth }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.1 }}
        whileDrag={{ scale: 1.2 }}
      >
        {/* Handle Grip */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Vertical Line Extension */}
        <div className="absolute inset-x-0 top-0 bottom-0 bg-white/80" />
      </motion.div>

      {/* Touch/Click Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs opacity-70 pointer-events-none">
        Drag to compare
      </div>
    </div>
  );
}