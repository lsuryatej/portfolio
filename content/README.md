# Content Directory

This directory contains all the MDX and Markdown content for the portfolio website, organized by content type.

## Structure

```
content/
├── projects/          # Project case studies (MDX)
├── blog/             # Blog posts (MDX)
├── testimonials/     # Client testimonials (Markdown)
└── README.md         # This file
```

## Content Types

### Projects (`/projects/*.mdx`)

Project case studies with rich media and detailed descriptions.

**Required fields:**
- `title`: Project title
- `slug`: URL slug (must be unique)
- `summary`: Brief project description
- `coverImage`: Main project image path
- `role`: Your role in the project
- `featured`: Boolean for homepage display

**Optional fields:**
- `gallery`: Array of image paths
- `tags`: Array of technology/category tags
- `tools`: Array of tools used
- `client`: Client name
- `year`: Project year
- `outcome`: Results/impact description
- `chapters`: Table of contents structure

### Blog Posts (`/blog/*.mdx`)

Technical articles and insights.

**Required fields:**
- `title`: Post title
- `slug`: URL slug (must be unique)
- `date`: Publication date (YYYY-MM-DD)

**Optional fields:**
- `excerpt`: Brief description for listings
- `coverImage`: Featured image path
- `tags`: Array of topic tags
- `canonicalUrl`: Original publication URL
- `readingTime`: Estimated reading time in minutes

### Testimonials (`/testimonials/*.md`)

Client and colleague recommendations.

**Required fields:**
- `name`: Person's name
- `quote`: Testimonial text

**Optional fields:**
- `title`: Job title
- `company`: Company name
- `avatar`: Profile image path
- `featured`: Boolean for homepage display

## Adding New Content

1. Create a new file in the appropriate directory
2. Add the required frontmatter fields
3. Write your content in MDX/Markdown
4. The content will be automatically processed and type-checked

## Hot Reloading

Content changes are automatically detected and rebuilt during development. The generated types are available at `contentlayer/generated`.

## Validation

All content is validated against Zod schemas defined in `/lib/contentlayer.ts`. This ensures type safety and catches errors early in the development process.