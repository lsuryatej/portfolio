'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSequenceProps {
  images: string[];
  alt: string;
  className?: string;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export function ScrollSequence({
  images,
  alt,
  className = '',
  trigger,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 1,
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageElements = useRef<HTMLImageElement[]>([]);

  // Preload all images
  useEffect(() => {
    if (images.length === 0) return;

    const loadImages = async () => {
      const imagePromises = images.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        imageElements.current = loadedImages;
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to load sequence images:', error);
      }
    };

    loadImages();
  }, [images]);

  // Setup scroll-triggered sequence
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show middle frame for reduced motion
      const middleFrame = Math.floor(images.length / 2);
      setCurrentFrame(middleFrame);
      return;
    }

    // Set canvas size to match first image
    const firstImage = imageElements.current[0];
    if (firstImage) {
      canvas.width = firstImage.naturalWidth;
      canvas.height = firstImage.naturalHeight;
    }

    // Render function
    const render = (frameIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(images.length - 1, Math.floor(frameIndex)));
      const image = imageElements.current[clampedIndex];
      
      if (image && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        setCurrentFrame(clampedIndex);
      }
    };

    // Initial render
    render(0);

    // Create GSAP timeline for scroll scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || containerRef.current,
        start,
        end,
        scrub,
        onUpdate: (self) => {
          const frameIndex = self.progress * (images.length - 1);
          render(frameIndex);
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, [imagesLoaded, images, trigger, start, end, scrub]);

  if (!imagesLoaded) {
    return (
      <div className={`relative bg-muted animate-pulse ${className}`}>
        <div className="aspect-video w-full flex items-center justify-center">
          <div className="text-muted-foreground">Loading sequence...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg"
        style={{ aspectRatio: 'auto' }}
      />
      
      {/* Progress indicator */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
        {currentFrame + 1} / {images.length}
      </div>
      
      {/* Accessibility: Hidden image for screen readers */}
      {images[currentFrame] && (
        <Image
          src={images[currentFrame]}
          alt={alt}
          width={100}
          height={100}
          className="sr-only"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

interface VideoScrollSequenceProps {
  videoSrc: string;
  poster?: string;
  className?: string;
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export function VideoScrollSequence({
  videoSrc,
  poster,
  className = '',
  trigger,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 1,
}: VideoScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Show poster or first frame for reduced motion
      video.currentTime = 0;
      return;
    }

    // Wait for video metadata to load
    const handleLoadedMetadata = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger || containerRef.current,
          start,
          end,
          scrub,
          onUpdate: (self) => {
            if (video.duration) {
              video.currentTime = self.progress * video.duration;
            }
          },
        },
      });

      return () => {
        tl.kill();
      };
    };

    if (video.readyState >= 1) {
      // Metadata already loaded
      return handleLoadedMetadata();
    } else {
      // Wait for metadata to load
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [trigger, start, end, scrub]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        className="w-full h-auto rounded-lg"
      />
      
      {/* Scroll instruction */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-70">
        Scroll to play
      </div>
    </div>
  );
}