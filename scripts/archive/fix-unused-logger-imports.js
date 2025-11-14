const fs = require('fs')
const path = require('path')

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        findFiles(filePath, fileList)
      }
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        fileList.push(filePath)
      }
    }
  })
  
  return fileList
}

function fixUnusedImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const originalContent = content
  
  // Check if file has logger import
  const loggerImportMatch = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]@\/lib\/logger['"]/)
  if (!loggerImportMatch) return false
  
  const importedFunctions = loggerImportMatch[1].split(',').map(f => f.trim())
  
  // Check which functions are actually used
  const usedFunctions = []
  importedFunctions.forEach(func => {
    // Check if function is used (not just in the import statement)
    const funcRegex = new RegExp(`\\b${func}\\s*\\(`, 'g')
    const matches = content.match(funcRegex)
    // Count matches, but exclude the import line itself
    const importLine = content.split('\n').find(line => line.includes(`import`) && line.includes('logger'))
    const matchesInImport = importLine ? (importLine.match(funcRegex) || []).length : 0
    const actualUsage = (matches || []).length - matchesInImport
    
    if (actualUsage > 0) {
      usedFunctions.push(func)
    }
  })
  
  // If no functions are used, remove the import
  if (usedFunctions.length === 0) {
    // Remove the import line
    const lines = content.split('\n')
    const importLineIndex = lines.findIndex(line => line.includes("from '@/lib/logger'") || line.includes('from "@/lib/logger"'))
    if (importLineIndex !== -1) {
      lines.splice(importLineIndex, 1)
      content = lines.join('\n')
    }
  } else if (usedFunctions.length !== importedFunctions.length) {
    // Replace with only used functions
    const newImport = `import { ${usedFunctions.join(', ')} } from '@/lib/logger'`
    content = content.replace(loggerImportMatch[0], newImport)
  } else {
    return false // No changes needed
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8')
    return true
  }
  return false
}

// Main execution
const rootDir = process.cwd()
const files = findFiles(rootDir)

console.log(`Checking ${files.length} files for unused logger imports...`)
let modifiedCount = 0

files.forEach(file => {
  try {
    if (fixUnusedImports(file)) {
      modifiedCount++
      console.log(`✓ Fixed: ${file}`)
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message)
  }
})

console.log(`\nCompleted: ${modifiedCount} files fixed`)

