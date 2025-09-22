import type { Metadata } from 'next';
import './globals.css';
import { fontSans, fontMono, fontDisplay } from '@/lib/typography';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/components/motion-provider';
import { Navigation, Footer } from '@/components/site';

export const metadata: Metadata = {
  title: 'Portfolio | Professional Web Developer',
  description: 'A production-ready portfolio showcasing world-class scroll animations, modular architecture, and exceptional user experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
