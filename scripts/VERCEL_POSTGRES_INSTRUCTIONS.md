# Adding Russian Columns via Vercel Postgres

## Steps to Add Russian Columns

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Log in to your account

2. **Navigate to Your Project**
   - Click on your project (cosmetics-website or similar)
   - Go to the **Storage** tab

3. **Open Postgres Database**
   - Find your Postgres database in the Storage section
   - Click on it to open the database dashboard

4. **Open SQL Editor**
   - Look for **"Query"** or **"SQL Editor"** tab/button
   - Click on it to open the SQL query interface

5. **Run the SQL**
   Copy and paste this SQL into the editor:

   ```sql
   ALTER TABLE blog_posts 
   ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
   ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
   ADD COLUMN IF NOT EXISTS "contentRu" TEXT;
   ```

6. **Execute the Query**
   - Click **"Run"** or **"Execute"** button
   - You should see a success message

7. **Verify Columns Were Added**
   Run this query to verify:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'blog_posts' 
   AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
   ORDER BY column_name;
   ```

8. **After Adding Columns**
   Once columns are added, run this script to add Russian translations:
   ```bash
   npx tsx scripts/update-russian-translations.ts
   ```

## Alternative: Using Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Connect to your project
vercel link

# Run SQL via Vercel CLI (if supported)
# Or use the dashboard method above
```

## Troubleshooting

- **Can't find SQL Editor**: Look for "Query", "SQL", or "Database" tabs
- **Permission errors**: Make sure you're logged in as the project owner/admin
- **Columns already exist**: The `IF NOT EXISTS` clause will prevent errors


















