'use client'

import { useUserRefresh } from './useUserRefresh'

export default function UserRefreshWrapper() {
  useUserRefresh()
  return null // This component doesn't render anything
}
