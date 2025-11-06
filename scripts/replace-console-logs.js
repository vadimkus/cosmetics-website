const fs = require('fs')
const path = require('path')

// Files/directories to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.next',
  '__tests__',
  'test-',
  'debug-',
  'scripts/replace-console-logs.js', // Don't modify this script
  'package-lock.json',
  'jest.config.js',
  'jest.setup.js'
]

// Files that should use logger
const TARGET_EXTENSIONS = ['.ts', '.tsx']

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => filePath.includes(pattern))
}

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      if (!shouldSkip(filePath)) {
        findFiles(filePath, fileList)
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file)
      if (TARGET_EXTENSIONS.includes(ext) && !shouldSkip(filePath)) {
        fileList.push(filePath)
      }
    }
  })
  
  return fileList
}

function replaceConsoleInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false
  let hasLoggerImport = content.includes("from '@/lib/logger'") || content.includes('from "@/lib/logger"')
  
  // Replace console.log with debugLog
  if (content.includes('console.log')) {
    content = content.replace(/console\.log\(/g, 'debugLog(')
    modified = true
    if (!hasLoggerImport) {
      // Add import at the top
      const importMatch = content.match(/^import .* from ['"]@\/lib\/[^'"]+['"]/m)
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0])
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1
        content = content.slice(0, insertIndex) + 
          "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
          content.slice(insertIndex)
      } else {
        // Add at the beginning after 'use client' or 'use server' if present
        const useDirective = content.match(/^('use client'|'use server')\n/)
        if (useDirective) {
          const insertIndex = useDirective[0].length
          content = content.slice(0, insertIndex) + 
            "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
            content.slice(insertIndex)
        } else {
          content = "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + content
        }
      }
      hasLoggerImport = true
    }
  }
  
  // Replace console.error with errorLog
  if (content.includes('console.error')) {
    content = content.replace(/console\.error\(/g, 'errorLog(')
    modified = true
    if (!hasLoggerImport) {
      const importMatch = content.match(/^import .* from ['"]@\/lib\/[^'"]+['"]/m)
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0])
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1
        content = content.slice(0, insertIndex) + 
          "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
          content.slice(insertIndex)
      } else {
        const useDirective = content.match(/^('use client'|'use server')\n/)
        if (useDirective) {
          const insertIndex = useDirective[0].length
          content = content.slice(0, insertIndex) + 
            "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
            content.slice(insertIndex)
        } else {
          content = "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + content
        }
      }
      hasLoggerImport = true
    }
  }
  
  // Replace console.warn with warnLog
  if (content.includes('console.warn')) {
    content = content.replace(/console\.warn\(/g, 'warnLog(')
    modified = true
    if (!hasLoggerImport) {
      const importMatch = content.match(/^import .* from ['"]@\/lib\/[^'"]+['"]/m)
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0])
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1
        content = content.slice(0, insertIndex) + 
          "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
          content.slice(insertIndex)
      } else {
        const useDirective = content.match(/^('use client'|'use server')\n/)
        if (useDirective) {
          const insertIndex = useDirective[0].length
          content = content.slice(0, insertIndex) + 
            "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
            content.slice(insertIndex)
        } else {
          content = "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + content
        }
      }
      hasLoggerImport = true
    }
  }
  
  // Replace console.info with infoLog
  if (content.includes('console.info')) {
    content = content.replace(/console\.info\(/g, 'infoLog(')
    modified = true
    if (!hasLoggerImport) {
      const importMatch = content.match(/^import .* from ['"]@\/lib\/[^'"]+['"]/m)
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0])
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1
        content = content.slice(0, insertIndex) + 
          "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
          content.slice(insertIndex)
      } else {
        const useDirective = content.match(/^('use client'|'use server')\n/)
        if (useDirective) {
          const insertIndex = useDirective[0].length
          content = content.slice(0, insertIndex) + 
            "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + 
            content.slice(insertIndex)
        } else {
          content = "import { debugLog, errorLog, warnLog, infoLog } from '@/lib/logger'\n" + content
        }
      }
    }
  }
  
  // Remove duplicate imports
  const importRegex = /import\s*\{\s*debugLog(?:\s*,\s*(?:errorLog|warnLog|infoLog))*(?:\s*,\s*(?:errorLog|warnLog|infoLog))*(?:\s*,\s*(?:errorLog|warnLog|infoLog))*\s*\}\s*from\s*['"]@\/lib\/logger['"]/g
  const imports = content.match(importRegex)
  if (imports && imports.length > 1) {
    // Keep only the first one, merge all needed functions
    const allFunctions = new Set()
    imports.forEach(imp => {
      const funcs = imp.match(/(debugLog|errorLog|warnLog|infoLog)/g)
      if (funcs) funcs.forEach(f => allFunctions.add(f))
    })
    const mergedImport = `import { ${Array.from(allFunctions).join(', ')} } from '@/lib/logger'`
    content = content.replace(importRegex, '')
    // Add merged import
    const useDirective = content.match(/^('use client'|'use server')\n/)
    if (useDirective) {
      const insertIndex = useDirective[0].length
      content = content.slice(0, insertIndex) + mergedImport + '\n' + content.slice(insertIndex)
    } else {
      const firstImport = content.match(/^import .+$/m)
      if (firstImport) {
        const insertIndex = content.indexOf(firstImport[0])
        content = content.slice(0, insertIndex) + mergedImport + '\n' + content.slice(insertIndex)
      } else {
        content = mergedImport + '\n' + content
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

// Main execution
const rootDir = process.cwd()
const files = findFiles(rootDir)

console.log(`Found ${files.length} files to check`)
let modifiedCount = 0

files.forEach(file => {
  try {
    if (replaceConsoleInFile(file)) {
      modifiedCount++
      console.log(`✓ Updated: ${file}`)
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message)
  }
})

console.log(`\nCompleted: ${modifiedCount} files modified`)

