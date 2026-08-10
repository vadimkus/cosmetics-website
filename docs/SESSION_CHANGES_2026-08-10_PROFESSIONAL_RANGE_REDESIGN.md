# Professional range homepage redesign

**Date:** 2026-08-10
**Area:** Homepage category section

## Summary

Rebuilt the six-card “The GENOSYS professional range” homepage block to match
the supplied warm editorial template:

- warm ivory section and card surfaces
- serif English/Russian heading and card titles
- red eyebrow, numbered cards, CTA accents, and ornamental divider
- full-bleed category compositions with refined borders and shadows
- responsive 3/2/1-column layout
- preserved live category links, product counts, EN/RU/AR copy, and RTL support

## Curated category images

The section now uses the dedicated compositions in
`public/images/prof_range/`:

- `microneedling.jpeg`
- `pro_solutions.jpeg`
- `prof_face_serums.jpeg`
- `prof_face_creams.jpeg`
- `prof_face_masks.jpeg`
- `prof_sun.jpeg`

The curated image map takes precedence over server-selected catalog thumbnails,
while the existing dynamic image map remains as a fallback for future
categories.

## Verification

- focused ESLint check passed
- visually checked at 1440 px and the supplied 1024 px reference width
- verified six category cards, loaded images, and responsive locale rendering
