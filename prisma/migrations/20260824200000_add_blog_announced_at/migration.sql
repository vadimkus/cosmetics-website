-- Stamped the first time a post is announced to subscribers, so that editing a
-- live post cannot re-notify anyone.
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "announcedAt" TIMESTAMP(3);
