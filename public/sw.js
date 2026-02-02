/**
 * Service Worker for Genosys Cosmetics Website
 * Provides offline functionality and caching strategies
 */

const CACHE_NAME = 'genosys-cache-v0.1.0-0e7586d8'
const STATIC_CACHE = 'genosys-static-v0.1.0-0e7586d8'
const DYNAMIC_CACHE = 'genosys-dynamic-v0.1.0-0e7586d8'
const IMAGE_CACHE = 'genosys-images-v0.1.0-0e7586d8'
const PRODUCTS_CACHE = 'genosys-products-v0.1.0-0e7586d8'
const API_CACHE = 'genosys-api-v0.1.0-0e7586d8'
const PAGE_CACHE = 'genosys-pages-v0.1.0-0e7586d8'

// IndexedDB configuration for offline data storage
const DB_NAME = 'genosys-offline-db'
const DB_VERSION = 1
const CART_STORE = 'cart'
const FAVORITES_STORE = 'favorites'

// Assets to cache immediately (including offline page)
const STATIC_ASSETS = [
  '/',
  '/offline',  // Critical: offline fallback page
  '/products',
  '/about',
  '/contact',
  '/brand',
  '/genosys',
  '/training',
  '/delivery',
  '/favicon.ico',
  '/favicon/genosys-logo.png',
  '/images/genosys-logo.png',
  '/images/genosys-products.jpg',
  // Add critical CSS and JS files
]

// API routes to cache for offline product viewing
const PRODUCTS_API_ROUTES = [
  '/api/products',
]

// API routes to cache
const API_ROUTES = [
  '/api/products',
  '/api/auth/login',
  '/api/auth/register',
]

// Product catalog configuration
const PRODUCT_CACHE_CONFIG = {
  maxProducts: 50,           // Maximum number of products to cache
  maxProductImages: 100,     // Maximum number of product images to cache
  refreshInterval: 30 * 60 * 1000,  // Refresh every 30 minutes when online
}

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\/images\/.*\.(jpg|jpeg|png|webp|avif)$/i,
  /\/favicon\/.*\.(ico|png|svg)$/i,
]

// Storage quota management configuration
const QUOTA_WARNING_THRESHOLD = 0.8 // Warn at 80%
const QUOTA_CLEANUP_THRESHOLD = 0.9 // Auto-cleanup at 90%
const MAX_IMAGE_CACHE_SIZE = 100 // Maximum number of images to cache
const MAX_DYNAMIC_CACHE_SIZE = 50 // Maximum number of dynamic pages to cache

// Message event - handle skip waiting requests
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Skip waiting requested, activating new service worker...')
    self.skipWaiting()
  } else if (event.data && event.data.type === 'CHECK_QUOTA') {
    console.log('Quota check requested...')
    checkStorageQuota().then(status => {
      event.ports[0].postMessage(status)
    })
  } else if (event.data && event.data.type === 'CLEAR_OLD_CACHES') {
    console.log('Cache cleanup requested...')
    cleanupOldCaches().then(() => {
      event.ports[0].postMessage({ success: true })
    })
  }
})

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets...')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Static assets cached successfully')
        // Don't auto skip waiting - let user decide
        console.log('New service worker installed, waiting for activation...')
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error)
      })
  )
})

// Activate event - clean up old caches, check quota, and pre-cache products
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, PRODUCTS_CACHE, API_CACHE, PAGE_CACHE]
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (!currentCaches.includes(cacheName)) {
                console.log('Deleting old cache:', cacheName)
                return caches.delete(cacheName)
              }
            })
          )
        }),
      // Check storage quota
      checkStorageQuota(),
      // Pre-cache product catalog for offline viewing
      cacheProductCatalog()
    ])
    .then(() => {
      console.log('Service Worker activated')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request))
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// Check if request is for an image
function isImageRequest(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url)) ||
         request.destination === 'image'
}

// Check if request is for API
function isAPIRequest(request) {
  return request.url.includes('/api/')
}

// Check if request is for static asset
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/_next/static/') ||
         url.pathname.startsWith('/favicon/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.woff') ||
         url.pathname.endsWith('.woff2')
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    
    // Only cache full responses (200 status), not partial responses (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Image request failed:', error)
    return new Response('Image not available offline', { status: 404 })
  }
}

