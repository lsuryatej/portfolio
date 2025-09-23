import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google'

// Sans-serif font for body text - preload critical weights
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// Monospace font for code - only load when needed
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
  preload: false, // Only load when code blocks are present
  fallback: ['ui-monospace', 'monospace'],
})

// Display font for headings - preload for hero section
export const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700'],
  preload: true,
  fallback: ['serif'],
})

// Typography scale configuration
export const typographyScale = {
  display: {
    '4xl': {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    },
    '3xl': {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    '2xl': {
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      lineHeight: '1.2',
      letterSpacing: '-0.01em',
    },
    xl: {
      fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
    },
    lg: {
      fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
      lineHeight: '1.4',
      letterSpacing: '0',
    },
  },
  body: {
    xl: {
      fontSize: '1.25rem',
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    lg: {
      fontSize: '1.125rem',
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    base: {
      fontSize: '1rem',
      lineHeight: '1.6',
      letterSpacing: '0',
    },
    sm: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    xs: {
      fontSize: '0.75rem',
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
  },
} as const

// Typography utility classes
export const typographyClasses = {
  display: {
    '4xl': 'text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] font-display',
    '3xl': 'text-[clamp(2rem,4vw,3rem)] leading-[1.2] tracking-[-0.02em] font-display',
    '2xl': 'text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.2] tracking-[-0.01em] font-display',
    xl: 'text-[clamp(1.5rem,2.5vw,1.875rem)] leading-[1.3] tracking-[-0.01em] font-display',
    lg: 'text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.4] font-display',
  },
  body: {
    xl: 'text-xl leading-relaxed font-sans',
    lg: 'text-lg leading-relaxed font-sans',
    base: 'text-base leading-relaxed font-sans',
    sm: 'text-sm leading-normal font-sans',
    xs: 'text-xs leading-tight tracking-wide font-sans',
  },
  code: {
    base: 'font-mono text-sm',
    inline: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded-md',
  },
} as const