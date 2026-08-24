# Blog announcements

Date: 2026-08-24

Publishing a post used to notify nobody. The publish path wrote the `blog_posts`
row and stopped there, so 23 articles went live without a single reader being
told. The newsletter list, the PWA push stack and the mobile app push token were
all built and working, and all three were only ever reachable by an admin
composing a message by hand.

A published post now fans out to all three, each recipient in their own language.

## What happens on publish

`announceBlogPost({ slug })` in `lib/blogAnnounce.ts`:

1. **Mobile app push** — Expo, to every `User.expoPushToken`. Tokens the service
   rejects as `DeviceNotRegistered` are cleared.
2. **Web push** — VAPID, to every `PushSubscription`. Logged as a
   `PWANotification` row so it appears in the PWA notification history alongside
   admin promotions. Subscriptions returning 404 or 410 are deleted.
3. **Newsletter** — one `NewsletterCampaign` per language that has active
   subscribers, so the history panel shows the subject each group actually
   received. Throttled to one email per 150 ms, matching the existing campaign
   runner.

Each channel is wrapped independently: a dead SMTP box does not cost you the
push send.

## Not notifying twice

`blog_posts.announcedAt` is stamped the first time a post is announced, and the
stamp is claimed with a conditional `updateMany` before anything is sent, so two
concurrent callers cannot both win the race.

Every post that existed before this shipped was backdated to its publish date
(`scripts/backfill-blog-announced-at.ts`). Without that, editing any old article
in the admin panel would have fired a push for something published months ago.

## Language

Neither `User` nor `PushSubscription` records a language, so push locale is
inferred: the locale on the person's most recent order, then their newsletter
preference, then English. Newsletter subscribers carry their own locale and need
no guessing.

Missing translations fall back to English rather than being skipped — a Russian
reader is better served an English headline than silence.

## Triggers

- **Admin panel** — `POST /api/blog/posts` and `PUT /api/blog/posts/[id]`
  announce in an `after()` hook once the post is published. Editing a live post
  is a no-op because of the `announcedAt` claim.
- **Scripts** — the `scripts/create-*-blog.ts` scripts only write the row. Run
  the announcer afterwards:

```bash
npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug> --dry-run
npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug>
```

`--dry-run` prints the audience and the localized subject lines without sending.
Individual channels can be picked with `--mobile`, `--web`, `--newsletter`;
naming none sends to all. `--force` re-announces a post that already carries a
stamp.

To test a push against one device without pushing the whole list a second time:

```bash
npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug> --force --only you@example.com
```

`--only` implies `--mobile` and is ignored by the other channels.

## Checking the email before a send

```bash
npx tsx --env-file=.env.local scripts/preview-blog-announcement.ts <slug>
```

Writes `/tmp/blog-announce-{en,ru,ar}.html` through the real campaign template.
Worth doing: the list is small enough that a broken layout reaches a meaningful
fraction of it.

## Email body

Built directly in `lib/blogAnnounceCopy.ts` rather than through
`renderNewsletterMarkdown`, which deliberately drops images — and the featured
image is most of why a blog announcement gets opened. Arabic renders RTL. Titles
and excerpts are HTML-escaped.

That module holds no Prisma or mail imports so the copy logic can be tested
without a database (`__tests__/lib/blogAnnounce.test.ts`).

## First send

`power-solution-sws-arbutin-2-percent`, 2026-08-24:

| Channel | Result |
|---|---|
| Mobile push | 56 sent, 0 failed |
| Web push | 15 sent, 1 dead subscription removed |
| Email EN | 10 sent |
| Email RU | 1 sent |
| Email AR | 1 sent |

## What still does not fire

WhatsApp has no blog message type and is untouched — it carries order messages
only. There is no automated Instagram, Telegram or X posting, and none was
added. The RSS feed at `/feed/blog.xml` is still not advertised through a
`<link rel="alternate">` tag in `app/layout.tsx`, so feed readers cannot
auto-discover it.
