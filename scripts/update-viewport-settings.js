#!/usr/bin/env node

/**
 * Update viewport settings in motion primitives
 */

const fs = require('fs');

const filePath = 'lib/motion/primitives.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of the old viewport settings
content = content.replace(
  /viewport=\{\{ once: true, margin: '-50%' \}\}/g,
  'viewport={{ margin: VIEWPORT.rootMargin, amount: VIEWPORT.amount, once: false }}'
);

// Update duration references
content = content.replace(
  /duration: motionTokens\.durations\.slow \/ 1000/g,
  'duration: DURATIONS.md'
);

content = content.replace(
  /duration: motionTokens\.durations\.normal \/ 1000/g,
  'duration: DURATIONS.sm'
);

fs.writeFileSync(filePath, content);
console.log('✅ Updated viewport settings in motion primitives');