import type { Metadata } from 'next';
import './globals.css';
import { fontSans, fontMono, fontDisplay } from '@/lib/typography';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/components/motion-provider';
import { Navigation, Footer } from '@/components/site';
import { ReadingProgressClient } from '@/components/blog/reading-progress-client';
import { ToastProvider } from '@/components/ui/toast';
import { SkipLinks } from '@/components/ui/skip-links';
import { BackToTop } from '@/components/projects/back-to-top';
import { generatePageMetadata, generatePersonStructuredData } from '@/lib/seo';
// import { PreloadScript } from '@/components/preload-script';
// import { PerformanceMonitor } from '@/components/performance-monitor';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com';

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Professional Web Developer',
    description: 'A portfolio focusing on modular architecture and exceptional user experience.',
    path: '',
  }),
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personStructuredData = generatePersonStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for better loading performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
        
        {/* Preload critical resources */}
        {/* <PreloadScript /> */}
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontDisplay.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <MotionProvider>
            <ToastProvider>
              <SkipLinks />
              <ReadingProgressClient />
              <BackToTop />
              {/* <PerformanceMonitor /> */}
              <div className="flex min-h-screen flex-col">
                <Navigation />
                <main id="main-content" className="flex-1" role="main">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
