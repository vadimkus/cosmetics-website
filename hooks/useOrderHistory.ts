'use client'
import { errorLog } from '@/lib/logger'
import { User } from '@/types/user'

import { useState, useEffect, useCallback } from 'react'

interface OrderWithItems {
  id: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    productName: string
    productId: string
    quantity: number
    price: number
    selectedSize?: string
    selectedColor?: string
  }>
}

export function useOrderHistory(user: User | null) {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const fetchOrders = useCallback(async () => {
    if (!user) return
    
    setLoadingOrders(true)
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const ordersData = await response.json()
        setOrders(ordersData)
      }
    } catch (error) {
      errorLog('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }, [user])

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
      })
      
      if (response.ok) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        )
      }
    } catch (error) {
      errorLog('Error cancelling order:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loadingOrders,
    cancelOrder,
    refetchOrders: fetchOrders
  }
}
