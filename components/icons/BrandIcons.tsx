/**
 * BrandIcons — a small set of custom, GENOSYS-specific pictograms.
 *
 * Why they exist: everywhere on the site we were using the stock Lucide
 * `BadgeCheck / Truck / ShieldCheck` glyphs, which ship on every Shopify
 * theme in the world. For the *trust strip* contexts (footer trust row,
 * Why GENOSYS 3-up, login brand panel) we want something the user
 * recognises as "ours".
 *
 * Design system
 * -------------
 *   - 24×24 artboard for drop-in compatibility with Lucide sizing
 *   - 1.6 px strokes, rounded caps + joins
 *   - stroke="currentColor" so the callers keep controlling tint with
 *     Tailwind `text-*` classes
 *   - no fills by default — these glyphs sit on already-tinted
 *     pastel circles, so the line art needs to remain crisp
 *   - each icon has a distinctive motif tied to GENOSYS:
 *       - serum bottle for "authentic product"
 *       - parcel + UAE-style pin for "free shipping"
 *       - card + padlock for "secure checkout"
 *       - rosette medal for "TDRA certified"
 *       - microscope for "clinical dermacosmetics"
 *       - stamp/ribbon seal for "official UAE distributor"
 *       - Seoul skyline + droplet for "made in Korea"
 *
 * Everything is plain inline SVG — no runtime dependency, no icon
 * font, fully tree-shakeable.
 */

import { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  /** Optional — pixel size, defaults to currentColor font-size via 1em. */
  size?: number | string
  /** Extra class overrides. */
  className?: string
}

