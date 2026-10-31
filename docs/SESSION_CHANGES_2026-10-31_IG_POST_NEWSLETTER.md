# Newsletter: new Instagram post (BIO-MESO PROOF), 2026-10-31

## Ask

Email users about the new Instagram post, each in their own language (from name or email),
only to real addresses, spaced out so Gmail does not block the mailbox.

## Audience

Vadim chose the active newsletter list only (opted in). Registered accounts that never
subscribed were not emailed (same reasoning as 2026-08-24: one Gmail mailbox carries
order mail too).

Dry run, 31 Oct: 255 active and not yet sent today, **243 to send** (EN 192, RU 49, AR 2).
Skipped: 10 Apple private relay addresses, 2 `@example.com` test rows. No MX failures, no
earlier bounces found (campaign `errors` and Gmail mailer-daemon both empty).

Language: Arabic-script name means AR, Cyrillic name or a Russian-language mail domain
(mail.ru, bk.ru, list.ru, inbox.ru, yandex, ya.ru, rambler, ukr.net, .ru/.by/.kz/.ua) means
RU, otherwise the stored locale. 40 subscribers moved from EN to RU this way.

## Email

Subject EN "No needles. Just hands." / RU "Без игл. Только руки." / AR "بلا إبر. فقط اليدان."
Cover and slide 2 of the post (`public/images/newsletter/biomeso-proof-2026-10/`), two short
paragraphs from the post caption, button to
https://www.instagram.com/genosys.uae/p/DfFC5d2jPSc/, clinics WhatsApp line. No prices.
Tests in all three languages sent to the sending mailbox and received.

## Send

`scripts/send-ig-post-newsletter.ts` (`--dry-run`, `--test <email>`, `--send`). Random
20-40 s gap between sends (about 2 h for 243), one `NewsletterCampaign` row per language,
`lastSentAt` updated per subscriber, so a re-run the same day skips anyone already sent.

Scheduled for **Sun 1 Nov 2026 10:00 Dubai** by a one-shot launchd job
`~/Library/LaunchAgents/com.vadim.genosys-newsletter-biomeso.plist` running
`~/Library/Scripts/genosys_send_biomeso_post.sh`; it removes itself after the run.
Log: `~/Library/Logs/genosys/newsletter_biomeso_post_2026-11-01.log`.
