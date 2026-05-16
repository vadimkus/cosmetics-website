# Session — Russian Desktop Category Rail Text (2026-05-16)

- **Issue:** Russian desktop homepage category cards used long SEO H1 labels in a compact 45% text column, causing text collisions/overlap.
- **Fix:** Added short `CATEGORY_RAIL_TITLES` for the homepage category rail in EN/AR/RU. SEO H1 copy remains unchanged on category pages.
- **Primary impact:** Russian labels now fit the card layout, e.g. `Аппараты для микронидлинга`, `Сыворотки для лица`, `Солнцезащитные кремы`.
- **Copy cleanup:** corrected live Russian copy from `дермакосметика` to `дерматокосметика` in homepage “Why GENOSYS” text and `messages/ru.json` `trustAuthentic`.
- **Hero terminology:** changed homepage hero eyebrow/proof-strip and product-list subtitle/trust badge from generic `космецевтика` to `дерматокосметика`. Brand-story references to cosmeceuticals remain where they describe microneedling + formulas conceptually.
