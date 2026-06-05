type StorageKind = 'localStorage' | 'sessionStorage'

function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === 'undefined') return null

  try {
    return window[kind]
  } catch {
    return null
  }
}

export function safeStorageGetItem(kind: StorageKind, key: string): string | null {
  try {
    return getStorage(kind)?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function safeStorageSetItem(kind: StorageKind, key: string, value: string): boolean {
  try {
    getStorage(kind)?.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function safeStorageRemoveItem(kind: StorageKind, key: string): void {
  try {
    getStorage(kind)?.removeItem(key)
  } catch {
    // Storage may be blocked by browser privacy settings.
  }
}

export function safeStorageClear(kind: StorageKind): void {
  try {
    getStorage(kind)?.clear()
  } catch {
    // Storage may be blocked by browser privacy settings.
  }
}

export const safeLocalStorageGetItem = (key: string): string | null =>
  safeStorageGetItem('localStorage', key)

export const safeLocalStorageSetItem = (key: string, value: string): boolean =>
  safeStorageSetItem('localStorage', key, value)

export const safeLocalStorageRemoveItem = (key: string): void =>
  safeStorageRemoveItem('localStorage', key)

export const safeLocalStorageClear = (): void => safeStorageClear('localStorage')

export const safeSessionStorageRemoveItem = (key: string): void =>
  safeStorageRemoveItem('sessionStorage', key)

export const safeSessionStorageClear = (): void => safeStorageClear('sessionStorage')

export function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof indexedDB !== 'undefined' && typeof indexedDB.open === 'function'
  } catch {
    return false
  }
}
