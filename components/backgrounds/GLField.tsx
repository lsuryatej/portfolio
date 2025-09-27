'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollCtx } from '@/components/motion/ScrollProvider';
import { isEnhanced } from '@/lib/config/motion';

gsap.registerPlugin(ScrollTrigger);

// Fragment shader with FBM noise
const fragmentShader = `
  uniform float u_time;
  uniform float u_scroll;
  uniform float u_velocity;
  uniform vec2 u_resolution;
  
  varying vec2 vUv;
  
  // Noise functions
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  // FBM (Fractal Brownian Motion)
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create flowing noise pattern
    vec3 pos = vec3(uv * 2.0, u_time * 0.1);
    pos.x += u_scroll * 0.001;
    pos.y += u_velocity * 0.01;
    
    float noise1 = fbm(pos);
    float noise2 = fbm(pos * 2.0 + vec3(100.0));
    
    // Create color gradient based on noise
    vec3 color1 = vec3(0.2, 0.4, 0.8); // Blue
    vec3 color2 = vec3(0.8, 0.2, 0.6); // Pink
    vec3 color3 = vec3(0.2, 0.8, 0.6); // Cyan
    
    vec3 finalColor = mix(color1, color2, noise1 * 0.5 + 0.5);
    finalColor = mix(finalColor, color3, noise2 * 0.3 + 0.3);
    
    // Add some movement based on velocity
    finalColor += vec3(abs(u_velocity) * 0.001);
    
    gl_FragColor = vec4(finalColor, 0.1);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface ShaderPlaneProps {
  scrollProgress: number;
  velocity: number;
}

function ShaderPlane({ scrollProgress, velocity }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_scroll: { value: 0 },
    u_velocity: { value: 0 },
    u_resolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
  }), [viewport]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.u_time.value = state.clock.elapsedTime;
      uniforms.u_scroll.value = scrollProgress;
      uniforms.u_velocity.value = velocity;
    }
  });

  return (
    <Plane ref={meshRef} args={[viewport.width, viewport.height]}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </Plane>
  );
}

interface GLFieldProps {
  className?: string;
  disabled?: boolean;
}

export default function GLField({ className = '', disabled = false }: GLFieldProps) {
  const scrollCtx = useScrollCtx();
  const scrollProgressRef = useRef(0);
  
  useEffect(() => {
    if (disabled || !isEnhanced()) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Track scroll progress
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });
  }, [disabled]);

  if (disabled || !isEnhanced()) return null;

  return (
    <div className={`fixed inset-0 -z-20 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Cap pixel ratio for performance
        style={{ background: 'transparent' }}
      >
        <ShaderPlane 
          scrollProgress={scrollProgressRef.current}
          velocity={scrollCtx?.velocity || 0}
        />
      </Canvas>
    </div>
  );
}