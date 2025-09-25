# Environment Variables Report

This document lists all environment variables used in the portfolio application and their configuration for deployment.

## Required Environment Variables

| Variable | Type | Required | Default | Where Used | Description |
|----------|------|----------|---------|------------|-------------|
| `NEXT_PUBLIC_SITE_URL` | string | Yes | `https://suryatej.vercel.app` | SEO, sitemap, robots.txt | Production domain URL |
| `NEXT_PUBLIC_SITE_NAME` | string | Yes | `"Suryatej"` | SEO metadata, site config | Site/brand name |
| `NEXT_PUBLIC_CONTACT_EMAIL` | string | Yes | `lsuryatej@gmail.com` | Contact form, footer | Primary contact email |

## Optional Environment Variables

| Variable | Type | Required | Default | Where Used | Description |
|----------|------|----------|---------|------------|-------------|
| `RESEND_API_KEY` | string | No | - | Contact form API | Email service API key |
| `CONTACT_EMAIL` | string | No | `lsuryatej@gmail.com` | Contact form recipient | Email where contact form sends |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | string | No | `suryatej.vercel.app` | Analytics | Privacy-focused analytics |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | string | No | - | Google Analytics | GA4 tracking ID |
| `GOOGLE_SITE_VERIFICATION` | string | No | - | SEO meta tags | Google Search Console |
| `BING_SITE_VERIFICATION` | string | No | - | SEO meta tags | Bing Webmaster Tools |
| `NEXT_PUBLIC_CALENDLY_USERNAME` | string | No | - | Calendar integration | Calendly username |
| `SPOTIFY_CLIENT_ID` | string | No | - | Music integration | Spotify API client ID |
| `SPOTIFY_CLIENT_SECRET` | string | No | - | Music integration | Spotify API secret |
| `SPOTIFY_REFRESH_TOKEN` | string | No | - | Music integration | Spotify refresh token |
| `UNSPLASH_ACCESS_KEY` | string | No | - | Image API | Unsplash API key |
| `OPENAI_API_KEY` | string | No | - | AI integration | OpenAI API key |

## Build-Time Variables

| Variable | Type | Required | Default | Where Used | Description |
|----------|------|----------|---------|------------|-------------|
| `NODE_ENV` | string | Auto | `production` | Build process | Environment mode |
| `ANALYZE` | string | No | - | Bundle analyzer | Enable webpack analyzer |

## Vercel Deployment Configuration

### Required Environment Variables for Production

```bash
NEXT_PUBLIC_SITE_URL=https://suryatej.vercel.app
NEXT_PUBLIC_SITE_NAME=Suryatej
NEXT_PUBLIC_CONTACT_EMAIL=lsuryatej@gmail.com
```

### Optional Environment Variables (if using features)

```bash
# Contact Form (if using Resend)
RESEND_API_KEY=re_xxxxxxxxxx
CONTACT_EMAIL=lsuryatej@gmail.com

# Analytics (choose one)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=suryatej.vercel.app
# OR
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# SEO (optional)
GOOGLE_SITE_VERIFICATION=xxxxxxxxxx
BING_SITE_VERIFICATION=xxxxxxxxxx

# Additional Features (optional)
NEXT_PUBLIC_CALENDLY_USERNAME=your_username
SPOTIFY_CLIENT_ID=xxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxx
SPOTIFY_REFRESH_TOKEN=xxxxxxxxxx
UNSPLASH_ACCESS_KEY=xxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxx
```

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use Vercel's environment variables interface for production secrets
- All `NEXT_PUBLIC_*` variables are exposed to the client-side
- Keep API keys and secrets in server-side only variables
- Use different API keys for development and production

## Local Development

1. Copy `.env.example` to `.env.local`
2. Update values as needed for local development
3. Never commit `.env.local` to git

## Production Deployment

1. Set environment variables in Vercel dashboard
2. Use production domain for `NEXT_PUBLIC_SITE_URL`
3. Use production API keys and secrets
4. Verify all required variables are set
