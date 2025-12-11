const fs = require('fs');

const content = fs.readFileSync('data/productTranslationsRu.ts', 'utf8');

// English words/phrases that indicate mixed content (excluding JSON keys)
const englishPatterns = [
  /\b(Homecare|Professional|Post-treatment|regenerating|skin|recovery|healing|technology|keyBenefits|usage|skinType|application|formulation|testing|origin)\b/gi,
  /\b(Preparation|Application|Frequency|Duration|Results|Method|Daily|Cleansing|Soak|cotton|pad|apply|gently|circular|motions|until|absorbed)\b/gi,
  /\b(Powerful|helps|promote|that|with|and|for|the|to|of|in|is|are|was|were|been|be|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall)\b/gi,
  /\b(provides|ensures|delivers|targets|improves|enhances|reduces|increases|decreases|supports|maintains|creates|offers|contains|includes)\b/gi,
  /\b(natural|alternative|stable|effective|advanced|premium|intensive|professional|clinical|dermatologically|tested|proven)\b/gi,
  /\b(smallest|molecule|penetration|absorption|efficacy|benefits|properties|complex|extract|acid|peptide|serum|cream|mask|toner)\b/gi,
];

// JSON keys to ignore (these are structural, not content)
const jsonKeys = ['step', 'instruction', 'name', 'description', 'title', 'form', 'size', 'target', 'keyBenefits', 'usage', 'skinType', 'application', 'formulation', 'testing', 'origin', 'type', 'sizeOptions', 'keyComponents', 'benefits', 'treatmentAreas', 'professionalUse', 'safety', 'needleCount', 'needleThickness', 'keyBenefits'];

const lines = content.split('\n');
const productsWithEnglish = [];
let currentProduct = null;
let englishContent = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect product start
  const productMatch = line.match(/^\s*"(\d+)":\s*\{/);
  if (productMatch) {
    if (currentProduct && englishContent.length > 0) {
      productsWithEnglish.push({
        product: currentProduct,
        lines: [...englishContent]
      });
    }
    currentProduct = productMatch[1];
    englishContent = [];
  }
  
  // Check for English patterns (but ignore JSON keys)
  if (currentProduct && line.trim()) {
    // Skip comment lines
    if (line.trim().startsWith('//')) continue;
    
    // Check if line contains English words (not just JSON keys)
    let hasEnglish = false;
    for (const pattern of englishPatterns) {
      const matches = line.match(pattern);
      if (matches) {
        // Check if matches are not JSON keys
        const actualContent = matches.filter(m => 
          !jsonKeys.includes(m.toLowerCase()) && 
          !jsonKeys.includes(m) &&
          m.length > 2 // Ignore very short words
        );
        if (actualContent.length > 0) {
          hasEnglish = true;
          break;
        }
      }
    }
    
    if (hasEnglish) {
      // Extract the actual content part (not JSON structure)
      const contentMatch = line.match(/:\s*"([^"]*)"|:\s*'([^']*)'|:\s*\[|\{\s*"([^"]*)"/);
      if (contentMatch) {
        const text = contentMatch[1] || contentMatch[2] || contentMatch[3] || '';
        // Check if text contains English words
        if (/\b[A-Z][a-z]+\b/.test(text) && text.length > 10) {
          englishContent.push({
            line: i + 1,
            content: line.trim().substring(0, 150)
          });
        }
      }
    }
  }
}

// Add last product if needed
if (currentProduct && englishContent.length > 0) {
  productsWithEnglish.push({
    product: currentProduct,
    lines: [...englishContent]
  });
}

console.log('Products with Mixed English/Russian Content:');
console.log('=============================================\n');

if (productsWithEnglish.length === 0) {
  console.log('No products found with mixed English/Russian content.');
} else {
  productsWithEnglish.forEach(({ product, lines }) => {
    console.log(`Product ${product}:`);
    lines.slice(0, 3).forEach(({ line, content }) => {
      console.log(`  Line ${line}: ${content}`);
    });
    if (lines.length > 3) {
      console.log(`  ... and ${lines.length - 3} more lines`);
    }
    console.log('');
  });
  
  console.log(`\nTotal products with mixed content: ${productsWithEnglish.length}`);
  console.log(`\nProduct IDs: ${productsWithEnglish.map(p => p.product).join(', ')}`);
}










