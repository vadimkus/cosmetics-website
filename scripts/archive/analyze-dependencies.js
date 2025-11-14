#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});
const devDependencies = Object.keys(packageJson.devDependencies || {});

// Function to find all imports in a file
function findImports(content) {
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const imports = new Set();
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  while ((match = requireRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  return Array.from(imports);
}

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, .git
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

// Function to check if a dependency is used
function isDependencyUsed(dep, files) {
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const imports = findImports(content);
      
      // Check if the dependency is imported directly
      if (imports.some(imp => imp === dep || imp.startsWith(dep + '/'))) {
        return true;
      }
      
      // Check for scoped packages
      if (dep.startsWith('@')) {
        const scopedName = dep.split('/')[0];
        if (imports.some(imp => imp.startsWith(scopedName + '/'))) {
          return true;
        }
      }
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }
  
  return false;
}

// Main analysis
console.log('🔍 Analyzing dependencies...\n');

const allFiles = findFiles('.');
const allDependencies = [...dependencies, ...devDependencies];
const unusedDeps = [];
const usedDeps = [];

console.log(`📁 Found ${allFiles.length} files to analyze`);
console.log(`📦 Found ${allDependencies.length} dependencies to check\n`);

for (const dep of allDependencies) {
  const isUsed = isDependencyUsed(dep, allFiles);
  
  if (isUsed) {
    usedDeps.push(dep);
  } else {
    unusedDeps.push(dep);
  }
}

console.log('✅ Used dependencies:');
usedDeps.forEach(dep => console.log(`  ✓ ${dep}`));

console.log('\n❌ Potentially unused dependencies:');
unusedDeps.forEach(dep => console.log(`  ✗ ${dep}`));

console.log(`\n📊 Summary:`);
console.log(`  Total dependencies: ${allDependencies.length}`);
console.log(`  Used: ${usedDeps.length}`);
console.log(`  Potentially unused: ${unusedDeps.length}`);

if (unusedDeps.length > 0) {
  console.log('\n💡 Consider removing unused dependencies to reduce bundle size:');
  console.log(`npm uninstall ${unusedDeps.join(' ')}`);
}
