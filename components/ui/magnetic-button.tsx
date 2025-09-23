"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  strength?: number
  className?: string
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, strength = 0.4, className, variant = "primary", size = "md", ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    const springConfig = { damping: 25, stiffness: 700 }
    const springX = useSpring(x, springConfig)
    const springY = useSpring(y, springConfig)
    
    const rotateX = useTransform(springY, [-50, 50], [10, -10])
    const rotateY = useTransform(springX, [-50, 50], [-10, 10])
    
    const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
      if (!buttonRef.current) return
      
      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
      x.set(deltaX)
      y.set(deltaY)
    }, [strength, x, y])

    const handleMouseLeave = React.useCallback(() => {
      x.set(0)
      y.set(0)
    }, [x, y])

    React.useImperativeHandle(ref, () => buttonRef.current!, [])

    const variants = {
      primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }

    return (
      <motion.div
        style={{
          x: springX,
          y: springY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
      >
        <button
          ref={buttonRef}
          className={cn(
            "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden w-full h-full",
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
          animate={{
            translateX: ["100%", "-100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "linear"
          }}
        />
        
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 bg-primary/10 rounded-lg opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
          <span className="relative z-10">{children}</span>
        </button>
      </motion.div>
    )
  }
)

MagneticButton.displayName = "MagneticButton"