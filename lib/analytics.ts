import { debugLog, errorLog } from '@/lib/logger'
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

// Server-side page view tracking for database
export const trackPageViewToDatabase = async (data: {
  page: string;
  ipAddress: string;
  country?: string;
  city?: string;
  userAgent: string;
  referrer?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  userEmail?: string;
}) => {
  try {
    const { prisma } = await import('./prisma');
    
    await prisma.pageView.create({
      data: {
        page: data.page,
        ipAddress: data.ipAddress,
        country: data.country || null,
        city: data.city || null,
        userAgent: data.userAgent,
        referrer: data.referrer || null,
        deviceType: data.deviceType || null,
        browser: data.browser || null,
        os: data.os || null,
        screenWidth: data.screenWidth || null,
        screenHeight: data.screenHeight || null,
        userEmail: data.userEmail || null,
        timestamp: new Date()
      }
    });
    
    debugLog('✅ Page view stored in database:', data.page);
  } catch (error) {
    errorLog('❌ Error storing page view:', error);
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

