'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { debugLog, errorLog, warnLog } from '@/lib/logger'

// IndexedDB configuration
const SYNC_DB_NAME = 'genosys-sync-queue'
const SYNC_DB_VERSION = 1
const SYNC_STORE_NAME = 'pending-operations'

export interface SyncOperation {
  id: string
  type: 'cart-add' | 'cart-remove' | 'cart-update' | 'favorite-toggle' | 'checkout' | 'profile-update' | 'order-status'
  url: string
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: string
  headers?: Record<string, string>
  timestamp: number
  retryCount: number
  maxRetries: number
  status: 'pending' | 'processing' | 'failed' | 'completed'
  error?: string
}

interface BackgroundSyncState {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
  lastSyncTime: number | null
  syncError: string | null
}

interface UseBackgroundSyncReturn extends BackgroundSyncState {
  queueOperation: (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>) => Promise<string>
  processQueue: () => Promise<void>
  clearQueue: () => Promise<void>
  getPendingOperations: () => Promise<SyncOperation[]>
  removeOperation: (id: string) => Promise<void>
}

// Open IndexedDB
function openSyncDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SYNC_DB_NAME, SYNC_DB_VERSION)

    request.onerror = () => {
      errorLog('Failed to open sync database:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(SYNC_STORE_NAME)) {
        const store = db.createObjectStore(SYNC_STORE_NAME, { keyPath: 'id' })
        store.createIndex('status', 'status', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
        store.createIndex('type', 'type', { unique: false })
      }
    }
  })
}

