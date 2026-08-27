import { Cormorant_Garamond } from 'next/font/google'

/**
 * The house display serif. Self-hosted by next/font at build time.
 *
 * It started as one product page's face (CERABARRIER, product 66) and is now
 * the display face of the bespoke product pages, the brand pages and, since
 * Aug 2026, the homepage. The variable is still applied per page root, so a
 * route that does not opt in is unaffected.
 */
export const ceraSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-cera-serif',
  // Preloaded since the homepage adopted it. The face now sets the first
  // heading a visitor reads on the site's most-visited route, and without a
  // preload link that heading paints in the Georgia fallback and swaps a beat
  // later. The original reason to skip it - that only product 66 rendered the
  // face, while /products/[id] is shared by the whole catalog - no longer
  // holds now that most of the catalog has a bespoke page.
  preload: true,
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
})
