'use client'

import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ReactNode, useState, useEffect } from 'react'

// Stripe appearance configuration
const appearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#2563eb', // Blue primary color to match site
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorDanger: '#dc2626',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e5e7eb',
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input:focus': {
      border: '1px solid #2563eb',
      boxShadow: '0 0 0 1px #2563eb',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '8px',
    },
    '.Error': {
      fontSize: '14px',
      marginTop: '8px',
    },
  },
}

let stripePromise: Promise<Stripe | null> | null = null

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
      return null
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string
  locale?: string
}

export default function StripeProvider({ 
  children, 
  clientSecret,
  locale = 'en'
}: StripeProviderProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null)

  useEffect(() => {
    const loadStripeInstance = async () => {
      const stripeInstance = await getStripe()
      setStripe(stripeInstance)
    }
    loadStripeInstance()
  }, [])

  if (!stripe || !clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const options = {
    clientSecret,
    appearance,
    locale: (locale === 'ar' ? 'ar' : 'en') as 'ar' | 'en',
  }

  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  )
}
