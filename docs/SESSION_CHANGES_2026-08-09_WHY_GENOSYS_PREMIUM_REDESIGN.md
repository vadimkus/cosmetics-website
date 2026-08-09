# WHY GENOSYS premium homepage redesign

Date: 2026-08-09

## Scope

Redesigned the localized homepage credibility section while preserving every approved EN/RU/AR claim. The previous flat divided columns are now one warm editorial panel with a serif English/Russian headline, responsive RTL-aware composition, and three distinct informational cards.

## Implementation

- Extracted the section from `HomeDesktopSections.tsx` into `components/home/WhyGenosysSection.tsx`.
- Added a 24px ivory panel, restrained border/depth, right/bottom scientific-beauty detail, balanced 7/5 header composition, and three elevated 14px-radius cards.
- Cards remain semantic informational `article` elements. They intentionally have no hover lift, cursor, tab stop, or fake click affordance.
- Desktop/tablet use three columns; narrow mobile stacks the cards without horizontal overflow.
- Arabic uses the established Arabic typeface and mirrors both composition and decorative artwork.
- English claims are unchanged, including the Dubai Municipality, VAT registration, direct GENOSYS Korea sourcing, Seoul facility, microneedling, and growth-factor wording.

## Asset

The panel reuses the existing first-party artwork:

- `/images/home/skin_concern/anti-aging.webp`
- Source: user-supplied first-party `anti_age.jpeg`, previously optimized for the skin-concern redesign
- Runtime: local Next Image delivery, no hotlink
- Dimensions: 960 × 720
- Size: 18,510 bytes
- Format/profile: WebP, no embedded color profile or metadata
- SHA-256: `b23888f4a2fab6c3990024b0202b25a625043b6dc31849f0aefffe31a0239468`

No third-party asset or additional license attribution was required.

## Verification

- Focused Jest covers the approved three-card order/headings/labels, Russian content, Arabic RTL, and image mirroring.
- TypeScript and focused ESLint pass.
- Production `npm run build` completed successfully; build-generated service-worker version changes were restored afterward so verification did not pollute the worktree.
- Browser checks at 1000px, 1440px, 390px mobile, Russian, and Arabic confirm three cards, no overflow, correct RTL, and a successful optimized image response with non-zero natural dimensions.
- The section asset produced no failed request or console error. The full homepage still emits two pre-existing HTTP 400 requests for the unrelated missing `/images/genosys-video-poster.jpg` Hero poster.

## Production visual follow-up

Vadim's production review showed that the white outer band made the rounded panel feel detached. The section wrapper now uses warm ivory `#f4efe8`, only one RGB step lighter than the panel's `#f3eee7`. The retained `#e4ddd2` panel border and soft shadow preserve its boundary without returning to a stark white canvas. Focused checks and responsive captures were rerun after this adjustment.

## Visual evidence

- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-premium-final-en-1000.png`
- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-premium-final-en-1440.png`
- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-premium-final-en-mobile.png`
- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-premium-final-ru-1000.png`
- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-premium-final-ar-rtl-1000.png`
- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-warm-band-final-desktop-1024.png`
- `/Users/vadimkus/.cursor/projects/Users-vadimkus-VisionDrive/assets/why-genosys-warm-band-final-mobile-390.png`
