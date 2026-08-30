'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = toastIdCounter.current++
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm pointer-events-none"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in pointer-events-auto ${
              toast.type === 'success' ? 'bg-green-50/95 border border-[var(--cera-ok-line)]' :
              toast.type === 'error' ? 'bg-red-50/95 border border-red-200' :
              toast.type === 'warning' ? 'bg-yellow-50/95 border border-yellow-200' :
              'bg-blue-50/95 border border-blue-200'
            }`}
          >
            {toast.type === 'success' && <Check className="h-5 w-5 text-[var(--cera-ok)] flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />}
            
            <p className={`text-sm flex-1 ${
              toast.type === 'success' ? 'text-[var(--cera-ok)]' :
              toast.type === 'error' ? 'text-red-800' :
              toast.type === 'warning' ? 'text-yellow-800' :
              'text-blue-800'
            }`}>
              {toast.message}
            </p>
            
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}


