'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isEnhanced } from '@/lib/config/motion';

gsap.registerPlugin(ScrollTrigger);

interface CanvasSequenceProps {
  frameUrl: (index: number) => string;
  frameCount: number;
  width: number;
  height: number;
  preload?: number; // Percentage of frames to preload (0-1)
  className?: string;
  disabled?: boolean;
  fallbackVideo?: string; // Fallback video URL for Safari iOS
}

export default function CanvasSequence({
  frameUrl,
  frameCount,
  width,
  height,
  preload = 0.2,
  className = '',
  disabled = false,
  fallbackVideo
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // Detect if we should use video fallback (Safari iOS with memory constraints)
  const shouldUseFallback = useCallback(() => {
    if (!fallbackVideo) return false;
    
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isLowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
    
    return isSafari && isIOS && (isLowMemory || frameCount > 100);
  }, [fallbackVideo, frameCount]);

  // Preload images off the main thread
  const preloadImages = useCallback(async () => {
    const preloadCount = Math.ceil(frameCount * preload);
    const images: HTMLImageElement[] = [];
    
    const loadPromises = Array.from({ length: preloadCount }, async (_, i) => {
      const img = new Image();
      img.src = frameUrl(i);
      
      // Use Image.decode() for better performance
      try {
        await img.decode();
      } catch (error) {
        console.warn(`Failed to decode frame ${i}:`, error);
      }
      
      images[i] = img;
      return img;
    });

    await Promise.allSettled(loadPromises);
    imagesRef.current = images;
    setIsLoaded(true);
  }, [frameUrl, frameCount, preload]);

  // Load remaining images lazily
  const loadRemainingImages = useCallback(async () => {
    const preloadCount = Math.ceil(frameCount * preload);
    const remainingPromises = Array.from({ length: frameCount - preloadCount }, async (_, i) => {
      const index = preloadCount + i;
      const img = new Image();
      img.src = frameUrl(index);
      
      try {
        await img.decode();
      } catch (error) {
        console.warn(`Failed to decode frame ${index}:`, error);
      }
      
      imagesRef.current[index] = img;
      return img;
    });

    await Promise.allSettled(remainingPromises);
  }, [frameUrl, frameCount, preload]);

  // Draw frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[frameIndex];
    
    if (!canvas || !ctx || !img) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
  }, [width, height]);

  // Update video current time for fallback
  const updateVideoFrame = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const targetTime = progress * video.duration;
    if (Math.abs(video.currentTime - targetTime) > 0.1) {
      video.currentTime = targetTime;
    }
  }, []);

  useEffect(() => {
    if (disabled || !isEnhanced()) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Determine if we should use fallback
    if (shouldUseFallback()) {
      setUseFallback(true);
      return;
    }

    // Start preloading images
    preloadImages();

    // Load remaining images after initial load
    const loadTimer = setTimeout(() => {
      loadRemainingImages();
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, [disabled, shouldUseFallback, preloadImages, loadRemainingImages]);

  useEffect(() => {
    if (disabled || !containerRef.current) return;

    let scrollTrigger: ScrollTrigger;

    if (useFallback && videoRef.current) {
      // Video fallback scroll trigger
      scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          updateVideoFrame(self.progress);
        }
      });
    } else if (isLoaded && canvasRef.current) {
      // Canvas sequence scroll trigger
      scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const frameIndex = Math.round(self.progress * (frameCount - 1));
          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }
        }
      });
    }

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [disabled, useFallback, isLoaded, frameCount, drawFrame, updateVideoFrame]);

  // Draw initial frame when loaded
  useEffect(() => {
    if (isLoaded && !useFallback) {
      drawFrame(0);
    }
  }, [isLoaded, useFallback, drawFrame]);

  if (disabled || !isEnhanced()) {
    return null;
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {useFallback && fallbackVideo ? (
        <video
          ref={videoRef}
          width={width}
          height={height}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source src={fallbackVideo} type="video/mp4" />
        </video>
      ) : (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && !useFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}