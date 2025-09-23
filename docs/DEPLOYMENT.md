# Deployment Guide

This guide covers deploying your portfolio website to various platforms with optimal configuration for performance, security, and SEO.

## 🚀 Vercel (Recommended)

Vercel is the recommended deployment platform as it's built by the Next.js team and provides excellent performance and developer experience.

### Quick Deploy

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Environment Variables

Add these in your Vercel dashboard under Settings > Environment Variables:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Name
NEXT_PUBLIC_CONTACT_EMAIL=your@email.com

# Optional
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_EMAIL=your@email.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Custom Domain

1. **Add Domain**
   - Go to Settings > Domains
   - Add your custom domain

2. **Configure DNS**
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.61`
   - Or use Vercel nameservers for full DNS management

3. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Includes automatic renewal

### Advanced Configuration

Create `vercel.json` for advanced settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

## 🌐 Netlify

Netlify is another excellent option with great features for static sites and serverless functions.

### Deploy Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18

3. **Configure Next.js for Static Export**
   ```js
   // next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   
   module.exports = nextConfig
   ```

### Environment Variables

Add in Netlify dashboard under Site settings > Environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
NEXT_PUBLIC_SITE_NAME=Your Name
# Add other variables as needed
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## ☁️ AWS Amplify

AWS Amplify provides hosting with CI/CD and additional AWS service integrations.

### Deploy Steps

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your GitHub repository

2. **Build Settings**
   ```yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add in Amplify Console under App settings > Environment variables

### Custom Domain

1. **Add Domain**
   - Go to Domain management
   - Add your domain

2. **DNS Configuration**
   - Follow AWS instructions for your DNS provider
   - SSL certificate is automatically provisioned

## 🐳 Docker Deployment

For containerized deployments on any platform.

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yml
# docker-compose.yml
version: '3.8'

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SITE_URL=https://your-domain.com
      - NEXT_PUBLIC_SITE_NAME=Your Name
      # Add other environment variables
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - portfolio
    restart: unless-stopped
```

### Build Configuration

Update `next.config.js` for Docker:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}

module.exports = nextConfig
```

## 🔧 GitHub Actions CI/CD

Automate your deployment with GitHub Actions.

### Vercel Deployment

```yml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Quality Checks

```yml
# .github/workflows/quality.yml
name: Quality Checks

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Format check
        run: npm run format:check
      
      - name: Build
        run: npm run build
      
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## 🔒 Security Configuration

### Content Security Policy

```js
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com *.plausible.io;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: *.vercel.com *.unsplash.com;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'false'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
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

The contact form includes built-in rate limiting. For additional protection, consider:

1. **Cloudflare** - DDoS protection and rate limiting
2. **Vercel Pro** - Advanced DDoS protection
3. **AWS WAF** - Web application firewall

## 📊 Performance Optimization

### Build Optimization

```js
// next.config.js
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compress responses
  compress: true,
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      config.plugins.push(
        new (require('@next/bundle-analyzer'))({
          enabled: true,
        })
      )
      return config
    },
  }),
}
```

### Caching Strategy

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}
```

## 🌍 CDN Configuration

### Cloudflare

1. **Add Site to Cloudflare**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain

2. **Update Nameservers**
   - Change your domain's nameservers to Cloudflare's

3. **Configure Settings**
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - Auto Minify: CSS, JavaScript, HTML
   - Brotli: On

4. **Page Rules**
   ```
   /_next/static/* - Cache Level: Cache Everything, Edge Cache TTL: 1 year
   /api/* - Cache Level: Bypass
   ```

## 📱 PWA Deployment

### Service Worker

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // Your existing config
})
```

### Web App Manifest

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
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

## 🔍 SEO Deployment Checklist

- [ ] **Sitemap**: Accessible at `/sitemap.xml`
- [ ] **Robots.txt**: Configured at `/robots.txt`
- [ ] **Meta tags**: Dynamic meta tags on all pages
- [ ] **Open Graph**: Dynamic OG images generated
- [ ] **Structured data**: JSON-LD on relevant pages
- [ ] **Canonical URLs**: Set on all pages
- [ ] **Google Search Console**: Site verified and sitemap submitted
- [ ] **Analytics**: Tracking code installed and working

## 🚨 Troubleshooting

### Common Deployment Issues

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working**
- Ensure variables are set in deployment platform
- Check variable names (case-sensitive)
- Restart deployment after adding variables

**Images Not Loading**
- Check image paths are correct
- Ensure images are in `public` directory
- Verify image optimization settings

**API Routes Failing**
- Check serverless function limits
- Verify environment variables for API keys
- Test API routes locally first

**Performance Issues**
- Run bundle analyzer: `ANALYZE=true npm run build`
- Check Core Web Vitals in deployment
- Optimize images and fonts

### Monitoring

Set up monitoring for your deployed site:

1. **Uptime Monitoring**: UptimeRobot, Pingdom
2. **Performance Monitoring**: Vercel Analytics, Google PageSpeed Insights
3. **Error Tracking**: Sentry, LogRocket
4. **Analytics**: Plausible, Google Analytics

---

Your portfolio is now ready for production deployment! Choose the platform that best fits your needs and follow the respective guide above.