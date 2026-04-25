'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Offline Client Component
 * 
 * This component is designed to work completely offline with:
 * - All CSS styles inline (no external dependencies)
 * - All icons as inline SVGs (no icon library needed)
 * - Minimal JavaScript for online/offline detection
 * 
 * Total size: < 15KB (well under 50KB limit)
 */

// Inline SVG Icons (no external dependencies)
const WifiOffIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="80" 
    height="80" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ color: '#9ca3af', margin: '0 auto 1rem' }}
  >
    <line x1="2" y1="2" x2="22" y2="22"></line>
    <path d="M8.5 16.5a5 5 0 0 1 7 0"></path>
    <path d="M2 8.82a15 15 0 0 1 4.17-2.65"></path>
    <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"></path>
    <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"></path>
    <path d="M5 13a10 10 0 0 1 5.24-2.76"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
)

const WifiIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="64" 
    height="64" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ color: '#22c55e', margin: '0 auto 1rem' }}
  >
    <path d="M5 13a10 10 0 0 1 14 0"></path>
    <path d="M8.5 16.5a5 5 0 0 1 7 0"></path>
    <path d="M2 8.82a15 15 0 0 1 20 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
)

const RefreshIcon = ({ spinning }: { spinning?: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ 
      marginRight: '0.5rem',
      animation: spinning ? 'spin 1s linear infinite' : 'none'
    }}
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
)

const HomeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ marginRight: '0.5rem' }}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

const ShoppingBagIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ marginRight: '0.5rem' }}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
)

// Inline Styles (no Tailwind dependency needed)
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '1rem',
  } as React.CSSProperties,
  containerOnline: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '1rem',
  } as React.CSSProperties,
  content: {
    maxWidth: '28rem',
    margin: '0 auto',
    textAlign: 'center' as const,
    padding: '1.5rem',
  } as React.CSSProperties,
  header: {
    marginBottom: '2rem',
  } as React.CSSProperties,
  title: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '0.5rem',
    marginTop: 0,
  } as React.CSSProperties,
  description: {
    color: '#4b5563',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  } as React.CSSProperties,
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '1rem',
    textAlign: 'left' as const,
  } as React.CSSProperties,
  warningCard: {
    backgroundColor: '#fefce8',
    borderRadius: '0.5rem',
    padding: '1rem',
    border: '1px solid #fde047',
    marginBottom: '1rem',
    textAlign: 'left' as const,
  } as React.CSSProperties,
  cardTitle: {
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    marginTop: 0,
  } as React.CSSProperties,
  warningCardTitle: {
    fontWeight: 600,
    color: '#854d0e',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    marginTop: 0,
  } as React.CSSProperties,
  list: {
    fontSize: '0.875rem',
    color: '#4b5563',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  } as React.CSSProperties,
  warningList: {
    fontSize: '0.875rem',
    color: '#a16207',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  } as React.CSSProperties,
  listItem: {
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  buttonPrimary: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '0.75rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  buttonPrimaryDisabled: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#d1d5db',
    color: '#9ca3af',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'not-allowed',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  buttonSecondary: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '0.75rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  buttonOutline: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: '#374151',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 500,
    marginBottom: '0.75rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  retryText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '1rem',
  } as React.CSSProperties,
  footer: {
    marginTop: '2rem',
    fontSize: '0.75rem',
    color: '#6b7280',
  } as React.CSSProperties,
  footerText: {
    margin: '0.25rem 0',
  } as React.CSSProperties,
  logo: {
    width: '120px',
    height: 'auto',
    marginBottom: '1rem',
  } as React.CSSProperties,
}

// Keyframes for spin animation (injected into document)
const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`

export default function OfflineClient() {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Inject spin animation keyframes
    const styleEl = document.createElement('style')
    styleEl.textContent = spinKeyframes
    document.head.appendChild(styleEl)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Check initial online status
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.head.removeChild(styleEl)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    window.location.reload()
  }

  // Online state - redirect to home
  if (isOnline) {
    return (
      <div style={styles.containerOnline}>
        <div style={styles.content}>
          <WifiIcon />
          <h1 style={styles.title}>Back Online!</h1>
          <p style={styles.description}>
            You&apos;re connected to the internet again.
          </p>
          <Link href="/" style={styles.buttonPrimary}>
            <HomeIcon />
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  // Offline state
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          {/* Inline GENOSYS text logo */}
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            color: '#1f2937', 
            letterSpacing: '0.1em',
            marginBottom: '1rem'
          }}>
            GENOSYS
          </div>
          <WifiOffIcon />
          <h1 style={styles.title}>You&apos;re Offline</h1>
          <p style={styles.description}>
            It looks like you&apos;re not connected to the internet. 
            Don&apos;t worry, you can still browse some of our cached content.
          </p>
        </div>

        {/* Available Offline Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>✓ Available Offline</h3>
          <ul style={styles.list}>
            <li style={styles.listItem}>• Browse cached product pages</li>
            <li style={styles.listItem}>• View product images</li>
            <li style={styles.listItem}>• Read about our brand</li>
            <li style={styles.listItem}>• Contact information</li>
          </ul>
        </div>

        {/* Limited Functionality Card */}
        <div style={styles.warningCard}>
          <h3 style={styles.warningCardTitle}>⚠ Limited Functionality</h3>
          <ul style={styles.warningList}>
            <li style={styles.listItem}>• Cannot place new orders</li>
            <li style={styles.listItem}>• Cannot login/register</li>
            <li style={styles.listItem}>• Cannot sync cart/favorites</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={handleRetry}
            disabled={retryCount >= 3}
            style={retryCount >= 3 ? styles.buttonPrimaryDisabled : styles.buttonPrimary}
          >
            <RefreshIcon spinning={retryCount >= 3} />
            {retryCount >= 3 ? 'Retrying...' : 'Try Again'}
          </button>

          <Link href="/products" style={styles.buttonSecondary}>
            <ShoppingBagIcon />
            Browse Cached Products
          </Link>

          <Link href="/" style={styles.buttonOutline}>
            <HomeIcon />
            Go to Homepage
          </Link>
        </div>

        {/* Retry Counter */}
        {retryCount > 0 && (
          <p style={styles.retryText}>
            Retry attempts: {retryCount}/3
          </p>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Genosys</p>
          <p style={styles.footerText}>Premium Korean Dermacosmetics</p>
          <p style={{ ...styles.footerText, marginTop: '0.5rem' }}>
            🇦🇪 UAE • 🇰🇷 Korea
          </p>
        </div>
      </div>
    </div>
  )
}