// Check if this is a products API request
function isProductsAPIRequest(request) {
  const url = new URL(request.url)
  return url.pathname === '/api/products' || url.pathname.startsWith('/api/products/')
}

// Handle API requests with appropriate caching strategy
async function handleAPIRequest(request) {
  // Use stale-while-revalidate for products API (better offline experience)
  if (isProductsAPIRequest(request)) {
    return handleProductsAPIRequest(request)
  }
  
  // Network-first for other API requests
  try {
    const networkResponse = await fetch(request)
    
    // Only cache full responses (200 status), not partial responses (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache for API request')
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline response for API
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This feature is not available offline' 
      }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle products API with stale-while-revalidate strategy
// This provides instant offline access while updating in background
async function handleProductsAPIRequest(request) {
  const cache = await caches.open(PRODUCTS_CACHE)
  const cachedResponse = await cache.match(request)
  
  // Create a promise for the network request
  const networkPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok && networkResponse.status === 200) {
        // Clone before caching
        const responseToCache = networkResponse.clone()
        await cache.put(request, responseToCache)
        console.log('✅ Products cache updated from network')
        
        // Also cache product images in the background
        try {
          const products = await networkResponse.clone().json()
          const productList = Array.isArray(products) ? products : (products.data || products.products || [])
          cacheProductImages(productList)
        } catch (e) {
          console.warn('Could not parse products for image caching:', e)
        }
      }
      return networkResponse
    })
    .catch((error) => {
      console.log('Network request failed for products:', error.message)
      return null
    })
  
  // If we have a cached response, return it immediately
  if (cachedResponse) {
    console.log('📦 Serving products from cache (stale-while-revalidate)')
    // Update cache in background (don't await)
    networkPromise.catch(() => {})
    return cachedResponse
  }
  
  // No cache, wait for network
  const networkResponse = await networkPromise
  if (networkResponse) {
    return networkResponse
  }
  
  // Both cache and network failed
  return new Response(
    JSON.stringify({ 
      error: 'Offline', 
      message: 'Products are not available offline. Please check your connection.',
      offline: true
    }),
    { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

// Handle static asset requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    
    // Only cache full responses (200 status), not partial responses (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Static asset request failed:', error)
    return new Response('Asset not available offline', { status: 404 })
  }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
  // For navigation requests (page refresh, direct URL access), always try network first
  // This ensures users always see the correct page on refresh
  const isNavigation = request.mode === 'navigate'
  
  try {
    const networkResponse = await fetch(request)
    
    // Only cache full responses (200 status), not partial responses (206)
    // Don't cache navigation requests - let browser handle history
    if (networkResponse.ok && networkResponse.status === 200 && !isNavigation) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache for page request')
    
    // For navigation, only use cache as last resort
    if (isNavigation) {
      const cache = await caches.open(DYNAMIC_CACHE)
      const cachedResponse = await cache.match(request)
      
      if (cachedResponse) {
        return cachedResponse
      }
      
      // Return offline page
      return caches.match('/offline')
    }
    
    // For non-navigation, try cache
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response('Page not available offline', { status: 404 })
  }
}

// ============================================================================
// PRODUCT CATALOG OFFLINE CACHING
// ============================================================================

/**
 * Pre-cache the product catalog for offline viewing
 * Called on service worker activation and periodically
 */
async function cacheProductCatalog() {
  console.log('🛍️ Pre-caching product catalog for offline viewing...')
  
  try {
    const cache = await caches.open(PRODUCTS_CACHE)
    
    // Fetch all products
    const response = await fetch('/api/products', {
      headers: { 'X-Cache-Warmup': 'true' }
    })
    
    if (!response.ok) {
      console.warn('Failed to fetch products for caching:', response.status)
      return false
    }
    
    // Cache the products API response
    await cache.put('/api/products', response.clone())
    
    // Parse products and cache their images
    const products = await response.json()
    const productList = Array.isArray(products) ? products : (products.data || products.products || [])
    
    console.log(`📦 Caching ${productList.length} products for offline viewing`)
    
    // Cache product images
    await cacheProductImages(productList)
    
    // Cache individual product pages (top products only to save space)
    const topProducts = productList.slice(0, PRODUCT_CACHE_CONFIG.maxProducts)
    const pageCache = await caches.open(PAGE_CACHE)
    
    for (const product of topProducts) {
      if (product.id) {
        try {
          const pageResponse = await fetch(`/products/${product.id}`, {
            headers: { 'X-Cache-Warmup': 'true' }
          })
          if (pageResponse.ok) {
            await pageCache.put(`/products/${product.id}`, pageResponse)
          }
        } catch (e) {
          // Skip individual failures silently
        }
      }
    }
    
    console.log('✅ Product catalog cached for offline viewing')
    return true
  } catch (error) {
    console.error('❌ Failed to cache product catalog:', error)
    return false
  }
}

