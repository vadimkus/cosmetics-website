import { defineConfig } from 'prisma/config'

/**
 * Prisma 7 config for migrations.
 *
 * IMPORTANT:
 * - `prisma migrate deploy` must connect to the **direct database** (`postgres://...`)
 * - Prisma Accelerate (`prisma+postgres://...`) is for runtime client, not migrations.
 * - `prisma generate` does NOT need a database connection (only the schema file)
 *
 * Vercel env recommendation:
 * - `POSTGRES_URL` (or `DATABASE_URL`): direct postgres connection string
 * - `PRISMA_DATABASE_URL`: Prisma Accelerate URL (optional, for runtime PrismaClient)
 */

const isAccelerateUrl = (url: string) => String(url || '').startsWith('prisma+postgres://')

const directUrlFromEnv =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  (process.env.PRISMA_DATABASE_URL && !isAccelerateUrl(process.env.PRISMA_DATABASE_URL)
    ? process.env.PRISMA_DATABASE_URL
    : undefined)

// Check if we're running a command that requires database connection
// `prisma generate` does NOT need a database URL - only migrations do
const commandArgs = process.argv.join(' ')
const isMigrationCommand = commandArgs.includes('migrate') || commandArgs.includes('db push')

if (!directUrlFromEnv && isMigrationCommand) {
  throw new Error(
    'Missing DIRECT database connection string for migrations. ' +
      'Set DATABASE_URL or POSTGRES_URL to a postgres://... URL. ' +
      'Do NOT use a prisma+postgres://... (Accelerate) URL for migrate deploy.'
  )
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Only set datasource URL if available (required for migrations, optional for generate)
  ...(directUrlFromEnv && {
    datasource: {
      url: directUrlFromEnv,
    },
  }),
})


