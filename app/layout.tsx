import type { Metadata } from 'next';
import './globals.css';
import { fontSans, fontMono, fontDisplay } from '@/lib/typography';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/components/motion-provider';
import { Navigation, Footer } from '@/components/site';
import { ReadingProgressClient } from '@/components/blog/reading-progress-client';
import { ToastProvider } from '@/components/ui/toast';
import { SkipLinks } from '@/components/ui/skip-links';
import { generatePageMetadata, generatePersonStructuredData } from '@/lib/seo';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.example.com';

export const metadata: Metadata = {
  ...generatePageMetadata({
    title: 'Professional Web Developer',
    description: 'A production-ready portfolio showcasing world-class scroll animations, modular architecture, and exceptional user experience.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
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
