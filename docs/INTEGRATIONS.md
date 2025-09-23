# Integration Guides

This document provides step-by-step guides for integrating various services with your portfolio website.

## 📧 Contact Form Integration

### Resend (Recommended)

Resend provides a simple, developer-friendly email API with excellent deliverability.

1. **Sign up for Resend**
   - Visit [resend.com](https://resend.com)
   - Create an account and verify your email

2. **Add your domain**
   - Go to Domains in your Resend dashboard
   - Add your domain and verify DNS records
   - Or use the default `onboarding@resend.dev` for testing

3. **Get your API key**
   - Go to API Keys in your dashboard
   - Create a new API key with "Sending access"
   - Copy the key (starts with `re_`)

4. **Configure environment variables**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@domain.com
   ```

5. **Test the integration**
   - Visit `/contact` on your site
   - Submit a test message
   - Check your email and Resend dashboard

### Alternative: Nodemailer with Gmail

If you prefer using Gmail SMTP:

1. **Enable 2-factor authentication** on your Gmail account

2. **Generate an app password**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"

3. **Configure environment variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=your-email@gmail.com
   ```

4. **Update the contact API route** to use Nodemailer instead of Resend

## 📊 Analytics Integration

### Plausible Analytics (Recommended)

Privacy-focused analytics that doesn't require cookie consent.

1. **Sign up for Plausible**
   - Visit [plausible.io](https://plausible.io)
   - Create an account and add your domain

2. **Configure environment variables**
   ```env
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
   ```

3. **The script is automatically included** in the layout when the environment variable is set

4. **Verify tracking**
   - Visit your site and navigate between pages
   - Check your Plausible dashboard for real-time data

### Google Analytics 4

If you prefer Google Analytics:

1. **Create a GA4 property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create a new property and get your Measurement ID

2. **Configure environment variables**
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Add the tracking script** to your layout:
   ```tsx
   // app/layout.tsx
   import Script from 'next/script'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <head>
           {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
             <>
               <Script
                 src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                 strategy="afterInteractive"
               />
               <Script id="google-analytics" strategy="afterInteractive">
                 {`
                   window.dataLayer = window.dataLayer || [];
                   function gtag(){dataLayer.push(arguments);}
                   gtag('js', new Date());
                   gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                 `}
               </Script>
             </>
           )}
         </head>
         <body>{children}</body>
       </html>
     )
   }
   ```

## 🔍 SEO Integration

### Google Search Console

1. **Add your property**
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Add your domain as a property

2. **Verify ownership**
   - Choose "HTML tag" verification method
   - Copy the verification code
   - Add to your environment variables:
     ```env
     GOOGLE_SITE_VERIFICATION=your-verification-code
     ```

3. **Submit your sitemap**
   - Your sitemap is automatically generated at `/sitemap.xml`
   - Submit this URL in Search Console

### Bing Webmaster Tools

1. **Add your site**
   - Go to [webmaster.bing.com](https://www.bing.com/webmasters)
   - Add your site URL

2. **Verify ownership**
   - Use the meta tag method
   - Add the verification code to your environment:
     ```env
     BING_SITE_VERIFICATION=your-verification-code
     ```

3. **Add the meta tag** to your SEO component:
   ```tsx
   // components/seo/seo-head.tsx
   {process.env.BING_SITE_VERIFICATION && (
     <meta name="msvalidate.01" content={process.env.BING_SITE_VERIFICATION} />
   )}
   ```

## 📅 Calendar Integration

### Calendly

1. **Set up your Calendly account**
   - Go to [calendly.com](https://calendly.com)
   - Create your scheduling page

2. **Get your username**
   - Your Calendly URL will be `calendly.com/yourusername`
   - Copy the username part

3. **Configure environment variables**
   ```env
   NEXT_PUBLIC_CALENDLY_USERNAME=yourusername
   ```

4. **Add Calendly widget** to your contact page:
   ```tsx
   // components/contact/calendly-widget.tsx
   import { useEffect } from 'react'
   
   export function CalendlyWidget() {
     useEffect(() => {
       const script = document.createElement('script')
       script.src = 'https://assets.calendly.com/assets/external/widget.js'
       script.async = true
       document.body.appendChild(script)
       
       return () => {
         document.body.removeChild(script)
       }
     }, [])
   
     return (
       <div
         className="calendly-inline-widget"
         data-url={`https://calendly.com/${process.env.NEXT_PUBLIC_CALENDLY_USERNAME}`}
         style={{ minWidth: '320px', height: '630px' }}
       />
     )
   }
   ```

## 🎵 Music Integration

### Spotify "Now Playing"

1. **Create a Spotify app**
   - Go to [developer.spotify.com](https://developer.spotify.com)
   - Create a new app in your dashboard

2. **Get your credentials**
   - Copy your Client ID and Client Secret
   - Add `http://localhost:3000/api/auth/callback/spotify` to redirect URIs

3. **Get a refresh token**
   - Use the Spotify Web API to authenticate and get a refresh token
   - Or use a tool like [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)

4. **Configure environment variables**
   ```env
   SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxx
   SPOTIFY_REFRESH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. **Create API route** for current track:
   ```tsx
   // app/api/spotify/now-playing/route.ts
   import { NextResponse } from 'next/server'
   
   const client_id = process.env.SPOTIFY_CLIENT_ID
   const client_secret = process.env.SPOTIFY_CLIENT_SECRET
   const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN
   
   const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
   const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
   const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
   
   export async function GET() {
     // Implementation for getting current track
     // See Spotify Web API documentation
   }
   ```

## 🖼️ Image Integration

### Unsplash

For dynamic background images or photo galleries:

1. **Create an Unsplash developer account**
   - Go to [unsplash.com/developers](https://unsplash.com/developers)
   - Create a new application

2. **Get your access key**
   - Copy your Access Key from the app dashboard

3. **Configure environment variables**
   ```env
   UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Create API route** for fetching images:
   ```tsx
   // app/api/images/route.ts
   import { NextResponse } from 'next/server'
   
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const query = searchParams.get('query') || 'landscape'
     
     const response = await fetch(
       `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
     )
     
     const data = await response.json()
     return NextResponse.json(data)
   }
   ```

## 💬 Comments Integration

### Giscus (GitHub Discussions)

1. **Enable GitHub Discussions** on your repository

2. **Install the Giscus app**
   - Go to [giscus.app](https://giscus.app)
   - Configure your settings and get the script

3. **Add Giscus component** to your blog posts:
   ```tsx
   // components/blog/giscus-comments.tsx
   import { useEffect, useRef } from 'react'
   import { useTheme } from 'next-themes'
   
   export function GiscusComments() {
     const ref = useRef<HTMLDivElement>(null)
     const { theme } = useTheme()
   
     useEffect(() => {
       const script = document.createElement('script')
       script.src = 'https://giscus.app/client.js'
       script.setAttribute('data-repo', 'your-username/your-repo')
       script.setAttribute('data-repo-id', 'your-repo-id')
       script.setAttribute('data-category', 'General')
       script.setAttribute('data-category-id', 'your-category-id')
       script.setAttribute('data-mapping', 'pathname')
       script.setAttribute('data-strict', '0')
       script.setAttribute('data-reactions-enabled', '1')
       script.setAttribute('data-emit-metadata', '0')
       script.setAttribute('data-input-position', 'bottom')
       script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
       script.setAttribute('data-lang', 'en')
       script.crossOrigin = 'anonymous'
       script.async = true
   
       ref.current?.appendChild(script)
   
       return () => {
         ref.current?.innerHTML = ''
       }
     }, [theme])
   
     return <div ref={ref} />
   }
   ```

## 🚀 Deployment Integration

### Vercel (Recommended)

1. **Connect your repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables**
   - Add all your production environment variables in the Vercel dashboard
   - Use different values for preview and production environments

3. **Set up custom domain**
   - Add your custom domain in the Vercel dashboard
   - Update your DNS records as instructed

4. **Configure build settings**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   ```

