import { defineConfig } from 'prisma/config'

const datasourceUrl =
  process.env.DATABASE_URL ||
  process.env.PRISMA_DATABASE_URL ||
  process.env.POSTGRES_URL

if (!datasourceUrl) {
  throw new Error(
    'Missing database connection string. Set DATABASE_URL (recommended) ' +
      'or PRISMA_DATABASE_URL or POSTGRES_URL in the environment.'
  )
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: datasourceUrl,
  },
})


