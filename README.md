# Portfolio Website

A production-ready personal portfolio website featuring world-class scroll animations, modular architecture, and high performance. Built with Next.js 14+, TypeScript, and modern animation libraries.

## ✨ Features

- **🎨 Modern Design**: Clean, editorial design with dark/light theme support
- **🚀 High Performance**: Optimized for Core Web Vitals with 95+ Lighthouse scores
- **📱 Fully Responsive**: Mobile-first design that works on all devices
- **♿ Accessible**: WCAG AA+ compliant with keyboard navigation and screen reader support
- **🎭 Advanced Animations**: Smooth scroll effects, parallax, and micro-interactions
- **📝 Content Management**: Type-safe MDX content with hot reloading
- **🔍 SEO Optimized**: Dynamic meta tags, structured data, and Open Graph images
- **⚡ Developer Experience**: TypeScript, ESLint, Prettier, and comprehensive tooling

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Content**: [Contentlayer](https://contentlayer.dev) with MDX
- **Animations**: [GSAP](https://gsap.com) + [Framer Motion](https://www.framer.com/motion)
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com)
- **Deployment**: [Vercel](https://vercel.com)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME="Your Name"
   
   # Contact Form (optional)
   RESEND_API_KEY=your_resend_api_key
   CONTACT_EMAIL=your@email.com
   
   # Analytics (optional)
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (site)/            # Main site routes
│   │   ├── page.tsx       # Home page
│   │   ├── about/         # About page
│   │   ├── projects/      # Projects listing & case studies
│   │   ├── blog/          # Blog listing & posts
│   │   ├── contact/       # Contact form
│   │   └── styleguide/    # Component showcase
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── site/             # Site-specific components
│   ├── projects/         # Project-related components
│   ├── blog/             # Blog-related components
│   └── seo/              # SEO components
├── content/              # MDX content files
│   ├── projects/         # Project case studies
│   ├── blog/             # Blog posts
│   └── testimonials/     # Client testimonials
├── lib/                  # Utility libraries
│   ├── motion/           # Animation system
│   ├── utils.ts          # General utilities
│   ├── contentlayer.ts   # Content configuration
│   └── seo.ts            # SEO utilities
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🎨 Content Management

### Adding Projects

1. Create a new MDX file in `content/projects/`:
   ```bash
   touch content/projects/my-new-project.mdx
   ```

2. Add frontmatter and content:
   ```mdx
   ---
   title: "My New Project"
   slug: "my-new-project"
   summary: "Brief project description"
   coverImage: "/projects/my-project/cover.jpg"
   tags: ["React", "TypeScript", "Design"]
   role: "Full-stack Developer"
   tools: ["Next.js", "Tailwind CSS", "Framer Motion"]
   client: "Client Name"
   year: 2024
   featured: true
   ---

   # Project Overview

   Your project content goes here...
   ```

### Adding Blog Posts

1. Create a new MDX file in `content/blog/`:
   ```bash
   touch content/blog/my-blog-post.mdx
   ```

2. Add frontmatter and content:
   ```mdx
   ---
   title: "My Blog Post"
   slug: "my-blog-post"
   date: "2024-01-15"
   excerpt: "Brief post description"
   tags: ["Development", "Tutorial"]
   ---

   # Blog Post Title

   Your blog content goes here...
   ```

### Content Features

- **Type Safety**: All content is validated with Zod schemas
- **Hot Reloading**: Content changes are reflected immediately
- **Syntax Highlighting**: Code blocks with Shiki
- **Image Optimization**: Automatic image processing
- **SEO**: Auto-generated meta tags and Open Graph images

## 🎭 Animation System

The portfolio includes a comprehensive animation system built on GSAP and Framer Motion. See [README_motion.md](./README_motion.md) for detailed documentation.

### Quick Usage

```tsx
import { FadeIn, RiseIn, Magnetic } from '@/lib/motion'

function MyComponent() {
  return (
    <div>
      <FadeIn>
        <h1>This fades in</h1>
      </FadeIn>
      
      <RiseIn delay={0.2}>
        <p>This rises up with a delay</p>
      </RiseIn>
      
      <Magnetic>
        <button>Magnetic hover effect</button>
      </Magnetic>
    </div>
  )
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript checks

# Content
npm run contentlayer    # Build content layer

# Performance
npm run build:analyze   # Analyze bundle size
npm run perf:audit      # Run Lighthouse audit
npm run perf:verify     # Verify performance metrics
```

### Code Quality

The project includes comprehensive tooling for code quality:

- **ESLint**: Code linting with Next.js recommended rules
- **Prettier**: Code formatting with Tailwind CSS plugin
- **TypeScript**: Strict type checking
- **Husky**: Git hooks for pre-commit checks (optional)

### Performance Monitoring

- **Bundle Analysis**: Webpack Bundle Analyzer integration
- **Lighthouse CI**: Automated performance auditing
- **Web Vitals**: Core Web Vitals tracking
- **Performance Metrics**: Custom performance monitoring

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your site

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

### Environment Variables

Required environment variables for production:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="Your Name"

# Contact Form
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your@email.com

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
```

## 🎯 Performance

The portfolio is optimized for exceptional performance:

- **Core Web Vitals**: Consistently achieves 95+ Lighthouse scores
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based and component-based splitting
- **Preloading**: Critical resources and fonts
- **Caching**: Optimized caching strategies

### Performance Features

- **Static Generation**: Pre-rendered pages for optimal loading
- **Incremental Static Regeneration**: Update content without full rebuilds
- **Edge Runtime**: Fast API routes with Vercel Edge Functions
- **Bundle Optimization**: Tree shaking and dead code elimination

## ♿ Accessibility

The portfolio meets WCAG AA+ standards:

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Color Contrast**: AA+ color contrast ratios
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Visible focus indicators

## 🔍 SEO

Comprehensive SEO optimization:

- **Meta Tags**: Dynamic meta tags for all pages
- **Structured Data**: JSON-LD for rich snippets
- **Open Graph**: Dynamic OG image generation
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Proper crawling directives

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📚 Documentation

- [Motion System Documentation](./README_motion.md) - Complete animation system guide
- [Integration Guides](./docs/INTEGRATIONS.md) - Third-party service integrations
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [Performance Guide](./docs/PERFORMANCE.md) - Performance optimization tips
- [Component Styleguide](http://localhost:3000/styleguide) - Live component showcase

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Rebuild Contentlayer: `npm run contentlayer`

**Animation Issues**
- Check if reduced motion is enabled in system preferences
- Verify GSAP license for commercial use
- Ensure motion components are properly imported

**Content Issues**
- Validate MDX frontmatter against schemas
- Check file paths and naming conventions
- Ensure images exist in the public directory

**Performance Issues**
- Run bundle analysis: `npm run build:analyze`
- Check for unused dependencies
- Optimize images and assets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Vercel](https://vercel.com) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [GSAP](https://gsap.com) for animation capabilities
- [Contentlayer](https://contentlayer.dev) for content management

---

Built with ❤️ and modern web technologies
