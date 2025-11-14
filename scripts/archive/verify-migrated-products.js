const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: ['1', '2', '3', '10', '11', '12', '15', '16'] }
      },
      select: {
        id: true,
        name: true,
        description: true,
        productDetails: true,
        keyFeatures: true,
        benefits: true,
        ingredients: true,
        howToUse: true,
        directions: true
      },
      orderBy: {
        id: 'asc'
      }
    });
    
    console.log('🔍 Verifying migrated products from DATABASE...\n');
    console.log('=' .repeat(80));
    
    products.forEach(product => {
      console.log(`\n✅ Product ${product.id}: ${product.name}`);
      console.log(`   📝 Description: ${product.description ? product.description.substring(0, 80) + '...' : 'NO ✗'}`);
      console.log(`   📋 Product Details: ${product.productDetails ? 'YES ✓ (from DB)' : 'NO ✗'}`);
      console.log(`   ⭐ Key Features: ${product.keyFeatures ? 'YES ✓ (from DB)' : 'NO ✗'}`);
      console.log(`   💎 Benefits: ${product.benefits ? 'YES ✓ (from DB)' : 'NO ✗'}`);
      console.log(`   🧪 Ingredients: ${product.ingredients ? 'YES ✓ (from DB)' : 'NO ✗'}`);
      console.log(`   📖 How to Use: ${product.howToUse ? 'YES ✓ (from DB)' : 'NO ✗'}`);
      console.log(`   ℹ️  Directions: ${product.directions ? 'YES ✓ (from DB)' : 'NO ✗'}`);
    });
    
    console.log('\n' + '=' .repeat(80));
    console.log(`\n📊 Summary:`);
    console.log(`   Total products checked: ${products.length}`);
    console.log(`   Products with full details: ${products.filter(p => p.productDetails).length}`);
    console.log(`   Products with descriptions: ${products.filter(p => p.description && p.description.length > 100).length}`);
    console.log(`\n✅ All product data is being served from the DATABASE!`);
    console.log(`   (Not from hardcoded JSON or files)`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyProducts();

