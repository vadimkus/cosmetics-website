import { create } from 'zustand'
import { Product } from '@/types'

/**
 * Routine Step - Represents a category/step in a skincare routine
 */
export interface RoutineStep {
  id: string
  name: string
  required: boolean
  category: string
  description: string
  icon: string
}

/**
 * Bundle Item - A product added to the bundle with its assigned step
 */
export interface BundleItem {
  product: Product
  step: string
  addedAt: number
}

/**
 * Bundle Pricing - Calculated pricing with tiered discounts
 */
export interface BundlePricing {
  subtotal: number
  bundleDiscountPercent?: number
  discountPercent: number
  discountAmount: number
  total: number
  itemCount: number
  nextTierItems: number | null
  nextTierDiscount: number | null
  appliedDiscountType?: 'none' | 'bundle' | 'user' | 'black_friday' | 'mixed'
}

/**
 * Discount Tiers for Bundle Builder
 * More items = higher discount
 * Single source of truth for the builder UI (checkout revalidates via
 * lib/checkoutPricingGuards.getBundleDiscountTier).
 */
export const DISCOUNT_TIERS = [
  { minItems: 2, discount: 5 },
  { minItems: 3, discount: 10 },
  { minItems: 4, discount: 15 },
  { minItems: 5, discount: 20 },
]

export function getBundleDiscountForCount(count: number): number {
  let discount = 0
  for (const tier of DISCOUNT_TIERS) {
    if (count >= tier.minItems) discount = tier.discount
  }
  return discount
}

/**
 * Routine Steps - The steps in a skincare routine
 * Products are organized by these categories
 */
export const ROUTINE_STEPS: RoutineStep[] = [
  {
    id: 'cleanser',
    name: 'Cleanser',
    required: true,
    category: 'Cleanser',
    description: 'Start with a clean slate',
    icon: '🧴'
  },
  {
    id: 'peeling',
    name: 'Peeling',
    required: false,
    category: 'Peeling',
    description: 'Exfoliate for radiance',
    icon: '✨'
  },
  {
    id: 'toner',
    name: 'Toner/Mist',
    required: false,
    category: 'Toner/Mist',
    description: 'Balance and hydrate',
    icon: '💧'
  },
  {
    id: 'serum',
    name: 'Serum',
    required: true,
    category: 'Serum',
    description: 'Target your concerns',
    icon: '💎'
  },
  {
    id: 'cream',
    name: 'Cream',
    required: true,
    category: 'Cream',
    description: 'Lock in moisture',
    icon: '🤍'
  },
  {
    id: 'eye-care',
    name: 'Eye Care',
    required: false,
    category: 'Eye care',
    description: 'Protect delicate skin',
    icon: '👁️'
  },
  {
    id: 'mask',
    name: 'Mask',
    required: false,
    category: 'Mask',
    description: 'Weekly treatment',
    icon: '🧖'
  },
  {
    id: 'sun',
    name: 'Sun Protection',
    required: false,
    category: 'Sun',
    description: 'Shield from UV',
    icon: '☀️'
  },
]

/**
 * Bundle Store State
 */
interface BundleState {
  items: BundleItem[]
  currentStep: number
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, step: string) => void
  removeItem: (productId: string) => void
  clearBundle: () => void
  setCurrentStep: (step: number) => void
  setIsOpen: (isOpen: boolean) => void
  
  // Computed
  getItemForStep: (stepId: string) => BundleItem | undefined
  getItemsForStep: (stepId: string) => BundleItem[]
  getItemCountForStep: (stepId: string) => number
  hasItemForStep: (stepId: string) => boolean
  isStepComplete: (stepId: string) => boolean
  areRequiredStepsComplete: () => boolean
  canAddToCart: () => boolean
}

/**
 * Bundle Store - Zustand store for Bundle Builder state
 */
export const useBundleStore = create<BundleState>((set, get) => ({
  items: [],
  currentStep: 0,
  isOpen: false,
  
  addItem: (product: Product, step: string) => {
    const items = get().items
    
    // Check if this exact product is already in the bundle
    const existingProduct = items.find(item => item.product.id === product.id)
    
    if (existingProduct) {
      // Product already in bundle - remove it (toggle behavior)
      set({
        items: items.filter(item => item.product.id !== product.id)
      })
    } else {
      // Add new item - allow multiple products per step
      set({
        items: [...items, {
          product,
          step,
          addedAt: Date.now()
        }]
      })
    }
  },
  
  removeItem: (productId: string) => {
    set({
      items: get().items.filter(item => item.product.id !== productId)
    })
  },
  
  clearBundle: () => {
    set({ items: [], currentStep: 0 })
  },
  
  setCurrentStep: (step: number) => {
    set({ currentStep: step })
  },
  
  setIsOpen: (isOpen: boolean) => {
    set({ isOpen })
  },
  
  getItemForStep: (stepId: string) => {
    return get().items.find(item => item.step === stepId)
  },
  
  getItemsForStep: (stepId: string) => {
    return get().items.filter(item => item.step === stepId)
  },
  
  getItemCountForStep: (stepId: string) => {
    return get().items.filter(item => item.step === stepId).length
  },
  
  hasItemForStep: (stepId: string) => {
    return get().items.some(item => item.step === stepId)
  },
  
  isStepComplete: (stepId: string) => {
    const step = ROUTINE_STEPS.find(s => s.id === stepId)
    if (!step) return false
    
    // Optional steps are always "complete"
    if (!step.required) return true
    
    // Required steps need an item
    return get().hasItemForStep(stepId)
  },
  
  areRequiredStepsComplete: () => {
    const items = get().items
    const requiredSteps = ROUTINE_STEPS.filter(s => s.required)
    return requiredSteps.every(step => items.some(item => item.step === step.id))
  },
  
  canAddToCart: () => {
    const items = get().items
    // Need at least 2 items to get a discount
    return items.length >= 2
  },
}))
