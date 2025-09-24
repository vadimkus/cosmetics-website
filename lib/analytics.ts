// Google Analytics 4 tracking utilities
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-50SH0F79YG', {
      page_path: url,
    });
  }
};

// Track product views
export const trackProductView = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'AED',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
      }]
    });
  }
};

// Track add to cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'AED',
      value: product.price * (product.quantity || 1),
      items: [{
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price,
        quantity: product.quantity || 1,
      }]
    });
  }
};

// Track purchase
export const trackPurchase = (order: {
  id: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'AED',
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      }))
    });
  }
};

// Track PDF downloads
export const trackPDFDownload = (filename: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      file_name: filename,
      file_type: 'pdf',
      event_category: 'engagement',
    });
  }
};

// Track user registration
export const trackRegistration = (method: string = 'email') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
      event_category: 'engagement',
    });
  }
};

// Track search queries
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      event_category: 'engagement',
    });
  }
};

// Track contact form submissions
export const trackContactForm = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_form_submit', {
      event_category: 'engagement',
    });
  }
};

// Server-side analytics functions for admin dashboard
import { prisma } from './prisma'

export const getAnalyticsData = async (days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const [
    totalPageViews,
    uniqueVisitors,
    totalOrders,
    totalRevenue,
    pdfDownloads
  ] = await Promise.all([
    prisma.pageView.count({
      where: { timestamp: { gte: startDate } }
    }),
    prisma.pageView.groupBy({
      by: ['ipAddress'],
      where: { timestamp: { gte: startDate } }
    }).then(result => result.length),
    prisma.order.count({
      where: { 
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      }
    }),
    prisma.order.aggregate({
      where: { 
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      _sum: { total: true }
    }),
    prisma.pDFDownload.count({
      where: { timestamp: { gte: startDate } }
    })
  ])

  return {
    totalPageViews,
    uniqueVisitors,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    pdfDownloads
  }
}

export const getRealTimeVisitors = async () => {
  const fiveMinutesAgo = new Date()
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5)
  
  const recentVisitors = await prisma.pageView.count({
    where: { timestamp: { gte: fiveMinutesAgo } }
  })
  
  return recentVisitors
}

export const getUserActivityTimeline = async (days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const timeline = await prisma.pageView.findMany({
    where: { timestamp: { gte: startDate } },
    select: {
      timestamp: true,
      page: true,
      userEmail: true,
      ipAddress: true,
      country: true,
      city: true
    },
    orderBy: { timestamp: 'desc' },
    take: 100
  })

  return timeline
}

export const getTopCountries = async (days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const countries = await prisma.pageView.groupBy({
    by: ['country'],
    where: {
      timestamp: { gte: startDate },
      country: { not: null }
    },
    _count: { country: true },
    orderBy: { _count: { country: 'desc' } },
    take: 10
  })

  return countries.map(c => ({
    country: c.country || 'Unknown',
    count: c._count.country
  }))
}

export const getTopCities = async (days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const cities = await prisma.pageView.groupBy({
    by: ['city'],
    where: {
      timestamp: { gte: startDate },
      city: { not: null }
    },
    _count: { city: true },
    orderBy: { _count: { city: 'desc' } },
    take: 10
  })

  return cities.map(c => ({
    city: c.city || 'Unknown',
    count: c._count.city
  }))
}

export const trackUserAction = async (data: {
  action: string;
  userEmail?: string;
  details?: string;
  userId?: string;
  metadata?: any;
}) => {
  // This function is for server-side tracking
  // For client-side tracking, use the gtag functions above
  console.log('User action tracked:', data)
  
  // You can add database logging here if needed
  // await prisma.userAction.create({
  //   data: {
  //     action: data.action,
  //     userEmail: data.userEmail,
  //     details: data.details,
  //     metadata: data.metadata
  //   }
  // })
}
