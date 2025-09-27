#!/usr/bin/env node

/**
 * Fix all project images by creating SVG placeholders and updating MDX files
 */

const fs = require('fs');
const path = require('path');

// Additional projects that need placeholders
const additionalProjects = [
  'sample-project',
  'data-pipeline-architecture', 
  'marketwatch-stock-monitor',
  'portfolio-website',
  'mobile-app',
  'findmybus',
  'ml-bank-deposit-prediction'
];

// Color schemes for different project types
const colorSchemes = {
  'sample-project': { bg: '#6366f1', accent: '#4f46e5' },
  'data-pipeline-architecture': { bg: '#06b6d4', accent: '#0891b2' },
  'marketwatch-stock-monitor': { bg: '#10b981', accent: '#059669' },
  'portfolio-website': { bg: '#8b5cf6', accent: '#7c3aed' },
  'mobile-app': { bg: '#ec4899', accent: '#db2777' },
  'findmybus': { bg: '#f59e0b', accent: '#d97706' },
  'ml-bank-deposit-prediction': { bg: '#3b82f6', accent: '#1d4ed8' }
};

function createSVGPlaceholder(projectSlug, title) {
  const colors = colorSchemes[projectSlug] || { bg: '#6b7280', accent: '#4b5563' };
  
  const svg = `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${projectSlug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${projectSlug})" />
  <rect x="50" y="50" width="700" height="400" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" rx="8"/>
  <text x="400" y="220" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
    ${title}
  </text>
  <text x="400" y="260" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white" opacity="0.7">
    Project Cover Image
  </text>
  <circle cx="400" cy="320" r="30" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle cx="400" cy="320" r="15" fill="rgba(255,255,255,0.5)"/>
</svg>`;

  return svg;
}

// Create missing SVG placeholders
additionalProjects.forEach(projectSlug => {
  const projectDir = path.join('public', 'projects', projectSlug);
  
  // Create project directory if it doesn't exist
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  const svgPath = path.join(projectDir, 'cover.svg');
  
  // Only create if doesn't exist
  if (!fs.existsSync(svgPath)) {
    // Generate title from slug
    const title = projectSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Create SVG placeholder
    const svgContent = createSVGPlaceholder(projectSlug, title);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ Created placeholder for ${projectSlug}`);
  } else {
    console.log(`⏭️  Placeholder already exists for ${projectSlug}`);
  }
});

// Update project MDX files
const projectFiles = [
  'data-pipeline-architecture.mdx',
  'marketwatch-stock-monitor.mdx', 
  'portfolio-website.mdx',
  'mobile-app.mdx',
  'findmybus.mdx',
  'ml-bank-deposit-prediction.mdx'
];

projectFiles.forEach(fileName => {
  const filePath = path.join('content', 'projects', fileName);
  const projectSlug = fileName.replace('.mdx', '');
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace image and coverImage fields
    content = content.replace(
      /image:\s*"https:\/\/[^"]+"/g, 
      `image: "/projects/${projectSlug}/cover.svg"`
    );
    
    content = content.replace(
      /coverImage:\s*"https:\/\/[^"]+"/g, 
      `coverImage: "/projects/${projectSlug}/cover.svg"`
    );
    
    // Replace gallery arrays
    content = content.replace(
      /gallery:\s*\n(\s*-\s*"https:\/\/[^"]+"\s*\n)*/g,
      `gallery:\n  - "/projects/${projectSlug}/cover.svg"`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${fileName}`);
  }
});

console.log('\\n🎉 All project images fixed!');