/**
 * Cache product images for offline viewing
 * @param {Array} products - Array of product objects
 */
async function cacheProductImages(products) {
  if (!products || !Array.isArray(products)) return
  
  const imageCache = await caches.open(IMAGE_CACHE)
  const imagesToCache = []
  
  // Collect unique image URLs
  for (const product of products.slice(0, PRODUCT_CACHE_CONFIG.maxProductImages)) {
    if (product.image) {
      imagesToCache.push(product.image)
    }
    // Also cache additional images if available
    if (product.images && Array.isArray(product.images)) {
      product.images.slice(0, 3).forEach(img => {
        if (img && !imagesToCache.includes(img)) {
          imagesToCache.push(img)
        }
      })
    }
  }
  
  console.log(`🖼️ Caching ${imagesToCache.length} product images...`)
  
  // Cache images in parallel (with limit)
  const batchSize = 5
  for (let i = 0; i < imagesToCache.length; i += batchSize) {
    const batch = imagesToCache.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async (imageUrl) => {
        try {
          const cachedImage = await imageCache.match(imageUrl)
          if (!cachedImage) {
            const imageResponse = await fetch(imageUrl)
            if (imageResponse.ok) {
              await imageCache.put(imageUrl, imageResponse)
            }
          }
        } catch (e) {
          // Skip failed images silently
        }
      })
    )
  }
  
  console.log('✅ Product images cached')
}

/**
 * Refresh product cache when online
 * Called by message handler or periodic sync
 */
async function refreshProductCache() {
  console.log('🔄 Refreshing product cache...')
  
  try {
    const success = await cacheProductCatalog()
    
    // Notify clients about cache update
    if (success) {
      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach(client => {
        client.postMessage({
          type: 'PRODUCTS_CACHE_UPDATED',
          timestamp: Date.now()
        })
      })
    }
    
    return success
  } catch (error) {
    console.error('Failed to refresh product cache:', error)
    return false
  }
}

// Handle message for product cache operations
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REFRESH_PRODUCTS_CACHE') {
    console.log('Product cache refresh requested...')
    refreshProductCache().then(success => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success })
      }
    })
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData())
  } else if (event.tag === 'favorites-sync') {
    event.waitUntil(syncFavoritesData())
  } else if (event.tag === 'sync-queue') {
    event.waitUntil(processSyncQueue())
  } else if (event.tag === 'products-sync') {
    event.waitUntil(refreshProductCache())
  }
})

