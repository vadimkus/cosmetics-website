/**
 * Offline Storage Utilities
 * Handles local storage for offline functionality
 */

export interface OfflineCartItem {
  id: string
  productId: string
  quantity: number
  timestamp: number
}

export interface OfflineFavorite {
  productId: string
  timestamp: number
}

export interface OfflineAction {
  type: 'add_to_cart' | 'remove_from_cart' | 'add_favorite' | 'remove_favorite'
  data: any
  timestamp: number
  synced: boolean
}

class OfflineStorage {
  private readonly CART_KEY = 'genosys_offline_cart'
  private readonly FAVORITES_KEY = 'genosys_offline_favorites'
  private readonly ACTIONS_KEY = 'genosys_offline_actions'
  private readonly MAX_ACTIONS = 100

  // Cart operations
  addToOfflineCart(productId: string, quantity: number = 1): void {
    try {
      const cart = this.getOfflineCart()
      const existingItem = cart.find(item => item.productId === productId)
      
      if (existingItem) {
        existingItem.quantity += quantity
        existingItem.timestamp = Date.now()
      } else {
        cart.push({
          id: `offline_${Date.now()}_${Math.random()}`,
          productId,
          quantity,
          timestamp: Date.now()
        })
      }
      
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart))
      this.addOfflineAction('add_to_cart', { productId, quantity })
    } catch (error) {
      console.error('Failed to add to offline cart:', error)
    }
  }

  removeFromOfflineCart(productId: string): void {
    try {
      const cart = this.getOfflineCart()
      const filteredCart = cart.filter(item => item.productId !== productId)
      localStorage.setItem(this.CART_KEY, JSON.stringify(filteredCart))
      this.addOfflineAction('remove_from_cart', { productId })
    } catch (error) {
      console.error('Failed to remove from offline cart:', error)
    }
  }

  getOfflineCart(): OfflineCartItem[] {
    try {
      const cart = localStorage.getItem(this.CART_KEY)
      return cart ? JSON.parse(cart) : []
    } catch (error) {
      console.error('Failed to get offline cart:', error)
      return []
    }
  }

  clearOfflineCart(): void {
    try {
      localStorage.removeItem(this.CART_KEY)
    } catch (error) {
      console.error('Failed to clear offline cart:', error)
    }
  }

  // Favorites operations
  addToOfflineFavorites(productId: string): void {
    try {
      const favorites = this.getOfflineFavorites()
      if (!favorites.find(fav => fav.productId === productId)) {
        favorites.push({
          productId,
          timestamp: Date.now()
        })
        localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites))
        this.addOfflineAction('add_favorite', { productId })
      }
    } catch (error) {
      console.error('Failed to add to offline favorites:', error)
    }
  }

  removeFromOfflineFavorites(productId: string): void {
    try {
      const favorites = this.getOfflineFavorites()
      const filteredFavorites = favorites.filter(fav => fav.productId !== productId)
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(filteredFavorites))
      this.addOfflineAction('remove_favorite', { productId })
    } catch (error) {
      console.error('Failed to remove from offline favorites:', error)
    }
  }

  getOfflineFavorites(): OfflineFavorite[] {
    try {
      const favorites = localStorage.getItem(this.FAVORITES_KEY)
      return favorites ? JSON.parse(favorites) : []
    } catch (error) {
      console.error('Failed to get offline favorites:', error)
      return []
    }
  }

  isOfflineFavorite(productId: string): boolean {
    const favorites = this.getOfflineFavorites()
    return favorites.some(fav => fav.productId === productId)
  }

  clearOfflineFavorites(): void {
    try {
      localStorage.removeItem(this.FAVORITES_KEY)
    } catch (error) {
      console.error('Failed to clear offline favorites:', error)
    }
  }

  // Offline actions tracking
  private addOfflineAction(type: OfflineAction['type'], data: any): void {
    try {
      const actions = this.getOfflineActions()
      actions.push({
        type,
        data,
        timestamp: Date.now(),
        synced: false
      })
      
      // Keep only the most recent actions
      if (actions.length > this.MAX_ACTIONS) {
        actions.splice(0, actions.length - this.MAX_ACTIONS)
      }
      
      localStorage.setItem(this.ACTIONS_KEY, JSON.stringify(actions))
    } catch (error) {
      console.error('Failed to add offline action:', error)
    }
  }

  getOfflineActions(): OfflineAction[] {
    try {
      const actions = localStorage.getItem(this.ACTIONS_KEY)
      return actions ? JSON.parse(actions) : []
    } catch (error) {
      console.error('Failed to get offline actions:', error)
      return []
    }
  }

  markActionsAsSynced(actions: OfflineAction[]): void {
    try {
      const allActions = this.getOfflineActions()
      const syncedTimestamps = actions.map(action => action.timestamp)
      
      allActions.forEach(action => {
        if (syncedTimestamps.includes(action.timestamp)) {
          action.synced = true
        }
      })
      
      localStorage.setItem(this.ACTIONS_KEY, JSON.stringify(allActions))
    } catch (error) {
      console.error('Failed to mark actions as synced:', error)
    }
  }

  getUnsyncedActions(): OfflineAction[] {
    const actions = this.getOfflineActions()
    return actions.filter(action => !action.synced)
  }

  clearSyncedActions(): void {
    try {
      const actions = this.getOfflineActions()
      const unsyncedActions = actions.filter(action => !action.synced)
      localStorage.setItem(this.ACTIONS_KEY, JSON.stringify(unsyncedActions))
    } catch (error) {
      console.error('Failed to clear synced actions:', error)
    }
  }

  // Sync operations
  async syncWithServer(): Promise<boolean> {
    try {
      const unsyncedActions = this.getUnsyncedActions()
      
      if (unsyncedActions.length === 0) {
        return true
      }

      // Group actions by type
      const cartActions = unsyncedActions.filter(action => 
        action.type === 'add_to_cart' || action.type === 'remove_from_cart'
      )
      const favoriteActions = unsyncedActions.filter(action => 
        action.type === 'add_favorite' || action.type === 'remove_favorite'
      )

      // Sync cart actions
      if (cartActions.length > 0) {
        await this.syncCartActions(cartActions)
      }

      // Sync favorite actions
      if (favoriteActions.length > 0) {
        await this.syncFavoriteActions(favoriteActions)
      }

      // Mark actions as synced
      this.markActionsAsSynced(unsyncedActions)
      
      return true
    } catch (error) {
      console.error('Failed to sync with server:', error)
      return false
    }
  }

  private async syncCartActions(actions: OfflineAction[]): Promise<void> {
    // This would integrate with your cart API
    for (const action of actions) {
      if (action.type === 'add_to_cart') {
        // await fetch('/api/cart/add', { method: 'POST', body: JSON.stringify(action.data) })
      } else if (action.type === 'remove_from_cart') {
        // await fetch('/api/cart/remove', { method: 'POST', body: JSON.stringify(action.data) })
      }
    }
  }

  private async syncFavoriteActions(actions: OfflineAction[]): Promise<void> {
    // This would integrate with your favorites API
    for (const action of actions) {
      if (action.type === 'add_favorite') {
        // await fetch('/api/favorites/add', { method: 'POST', body: JSON.stringify(action.data) })
      } else if (action.type === 'remove_favorite') {
        // await fetch('/api/favorites/remove', { method: 'POST', body: JSON.stringify(action.data) })
      }
    }
  }

  // Storage info
  getStorageInfo(): { cart: number; favorites: number; actions: number } {
    return {
      cart: this.getOfflineCart().length,
      favorites: this.getOfflineFavorites().length,
      actions: this.getOfflineActions().length
    }
  }

  // Clear all offline data
  clearAllOfflineData(): void {
    this.clearOfflineCart()
    this.clearOfflineFavorites()
    try {
      localStorage.removeItem(this.ACTIONS_KEY)
    } catch (error) {
      console.error('Failed to clear offline actions:', error)
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorage()
