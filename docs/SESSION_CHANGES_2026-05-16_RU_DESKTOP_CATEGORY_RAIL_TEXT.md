# Session — Russian Desktop Category Rail Text (2026-05-16)

- **Issue:** Russian desktop homepage category cards used long SEO H1 labels in a compact 45% text column, causing text collisions/overlap.
- **Fix:** Added short `CATEGORY_RAIL_TITLES` for the homepage category rail in EN/AR/RU. SEO H1 copy remains unchanged on category pages.
- **Primary impact:** Russian labels now fit the card layout, e.g. `Аппараты для микронидлинга`, `Сыворотки для лица`, `Солнцезащитные кремы`.
- **Follow-up:** shortened the sun tile to `SPF-кремы` and added `break-words` on card titles so long Russian words cannot spill into the image column.
- **Product accuracy:** changed the Russian microneedling tile from `Аппараты для микронидлинга` to `Ролики для микронидлинга` because devices are not currently sold.
- **Cream tile:** changed homepage Cream category image from ND Cell cream to **Multi Functional Anti-Wrinkle Cream** (`product 32`, `/images/ANT.jpg`) and bumped the cached home-data key.
- **Russian wording:** changed newsletter/home copy from `Гайды` to `Советы`.
- **Copy cleanup:** corrected live Russian copy from `дермакосметика` to `дерматокосметика` in homepage “Why GENOSYS” text and `messages/ru.json` `trustAuthentic`.
- **Hero terminology:** changed homepage hero eyebrow/proof-strip and product-list subtitle/trust badge from generic `космецевтика` to `дерматокосметика`. Brand-story references to cosmeceuticals remain where they describe microneedling + formulas conceptually.