### Netlify

1. **Connect your repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add environment variables**
   - Go to Site settings > Environment variables
   - Add all your production environment variables

4. **Set up redirects**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

## 🔒 Security Integration

### Content Security Policy

1. **Configure CSP headers** in your Next.js config:
   ```js
   // next.config.js
   const securityHeaders = [
     {
       key: 'Content-Security-Policy',
       value: `
         default-src 'self';
         script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
         style-src 'self' 'unsafe-inline';
         img-src 'self' blob: data: *.vercel.com;
         font-src 'self';
         object-src 'none';
         base-uri 'self';
         form-action 'self';
         frame-ancestors 'none';
         upgrade-insecure-requests;
       `.replace(/\s{2,}/g, ' ').trim()
     }
   ]
   
   module.exports = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: securityHeaders,
         },
       ]
     },
   }
   ```

### Rate Limiting

The contact form includes built-in rate limiting. Configure the limits:

```env
# Maximum requests per hour per IP address
CONTACT_RATE_LIMIT=5

# Rate limiting window in milliseconds (1 hour = 3600000)
RATE_LIMIT_WINDOW=3600000
```

## 🧪 Testing Integration

### Lighthouse CI

1. **Install Lighthouse CI**
   ```bash
   npm install -g @lhci/cli
   ```

