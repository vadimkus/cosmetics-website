# Adding Russian Columns via Prisma Console

## Steps to Add Russian Columns

1. **Open Prisma Console**
   - Go to: https://console.prisma.io/cmffb32hi04hav8failfmlc7a/overview
   - Navigate to your database/project

2. **Open SQL Editor**
   - Look for "SQL Editor" or "Query" tab in Prisma Console
   - Or go to Database → SQL Editor

3. **Run the SQL**
   Copy and paste this SQL:

   ```sql
   ALTER TABLE blog_posts 
   ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
   ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
   ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
   ```

4. **Execute the Query**
   - Click "Run" or "Execute"
   - You should see a success message

5. **Verify Columns Were Added**
   Run this query to verify:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'blog_posts' 
   AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
   ORDER BY column_name;
   ```

6. **After Adding Columns**
   Once columns are added, run this script to add Russian translations:
   ```bash
   npx tsx scripts/update-russian-translations.ts
   ```

## Alternative: Use Migration File

If Prisma Console supports migrations, you can use:
- File: `prisma/migrations/add_russian_blog_columns/migration.sql`




