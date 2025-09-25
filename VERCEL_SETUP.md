# Vercel Deployment Setup Guide

Complete guide for deploying your portfolio to Vercel with optimal configuration.

## 🚀 Quick Deployment (Recommended)

### Option 1: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Your account]
# - Link to existing project? N
# - Project name: suryatej-portfolio
# - Directory: ./
# - Override settings? N
```

### Option 2: Deploy via GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure settings (see below)
6. Deploy!

## ⚙️ Vercel Project Settings

### Framework Preset
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### Environment Variables
Set these in Vercel dashboard under Project Settings → Environment Variables:

#### Required
```bash
NEXT_PUBLIC_SITE_URL=https://suryatej.vercel.app
NEXT_PUBLIC_SITE_NAME=Suryatej
NEXT_PUBLIC_CONTACT_EMAIL=lsuryatej@gmail.com
```

#### Optional (if using features)
```bash
# Contact Form
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_EMAIL=lsuryatej@gmail.com

# Analytics (choose one)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=suryatej.vercel.app
# OR
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# SEO
GOOGLE_SITE_VERIFICATION=xxxxxxxxxx
BING_SITE_VERIFICATION=xxxxxxxxxx
```

### Build Settings
- **Node.js Version**: 18.x (auto-detected from .nvmrc)
- **Install Command**: `npm install --legacy-peer-deps`
- **Build Command**: `npm run build`
- **Development Command**: `npm run dev`

### Domain Configuration
- **Production Domain**: `suryatej.vercel.app` (auto-assigned)
- **Custom Domain**: Add your own domain in Project Settings → Domains

## 🌐 Custom Domain Setup

### Option 1: Buy Domain from Vercel
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Search for available domains
4. Purchase directly through Vercel

### Option 2: Use Existing Domain
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### DNS Configuration
If using external domain provider:
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 📊 Performance Optimization

### Vercel Analytics
- Enable Vercel Analytics in Project Settings
- Provides Core Web Vitals monitoring
- No additional setup required

### Image Optimization
- Next.js Image component automatically optimized
- Images served from Vercel's global CDN
- Automatic WebP/AVIF format conversion

### Edge Functions
- API routes automatically deployed as Edge Functions
- Global distribution for optimal performance
- Automatic scaling

## 🔧 Advanced Configuration

### vercel.json (Optional)
Create `vercel.json` in project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Build Optimization
- Automatic code splitting
- Tree shaking enabled
- Bundle optimization
- Static generation for optimal performance

## 🚀 Deployment Workflow

### Automatic Deployments
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Automatic preview URLs

### Manual Deployments
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### Environment-Specific Deployments
- **Production**: `main` branch
- **Preview**: All other branches
- **Development**: Local `vercel dev`

## 📈 Monitoring & Analytics

### Vercel Dashboard
- Build logs and deployment history
- Performance metrics
- Error tracking
- Function execution logs

### Core Web Vitals
- Automatic monitoring
- Performance scores
- Optimization suggestions
- Real user monitoring

## 🔒 Security Features

### Automatic HTTPS
- SSL certificates automatically provisioned
- HTTP to HTTPS redirects
- HSTS headers

### Security Headers
- Content Security Policy
- XSS Protection
- Clickjacking Protection
- MIME Type Sniffing Protection

## 🛠️ Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install --legacy-peer-deps
npm run build
```

#### Environment Variables
- Ensure all required variables are set
- Check variable names match exactly
- Restart deployment after adding variables

#### Domain Issues
- Verify DNS configuration
- Check domain propagation (up to 48 hours)
- Ensure SSL certificate is provisioned

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## ✅ Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test all pages and navigation
- [ ] Check contact form functionality
- [ ] Verify analytics tracking
- [ ] Test mobile responsiveness
- [ ] Check Core Web Vitals
- [ ] Submit sitemap to search engines
- [ ] Set up monitoring alerts

## 🎉 Launch!

Your portfolio is now live at `https://suryatej.vercel.app`!

### Next Steps
1. Share your portfolio URL
2. Update your resume with the new URL
3. Submit to search engines
4. Monitor performance and user feedback
5. Iterate and improve based on analytics
