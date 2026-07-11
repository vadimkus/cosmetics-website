'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, MessageCircle, Clock, AlertTriangle, CheckCircle, Package } from 'lucide-react'
import AdminLogin from '@/components/AdminLogin'
import { errorLog } from '@/lib/logger'

interface Clinic {
  id: string
  name: string
  phone: string | null
  discountType: string | null
  discountPercentage: number
  lastOrderNumber: string | null
  lastOrderDate: string | null
  lastOrderTotal: number | null
  daysSince: number | null
  state: 'overdue' | 'ok' | 'never'
  whatsappUrl: string | null
}

interface ReorderResponse {
  thresholdDays: number
  counts: { total: number; overdue: number; never: number; ok: number }
  clinics: Clinic[]
}

export default function AdminPartnersReorderPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(30)
  const [data, setData] = useState<ReorderResponse | null>(null)

  const fetchData = useCallback(async (d: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/partners/reorder-due?days=${d}`, { credentials: 'include' })
      if (res.status === 401) {
        setAuthed(false)
        return
      }
      if (res.ok) {
        setData(await res.json())
        setAuthed(true)
      }
    } catch (e) {
      errorLog('reorder fetch failed', e)
    } finally {
      setLoading(false)
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    // Try immediately; the httpOnly admin-session cookie decides access.
    if (typeof window !== 'undefined' && localStorage.getItem('admin_session')) {
      fetchData(days)
    } else {
      setChecking(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const d = await res.json()
      if (res.ok && d.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'admin_session',
            JSON.stringify({ email: d.user.email, name: d.user.name, authenticatedAt: new Date().toISOString() })
          )
        }
        await fetchData(days)
        return true
      }
      return false
    } catch (e) {
      errorLog('admin login failed', e)
      return false
    }
  }

  const changeDays = (d: number) => {
    setDays(d)
    fetchData(d)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-red-600" />
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const stateBadge = (c: Clinic) => {
    if (c.state === 'overdue')
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
          <AlertTriangle className="w-3.5 h-3.5" /> Overdue
        </span>
      )
    if (c.state === 'never')
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          <Clock className="w-3.5 h-3.5" /> No orders
        </span>
      )
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
        <CheckCircle className="w-3.5 h-3.5" /> OK
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-gray-900">Partner Reorder Reminders</h1>
          </div>
          <button
            onClick={() => fetchData(days)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Summary + threshold */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {data && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-red-600">{data.counts.overdue}</p>
                <p className="text-xs text-gray-500">Overdue</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-gray-700">{data.counts.never}</p>
                <p className="text-xs text-gray-500">No orders</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <p className="text-2xl font-bold text-green-600">{data.counts.ok}</p>
                <p className="text-xs text-gray-500">On track</p>
              </div>
            </>
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500">Overdue after</span>
            {[30, 45, 60].map(d => (
              <button
                key={d}
                onClick={() => changeDays(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${days === d ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading && !data ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {data?.clinics.map(c => (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">
                    {c.lastOrderDate
                      ? `Last: ${new Date(c.lastOrderDate).toLocaleDateString('en-GB')} · ${c.daysSince}d ago${c.lastOrderNumber ? ` · ${c.lastOrderNumber}` : ''}`
                      : 'No orders on record'}
                    {c.discountPercentage > 0 ? ` · ${Math.round(c.discountPercentage)}% price` : ''}
                  </p>
                </div>
                {stateBadge(c)}
                {c.whatsappUrl ? (
                  <a
                    href={c.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
                  >
                    <MessageCircle className="w-4 h-4" /> Remind
                  </a>
                ) : (
                  <span className="text-xs text-gray-400 px-3">No phone</span>
                )}
              </div>
            ))}
            {data && data.clinics.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-10">No partner clinics found.</p>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Based on orders placed through genosys.ae. Consignment-only clinics that order via WhatsApp may not appear until
          their first portal order.
        </p>
      </div>
    </div>
  )
}