// Process the generic sync queue from IndexedDB
async function processSyncQueue() {
  console.log('📤 Processing background sync queue...')
  
  const SYNC_DB_NAME = 'genosys-sync-queue'
  const SYNC_STORE_NAME = 'pending-operations'
  
  try {
    // Open the sync database
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(SYNC_DB_NAME, 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
    
    // Get all pending operations
    const operations = await new Promise((resolve, reject) => {
      const transaction = db.transaction(SYNC_STORE_NAME, 'readonly')
      const store = transaction.objectStore(SYNC_STORE_NAME)
      const index = store.index('status')
      const request = index.getAll(IDBKeyRange.only('pending'))
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || [])
    })
    
    console.log(`Found ${operations.length} pending operations`)
    
    // Process each operation
    for (const op of operations) {
      try {
        const response = await fetch(op.url, {
          method: op.method,
          headers: {
            'Content-Type': 'application/json',
            'X-Background-Sync': 'true',
            ...op.headers
          },
          body: op.body,
          credentials: 'include'
        })
        
        if (response.ok) {
          // Remove successful operation
          const deleteTx = db.transaction(SYNC_STORE_NAME, 'readwrite')
          const deleteStore = deleteTx.objectStore(SYNC_STORE_NAME)
          deleteStore.delete(op.id)
          console.log(`✅ Sync completed: ${op.type}`)
          
          // Notify any open clients
          const clients = await self.clients.matchAll({ type: 'window' })
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_COMPLETE',
              operation: op
            })
          })
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        console.warn(`❌ Sync failed for ${op.type}:`, error.message)
        
        // Update retry count
        const updateTx = db.transaction(SYNC_STORE_NAME, 'readwrite')
        const updateStore = updateTx.objectStore(SYNC_STORE_NAME)
        const getReq = updateStore.get(op.id)
        getReq.onsuccess = () => {
          const operation = getReq.result
          if (operation) {
            operation.retryCount = (operation.retryCount || 0) + 1
            if (operation.retryCount >= (operation.maxRetries || 3)) {
              operation.status = 'failed'
              operation.error = error.message
            }
            updateStore.put(operation)
          }
        }
      }
    }
    
    db.close()
    console.log('📥 Background sync queue processing complete')
    
  } catch (error) {
    console.error('Failed to process sync queue:', error)
    throw error // Re-throw to trigger retry
  }
}

/**
 * Periodic Background Sync
 * 
 * This allows the PWA to periodically update content in the background,
 * even when the app is not open. Useful for:
 * - Pre-caching new products
 * - Updating prices
 * - Refreshing promotional content
 * 
 * Requires user permission and is subject to browser heuristics
 * (engagement level, network conditions, battery, etc.)
 */
self.addEventListener('periodicsync', (event) => {
  console.log('🔄 Periodic sync triggered:', event.tag)
  
  if (event.tag === 'content-sync') {
    event.waitUntil(periodicContentSync())
  } else if (event.tag === 'products-update') {
    event.waitUntil(updateProductsCache())
  }
})

/**
 * Periodic content sync - refreshes key pages and data
 */
async function periodicContentSync() {
  console.log('📥 Starting periodic content sync...')
  
  try {
    // Define critical pages to keep fresh
    const criticalPages = [
      '/',
      '/products',
      '/en',
      '/ar',
      '/ru',
    ]
    
    // Update page cache
    const pageCache = await caches.open(PAGE_CACHE)
    
    for (const page of criticalPages) {
      try {
        const response = await fetch(page, { 
          cache: 'no-store',
          headers: { 'X-Background-Sync': 'true' }
        })
        if (response.ok) {
          await pageCache.put(page, response)
          console.log(`✅ Updated cache for: ${page}`)
        }
      } catch (err) {
        console.warn(`⚠️ Failed to update ${page}:`, err.message)
      }
    }
    
    console.log('✅ Periodic content sync complete')
    return true
  } catch (error) {
    console.error('❌ Periodic content sync failed:', error)
    return false
  }
}

/**
 * Update products cache with latest data
 */
async function updateProductsCache() {
  console.log('🛍️ Updating products cache...')
  
  try {
    // Fetch latest products
    const response = await fetch('/api/products?limit=20', {
      cache: 'no-store',
      headers: { 'X-Background-Sync': 'true' }
    })
    
    if (response.ok) {
      const apiCache = await caches.open(API_CACHE)
      await apiCache.put('/api/products?limit=20', response.clone())
      
      // Also cache individual product pages
      const products = await response.json()
      const pageCache = await caches.open(PAGE_CACHE)
      
      // Pre-cache first 10 product pages
      const productsToCache = (products.data || products).slice(0, 10)
      
      for (const product of productsToCache) {
        if (product.id) {
          try {
            const productPage = await fetch(`/products/${product.id}`, {
              cache: 'no-store'
            })
            if (productPage.ok) {
              await pageCache.put(`/products/${product.id}`, productPage)
            }
          } catch (err) {
            // Skip individual failures
          }
        }
      }
      
      console.log('✅ Products cache updated')
      return true
    }
    
    return false
  } catch (error) {
    console.error('❌ Products cache update failed:', error)
    return false
  }
}

