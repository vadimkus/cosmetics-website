import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/account/', '/checkout/', '/cart/'],
      },
    ],
    sitemap: 'https://genosys.ae/sitemap.xml',
  }
}
