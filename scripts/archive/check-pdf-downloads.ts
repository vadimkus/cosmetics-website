import { debugLog } from '@/lib/logger'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPdfDownloads() {
  debugLog('🔍 Checking recent PDF downloads...');
  
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
    debugLog('📊 Recent PDF Downloads:');
    downloads.forEach((dl, index) => {
      debugLog(`${index + 1}. ${dl.filename}`);
      debugLog(`   User: ${dl.userEmail || 'anonymous'}`);
      debugLog(`   IP: ${dl.ipAddress}`);
      debugLog(`   Location: ${dl.city || 'Unknown'}, ${dl.country || 'Unknown'}`);
      debugLog(`   Time: ${dl.timestamp.toISOString()}`);
      debugLog('');
    });
  } else {
    debugLog('❌ No PDF downloads found in database');
  }
}

checkPdfDownloads()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
