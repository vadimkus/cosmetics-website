# B2B guides: wholesale CTA and cluster links (20 Sep 2026)

## Trigger

An external SEO note claimed `sitemap.xml` returned 500 and proposed five
"revenue plays". Verified against production:

- `sitemap.xml`: 200, `application/xml`, valid, 428 URLs (142 EN / 142 AR /
  142 RU), 0.2 to 0.6 s over six fetches including Googlebot UA. Not broken.
- Of the five plays, PDRN, SPF/BB and hair-loss clusters already exist as
  guides, concern and category pages. Two gaps were real: the clinic pages had
  no wholesale conversion action, and they did not link to each other.

## Change

- `SeoLandingPage.cta` (optional): eyebrow, title, body, primary and secondary
  actions. `GuideArticle` renders it as a dark block directly under the key
  points, so a clinic buyer sees the action before the editorial sections.
  External hrefs open in a new tab, internal ones stay client-routed.
- Primary action: WhatsApp to sales (+971 58 548 76 65) with a prefilled
  clinic-account request. `/partners` is a directory, not an application form,
  so it was the wrong target. Secondary: `/contact`.
- `b2bLinksExcept(slug, links)`: the four B2B guides (clinics, devices,
  training, distributor) now share one six-link cluster (each other, partner
  clinics, training materials) minus the page itself.
- Applied in EN, AR and RU. The AR and RU CTA copy is written for the buyer,
  not translated word for word; WhatsApp prefills are localized.

## Not changed

The remaining suggestions (seasonal SPF guide, spicule explainer, Arabic-native
rewrites of the concern pages) are content work, not fixes, and should be
driven by Search Console query data before anyone writes them.
