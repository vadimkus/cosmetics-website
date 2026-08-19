import type { Metadata } from 'next'

/**
 * Post-payment pages. `app/success` and `app/checkout/success` were already noindexed, but
 * this parallel `/pay` route was missed, so both its outcomes inherited the root layout's
 * `index: true` and could be crawled with the homepage title.
 *
 * `cancel/page.tsx` is a client component and could not carry its own metadata anyway, so
 * the directive lives here and covers both children.
 */
export const metadata: Metadata = {
  title: 'Payment - GENOSYS',
  description: 'Payment status for your GENOSYS order.',
  robots: { index: false, follow: false },
}

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return children
}
