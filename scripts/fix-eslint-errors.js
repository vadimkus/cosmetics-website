#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix unescaped entities in a file
function fixUnescapedEntities(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix single quotes
    content = content.replace(/'/g, '&apos;');
    
    // Fix double quotes
    content = content.replace(/"/g, '&quot;');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed unescaped entities in ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Function to find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          traverse(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
console.log('🔧 Fixing ESLint unescaped entities errors...\n');

const allFiles = findFiles('.');
const targetFiles = allFiles.filter(file => 
  file.includes('ProductPageClient.tsx') || 
  file.includes('profile/page.tsx') ||
  file.includes('training/page.tsx')
);

console.log(`📁 Found ${targetFiles.length} files to fix\n`);

targetFiles.forEach(file => {
  fixUnescapedEntities(file);
});

console.log('\n✅ ESLint errors fixed!');
