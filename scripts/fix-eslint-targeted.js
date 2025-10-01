#!/usr/bin/env node

const fs = require('fs');

// Function to fix specific unescaped entities in ProductPageClient.tsx
function fixProductPageClient() {
  const filePath = 'app/products/[id]/ProductPageClient.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix specific patterns that are causing ESLint errors
  // Replace single quotes in text content with &apos;
  content = content.replace(/([^\\])'/g, '$1&apos;');
  
  // Replace double quotes in text content with &quot;
  content = content.replace(/([^\\])"/g, '$1&quot;');
  
  // Fix any remaining issues
  content = content.replace(/\\'/g, "'");
  content = content.replace(/\\"/g, '"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed unescaped entities in ${filePath}`);
}

// Function to fix specific unescaped entities in profile/page.tsx
function fixProfilePage() {
  const filePath = 'app/profile/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix specific patterns
  content = content.replace(/([^\\])'/g, '$1&apos;');
  content = content.replace(/([^\\])"/g, '$1&quot;');
  content = content.replace(/\\'/g, "'");
  content = content.replace(/\\"/g, '"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed unescaped entities in ${filePath}`);
}

// Function to fix specific unescaped entities in training/page.tsx
function fixTrainingPage() {
  const filePath = 'app/training/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix specific patterns
  content = content.replace(/([^\\])'/g, '$1&apos;');
  content = content.replace(/([^\\])"/g, '$1&quot;');
  content = content.replace(/\\'/g, "'");
  content = content.replace(/\\"/g, '"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed unescaped entities in ${filePath}`);
}

// Main execution
console.log('🔧 Fixing ESLint unescaped entities errors (targeted approach)...\n');

try {
  fixProductPageClient();
  fixProfilePage();
  fixTrainingPage();
  console.log('\n✅ ESLint errors fixed!');
} catch (error) {
  console.error('❌ Error:', error.message);
}
