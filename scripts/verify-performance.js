#!/usr/bin/env node

/**
 * Performance Verification Script
 * 
 * Verifies that all performance optimizations are properly implemented
 */

const fs = require('fs');
const path = require('path');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function log(type, message) {
  const colors = {
    pass: '\x1b[32m✓\x1b[0m',
    fail: '\x1b[31m✗\x1b[0m',
    warn: '\x1b[33m⚠\x1b[0m',
    info: '\x1b[36mℹ\x1b[0m',
  };
  
  console.log(`${colors[type]} ${message}`);
  
  if (type === 'pass') checks.passed++;
  if (type === 'fail') checks.failed++;
  if (type === 'warn') checks.warnings++;
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log('pass', `${description} exists`);
    return true;
  } else {
    log('fail', `${description} missing: ${filePath}`);
    return false;
  }
}

function checkFileContains(filePath, pattern, description) {
  if (!fs.existsSync(filePath)) {
    log('fail', `File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(pattern) || new RegExp(pattern).test(content)) {
    log('pass', description);
    return true;
  } else {
    log('fail', `${description} - Pattern not found: ${pattern}`);
    return false;
  }
}

function checkPackageJson() {
  console.log('\n📦 Checking package.json optimizations...');
  
  const packagePath = 'package.json';
  if (!fs.existsSync(packagePath)) {
    log('fail', 'package.json not found');
    return;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check for performance-related dependencies
  const perfDeps = ['web-vitals', 'webpack-bundle-analyzer'];
  perfDeps.forEach(dep => {
    if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) {
      log('pass', `${dep} dependency installed`);
    } else {
      log('warn', `${dep} dependency not found`);
    }
  });
  
  // Check for performance scripts
  const perfScripts = ['build:analyze', 'bundle:analyze', 'perf:audit'];
  perfScripts.forEach(script => {
    if (pkg.scripts?.[script]) {
      log('pass', `${script} script configured`);
    } else {
      log('warn', `${script} script not found`);
    }
  });
}

function checkNextConfig() {
  console.log('\n⚙️ Checking Next.js configuration...');
  
  checkFileContains(
    'next.config.ts',
    'optimizePackageImports',
    'Package imports optimization enabled'
  );
  
  checkFileContains(
    'next.config.ts',
    'formats.*avif.*webp',
    'Modern image formats configured'
  );
  
  checkFileContains(
    'next.config.ts',
    'swcMinify.*true',
    'SWC minification enabled'
  );
  
  checkFileContains(
    'next.config.ts',
    'compress.*true',
    'Compression enabled'
  );
}

function checkFontOptimization() {
  console.log('\n🔤 Checking font optimization...');
  
  checkFileContains(
    'lib/typography.ts',
    'preload.*true',
    'Font preloading enabled'
  );
  
  checkFileContains(
    'lib/typography.ts',
    'display.*swap',
    'Font display swap configured'
  );
  
  checkFileContains(
    'lib/typography.ts',
    'fallback',
    'Font fallbacks defined'
  );
}

function checkCodeSplitting() {
  console.log('\n📦 Checking code splitting...');
  
  checkFileExists(
    'lib/dynamic-loader.ts',
    'Dynamic loader utility'
  );
  
  checkFileContains(
    'lib/dynamic-loader.ts',
    'createDynamicComponent',
    'Dynamic component creator implemented'
  );
  
  checkFileContains(
    'components/motion-provider.tsx',
    'import.*@/lib/motion',
    'Motion system dynamically imported'
  );
}

function checkImageOptimization() {
  console.log('\n🖼️ Checking image optimization...');
  
  checkFileExists(
    'components/ui/optimized-image.tsx',
    'Optimized image component'
  );
  
  checkFileContains(
    'components/ui/optimized-image.tsx',
    'placeholder.*blur',
    'Blur placeholder support'
  );
  
  checkFileContains(
    'components/ui/optimized-image.tsx',
    'formats.*avif.*webp',
    'Modern image format support'
  );
}

function checkPreloading() {
  console.log('\n🚀 Checking resource preloading...');
  
  checkFileExists(
    'lib/preloader.ts',
    'Preloader utility'
  );
  
  checkFileExists(
    'components/preload-script.tsx',
    'Preload script component'
  );
  
  checkFileContains(
    'app/layout.tsx',
    'PreloadScript',
    'Preload script included in layout'
  );
  
  checkFileContains(
    'app/layout.tsx',
    'dns-prefetch',
    'DNS prefetch configured'
  );
}

function checkPerformanceMonitoring() {
  console.log('\n📊 Checking performance monitoring...');
  
  checkFileExists(
    'lib/performance-metrics.ts',
    'Performance metrics utility'
  );
  
  checkFileExists(
    'components/performance-monitor.tsx',
    'Performance monitor component'
  );
  
  checkFileContains(
    'lib/performance-metrics.ts',
    'web-vitals',
    'Web Vitals monitoring implemented'
  );
  
  checkFileContains(
    'app/layout.tsx',
    'PerformanceMonitor',
    'Performance monitor included in layout'
  );
}

function checkBundleOptimization() {
  console.log('\n📊 Checking bundle optimization...');
  
  checkFileExists(
    'lib/bundle-optimizer.ts',
    'Bundle optimizer utility'
  );
  
  checkFileContains(
    'lib/bundle-optimizer.ts',
    'tree.*shaking',
    'Tree shaking configuration'
  );
  
  checkFileContains(
    'lib/bundle-optimizer.ts',
    'splitChunks',
    'Chunk splitting configuration'
  );
}

function checkDocumentation() {
  console.log('\n📚 Checking documentation...');
  
  checkFileExists(
    'docs/PERFORMANCE.md',
    'Performance documentation'
  );
  
  checkFileContains(
    'docs/PERFORMANCE.md',
    'Core Web Vitals',
    'Core Web Vitals documentation'
  );
  
  checkFileContains(
    'docs/PERFORMANCE.md',
    'Bundle Analysis',
    'Bundle analysis documentation'
  );
}

function printSummary() {
  console.log('\n📋 Performance Optimization Summary');
  console.log('=====================================');
  console.log(`✅ Passed: ${checks.passed}`);
  console.log(`❌ Failed: ${checks.failed}`);
  console.log(`⚠️  Warnings: ${checks.warnings}`);
  
  const total = checks.passed + checks.failed;
  const score = total > 0 ? Math.round((checks.passed / total) * 100) : 0;
  
  console.log(`\n🎯 Overall Score: ${score}%`);
  
  if (score >= 90) {
    console.log('🎉 Excellent! Performance optimizations are well implemented.');
  } else if (score >= 75) {
    console.log('👍 Good! Most optimizations are in place, but there\'s room for improvement.');
  } else if (score >= 50) {
    console.log('⚠️  Fair. Several optimizations are missing or incomplete.');
  } else {
    console.log('❌ Poor. Many performance optimizations need to be implemented.');
  }
  
  if (checks.failed > 0) {
    console.log('\n💡 Run the following to fix issues:');
    console.log('   npm run build:analyze  # Analyze bundle size');
    console.log('   npm run perf:audit     # Run performance audit');
    console.log('   npm run lint:fix       # Fix linting issues');
  }
}

// Run all checks
console.log('🔍 Verifying Performance Optimizations...\n');

checkPackageJson();
checkNextConfig();
checkFontOptimization();
checkCodeSplitting();
checkImageOptimization();
checkPreloading();
checkPerformanceMonitoring();
checkBundleOptimization();
checkDocumentation();

printSummary();

// Exit with error code if there are failures
process.exit(checks.failed > 0 ? 1 : 0);