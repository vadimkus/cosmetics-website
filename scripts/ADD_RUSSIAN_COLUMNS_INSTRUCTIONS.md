# How to Add Russian Columns to blog_posts Table

## Problem
The database user doesn't have permission to alter table structure. You need to run the SQL as a database admin/owner.

## Solution Options

### Option 1: Run SQL Directly (Recommended)
If you have database admin access (e.g., via Vercel Postgres dashboard, Supabase, or direct PostgreSQL access):

1. Connect to your database with admin privileges
2. Run the SQL script:
   ```sql
   ALTER TABLE blog_posts 
   ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
   ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
   ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
   ```

Or use the provided SQL file:
```bash
# If using psql command line:
psql $DATABASE_URL -f scripts/add-russian-columns.sql

# Or copy the SQL from scripts/add-russian-columns.sql and run it in your database admin panel
```

### Option 2: Via Vercel Dashboard (If using Vercel Postgres)
1. Go to Vercel Dashboard → Your Project → Storage → Postgres
2. Click on "Query" or "SQL Editor"
3. Run:
   ```sql
   ALTER TABLE blog_posts 
   ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
   ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
   ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
   ```

### Option 3: Grant Permissions (If you have superuser access)
If you have superuser access, you can grant ALTER permissions:
```sql
GRANT ALTER ON TABLE blog_posts TO your_database_user;
```

Then run:
```bash
npx tsx scripts/add-russian-columns-via-api.ts admin@genosys.ae
```

### Option 4: Use Prisma Migrate (If you have migration permissions)
```bash
npx prisma migrate dev --name add_russian_blog_columns
```

## After Adding Columns

Once the columns are added, run this to add Russian translations:
```bash
npx tsx scripts/update-russian-translations.ts
```

## Verify Columns Were Added

```bash
npx tsx -e "import 'dotenv/config'; import { prisma } from './lib/prisma'; (async () => { const cols = await prisma.\$queryRaw\`SELECT column_name FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name LIKE '%Ru%'\`; console.log('Russian columns:', cols.length); (cols as any[]).forEach((c: any) => console.log('  -', c.column_name)); await prisma.\$disconnect(); })()"
```






