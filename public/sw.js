/**
 * Service Worker for Genosys Cosmetics Website
 * Provides offline functionality and caching strategies
 */

const CACHE_NAME = 'genosys-cache-v54'
const STATIC_CACHE = 'genosys-static-v54'
const DYNAMIC_CACHE = 'genosys-dynamic-v54'
const IMAGE_CACHE = 'genosys-images-v54'

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

// API routes to cache
const API_ROUTES = [
  '/api/products',
  '/api/auth/login',
  '/api/auth/register',
]

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

// Activate event - clean up old caches and check quota
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== STATIC_CACHE && 
                  cacheName !== DYNAMIC_CACHE && 
                  cacheName !== IMAGE_CACHE) {
                console.log('Deleting old cache:', cacheName)
                return caches.delete(cacheName)
              }
            })
          )
        }),
      // Check storage quota
      checkStorageQuota()
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

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
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
  try {
    const networkResponse = await fetch(request)
    
    // Only cache full responses (200 status), not partial responses (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache for page request')
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline')
    }
    
    return new Response('Page not available offline', { status: 404 })
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData())
  } else if (event.tag === 'favorites-sync') {
    event.waitUntil(syncFavoritesData())
  }
})

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

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/favicon/genosys-logo.png',
    badge: '/favicon/genosys-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Products',
        icon: '/favicon/genosys-logo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon/genosys-logo.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Genosys Cosmetics', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    )
  }
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
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE]
    
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
