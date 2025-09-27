#!/usr/bin/env node

/**
 * Update all project MDX files to use local placeholder images
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all project MDX files
const projectFiles = glob.sync('content/projects/*.mdx');

projectFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.mdx');
  
  // Replace external image URLs with local placeholders
  let updatedContent = content
    // Replace coverImage with local SVG
    .replace(
      /coverImage:\s*"https:\/\/[^"]+"/g, 
      `coverImage: "/projects/${fileName}/cover.svg"`
    )
    // Replace gallery images with local SVG
    .replace(
      /gallery:\s*\n(\s*-\s*"https:\/\/[^"]+"\s*\n)*/g,
      `gallery:\n  - "/projects/${fileName}/cover.svg"`
    );
  
  // Write updated content back to file
  fs.writeFileSync(filePath, updatedContent);
  console.log(`✅ Updated ${fileName}`);
});

console.log('\\n🎉 All project files updated to use local images!');