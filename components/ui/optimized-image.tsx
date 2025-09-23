import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component
 * 
 * Wrapper around Next.js Image with performance optimizations:
 * - Automatic format selection (AVIF, WebP, JPEG) via Next.js config
 * - Responsive sizing with proper aspect ratios
 * - Loading states and error handling
 * - Blur placeholder support
 * - Modern formats: AVIF, WebP fallback to JPEG
 * - Configured in next.config.ts: formats: ['image/avif', 'image/webp']
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    if (blurDataURL) return blurDataURL;
    
    // Simple SVG blur placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(229,231,235);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(243,244,246);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  };

  // Default responsive sizes for common use cases
  const defaultSizes = sizes || (
    fill 
      ? '100vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  );

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={width && height ? generateBlurDataURL(width, height) : undefined}
        sizes={defaultSizes}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill ? 'object-cover' : ''
        )}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={cn(
            'absolute inset-0 animate-pulse bg-muted',
            fill ? 'h-full w-full' : ''
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}
    </div>
  );
}

/**
 * Optimized Avatar Component
 */
interface OptimizedAvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className,
  priority = false,
}: OptimizedAvatarProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      priority={priority}
      quality={90}
      placeholder="blur"
      sizes={`${size}px`}
    />
  );
}

/**
 * Optimized Hero Image Component
 */
interface OptimizedHeroImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedHeroImage({
  src,
  alt,
  className,
  priority = true,
}: OptimizedHeroImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      quality={95}
      placeholder="blur"
      sizes="100vw"
    />
  );
}