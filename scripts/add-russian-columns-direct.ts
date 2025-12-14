import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

/**
 * Script to add Russian columns directly using Prisma's $executeRaw
 * This bypasses the permission check by using the direct database connection
 */

async function addRussianColumnsDirect() {
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL environment variable is required')
    process.exit(1)
  }

  // Check if using Prisma Accelerate
  const isAccelerate = databaseUrl.startsWith('prisma+')
  
  let prisma: PrismaClient
  
  if (isAccelerate) {
    console.log('🚀 Using Prisma Accelerate connection')
    prisma = new PrismaClient({
      accelerateUrl: databaseUrl,
    })
  } else {
    console.log('📦 Using direct PostgreSQL connection')
    // Try to use direct connection with adapter
    try {
      const { PrismaPg } = require('@prisma/adapter-pg')
      const { Pool } = require('pg')
      const pool = new Pool({ connectionString: databaseUrl })
      const adapter = new PrismaPg(pool)
      prisma = new PrismaClient({
        adapter,
      })
    } catch (error) {
      // Fallback to regular Prisma client
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      })
    }
  }

  try {
    console.log('')
    console.log('🔍 Checking if Russian columns exist...')
    
    // Check if columns exist
    let hasColumns = false
    try {
      const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
      `
      hasColumns = columns.length === 3
      if (hasColumns) {
        console.log('✅ Russian columns already exist!')
        columns.forEach(col => console.log(`   - ${col.column_name}`))
        return
      }
    } catch (error: any) {
      console.log('📝 Columns check failed, will attempt to add them...')
    }

    console.log('')
    console.log('📝 Adding Russian columns...')
    
    // Try to add columns
    try {
      await prisma.$executeRaw`
        ALTER TABLE blog_posts 
        ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
        ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
        ADD COLUMN IF NOT EXISTS "contentRu" TEXT
      `
      
      console.log('✅ Russian columns added successfully!')
      
      // Verify
      const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blog_posts' 
        AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
        ORDER BY column_name
      `
      
      console.log('')
      console.log('✅ Verification:')
      columns.forEach(col => console.log(`   - ${col.column_name}`))
      
      console.log('')
      console.log('🎉 Success! Russian columns are now available.')
      console.log('')
      console.log('📝 Next step: Run this to add Russian translations:')
      console.log('   npx tsx scripts/update-russian-translations.ts')
      
    } catch (error: any) {
      if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('owner')) {
        console.error('')
        console.error('❌ Permission denied: Cannot add columns')
        console.error('')
        console.error('The database user does not have ALTER TABLE permissions.')
        console.error('')
        console.error('Options:')
        console.error('1. Use Prisma Migrate (if you have migration permissions):')
        console.error('   npx prisma migrate dev --name add_russian_blog_columns')
        console.error('')
        console.error('2. Connect to database with admin user and run:')
        console.error('   ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS "titleRu" TEXT,')
        console.error('   ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,')
        console.error('   ADD COLUMN IF NOT EXISTS "contentRu" TEXT;')
        console.error('')
        console.error('3. If using Vercel Postgres:')
        console.error('   - Go to Vercel Dashboard → Storage → Postgres → Query')
        console.error('   - Run the ALTER TABLE command there')
        console.error('')
        console.error('4. If using Supabase:')
        console.error('   - Go to Supabase Dashboard → SQL Editor')
        console.error('   - Run the ALTER TABLE command there')
      } else {
        throw error
      }
    }
    
  } catch (error) {
    console.error('❌ Failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addRussianColumnsDirect()
  .then(() => {
    console.log('')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n💥 Fatal error:', e)
    process.exit(1)
  })
































