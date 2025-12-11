# How to Access SQL Editor in Vercel Postgres

## Current Location
You're at: Prisma Integration page
**This page doesn't have a SQL editor**

## Where to Go Instead

### Option 1: Vercel Postgres Storage Dashboard (Recommended)

1. **Go back to your project main page**
   - Click on your project name at the top
   - Or go to: https://vercel.com/vadimkus-projects/cosmetics-website2

2. **Navigate to Storage**
   - Click on **"Storage"** tab in your project
   - Find your **Postgres** database (not Prisma integration)
   - Click on the Postgres database name

3. **Open SQL Editor**
   - In the Postgres database page, look for:
     - **"Query"** tab
     - **"SQL Editor"** button
     - **"Run SQL"** option
   - This is different from the Prisma integration page

### Option 2: Direct Vercel Storage Link

Try going directly to:
```
https://vercel.com/vadimkus-projects/cosmetics-website2/storage
```

Then click on your Postgres database → Look for Query/SQL Editor

### Option 3: Use Prisma Migrate

If you can't find the SQL editor, try using Prisma Migrate:

```bash
# Make sure you're in the project directory
cd /Users/vadimkus/cosmetics-website

# Try to create and apply migration
npx prisma migrate dev --name add_russian_blog_columns
```

This will create a migration file and try to apply it.

### Option 4: Use Database Client Tool

If Vercel doesn't provide SQL editor access, use a database client:

1. **Get your connection string** from Vercel:
   - Go to Storage → Postgres → Settings/Connect
   - Copy the connection string (starts with `postgres://`)

2. **Use a database client** like:
   - **TablePlus** (Mac/Windows) - https://tableplus.com
   - **pgAdmin** - https://www.pgadmin.org
   - **DBeaver** - https://dbeaver.io
   - **Postico** (Mac) - https://eggerapps.at/postico/

3. **Connect** using the connection string

4. **Run the SQL**:
   ```sql
   ALTER TABLE blog_posts 
   ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
   ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
   ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
   ```

## SQL to Run

Once you find the SQL editor (in any of the above methods), run:

```sql
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
```











