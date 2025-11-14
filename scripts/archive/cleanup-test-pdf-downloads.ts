import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupTestPDFDownloads() {
  try {
    console.log('🧹 Starting cleanup of test PDF downloads...')
    
    // Get all PDF downloads to see what we have
    const allDownloads = await prisma.pDFDownload.findMany({
      orderBy: { timestamp: 'desc' }
    })
    
    console.log(`📊 Found ${allDownloads.length} total PDF downloads`)
    
    // Show recent downloads
    console.log('\n📄 Recent PDF downloads:')
    allDownloads.slice(0, 10).forEach((download, index) => {
      console.log(`${index + 1}. ${download.filename} - ${download.userEmail || 'anonymous'} - ${download.timestamp.toISOString()}`)
    })
    
    // Delete test downloads (you can customize these criteria)
    const testCriteria = [
      // Delete downloads from test emails
      { userEmail: { contains: 'test' } },
      { userEmail: { contains: 'example' } },
      { userEmail: { contains: 'demo' } },
      { userEmail: { contains: 'f.this.that@gmail.com' } }, // Your test email
      
      // Delete downloads with test filenames
      { filename: { contains: 'test' } },
      { filename: { contains: 'demo' } },
      { filename: { contains: 'sample' } },
      
      // Delete downloads from localhost (development)
      { ipAddress: { contains: '127.0.0.1' } },
      { ipAddress: { contains: 'localhost' } },
      { ipAddress: { contains: '192.168' } },
      
      // Delete downloads from today (if you want to clean today's test data)
      // Uncomment the next line if you want to delete all downloads from today
      // { timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
    ]
    
    let totalDeleted = 0
    
    for (const criteria of testCriteria) {
      const downloadsToDelete = await prisma.pDFDownload.findMany({
        where: criteria
      })
      
      if (downloadsToDelete.length > 0) {
        console.log(`\n🗑️ Deleting ${downloadsToDelete.length} downloads matching criteria:`, criteria)
        
        const deleteResult = await prisma.pDFDownload.deleteMany({
          where: criteria
        })
        
        totalDeleted += deleteResult.count
        console.log(`✅ Deleted ${deleteResult.count} downloads`)
      }
    }
    
    // Get remaining downloads count
    const remainingDownloads = await prisma.pDFDownload.count()
    
    console.log(`\n📊 Cleanup Summary:`)
    console.log(`   • Total deleted: ${totalDeleted}`)
    console.log(`   • Remaining downloads: ${remainingDownloads}`)
    
    if (totalDeleted > 0) {
      console.log('\n✅ PDF downloads cleanup completed successfully!')
    } else {
      console.log('\n✅ No test downloads found to clean up.')
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
cleanupTestPDFDownloads()