function Base({
  children,
  size = 24,
  strokeWidth,
  className,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  // Default stroke locally so the prop type stays compatible with React.SVGProps
  // (which widens strokeWidth to `string | number | undefined`). Overriding it to
  // `number` in the intersection trips `exactOptionalPropertyTypes: true`.
  const sw = strokeWidth ?? 1.6
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* ─── Trust strip icons ─────────────────────────────────────────────── */

/**
 * Authentic — serum bottle silhouette with a small hallmark sparkle on the
 * neck. Reads "product you can trust" without defaulting to the ubiquitous
 * check-in-a-circle.
 */
export function IconAuthentic(props: IconProps) {
  return (
    <Base {...props}>
      {/* dropper cap */}
      <path d="M10 3h4" />
      <path d="M11 3v2.2" />
      <path d="M13 3v2.2" />
      {/* shoulder */}
      <path d="M9.6 5.2h4.8a1.2 1.2 0 0 1 1.2 1.2v1.1" />
      <path d="M14.4 5.2h-4.8a1.2 1.2 0 0 0-1.2 1.2v1.1" />
      {/* bottle body */}
      <path d="M8.4 7.5h7.2a1.4 1.4 0 0 1 1.4 1.4v10a1.6 1.6 0 0 1-1.6 1.6H8.6A1.6 1.6 0 0 1 7 18.9v-10A1.4 1.4 0 0 1 8.4 7.5Z" />
      {/* liquid line */}
      <path d="M7 14h10" />
      {/* hallmark sparkle on shoulder */}
      <path d="M17.5 5.2l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" />
    </Base>
  )
}

/**
 * Free shipping — a parcel with a routed dashed arc ending in a pin.
 * Clearly "delivery" but not the stock truck.
 */
export function IconShipping(props: IconProps) {
  return (
    <Base {...props}>
      {/* parcel */}
      <path d="M4 9.2l7.6-3.6a1 1 0 0 1 .8 0L20 9.2" />
      <path d="M4 9.2v8a1 1 0 0 0 .6.9l7 3.1a1 1 0 0 0 .8 0l7-3.1a1 1 0 0 0 .6-.9v-8" />
      <path d="M12 10.8V21" />
      <path d="M4 9.2l8 4 8-4" />
      {/* tape strip */}
      <path d="M8 7.3l8 3.5" />
      {/* route arc + pin */}
      <path d="M19.5 5c1.6 1.2 1.8 3.2.6 4.4" strokeDasharray="1.4 1.4" />
      <circle cx="20.2" cy="4.4" r="1.1" />
    </Base>
  )
}

/**
 * Secure checkout — credit card with an integrated padlock and a chip hint.
 * More specific than the stock shield.
 */
export function IconSecureCheckout(props: IconProps) {
  return (
    <Base {...props}>
      {/* card */}
      <rect x="2.5" y="6" width="15" height="11" rx="1.8" />
      <path d="M2.5 10h15" />
      {/* chip */}
      <rect x="5" y="12" width="3.2" height="2.2" rx="0.4" />
      {/* magstripe dots */}
      <path d="M11 13.2h4" />
      {/* padlock fob overlapping top-right */}
      <rect x="15.6" y="11" width="6" height="5.2" rx="1.2" />
      <path d="M17 11V9.6a1.6 1.6 0 0 1 3.2 0V11" />
    </Base>
  )
}

/**
 * TDRA certified — rosette medal with ribbons + a small star. Distinct from
 * the shield/check used everywhere else.
 */
export function IconCertified(props: IconProps) {
  return (
    <Base {...props}>
      {/* ribbons */}
      <path d="M9 13.5l-2.5 6 2.8-1 1.7 2.3 1.8-4.7" />
      <path d="M15 13.5l2.5 6-2.8-1-1.7 2.3-1.8-4.7" />
      {/* medal */}
      <circle cx="12" cy="9" r="5" />
      {/* star */}
      <path d="M12 6.2l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" />
    </Base>
  )
}

/* ─── Why GENOSYS (homepage 3-up) icons ─────────────────────────────── */

/**
 * Clinical dermacosmetics — microscope with a droplet on the slide.
 */
export function IconClinical(props: IconProps) {
  return (
    <Base {...props}>
      {/* arm + eyepiece */}
      <path d="M10 3h4l-.6 2h-2.8z" />
      <path d="M12 5v4" />
      <path d="M10.5 9h3" />
      {/* objective */}
      <path d="M11 9v3a1 1 0 0 0 1 1 1 1 0 0 0 1-1V9" />
      {/* stage arm */}
      <path d="M9.5 13.2l5 0" />
      <path d="M9 13.2l-2 5.8" />
      {/* base */}
      <path d="M5.5 20h13" />
      <path d="M8 19l-.8-1h9.6l-.8 1" />
      {/* slide droplet */}
      <path d="M16 15c.8 0 1.4.6 1.4 1.4 0 .6-.4 1.1-1 1.3" />
      <circle cx="16" cy="16.4" r="0.4" />
    </Base>
  )
}

/**
 * Official UAE distributor — wax stamp/seal with ribbons.
 */
export function IconOfficialDistributor(props: IconProps) {
  return (
    <Base {...props}>
      {/* seal body */}
      <circle cx="12" cy="10" r="5" />
      {/* inner ring */}
      <circle cx="12" cy="10" r="2.4" />
      {/* handle/imprint dash top */}
      <path d="M12 3v2" />
      {/* ribbon tails */}
      <path d="M8.5 14l-2 6 3-1 .8 2 2.5-5.2" />
      <path d="M15.5 14l2 6-3-1-.8 2-2.5-5.2" />
    </Base>
  )
}

/**
 * Heritage / since — calendar leaf with a sweep underline, used to signal
 * "trading since X" in trust rows.
 */
export function IconHeritage(props: IconProps) {
  return (
    <Base {...props}>
      {/* calendar body */}
      <rect x="4" y="6" width="16" height="13" rx="2" />
      {/* hanger ticks */}
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      {/* month divider */}
      <path d="M4 10h16" />
      {/* laurel sweep */}
      <path d="M8 15.4c1.6 1.4 3.6 1.6 5 .4" />
      <path d="M15 14.2c.6-.2 1.2-.6 1.6-1.2" />
    </Base>
  )
}

/**
 * Made in South Korea — stylised Seoul tower (geometric) + a small droplet
 * (Korean dermacosmetics / beauty cue).
 */
export function IconMadeInKorea(props: IconProps) {
  return (
    <Base {...props}>
      {/* tower spire */}
      <path d="M9 19l3-14 3 14" />
      {/* tower platform */}
      <path d="M8 15h8" />
      {/* guy wires */}
      <path d="M6 19l6-4 6 4" />
      {/* base line */}
      <path d="M4 20h16" />
      {/* droplet beside the tower */}
      <path d="M17.2 6c.8.9 1.4 1.8 1.4 2.6a1.4 1.4 0 1 1-2.8 0c0-.8.6-1.7 1.4-2.6z" />
    </Base>
  )
}