// Sync cart data when back online
async function syncCartData() {
  try {
    const cartData = await getStoredCartData()
    if (cartData && cartData.length > 0) {
      // Sync with server
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      })
      console.log('Cart data synced successfully')
    }
  } catch (error) {
    console.error('Failed to sync cart data:', error)
  }
}

// Sync favorites data when back online
async function syncFavoritesData() {
  try {
    const favoritesData = await getStoredFavoritesData()
    if (favoritesData && favoritesData.length > 0) {
      // Sync with server
      await fetch('/api/favorites/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favoritesData)
      })
      console.log('Favorites data synced successfully')
    }
  } catch (error) {
    console.error('Failed to sync favorites data:', error)
  }
}

// IndexedDB helper - open database connection
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => {
      console.error('Failed to open IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      resolve(request.result)
    }
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Create cart store if it doesn't exist
      if (!db.objectStoreNames.contains(CART_STORE)) {
        db.createObjectStore(CART_STORE, { keyPath: 'id' })
      }
      
      // Create favorites store if it doesn't exist
      if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
        db.createObjectStore(FAVORITES_STORE, { keyPath: 'id' })
      }
    }
  })
}

// Helper function to get data from IndexedDB store
async function getStoreData(storeName) {
  try {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      
      request.onerror = () => {
        console.error(`Failed to get ${storeName} data:`, request.error)
        reject(request.error)
      }
      
      request.onsuccess = () => {
        resolve(request.result || [])
      }
      
      transaction.oncomplete = () => {
        db.close()
      }
    })
  } catch (error) {
    console.error(`Error accessing ${storeName}:`, error)
    return []
  }
}

// Get cart data from IndexedDB (not localStorage - which is unavailable in SW)
async function getStoredCartData() {
  return getStoreData(CART_STORE)
}

// Get favorites data from IndexedDB (not localStorage - which is unavailable in SW)
async function getStoredFavoritesData() {
  return getStoreData(FAVORITES_STORE)
}

// Push notification handling - Rich Notifications with Action Buttons
self.addEventListener('push', (event) => {
  console.log('📬 Push notification received:', event)
  
  let payload = {
    title: 'Genosys Cosmetics',
    body: 'New update available',
    url: '/profile/promo',
    icon: '/favicon/genosys-logo.png',
    badge: '/favicon/genosys-logo.png',
    image: null,
    notificationId: null,
    type: 'general',
    actions: null,
    data: null
  }
  
  // Try to parse JSON payload from server
  if (event.data) {
    try {
      const data = event.data.json()
      payload = {
        ...payload,
        ...data
      }
    } catch (e) {
      // Fallback to text if not JSON
      payload.body = event.data.text()
    }
  }

  // Build notification options
  const options = {
    body: payload.body,
    icon: payload.icon || '/favicon/genosys-logo.png',
    badge: payload.badge || '/favicon/genosys-logo.png',
    vibrate: getVibrationPattern(payload.type),
    tag: payload.notificationId || `genosys-${Date.now()}`,
    renotify: true,
    requireInteraction: shouldRequireInteraction(payload.type),
    silent: false,
    data: {
      url: payload.url || '/profile/promo',
      notificationId: payload.notificationId,
      type: payload.type,
      dateOfArrival: Date.now(),
      ...payload.data
    }
  }

  // Add image for rich notifications (promotional, product updates)
  if (payload.image) {
    options.image = payload.image
  }

  // Add action buttons based on notification type
  if (payload.actions && payload.actions.length > 0) {
    options.actions = payload.actions.map(action => ({
      action: action.action,
      title: action.title,
      icon: action.icon || '/favicon/genosys-logo.png'
    }))
  } else {
    // Default actions based on type
    options.actions = getDefaultActions(payload.type)
  }
  
  console.log('📬 Showing notification:', payload.title, options)
  
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(payload.title, options),
      updateBadge()
    ])
  )
})

// Get vibration pattern based on notification type
function getVibrationPattern(type) {
  const patterns = {
    'order-status': [100, 50, 100, 50, 100], // Three quick buzzes for important
    'promotion': [200, 100, 200], // Two longer buzzes
    'cart-reminder': [100, 50, 100], // Gentle reminder
    'price-drop': [150, 50, 150, 50, 150], // Exciting - three medium buzzes
    'back-in-stock': [200, 100, 200], // Good news - two buzzes
    'general': [100, 50, 100] // Default
  }
  return patterns[type] || patterns['general']
}

