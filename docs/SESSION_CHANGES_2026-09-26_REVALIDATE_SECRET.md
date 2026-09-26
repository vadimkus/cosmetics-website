# REVALIDATE_SECRET set in production (26 Sep 2026)

`/api/revalidate` refused every call with "Invalid secret" because `REVALIDATE_SECRET`
was never set in Vercel production. Product edits (DB images, video, copy) therefore
waited for the 300 s `unstable_cache` window on the `products` tag.

- Added `REVALIDATE_SECRET` (random 64-hex) to Vercel **Production** and to local
  `.env.local` (gitignored). Production redeployed to load it.
- Verified: wrong secret returns `Invalid secret`; the real one returns
  `Tag 'products' revalidated`.

Use after a DB product change:

```bash
S=$(rg -o --color=never '^REVALIDATE_SECRET=.*' .env.local | tail -1 | cut -d= -f2-)
curl -s -X POST https://genosys.ae/api/revalidate -H "Content-Type: application/json" \
  -d "{\"tag\":\"products\",\"path\":\"/products/39\",\"secret\":\"$S\"}"
```

`path` is optional; the `products` tag alone refreshes every product read.
