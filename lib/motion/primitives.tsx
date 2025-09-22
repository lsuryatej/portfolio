'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { motionTokens } from './tokens';

// Base animation variants
const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0,
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: motionTokens.durations.normal / 1000,
      ease: motionTokens.easings.entrance,
    },
  },
};

const riseInVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: motionTokens.transforms.slideDistance,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.durations.slow / 1000,
      ease: motionTokens.easings.entrance,
    },
  },
};

const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: motionTokens.transforms.scaleStart,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionTokens.durations.slow / 1000,
      ease: motionTokens.easings.bounce,
    },
  },
};

const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.easings.entrance,
      },
    },
  },
  right: {
    hidden: { opacity: 0, x: motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.easings.entrance,
      },
    },
  },
  up: {
    hidden: { opacity: 0, y: motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.easings.entrance,
      },
    },
  },
  down: {
    hidden: { opacity: 0, y: -motionTokens.transforms.slideDistance },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: motionTokens.durations.slow / 1000,
        ease: motionTokens.easings.entrance,
      },
    },
  },
};

// Component interfaces
interface BaseMotionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

interface SlideInProps extends BaseMotionProps {
  direction?: 'left' | 'right' | 'up' | 'down';
}

// FadeIn Component
export const FadeIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    if (disabled) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...fadeInVariants,
      visible: {
        opacity: 1,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.entrance,
        },
      },
    } : fadeInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

FadeIn.displayName = 'FadeIn';

// RiseIn Component
export const RiseIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    if (disabled) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...riseInVariants,
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.entrance,
        },
      },
    } : riseInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

RiseIn.displayName = 'RiseIn';

// ScaleIn Component
export const ScaleIn = forwardRef<HTMLDivElement, BaseMotionProps>(
  ({ children, delay = 0, duration, className, disabled = false }, ref) => {
    if (disabled) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...scaleInVariants,
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: duration / 1000,
          ease: motionTokens.easings.bounce,
        },
      },
    } : scaleInVariants;

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

ScaleIn.displayName = 'ScaleIn';

// SlideIn Component
export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, direction = 'up', delay = 0, duration, className, disabled = false }, ref) => {
    if (disabled) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const variants = duration ? {
      ...slideInVariants[direction],
      visible: {
        ...slideInVariants[direction].visible,
        transition: {
          ...slideInVariants[direction].visible.transition,
          duration: duration / 1000,
        },
      },
    } : slideInVariants[direction];

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={variants}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  }
);

SlideIn.displayName = 'SlideIn';

// StaggerChildren Component
interface StaggerChildrenProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
  disabled?: boolean;
}

export const StaggerChildren = forwardRef<HTMLDivElement, StaggerChildrenProps>(
  ({ children, stagger = motionTokens.reveal.stagger, className, disabled = false }, ref) => {
    if (disabled) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: stagger,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerChildren.displayName = 'StaggerChildren';

// Magnetic Component for cursor attraction effects
interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  disabled?: boolean;
}

export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
  ({ children, strength = motionTokens.magnetic.strength, className, disabled = false }, ref) => {
    if (disabled) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={motionTokens.springs.gentle}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          e.currentTarget.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0px, 0px)';
        }}
      >
        {children}
      </motion.div>
    );
  }
);

Magnetic.displayName = 'Magnetic';