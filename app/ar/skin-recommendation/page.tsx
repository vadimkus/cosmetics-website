import { Metadata } from 'next'
import SkinRecommendationPage from '@/app/skin-recommendation/page'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'توصية البشرة المخصصة | GENOSYS Professional',
  description: 'اكتشف منتجات GENOSYS المثالية المصممة خصيصاً لاحتياجات بشرتك الفريدة. نظام التوصية المدعوم بالذكاء الاصطناعي لدينا يحلل ملف بشرتك لاقتراح أفضل منتجات العناية بالبشرة الكورية المهنية.',
  keywords: ['توصية البشرة', 'منتجات العناية بالبشرة', 'GENOSYS', 'العناية بالبشرة الكورية', 'منتجات مخصصة', 'تحليل البشرة', 'توصيات المنتجات'],
  openGraph: {
    title: 'توصية البشرة المخصصة | GENOSYS Professional',
    description: 'اكتشف منتجات GENOSYS المثالية المصممة خصيصاً لاحتياجات بشرتك الفريدة.',
    url: 'https://genosys.ae/ar/skin-recommendation',
    siteName: 'GENOSYS Professional',
    locale: 'ar_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'توصية البشرة المخصصة | GENOSYS Professional',
    description: 'اكتشف منتجات GENOSYS المثالية المصممة خصيصاً لاحتياجات بشرتك الفريدة.',
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/skin-recommendation',
    languages: {
      'en': 'https://genosys.ae/skin-recommendation',
      'ar': 'https://genosys.ae/ar/skin-recommendation',
    },
  },
}

export default function ArabicSkinRecommendationPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'توصية البشرة', url: '/ar/skin-recommendation' }
        ]}
      />
      <SkinRecommendationPage />
    </>
  )
}

