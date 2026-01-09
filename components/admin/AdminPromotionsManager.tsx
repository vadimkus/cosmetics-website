'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Megaphone, Save, PlusCircle, RefreshCw, CheckCircle2, Bell, Send, Users, Eye, Trash2 } from 'lucide-react'
import { addCsrfToBody, fetchCsrfToken } from '@/lib/csrfClient'
import RichTextEditor from './RichTextEditor'

// Type for parsed JSON response
interface ParsedResponse {
  contentType: string
  raw: string
  json: ApiResponse | null
  isJson: boolean
}

// Generic API response type
interface ApiResponse {
  success?: boolean
  error?: string
  promotions?: Promotion[]
  notifications?: PWANotification[]
  subscribersCount?: number
  stats?: { success?: number }
  [key: string]: unknown
}

type Promotion = {
  id: string
  date: string
  textEn: string
  textRu?: string | null
  textAr?: string | null
  isActive: boolean
}

type PWANotification = {
  id: string
  title: string
  titleRu?: string | null
  titleAr?: string | null
  body: string
  bodyRu?: string | null
  bodyAr?: string | null
  url?: string | null
  sentAt: string
  totalSent: number
  readCount: number
}

export default function AdminPromotionsManager({
  getAdminHeaders,
  showToast,
}: {
  getAdminHeaders: (additionalHeaders?: Record<string, string>) => HeadersInit
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void
}) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const activePromotion = useMemo(() => promotions.find(p => p.isActive) || promotions[0] || null, [promotions])

  const [form, setForm] = useState({
    date: '',
    textEn: '',
    textRu: '',
    textAr: '',
    isActive: true,
  })

  // Push notification state
  const [pushLoading, setPushLoading] = useState(false)
  const [sendingPush, setSendingPush] = useState(false)
  const [notifications, setNotifications] = useState<PWANotification[]>([])
  const [pwaSubscribersCount, setPwaSubscribersCount] = useState(0)
  const [pushForm, setPushForm] = useState({
    title: '',
    titleRu: '',
    titleAr: '',
    body: '',
    bodyRu: '',
    bodyAr: '',
    url: '/profile/promo'
  })

  const parseJsonResponse = useCallback(async (res: Response): Promise<ParsedResponse> => {
    const contentType = res.headers.get('content-type') || ''
    const raw = await res.text().catch(() => '')
    let json: ApiResponse | null = null
    let isJson = false
    try {
      json = raw ? JSON.parse(raw) : null
      isJson = true
    } catch {
      isJson = false
    }
    return { contentType, raw, json, isJson }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/promotions', { headers: getAdminHeaders() })

      const parsed = await parseJsonResponse(res)
      if (!parsed.isJson) {
        console.error('Non-JSON response from /api/admin/promotions:', {
          status: res.status,
          statusText: res.statusText,
          contentType: parsed.contentType,
          preview: String(parsed.raw || '').substring(0, 200),
        })
        if (res.status === 404) {
          showToast('Promotions API endpoint not found. Please redeploy.', 'error')
        } else if (res.status === 401 || res.status === 403) {
          showToast('Authentication failed. Please log in again.', 'error')
        } else {
          showToast(`Server returned invalid response (${res.status}).`, 'error')
        }
        return
      }

      const body = parsed.json
      if (!res.ok || !body?.success) {
        showToast(body?.error || 'Failed to load promotions', 'error')
        return
      }
      setPromotions(Array.isArray(body.promotions) ? body.promotions : [])
    } catch (e: unknown) {
      const err = e as Error
      console.error('Error loading promotions:', err)
      showToast(err?.message || 'Failed to load promotions', 'error')
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders, parseJsonResponse, showToast])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!activePromotion) return
    setForm({
      date: activePromotion?.date ? new Date(activePromotion.date).toISOString().slice(0, 16) : '',
      textEn: activePromotion.textEn || '',
      textRu: activePromotion.textRu || '',
      textAr: activePromotion.textAr || '',
      isActive: !!activePromotion.isActive,
    })
  }, [activePromotion?.id])

  const handleSaveExisting = useCallback(async () => {
    if (!activePromotion) return
    const textEn = String(form.textEn || '').trim()
    if (!textEn) {
      showToast('English text is required', 'warning')
      return
    }
    setSaving(true)
    try {
      const payload = addCsrfToBody({
        date: form.date ? new Date(form.date).toISOString() : undefined,
        textEn,
        textRu: form.textRu?.trim() || null,
        textAr: form.textAr?.trim() || null,
        isActive: !!form.isActive,
      })
      const res = await fetch(`/api/admin/promotions/${activePromotion.id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      })

      const parsed = await parseJsonResponse(res)
      if (!parsed.isJson) {
        console.error('Non-JSON response from PUT /api/admin/promotions:', {
          status: res.status,
          statusText: res.statusText,
          contentType: parsed.contentType,
          preview: String(parsed.raw || '').substring(0, 200),
        })
        showToast('Server returned invalid response. Please check authentication.', 'error')
        return
      }

      const body = parsed.json
      if (!res.ok || !body?.success) {
        showToast(body?.error || 'Failed to save promotion', 'error')
        return
      }
      showToast('Promotion saved', 'success')
      await load()
    } catch (e: unknown) {
      const err = e as Error
      showToast(err?.message || 'Failed to save promotion', 'error')
    } finally {
      setSaving(false)
    }
  }, [activePromotion, form, getAdminHeaders, load, parseJsonResponse, showToast])

  const handleCreateNew = useCallback(async () => {
    const textEn = String(form.textEn || '').trim()
    if (!textEn) {
      showToast('English text is required', 'warning')
      return
    }
    setSaving(true)
    try {
      const payload = addCsrfToBody({
        date: form.date ? new Date(form.date).toISOString() : undefined,
        textEn,
        textRu: form.textRu?.trim() || null,
        textAr: form.textAr?.trim() || null,
        isActive: !!form.isActive,
      })
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      })

      const parsed = await parseJsonResponse(res)
      if (!parsed.isJson) {
        console.error('Non-JSON response from POST /api/admin/promotions:', {
          status: res.status,
          statusText: res.statusText,
          contentType: parsed.contentType,
          preview: String(parsed.raw || '').substring(0, 200),
        })
        showToast('Server returned invalid response. Please check authentication.', 'error')
        return
      }

      const body = parsed.json
      if (!res.ok || !body?.success) {
        showToast(body?.error || 'Failed to create promotion', 'error')
        return
      }
      showToast('Promotion created', 'success')
      await load()
    } catch (e: unknown) {
      const err = e as Error
      showToast(err?.message || 'Failed to create promotion', 'error')
    } finally {
      setSaving(false)
    }
  }, [form, getAdminHeaders, load, parseJsonResponse, showToast])

  const hasAny = promotions.length > 0

  // Load push notifications and subscriber count
  const loadNotifications = useCallback(async () => {
    setPushLoading(true)
    try {
      const res = await fetch('/api/push/send', { headers: getAdminHeaders() })
      const data = await res.json()
      if (data.success) {
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications)
        }
        if (typeof data.subscribersCount === 'number') {
          setPwaSubscribersCount(data.subscribersCount)
        }
      }
    } catch (e: unknown) {
      console.error('Error loading notifications:', e)
    } finally {
      setPushLoading(false)
    }
  }, [getAdminHeaders])

  // Load notifications on mount
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Send push notification
  const handleSendPush = useCallback(async () => {
    const title = String(pushForm.title || '').trim()
    const body = String(pushForm.body || '').trim()
    
    if (!title || !body) {
      showToast('Title and message body are required', 'warning')
      return
    }

    setSendingPush(true)
    try {
      // Ensure CSRF token is fresh before POST request
      await fetchCsrfToken()
      
      const payload = addCsrfToBody({
        title,
        titleRu: pushForm.titleRu?.trim() || null,
        titleAr: pushForm.titleAr?.trim() || null,
        body,
        bodyRu: pushForm.bodyRu?.trim() || null,
        bodyAr: pushForm.bodyAr?.trim() || null,
        url: pushForm.url?.trim() || '/profile/promo'
      })

      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to send notification', 'error')
        return
      }

      showToast(`Push sent to ${data.stats?.success || 0} PWA users!`, 'success')
      
      // Clear form and refresh list
      setPushForm({
        title: '',
        titleRu: '',
        titleAr: '',
        body: '',
        bodyRu: '',
        bodyAr: '',
        url: '/profile/promo'
      })
      await loadNotifications()
    } catch (e: unknown) {
      const err = e as Error
      showToast(err?.message || 'Failed to send notification', 'error')
    } finally {
      setSendingPush(false)
    }
  }, [pushForm, getAdminHeaders, loadNotifications, showToast])

  // Quick send from active promotion
  const handleQuickSendFromPromo = useCallback(() => {
    if (!activePromotion) return
    
    // Extract text content from HTML (simple approach)
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }
    
    setPushForm({
      title: 'Latest News & Offers',
      titleRu: 'Новости и предложения',
      titleAr: 'آخر الأخبار والعروض',
      body: stripHtml(activePromotion.textEn).substring(0, 200),
      bodyRu: activePromotion.textRu ? stripHtml(activePromotion.textRu).substring(0, 200) : '',
      bodyAr: activePromotion.textAr ? stripHtml(activePromotion.textAr).substring(0, 200) : '',
      url: '/profile/promo'
    })
    
    showToast('Form filled from active promotion. Review and send!', 'success')
  }, [activePromotion, showToast])

  // Delete push notification
  const handleDeleteNotification = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return
    
    try {
      // Ensure CSRF token is fresh before DELETE request
      await fetchCsrfToken()
      
      const payload = addCsrfToBody({})
      const res = await fetch(`/api/push/send/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
        credentials: 'include' // Ensure cookies are sent with the request
      })
      
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to delete notification', 'error')
        return
      }
      
      showToast('Notification deleted', 'success')
      await loadNotifications()
    } catch (e: unknown) {
      const err = e as Error
      showToast(err?.message || 'Failed to delete notification', 'error')
    }
  }, [getAdminHeaders, loadNotifications, showToast])

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Promotions</h2>
            <p className="text-sm text-gray-600">
              This message is shown to users in the mobile app and can be reused on the website.
            </p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-gray-50 border rounded-xl p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Date</label>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">Used for sorting and display.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Text (EN) * <span className="text-xs text-gray-500 font-normal">(Rich text with formatting)</span>
              </label>
              <RichTextEditor
                value={form.textEn}
                onChange={(value) => setForm((p) => ({ ...p, textEn: value }))}
                placeholder="English promotion message…"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Text (RU) <span className="text-xs text-gray-500 font-normal">(Rich text with formatting)</span>
              </label>
              <RichTextEditor
                value={form.textRu || ''}
                onChange={(value) => setForm((p) => ({ ...p, textRu: value }))}
                placeholder="Русский текст…"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Text (AR) <span className="text-xs text-gray-500 font-normal">(Rich text with formatting)</span>
              </label>
              <RichTextEditor
                value={form.textAr || ''}
                onChange={(value) => setForm((p) => ({ ...p, textAr: value }))}
                placeholder="النص العربي…"
                dir="rtl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="h-4 w-4"
              />
              Active (shown to users)
            </label>

            <div className="flex flex-wrap gap-2 justify-end">
              {hasAny && (
                <button
                  onClick={handleSaveExisting}
                  disabled={saving || !activePromotion}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              )}
              <button
                onClick={handleCreateNew}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <PlusCircle className="h-4 w-4" />
                Create New
              </button>
            </div>
          </div>

          {activePromotion?.isActive && (
            <div className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-semibold">Currently active</div>
                <div className="text-emerald-700/80">Users will see this promotion in the app.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PWA Push Notifications Section */}
      <div className="mt-10 pt-10 border-t border-gray-200">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">PWA Push Notifications</h2>
              <p className="text-sm text-gray-600">
                Send push notifications to all PWA users. They will see it on their device and in Announcements.
              </p>
              {/* Active PWA subscribers count - clickable */}
              <div className="flex items-center gap-2 mt-2">
                <a 
                  href="/admin/pwa-subscribers"
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{pwaSubscribersCount} active PWA {pwaSubscribersCount === 1 ? 'subscriber' : 'subscribers'}</span>
                  <span className="text-blue-500">→</span>
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={loadNotifications}
            disabled={pushLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${pushLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {/* Quick fill from promo button */}
            {activePromotion && (
              <button
                onClick={handleQuickSendFromPromo}
                className="self-start inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-colors"
              >
                <Megaphone className="h-4 w-4" />
                Fill from Active Promotion
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Title (EN) *</label>
                <input
                  type="text"
                  value={pushForm.title}
                  onChange={(e) => setPushForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Notification title..."
                  className="w-full rounded-lg border px-3 py-2 bg-white"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Title (RU)</label>
                <input
                  type="text"
                  value={pushForm.titleRu}
                  onChange={(e) => setPushForm(p => ({ ...p, titleRu: e.target.value }))}
                  placeholder="Заголовок..."
                  className="w-full rounded-lg border px-3 py-2 bg-white"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Title (AR)</label>
                <input
                  type="text"
                  value={pushForm.titleAr}
                  onChange={(e) => setPushForm(p => ({ ...p, titleAr: e.target.value }))}
                  placeholder="العنوان..."
                  className="w-full rounded-lg border px-3 py-2 bg-white"
                  dir="rtl"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Message (EN) *</label>
                <textarea
                  value={pushForm.body}
                  onChange={(e) => setPushForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Notification message..."
                  className="w-full rounded-lg border px-3 py-2 bg-white resize-none"
                  rows={3}
                  maxLength={300}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Message (RU)</label>
                <textarea
                  value={pushForm.bodyRu}
                  onChange={(e) => setPushForm(p => ({ ...p, bodyRu: e.target.value }))}
                  placeholder="Сообщение..."
                  className="w-full rounded-lg border px-3 py-2 bg-white resize-none"
                  rows={3}
                  maxLength={300}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Message (AR)</label>
                <textarea
                  value={pushForm.bodyAr}
                  onChange={(e) => setPushForm(p => ({ ...p, bodyAr: e.target.value }))}
                  placeholder="الرسالة..."
                  className="w-full rounded-lg border px-3 py-2 bg-white resize-none"
                  dir="rtl"
                  rows={3}
                  maxLength={300}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Click URL (optional)</label>
              <input
                type="text"
                value={pushForm.url}
                onChange={(e) => setPushForm(p => ({ ...p, url: e.target.value }))}
                placeholder="/profile/promo"
                className="w-full max-w-md rounded-lg border px-3 py-2 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">Where users go when they click the notification</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendPush}
                disabled={sendingPush || !pushForm.title.trim() || !pushForm.body.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
                {sendingPush ? 'Sending...' : 'Send Push Notification'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Notifications</h3>
            <div className="space-y-2">
              {notifications.slice(0, 10).map(n => (
                <div 
                  key={n.id} 
                  className="flex items-center justify-between bg-white border rounded-lg p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{n.title}</div>
                    <div className="text-sm text-gray-500 truncate">{n.body.substring(0, 80)}...</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.sentAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 text-sm">
                    <div className="flex items-center gap-1 text-blue-600" title="Sent to">
                      <Users className="h-4 w-4" />
                      <span>{n.totalSent}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600" title="Read by">
                      <Eye className="h-4 w-4" />
                      <span>{n.readCount}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(n.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