// Determine if notification should require interaction
function shouldRequireInteraction(type) {
  // Order status and cart reminders should stay until dismissed
  return ['order-status', 'cart-reminder'].includes(type)
}

// Get default action buttons based on notification type
function getDefaultActions(type) {
  const actionSets = {
    'promotion': [
      { action: 'view-offer', title: '🎁 View Offer' },
      { action: 'shop-now', title: '🛒 Shop Now' }
    ],
    'order-status': [
      { action: 'track-order', title: '📍 Track Order' },
      { action: 'view-details', title: '📋 View Details' }
    ],
    'cart-reminder': [
      { action: 'checkout', title: '✨ Complete Purchase' },
      { action: 'view-cart', title: '🛒 View Cart' }
    ],
    'price-drop': [
      { action: 'buy-now', title: '💰 Buy Now' },
      { action: 'view-product', title: '👁️ View Product' }
    ],
    'back-in-stock': [
      { action: 'add-to-cart', title: '🛒 Add to Cart' },
      { action: 'view-product', title: '👁️ View Product' }
    ],
    'general': [
      { action: 'view', title: '👁️ View' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ]
  }
  return actionSets[type] || actionSets['general']
}

// Update app badge count
async function updateBadge() {
  if ('setAppBadge' in navigator) {
    try {
      // Try to fetch unread count from server
      const response = await fetch('/api/push/mark-read', { 
        credentials: 'include' 
      })
      const data = await response.json()
      
      if (data.unreadCount > 0) {
        await navigator.setAppBadge(data.unreadCount)
      } else {
        await navigator.clearAppBadge()
      }
    } catch (e) {
      // Fallback: just set badge to 1 for new notification
      await navigator.setAppBadge(1)
    }
  }
}

// Notification click handling - with action button support
self.addEventListener('notificationclick', (event) => {
  console.log('📬 Notification clicked:', event.action || 'main', event)
  
  event.notification.close()
  
  const notificationData = event.notification.data || {}
  const action = event.action
  const notificationType = notificationData.type || 'general'
  
  // Handle dismiss action
  if (action === 'dismiss' || action === 'close') {
    console.log('Notification dismissed')
    return
  }
  
  // Determine target URL based on action and notification type
  let targetUrl = notificationData.url || '/profile/promo'
  
  // Map actions to URLs
  const actionUrls = {
    // Promotion actions
    'view-offer': '/profile/promo',
    'shop-now': '/products',
    
    // Order status actions
    'track-order': notificationData.orderId ? `/orders?track=${notificationData.orderId}` : '/orders',
    'view-details': notificationData.orderId ? `/orders` : '/orders',
    
    // Cart actions
    'checkout': '/checkout',
    'view-cart': '/cart',
    
    // Product actions
    'buy-now': notificationData.productId ? `/products/${notificationData.productId}` : '/products',
    'view-product': notificationData.productId ? `/products/${notificationData.productId}` : '/products',
    'add-to-cart': notificationData.productId ? `/products/${notificationData.productId}?action=add-to-cart` : '/products',
    
    // General actions
    'view': targetUrl
  }
  
  // Use action-specific URL if available
  if (action && actionUrls[action]) {
    targetUrl = actionUrls[action]
  }
  
  console.log('📬 Navigating to:', targetUrl)
  
  // Open the app to the target URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Post message to update badge count
            client.postMessage({
              type: 'NOTIFICATION_CLICKED',
              notificationId: notificationData.notificationId,
              action: action,
              targetUrl: targetUrl
            })
            client.navigate(targetUrl)
            return client.focus()
          }
        }
        // No existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl)
        }
      })
  )
})

// Handle notification close (user swiped away)
self.addEventListener('notificationclose', (event) => {
  console.log('📬 Notification closed/dismissed')
  // Could track analytics here
})

// ============================================================================
// STORAGE QUOTA MANAGEMENT
// ============================================================================

/**
 * Check storage quota and usage
 * @returns {Promise<Object>} Storage status information
 */
