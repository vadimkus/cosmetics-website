
import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  twitterCard?: 'summary' | 'summary_large_image'
  twitterSite?: string
  twitterCreator?: string
  noIndex?: boolean
  noFollow?: boolean
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/images/genosys-products.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@genosys_me',
  twitterCreator = '@genosys_me',
  noIndex = false,
  noFollow = false
}: SEOHeadProps) {
  const fullTitle = title.includes('GENOSYS') ? title : `${title} | GENOSYS Middle East FZ-LLC`
  const fullDescription = description.includes('GENOSYS') ? description : `${description} - GENOSYS Professional Korean Dermacosmetics`
  
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="GENOSYS Middle East FZ-LLC" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="GENOSYS Middle East FZ-LLC" />
      <meta name="theme-color" content="#dc2626" />
      <meta name="msapplication-TileColor" content="#dc2626" />
    </Head>
  )
}
