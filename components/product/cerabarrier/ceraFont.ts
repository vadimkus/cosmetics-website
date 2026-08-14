import { Cormorant_Garamond } from 'next/font/google'

/**
 * Display serif used only on the CERABARRIER product page (product 66).
 * Self-hosted by next/font at build time — no extra network round trip and
 * no effect on any other route, since the variable is applied to that page's
 * root element only.
 */
export const ceraSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-cera-serif',
  // No <link rel="preload">: the /products/[id] route is shared by the whole
  // catalog, and only product 66 renders this face. Without preload the font
  // is fetched on demand, so other product pages pay nothing for it.
  preload: false,
  fallback: ['Iowan Old Style', 'Georgia', 'serif'],
})
