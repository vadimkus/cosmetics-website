# How to Add Russian Columns - Database Provider Instructions

Since Prisma Console doesn't have a SQL editor, you need to access your underlying database provider's console.

## Step 1: Identify Your Database Provider

Your database URL should indicate which provider you're using. Common providers:

- **Vercel Postgres**: URL contains `vercel` or `vercel-postgres`
- **Supabase**: URL contains `supabase.co`
- **Neon**: URL contains `neon.tech`
- **Railway**: URL contains `railway.app`
- **Render**: URL contains `render.com`

## Step 2: Access Your Database Provider's Console

### If Using Vercel Postgres:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** → **Postgres**
4. Click **"Query"** or **"SQL Editor"** tab
5. Run this SQL:

```sql
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
```

### If Using Supabase:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **"New query"**
5. Run the SQL above

### If Using Neon:
1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **SQL Editor**
4. Run the SQL above

### If Using Railway:
1. Go to [Railway Dashboard](https://railway.app)
2. Select your project → Database
3. Click **"Query"** tab
4. Run the SQL above

### If Using Render:
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your database service
3. Go to **"Connect"** → **"PSQL"** or use **"Shell"**
4. Run the SQL above

## Step 3: After Adding Columns

Once columns are added, run:

```bash
npx tsx scripts/update-russian-translations.ts
```

## Alternative: Use psql Command Line

If you have `psql` installed and your database URL:

```bash
psql $DATABASE_URL -c "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS \"titleRu\" TEXT, ADD COLUMN IF NOT EXISTS \"excerptRu\" TEXT, ADD COLUMN IF NOT EXISTS \"contentRu\" TEXT;"
```

Or use the migration file:

```bash
psql $DATABASE_URL -f prisma/migrations/add_russian_blog_columns/migration.sql
```




