async function checkStorageQuota() {
  try {
    if (!navigator.storage || !navigator.storage.estimate) {
      console.warn('Storage API not supported')
      return {
        supported: false,
        usage: 0,
        quota: 0,
        percentUsed: 0,
        available: 0
      }
    }

    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage || 0
    const quota = estimate.quota || 0
    const percentUsed = quota > 0 ? (usage / quota) * 100 : 0
    const available = quota - usage

    const status = {
      supported: true,
      usage,
      quota,
      percentUsed,
      available,
      usageFormatted: formatBytes(usage),
      quotaFormatted: formatBytes(quota),
      availableFormatted: formatBytes(available)
    }

    console.log('Storage Quota Status:', {
      usage: status.usageFormatted,
      quota: status.quotaFormatted,
      percentUsed: `${percentUsed.toFixed(2)}%`,
      available: status.availableFormatted
    })

    // Check if we need to warn or cleanup
    if (percentUsed >= QUOTA_CLEANUP_THRESHOLD * 100) {
      console.warn(`⚠️ Storage quota critical (${percentUsed.toFixed(2)}%)! Triggering cleanup...`)
      await cleanupOldCaches()
    } else if (percentUsed >= QUOTA_WARNING_THRESHOLD * 100) {
      console.warn(`⚠️ Storage quota warning (${percentUsed.toFixed(2)}%)`)
    }

    return status
  } catch (error) {
    console.error('Failed to check storage quota:', error)
    return {
      supported: false,
      error: error.message
    }
  }
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Clean up old caches to free up space
 * @returns {Promise<void>}
 */
async function cleanupOldCaches() {
  try {
    console.log('🧹 Starting cache cleanup...')
    
    const cacheNames = await caches.keys()
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, PRODUCTS_CACHE, API_CACHE, PAGE_CACHE]
    
    // Delete old/unused caches
    let deletedCount = 0
    for (const cacheName of cacheNames) {
      if (!currentCaches.includes(cacheName)) {
        console.log(`Deleting old cache: ${cacheName}`)
        await caches.delete(cacheName)
        deletedCount++
      }
    }
    
    // Trim image cache if too large
    await trimCache(IMAGE_CACHE, MAX_IMAGE_CACHE_SIZE)
    
    // Trim dynamic cache if too large
    await trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE)
    
    // Trim products page cache if too large
    await trimCache(PAGE_CACHE, PRODUCT_CACHE_CONFIG.maxProducts)
    
    console.log(`✅ Cache cleanup complete. Deleted ${deletedCount} old caches.`)
    
    // Check quota again after cleanup
    const newStatus = await checkStorageQuota()
    console.log(`Storage after cleanup: ${newStatus.usageFormatted} / ${newStatus.quotaFormatted} (${newStatus.percentUsed.toFixed(2)}%)`)
    
  } catch (error) {
    console.error('Failed to cleanup caches:', error)
  }
}

/**
 * Trim cache to maximum size by removing oldest entries
 * @param {string} cacheName - Name of cache to trim
 * @param {number} maxSize - Maximum number of entries
 * @returns {Promise<void>}
 */
async function trimCache(cacheName, maxSize) {
  try {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    
    if (keys.length > maxSize) {
      console.log(`Trimming ${cacheName}: ${keys.length} → ${maxSize} entries`)
      
      // Sort by date (oldest first) - using URL as proxy for age
      // In production, you might want to store timestamps
      const keysToDelete = keys.slice(0, keys.length - maxSize)
      
      for (const key of keysToDelete) {
        await cache.delete(key)
      }
      
      console.log(`✅ Trimmed ${keysToDelete.length} entries from ${cacheName}`)
    }
  } catch (error) {
    console.error(`Failed to trim cache ${cacheName}:`, error)
  }
}

/**
 * Get detailed cache information
 * @returns {Promise<Array>} Array of cache info objects
 */
async function getCacheInfo() {
  try {
    const cacheNames = await caches.keys()
    const cacheInfo = []
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      
      cacheInfo.push({
        name: cacheName,
        size: keys.length,
        urls: keys.map(key => key.url)
      })
    }
    
    return cacheInfo
  } catch (error) {
    console.error('Failed to get cache info:', error)
    return []
  }
}

// Periodic quota check (every 5 minutes)
setInterval(() => {
  checkStorageQuota()
}, 5 * 60 * 1000)
