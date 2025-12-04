import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Apply the Russian columns migration directly
 * This reads the migration SQL file and executes it
 */

async function applyMigration() {
  const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL or PRISMA_DATABASE_URL environment variable is required')
    process.exit(1)
  }

  const isAccelerate = databaseUrl.startsWith('prisma+')
  
  let prisma: PrismaClient
  
  if (isAccelerate) {
    console.log('🚀 Using Prisma Accelerate connection')
    prisma = new PrismaClient({
      accelerateUrl: databaseUrl,
    })
  } else {
    try {
      const { PrismaPg } = require('@prisma/adapter-pg')
      const { Pool } = require('pg')
      const pool = new Pool({ connectionString: databaseUrl })
      const adapter = new PrismaPg(pool)
      prisma = new PrismaClient({
        adapter,
      })
    } catch (error) {
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
    // Read migration SQL file
    const migrationPath = join(process.cwd(), 'prisma/migrations/add_russian_blog_columns/migration.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')
    
    console.log('📝 Applying migration: add_russian_blog_columns')
    console.log('')
    
    // Execute each ALTER TABLE statement separately
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement)
          console.log('✅ Executed:', statement.substring(0, 60) + '...')
        } catch (error: any) {
          if (error.code === '42501' || error.message?.includes('permission')) {
            console.error('❌ Permission denied')
            console.error('')
            console.error('You need database admin permissions to run this migration.')
            console.error('')
            console.error('Please run this SQL with admin access:')
            console.error('')
            console.error(migrationSQL)
            console.error('')
            console.error('Or use one of these options:')
            console.error('1. Vercel Postgres: Dashboard → Storage → Postgres → Query')
            console.error('2. Supabase: Dashboard → SQL Editor')
            console.error('3. Direct PostgreSQL: psql $DATABASE_URL -f prisma/migrations/add_russian_blog_columns/migration.sql')
            process.exit(1)
          } else if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
            console.log('⚠️  Column may already exist, continuing...')
          } else {
            throw error
          }
        }
      }
    }
    
    console.log('')
    console.log('✅ Migration applied successfully!')
    
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
    if (columns.length === 3) {
      columns.forEach(col => console.log(`   ✅ ${col.column_name}`))
      console.log('')
      console.log('🎉 Russian columns are now available!')
      console.log('')
      console.log('📝 Next step: Run this to add Russian translations:')
      console.log('   npx tsx scripts/update-russian-translations.ts')
    } else {
      console.log(`   ⚠️  Only ${columns.length} columns found (expected 3)`)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

applyMigration()
  .then(() => {
    console.log('')
    process.exit(0)
  })
  .catch((e) => {
    console.error('\n💥 Fatal error:', e)
    process.exit(1)
  })






