import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL environment variable is required')
  process.exit(1)
}

// Check if using Prisma Accelerate
const isAccelerate = connectionString.startsWith('prisma+')

let prisma: PrismaClient

if (isAccelerate) {
  console.log('🚀 Using Prisma Accelerate connection')
  prisma = new PrismaClient({
    accelerateUrl: connectionString,
  })
} else {
  console.log('📦 Using PostgreSQL adapter')
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
}

async function main() {
  try {
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
    console.log('📝 Adding Russian columns to blog_posts table...')
    
    // Add columns using raw SQL
    await prisma.$executeRaw`
      ALTER TABLE blog_posts 
      ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
      ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
      ADD COLUMN IF NOT EXISTS "contentRu" TEXT
    `
    
    console.log('✅ Russian columns added successfully!')
    
    // Verify columns were added
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
    
    if (columns.length === 3) {
      console.log('')
      console.log('🎉 Success! Russian columns are now available.')
      console.log('')
      console.log('📝 Next step: Run this to add Russian translations:')
      console.log('   npx tsx scripts/update-russian-translations.ts')
    }
    
  } catch (error: any) {
    if (error.code === '42501' || error.message?.includes('permission') || error.message?.includes('owner')) {
      console.error('')
      console.error('❌ Permission denied: Cannot add columns')
      console.error('')
      console.error('The database user does not have ALTER TABLE permissions.')
      console.error('')
      console.error('You need to run this SQL with database admin access.')
      console.error('')
      console.error('SQL to run:')
      console.error('')
      console.error('ALTER TABLE blog_posts')
      console.error('ADD COLUMN IF NOT EXISTS "titleRu" TEXT,')
      console.error('ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,')
      console.error('ADD COLUMN IF NOT EXISTS "contentRu" TEXT;')
      console.error('')
      console.error('Options:')
      console.error('1. Vercel Storage → Postgres → Query/SQL Editor')
      console.error('2. Use a database client (TablePlus, pgAdmin, etc.)')
      console.error('3. Use psql command line with admin connection')
    } else {
      console.error('❌ Error:', error.message)
      throw error
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('')
  })
  .catch(async (e) => {
    console.error('')
    console.error('💥 Fatal error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
































