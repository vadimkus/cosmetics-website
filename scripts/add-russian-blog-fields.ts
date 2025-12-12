/**
 * Script to add Russian translation fields to blog_posts table
 * This uses raw SQL since Prisma db push requires a config file
 */

import { prisma } from '../lib/prisma'

async function addRussianFields() {
  try {
    console.log('🔍 Checking if Russian fields exist...')
    
    // Check if columns already exist by trying to query them
    try {
      const test = await prisma.$queryRaw`
        SELECT "titleRu", "excerptRu", "contentRu" 
        FROM blog_posts 
        LIMIT 1
      `
      console.log('✅ Russian fields already exist in database')
      return
    } catch (error: any) {
      if (error.message?.includes('column') || error.message?.includes('does not exist')) {
        console.log('📝 Russian fields do not exist, adding them...')
      } else {
        throw error
      }
    }

    console.log('📝 Adding Russian translation fields to blog_posts table...')
    
    // Add Russian fields using raw SQL
    await prisma.$executeRaw`
      ALTER TABLE blog_posts 
      ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
      ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
      ADD COLUMN IF NOT EXISTS "contentRu" TEXT
    `
    
    console.log('✅ Successfully added Russian fields to blog_posts table')
    
    // Verify the columns were added
    const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts' 
      AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
    `
    
    console.log(`✅ Verified: ${columns.length} Russian columns exist`)
    columns.forEach(col => console.log(`   - ${col.column_name}`))
    
  } catch (error) {
    console.error('❌ Failed to add Russian fields:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addRussianFields()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n💥 Fatal error:', e)
    process.exit(1)
  })