// Generate unique ID
function generateId(): string {
  return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function useBackgroundSync(): UseBackgroundSyncReturn {
  const [state, setState] = useState<BackgroundSyncState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingCount: 0,
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
  })

  const syncInProgressRef = useRef(false)
  const dbRef = useRef<IDBDatabase | null>(null)

  // Initialize database
  useEffect(() => {
    openSyncDB()
      .then((db) => {
        dbRef.current = db
        updatePendingCount()
      })
      .catch((error) => {
        errorLog('Failed to initialize sync database:', error)
      })

    return () => {
      if (dbRef.current) {
        dbRef.current.close()
      }
    }
  }, [])

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      debugLog('🌐 Back online! Processing sync queue...')
      setState((prev) => ({ ...prev, isOnline: true }))
      // Auto-process queue when back online
      processQueue()
    }

    const handleOffline = () => {
      debugLog('📴 Gone offline. Operations will be queued.')
      setState((prev) => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Update pending count
  const updatePendingCount = useCallback(async () => {
    try {
      const db = dbRef.current || (await openSyncDB())
      const transaction = db.transaction(SYNC_STORE_NAME, 'readonly')
      const store = transaction.objectStore(SYNC_STORE_NAME)
      const index = store.index('status')
      const request = index.count(IDBKeyRange.only('pending'))

      request.onsuccess = () => {
        setState((prev) => ({ ...prev, pendingCount: request.result }))
      }
    } catch (error) {
      errorLog('Failed to update pending count:', error)
    }
  }, [])

  // Queue a new operation
  const queueOperation = useCallback(
    async (
      operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>
    ): Promise<string> => {
      const id = generateId()
      const syncOperation: SyncOperation = {
        ...operation,
        id,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: operation.maxRetries || 3,
        status: 'pending',
      }

      try {
        const db = dbRef.current || (await openSyncDB())
        const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
        const store = transaction.objectStore(SYNC_STORE_NAME)

        await new Promise<void>((resolve, reject) => {
          const request = store.add(syncOperation)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })

        debugLog('📝 Queued operation:', syncOperation.type, id)
        await updatePendingCount()

        // Try to register background sync if supported
        if ('serviceWorker' in navigator && 'sync' in (navigator.serviceWorker as any)) {
          try {
            const registration = await navigator.serviceWorker.ready
            await (registration as any).sync.register('sync-queue')
            debugLog('📡 Background sync registered')
          } catch (err) {
            warnLog('Background sync registration failed:', err)
          }
        }

        // If online, try to process immediately
        if (navigator.onLine) {
          setTimeout(() => processQueue(), 100)
        }

        return id
      } catch (error) {
        errorLog('Failed to queue operation:', error)
        throw error
      }
    },
    [updatePendingCount]
  )

  // Process the sync queue
  const processQueue = useCallback(async () => {
    if (syncInProgressRef.current) {
      debugLog('Sync already in progress, skipping...')
      return
    }

    if (!navigator.onLine) {
      debugLog('Offline, cannot process queue')
      return
    }

    syncInProgressRef.current = true
    setState((prev) => ({ ...prev, isSyncing: true, syncError: null }))

    try {
      const db = dbRef.current || (await openSyncDB())
      const transaction = db.transaction(SYNC_STORE_NAME, 'readonly')
      const store = transaction.objectStore(SYNC_STORE_NAME)
      const index = store.index('status')

      const pendingOps = await new Promise<SyncOperation[]>((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only('pending'))
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })

      debugLog(`📤 Processing ${pendingOps.length} pending operations...`)

      for (const op of pendingOps) {
        await processOperation(op)
      }

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: Date.now(),
      }))
      await updatePendingCount()
    } catch (error) {
      errorLog('Failed to process sync queue:', error)
      setState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Sync failed',
      }))
    } finally {
      syncInProgressRef.current = false
    }
  }, [updatePendingCount])

  // Process a single operation
  const processOperation = async (operation: SyncOperation): Promise<void> => {
    debugLog(`🔄 Processing operation: ${operation.type} (${operation.id})`)

    try {
      // Update status to processing
      await updateOperationStatus(operation.id, 'processing')

      // Make the API request
      const response = await fetch(operation.url, {
        method: operation.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Background-Sync': 'true',
          ...operation.headers,
        },
        body: operation.body ?? null,
        credentials: 'include',
      })

      if (response.ok) {
        // Success - remove from queue
        await removeOperation(operation.id)
        debugLog(`✅ Operation completed: ${operation.type}`)

        // Notify the app of successful sync
        window.dispatchEvent(
          new CustomEvent('sync-operation-complete', {
            detail: { operation, success: true },
          })
        )
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      warnLog(`❌ Operation failed: ${operation.type}`, errorMessage)

      // Increment retry count
      const newRetryCount = operation.retryCount + 1

      if (newRetryCount >= operation.maxRetries) {
        // Max retries reached - mark as failed
        await updateOperationStatus(operation.id, 'failed', errorMessage)
        debugLog(`💀 Operation permanently failed after ${operation.maxRetries} retries`)

        window.dispatchEvent(
          new CustomEvent('sync-operation-failed', {
            detail: { operation, error: errorMessage },
          })
        )
      } else {
        // Update retry count and keep as pending
        await updateOperationRetry(operation.id, newRetryCount)
        debugLog(`🔁 Will retry (${newRetryCount}/${operation.maxRetries})`)
      }
    }
  }

  // Update operation status
  const updateOperationStatus = async (
    id: string,
    status: SyncOperation['status'],
    error?: string
  ): Promise<void> => {
    try {
      const db = dbRef.current || (await openSyncDB())
      const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
      const store = transaction.objectStore(SYNC_STORE_NAME)

      const request = store.get(id)
      request.onsuccess = () => {
        const op = request.result as SyncOperation
        if (op) {
          op.status = status
          if (error) op.error = error
          store.put(op)
        }
      }
    } catch (error) {
      errorLog('Failed to update operation status:', error)
    }
  }

  // Update operation retry count
  const updateOperationRetry = async (id: string, retryCount: number): Promise<void> => {
    try {
      const db = dbRef.current || (await openSyncDB())
      const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
      const store = transaction.objectStore(SYNC_STORE_NAME)

      const request = store.get(id)
      request.onsuccess = () => {
        const op = request.result as SyncOperation
        if (op) {
          op.retryCount = retryCount
          op.status = 'pending'
          store.put(op)
        }
      }
    } catch (error) {
      errorLog('Failed to update retry count:', error)
    }
  }

  // Remove an operation from the queue
  const removeOperation = useCallback(
    async (id: string): Promise<void> => {
      try {
        const db = dbRef.current || (await openSyncDB())
        const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
        const store = transaction.objectStore(SYNC_STORE_NAME)

        await new Promise<void>((resolve, reject) => {
          const request = store.delete(id)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })

        await updatePendingCount()
      } catch (error) {
        errorLog('Failed to remove operation:', error)
      }
    },
    [updatePendingCount]
  )

  // Get all pending operations
  const getPendingOperations = useCallback(async (): Promise<SyncOperation[]> => {
    try {
      const db = dbRef.current || (await openSyncDB())
      const transaction = db.transaction(SYNC_STORE_NAME, 'readonly')
      const store = transaction.objectStore(SYNC_STORE_NAME)

      return new Promise((resolve, reject) => {
        const request = store.getAll()
        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      errorLog('Failed to get pending operations:', error)
      return []
    }
  }, [])

  // Clear the entire queue
  const clearQueue = useCallback(async (): Promise<void> => {
    try {
      const db = dbRef.current || (await openSyncDB())
      const transaction = db.transaction(SYNC_STORE_NAME, 'readwrite')
      const store = transaction.objectStore(SYNC_STORE_NAME)

      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })

      await updatePendingCount()
      debugLog('🗑️ Sync queue cleared')
    } catch (error) {
      errorLog('Failed to clear queue:', error)
    }
  }, [updatePendingCount])

  return {
    ...state,
    queueOperation,
    processQueue,
    clearQueue,
    getPendingOperations,
    removeOperation,
  }
}

/**
 * Helper hook for using background sync with specific operation types
 */
export function useQueuedFetch() {
  const { queueOperation, isOnline, pendingCount } = useBackgroundSync()

  const queuedFetch = useCallback(
    async (
      url: string,
      options: {
        method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
        body?: object
        headers?: Record<string, string>
        type?: SyncOperation['type']
        maxRetries?: number
      } = {}
    ) => {
      const {
        method = 'POST',
        body,
        headers,
        type = 'profile-update',
        maxRetries = 3,
      } = options

      // If online, try direct fetch first
      if (isOnline) {
        try {
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: body ? JSON.stringify(body) : null,
            credentials: 'include',
          })

          if (response.ok) {
            return { success: true, queued: false, data: await response.json() }
          }
        } catch {
          // Network error - fall through to queue
        }
      }

      // Queue for later
      const operationData: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'> = {
        type,
        url,
        method,
        maxRetries,
      }
      if (body) {
        operationData.body = JSON.stringify(body)
      }
      if (headers) {
        operationData.headers = headers
      }
      const id = await queueOperation(operationData)

      return { success: false, queued: true, operationId: id }
    },
    [isOnline, queueOperation]
  )

  return { queuedFetch, isOnline, pendingCount }
}

