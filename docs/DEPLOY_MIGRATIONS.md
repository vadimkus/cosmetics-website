# Deploy & Database Migrations Runbook

Short version: **every Vercel build runs `prisma migrate deploy` automatically.**
If you need to recover from a broken migration at 2am, jump to [Emergency bypass](#emergency-bypass).

## How it works

```
git push → Vercel build trigger
         → npm run build
           → prisma generate
           → node scripts/deploy-setup.js
             ├─ generates Prisma client
             ├─ runs `prisma migrate deploy`   ← applies pending migrations
             └─ aborts build on failure
           → node scripts/generate-sw-version.js
           → next build
```

Key points:
- `prisma migrate deploy` only applies migrations that are NEW (not in the `_prisma_migrations` table).
- It never drops data. It never modifies an already-applied migration.
- If a migration fails, the build **fails**. No broken code ships.

## Environment variables on Vercel

Required on every Vercel environment (production, preview):

| Variable              | Purpose                                   | Format                       |
| --------------------- | ----------------------------------------- | ---------------------------- |
| `DATABASE_URL`        | Direct postgres URL for migrations        | `postgres://...sslmode=require` |
| `PRISMA_DATABASE_URL` | Accelerate URL for runtime PrismaClient   | `prisma+postgres://...`      |

> `DATABASE_URL` MUST be a direct postgres URL. Accelerate URLs (`prisma+postgres://`)
> do **not** work for `prisma migrate deploy`. If you only set the Accelerate URL,
> the build will exit with a clear error.

## Adding a new migration

1. Edit `prisma/schema.prisma` locally.
2. Create a migration file: `npx prisma migrate dev --name short_description`.
   - This creates `prisma/migrations/<timestamp>_short_description/migration.sql`.
3. Commit BOTH the schema change and the new migration folder.
4. Push. Vercel applies the migration on next build.

**Do not edit old migration files.** Prisma hashes them; changing one breaks drift detection.

## Emergency bypass

If a migration is broken and you need to ship a hotfix that doesn't touch the schema:

1. Go to Vercel dashboard → Project → Settings → Environment Variables.
2. Add `SKIP_DB_MIGRATIONS = true` to the relevant environment.
3. Redeploy. Build will log `⏭️  SKIP_DB_MIGRATIONS=true — bypassing prisma migrate deploy`.
4. Fix the migration, commit, **remove the env var**, redeploy.

Leaving `SKIP_DB_MIGRATIONS=true` set for longer than a single incident will cause
schema drift — the checked-in migrations will be ahead of the database.

## Common operations

```bash
# Check migration status against the current DB
set -a && source .env.local && set +a
npx prisma migrate status

# Manually apply migrations (e.g. from a local machine to prod)
npm run db:migrate:deploy

# Detect schema drift
npx prisma migrate diff \
  --from-config-datasource \
  --to-schema prisma/schema.prisma \
  --exit-code
# exit 0 = no drift, exit 2 = drift exists
```

## Troubleshooting

**"Following migrations have not yet been applied"** shown in `migrate status` but
the tables already exist in the DB (legacy `db push` path):
→ Mark each as already applied: `npx prisma migrate resolve --applied <migration_name>`.
This writes to `_prisma_migrations` without touching the schema.

**Build fails with "Missing DIRECT database connection string for migrations":**
→ `DATABASE_URL` on Vercel is empty or set to an Accelerate URL. Fix in Vercel env.

**A migration needs to be "undone":**
→ Prisma doesn't support rollback. Write a new migration that reverses the change.

## History

- **Pre-2026-04-17**: Vercel build ran `prisma db push --accept-data-loss`, which bypassed
  migration history and silently swallowed errors.
- **2026-04-17**: Baselined 10 existing migrations into `_prisma_migrations`, switched
  `scripts/deploy-setup.js` to `prisma migrate deploy`, added `SKIP_DB_MIGRATIONS` bypass.
