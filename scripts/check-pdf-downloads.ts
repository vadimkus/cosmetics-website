import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPdfDownloads() {
  console.log('🔍 Checking recent PDF downloads...');
  
  const downloads = await prisma.pDFDownload.findMany({
    orderBy: { timestamp: 'desc' },
    take: 10,
    select: {
      filename: true,
      userEmail: true,
      ipAddress: true,
      timestamp: true,
      country: true,
      city: true
    }
  });

  if (downloads.length > 0) {
    console.log('📊 Recent PDF Downloads:');
    downloads.forEach((dl, index) => {
      console.log(`${index + 1}. ${dl.filename}`);
      console.log(`   User: ${dl.userEmail || 'anonymous'}`);
      console.log(`   IP: ${dl.ipAddress}`);
      console.log(`   Location: ${dl.city || 'Unknown'}, ${dl.country || 'Unknown'}`);
      console.log(`   Time: ${dl.timestamp.toISOString()}`);
      console.log('');
    });
  } else {
    console.log('❌ No PDF downloads found in database');
  }
}

checkPdfDownloads()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
