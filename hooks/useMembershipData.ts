'use client'

import { useEffect, useState } from 'react'

export type MembershipTier = 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM'

export interface MembershipData {
  success: boolean
  track: 'REWARDS' | 'PARTNER'
  memberNumber: string | null
  tier?: MembershipTier
  multiplier?: number
  points?: { balance: number; valueAed: number }
  tierProgress?: {
    currentSpent: number
    nextTier: MembershipTier | null
    nextTierAt: number
    progressPercent: number
  }
  stats?: { totalOrders: number; totalSpent: number }
  partner?: { discountType: string | null; discountPercentage: number | null }
}

let membershipCache: MembershipData | null = null
let membershipRequest: Promise<MembershipData | null> | null = null

function loadMembership() {
  if (membershipCache) return Promise.resolve(membershipCache)
  if (!membershipRequest) {
    membershipRequest = fetch('/api/user/membership', { credentials: 'include' })
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        membershipCache = json?.success ? json : null
        return membershipCache
      })
      .catch(() => null)
      .finally(() => {
        membershipRequest = null
      })
  }
  return membershipRequest
}

export function useMembershipData() {
  const [data, setData] = useState<MembershipData | null>(membershipCache)
  const [loading, setLoading] = useState(!membershipCache)

  useEffect(() => {
    let cancelled = false
    loadMembership().then(result => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading }
}
