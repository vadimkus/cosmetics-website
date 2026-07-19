import type { Metadata } from 'next'
import HomecareRecommendationClient from './HomecareRecommendationClient'

export const metadata: Metadata = {
  title: 'Your GENOSYS Homecare Recommendation',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  referrer: 'no-referrer',
}

export default async function HomecareRecommendationPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <HomecareRecommendationClient token={token} />
}
