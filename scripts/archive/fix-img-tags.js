#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix img tags in a file
function fixImgTags(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if Image is already imported
    const hasImageImport = content.includes("import Image from 'next/image'");
    
    // Add Image import if not present
    if (!hasImageImport && content.includes('<img')) {
      // Find the first import statement and add Image import after it
      const importMatch = content.match(/import.*from ['"][^'"]+['"];?\s*\n/);
      if (importMatch) {
        const insertIndex = importMatch.index + importMatch[0].length;
        content = content.slice(0, insertIndex) + 
                 "import Image from 'next/image'\n" + 
                 content.slice(insertIndex);
        modified = true;
      }
    }
    
    // Replace img tags with Image components
    // Pattern: <img src="..." alt="..." className="..." />
    content = content.replace(
      /<img\s+src=["']([^"']+)["'](?:\s+alt=["']([^"']*)["'])?(?:\s+className=["']([^"']*)["'])?(?:\s+width=["']?(\d+)["']?)?(?:\s+height=["']?(\d+)["']?)?(?:\s+[^>]*)?\s*\/?>/g,
      (match, src, alt, className, width, height) => {
        const altAttr = alt || 'Image';
        const widthAttr = width || '500';
        const heightAttr = height || '300';
        const classNameAttr = className ? ` className="${className}"` : '';
        
        return `<Image\n        src="${src}"\n        alt="${altAttr}"\n        width={${widthAttr}}\n        height={${heightAttr}}${classNameAttr}\n      />`;
      }
    );
    
    // Also handle img tags without closing slash
    content = content.replace(
      /<img\s+src=["']([^"']+)["'](?:\s+alt=["']([^"']*)["'])?(?:\s+className=["']([^"']*)["'])?(?:\s+width=["']?(\d+)["']?)?(?:\s+height=["']?(\d+)["']?)?(?:\s+[^>]*)?>/g,
      (match, src, alt, className, width, height) => {
        const altAttr = alt || 'Image';
        const widthAttr = width || '500';
        const heightAttr = height || '300';
        const classNameAttr = className ? ` className="${className}"` : '';
        
        return `<Image\n        src="${src}"\n        alt="${altAttr}"\n        width={${widthAttr}}\n        height={${heightAttr}}${classNameAttr}\n      />`;
      }
    );
    
    if (content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed img tags in ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
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
console.log('🖼️  Fixing img tags to use Next.js Image components...\n');

const allFiles = findFiles('.');
const targetFiles = allFiles.filter(file => 
  file.includes('app/') && 
  (file.endsWith('.tsx') || file.endsWith('.jsx')) &&
  !file.includes('node_modules') &&
  !file.includes('.next')
);

console.log(`📁 Found ${targetFiles.length} files to check\n`);

let fixedCount = 0;
targetFiles.forEach(file => {
  if (fixImgTags(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed img tags in ${fixedCount} files!`);
