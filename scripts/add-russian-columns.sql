-- SQL script to add Russian translation columns to blog_posts table
-- Run this script with database admin/owner permissions

-- Add Russian translation columns
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS "titleRu" TEXT,
ADD COLUMN IF NOT EXISTS "excerptRu" TEXT,
ADD COLUMN IF NOT EXISTS "contentRu" TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name IN ('titleRu', 'excerptRu', 'contentRu')
ORDER BY column_name;



































