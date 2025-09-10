'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useServiceWorker } from '@/hooks/useServiceWorker'

interface ServiceWorkerContextType {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  registration: ServiceWorkerRegistration | null
  error: string | null
  checkForUpdates: () => Promise<void>
  unregister: () => Promise<void>
  clearCaches: () => Promise<void>
  getCacheStatus: () => Promise<any[]>
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null)

interface ServiceWorkerProviderProps {
  children: ReactNode
}

export function ServiceWorkerProvider({ children }: ServiceWorkerProviderProps) {
  const serviceWorker = useServiceWorker()

  return (
    <ServiceWorkerContext.Provider value={serviceWorker}>
      {children}
    </ServiceWorkerContext.Provider>
  )
}

export function useServiceWorkerContext() {
  const context = useContext(ServiceWorkerContext)
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within a ServiceWorkerProvider')
  }
  return context
}

// Service Worker Status Component
export function ServiceWorkerStatus() {
  const { isSupported, isRegistered, isOnline, error } = useServiceWorkerContext()

  if (!isSupported) {
    return null // Don't show anything if not supported
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">You're offline</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">SW Error: {error}</span>
          </div>
        </div>
      )}
      
      {isRegistered && isOnline && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">App ready for offline use</span>
          </div>
        </div>
      )}
    </div>
  )
}
