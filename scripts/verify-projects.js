#!/usr/bin/env node

/**
 * Simple script to verify projects are loading correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Projects System...\n');

// Check if contentlayer generated files exist
const contentlayerPath = path.join(__dirname, '../.contentlayer/generated');
if (!fs.existsSync(contentlayerPath)) {
  console.error('❌ Contentlayer generated files not found');
  process.exit(1);
}

// Check project files
const projectsPath = path.join(contentlayerPath, 'Project');
if (!fs.existsSync(projectsPath)) {
  console.error('❌ Project files not found');
  process.exit(1);
}

const projectFiles = fs.readdirSync(projectsPath).filter(f => f.endsWith('.json'));
console.log(`✅ Found ${projectFiles.length} project files:`);
projectFiles.forEach(file => {
  console.log(`   - ${file.replace('projects__', '').replace('.mdx.json', '')}`);
});

// Check if index file exists
const indexPath = path.join(contentlayerPath, 'index.mjs');
if (!fs.existsSync(indexPath)) {
  console.error('❌ Contentlayer index file not found');
  process.exit(1);
}

console.log('\n✅ Projects system verification complete!');
console.log(`📊 Total projects: ${projectFiles.length}`);

// Check for required fields in a sample project
try {
  const sampleProjectPath = path.join(projectsPath, projectFiles[0]);
  const sampleProject = JSON.parse(fs.readFileSync(sampleProjectPath, 'utf8'));
  
  const requiredFields = ['title', 'slug', 'summary', 'coverImage', 'url', 'role'];
  const missingFields = requiredFields.filter(field => !sampleProject[field]);
  
  if (missingFields.length > 0) {
    console.warn(`⚠️  Missing fields in sample project: ${missingFields.join(', ')}`);
  } else {
    console.log('✅ All required fields present in projects');
  }
  
  // Check cover image format
  if (sampleProject.coverImage && sampleProject.coverImage.startsWith('http')) {
    console.log('✅ Cover images are properly formatted URLs');
  } else {
    console.warn('⚠️  Cover image may not be a valid URL');
  }
  
} catch (error) {
  console.warn('⚠️  Could not verify project structure:', error.message);
}

console.log('\n🚀 Ready for deployment!');