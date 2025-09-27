#!/usr/bin/env node

/**
 * Create placeholder images for projects
 * This script creates simple SVG placeholders for each project
 */

const fs = require('fs');
const path = require('path');

// Project slugs that need placeholder images
const projects = [
  'ai-automation-platform',
  'dashboard-analytics', 
  'data-pipeline-architecture',
  'ecommerce-platform',
  'fraud-detection-system',
  'healthcare-dashboard',
  'inventory-management',
  'learning-platform',
  'real-time-chat',
  'social-media-analytics',
  'task-management'
];

// Color schemes for different project types
const colorSchemes = {
  'ai-automation-platform': { bg: '#3b82f6', accent: '#1d4ed8' },
  'dashboard-analytics': { bg: '#8b5cf6', accent: '#7c3aed' },
  'data-pipeline-architecture': { bg: '#06b6d4', accent: '#0891b2' },
  'ecommerce-platform': { bg: '#10b981', accent: '#059669' },
  'fraud-detection-system': { bg: '#f59e0b', accent: '#d97706' },
  'healthcare-dashboard': { bg: '#ef4444', accent: '#dc2626' },
  'inventory-management': { bg: '#6366f1', accent: '#4f46e5' },
  'learning-platform': { bg: '#8b5cf6', accent: '#7c3aed' },
  'real-time-chat': { bg: '#06b6d4', accent: '#0891b2' },
  'social-media-analytics': { bg: '#ec4899', accent: '#db2777' },
  'task-management': { bg: '#10b981', accent: '#059669' }
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
  <text x="400" y="220" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
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

// Create directories and placeholder images
projects.forEach(projectSlug => {
  const projectDir = path.join('public', 'projects', projectSlug);
  
  // Create project directory if it doesn't exist
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }
  
  // Generate title from slug
  const title = projectSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Create SVG placeholder
  const svgContent = createSVGPlaceholder(projectSlug, title);
  const svgPath = path.join(projectDir, 'cover.svg');
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ Created placeholder for ${projectSlug}`);
});

console.log('\\n🎉 All project placeholders created successfully!');
console.log('\\n📝 Next steps:');
console.log('1. Update project MDX files to use local images');
console.log('2. Replace placeholders with actual project images when available');