2. **Configure Lighthouse CI**
   ```json
   // lighthouserc.json
   {
     "ci": {
       "collect": {
         "url": ["http://localhost:3000"],
         "startServerCommand": "npm run start",
         "numberOfRuns": 3
       },
       "assert": {
         "assertions": {
           "categories:performance": ["warn", {"minScore": 0.9}],
           "categories:accessibility": ["error", {"minScore": 0.9}],
           "categories:best-practices": ["warn", {"minScore": 0.9}],
           "categories:seo": ["error", {"minScore": 0.9}]
         }
       }
     }
   }
   ```

3. **Add to your CI/CD pipeline**
   ```yml
   # .github/workflows/lighthouse.yml
   name: Lighthouse CI
   on: [push]
   jobs:
     lighthouse:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm install && npm run build
         - run: lhci autorun
   ```

## 📱 PWA Integration

### Service Worker

1. **Install next-pwa**
   ```bash
   npm install next-pwa
   ```

2. **Configure next-pwa**
   ```js
   // next.config.js
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
   })
   
   module.exports = withPWA({
     // Your existing Next.js config
   })
   ```

3. **Add PWA manifest**
   ```json
   // public/manifest.json
   {
     "name": "Your Portfolio",
     "short_name": "Portfolio",
     "description": "Personal portfolio website",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#000000",
     "icons": [
       {
         "src": "/icon-192x192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512x512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

## 🤖 AI Integration

### OpenAI for Content Generation

1. **Get an OpenAI API key**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an API key

2. **Configure environment variables**
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Create API route** for content generation:
   ```tsx
   // app/api/ai/generate/route.ts
   import { NextResponse } from 'next/server'
   import OpenAI from 'openai'
   
   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   })
   
   export async function POST(request: Request) {
     const { prompt } = await request.json()
     
     const completion = await openai.chat.completions.create({
       messages: [{ role: 'user', content: prompt }],
       model: 'gpt-3.5-turbo',
     })
     
     return NextResponse.json({ 
       content: completion.choices[0].message.content 
     })
   }
   ```

---

## 🆘 Troubleshooting

### Common Integration Issues

**Environment Variables Not Working**
- Ensure variables are in `.env.local` (not `.env`)
- Restart your development server after adding variables
- Check that public variables start with `NEXT_PUBLIC_`

**CORS Issues**
- Add proper CORS headers to your API routes
- Check that external services allow your domain

**Build Failures**
- Ensure all required environment variables are set in production
- Check that optional integrations have proper fallbacks

**Rate Limiting Issues**
- Implement proper error handling for rate-limited APIs
- Use caching to reduce API calls
- Consider implementing retry logic with exponential backoff

For more specific issues, check the documentation for each service or create an issue in the repository.