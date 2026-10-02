// Google Analytics 4 tracking utilities, mirrored to the Meta Pixel (lib/metaPixel.ts)
import { metaPageView, metaPurchaseEventId, metaTrack } from '@/lib/metaPixel'

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
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
  metaPageView();
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
  metaTrack('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    content_type: 'product',
    value: product.price,
    currency: 'AED',
  });
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
  metaTrack('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    contents: [{ id: product.id, quantity: product.quantity || 1, item_price: product.price }],
    value: product.price * (product.quantity || 1),
    currency: 'AED',
  });
};

// Track begin_checkout (user lands on the checkout page)
export const trackBeginCheckout = (cart: {
  value: number;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    price: number;
    quantity: number;
  }>;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'AED',
      value: cart.value,
      items: cart.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      }))
    });
  }
  metaTrack('InitiateCheckout', {
    content_ids: cart.items.map(item => item.id),
    content_type: 'product',
    contents: cart.items.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.price })),
    num_items: cart.items.reduce((n, item) => n + item.quantity, 0),
    value: cart.value,
    currency: 'AED',
  });
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
  metaTrack('Purchase', {
    content_ids: order.items.map(item => item.id),
    content_type: 'product',
    contents: order.items.map(item => ({ id: item.id, quantity: item.quantity, item_price: item.price })),
    num_items: order.items.reduce((n, item) => n + item.quantity, 0),
    value: order.total,
    currency: 'AED',
  }, metaPurchaseEventId(order.id));
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

// Track search queries (resultsCount surfaces zero-result searches in GA)
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      event_category: 'engagement',
      ...(typeof resultsCount === 'number' ? { results_count: resultsCount } : {}),
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
