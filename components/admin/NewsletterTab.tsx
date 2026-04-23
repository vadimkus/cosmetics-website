'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Mail, Download, RefreshCw, Plus, Trash2, Send, Eye, Loader2, Users, Globe,
  CheckCircle2, AlertCircle, Clock, FileText
} from 'lucide-react'
import { errorLog } from '@/lib/logger'

/**
 * Admin newsletter management tab.
 *
 * Scope:
 *  - Stats cards: total active, by locale
 *  - Composer: subject + markdown body + locale/source filter + test send + production send
 *  - Subscribers table: filter, search, add, remove, CSV export
 *  - Campaign history with live progress polling
 *
 * Auth: relies on parent passing `getAdminHeaders` (X-Admin-Email + CSRF).
 */

type Locale = 'en' | 'ar' | 'ru'

type Subscriber = {
  id: string
  email: string
  locale: string
  source: string
  isActive: boolean
  userId: string | null
  subscribedAt: string | null
  unsubscribedAt: string | null
  lastSentAt: string | null
  createdAt: string
}

type Stats = {
  totalActive: number
  totalInactive: number
  byLocale: Record<string, { active: number; inactive: number }>
}

type Campaign = {
  id: string
  subject: string
  bodyMarkdown?: string
  bodyHtml?: string
  localeFilter: string | null
  sourceFilter: string | null
  isTest: boolean
  testEmail: string | null
  totalRecipients: number
  sentCount: number
  failedCount: number
  status: 'draft' | 'sending' | 'sent' | 'failed' | 'cancelled'
  sentByEmail: string
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  errors?: string | null
}

interface NewsletterTabProps {
  getAdminHeaders: () => HeadersInit
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void
}

export default function NewsletterTab({ getAdminHeaders, showToast }: NewsletterTabProps) {
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<Stats>({
    totalActive: 0,
    totalInactive: 0,
    byLocale: { en: { active: 0, inactive: 0 }, ar: { active: 0, inactive: 0 }, ru: { active: 0, inactive: 0 } },
  })

  // Filters
  const [filterLocale, setFilterLocale] = useState<'all' | Locale>('all')
  const [filterActive, setFilterActive] = useState<'all' | 'true' | 'false'>('true')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Manual add
  const [addEmail, setAddEmail] = useState('')
  const [addLocale, setAddLocale] = useState<Locale>('en')
  const [adding, setAdding] = useState(false)

  // Composer
  const [subject, setSubject] = useState('')
  const [bodyMarkdown, setBodyMarkdown] = useState('')
  const [composerLocale, setComposerLocale] = useState<'all' | Locale>('all')
  const [composerSource, setComposerSource] = useState<'all' | 'homepage' | 'footer' | 'checkout' | 'admin'>('all')
  const [testEmail, setTestEmail] = useState('')
  const [sending, setSending] = useState<'idle' | 'test' | 'production'>('idle')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  // Campaign history
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search input — 300ms feels responsive without hammering the API.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const loadSubscribers = useCallback(async () => {
    setLoadingSubs(true)
    try {
      const params = new URLSearchParams()
      if (filterLocale !== 'all') params.set('locale', filterLocale)
      if (filterActive !== 'all') params.set('isActive', filterActive)
      if (debouncedSearch) params.set('search', debouncedSearch)
      params.set('limit', '200')

      const res = await fetch(`/api/admin/newsletter/subscribers?${params.toString()}`, {
        headers: getAdminHeaders(),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to load subscribers', 'error')
        return
      }
      setSubscribers(data.rows)
      setStats(data.stats)
    } catch (e) {
      errorLog('[NewsletterTab] loadSubscribers error:', e)
      showToast('Failed to load subscribers', 'error')
    } finally {
      setLoadingSubs(false)
    }
  }, [filterLocale, filterActive, debouncedSearch, getAdminHeaders, showToast])

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/newsletter/campaigns?limit=10', {
        headers: getAdminHeaders(),
      })
      const data = await res.json()
      if (!res.ok || !data.success) return
      setCampaigns(data.rows)
    } catch (e) {
      errorLog('[NewsletterTab] loadCampaigns error:', e)
    }
  }, [getAdminHeaders])

  // Initial load + reload on filter change
  useEffect(() => {
    loadSubscribers()
  }, [loadSubscribers])

  useEffect(() => {
    loadCampaigns()
  }, [loadCampaigns])

  // Poll active campaign every 2s while it's sending, stop once status !== 'sending'
  useEffect(() => {
    if (!activeCampaignId) return
    let cancelled = false

    const tick = async () => {
      try {
        const res = await fetch(`/api/admin/newsletter/campaigns/${activeCampaignId}`, {
          headers: getAdminHeaders(),
        })
        const data = await res.json()
        if (cancelled) return
        if (res.ok && data.success) {
          // Merge into campaigns list
          setCampaigns(prev => {
            const idx = prev.findIndex(c => c.id === data.campaign.id)
            if (idx === -1) return [data.campaign, ...prev]
            const next = prev.slice()
            next[idx] = { ...next[idx], ...data.campaign }
            return next
          })
          if (data.campaign.status !== 'sending') {
            setActiveCampaignId(null)
            showToast(
              data.campaign.status === 'sent'
                ? `Campaign delivered: ${data.campaign.sentCount} sent, ${data.campaign.failedCount} failed`
                : `Campaign ended with status: ${data.campaign.status}`,
              data.campaign.status === 'sent' ? 'success' : 'warning'
            )
            // Also refresh subscriber list so lastSentAt timestamps update
            loadSubscribers()
            return
          }
        }
      } catch (e) {
        errorLog('[NewsletterTab] poll error:', e)
      }
      if (!cancelled) pollRef.current = setTimeout(tick, 2000)
    }

    pollRef.current = setTimeout(tick, 2000)
    return () => {
      cancelled = true
      if (pollRef.current) clearTimeout(pollRef.current)
    }
  }, [activeCampaignId, getAdminHeaders, showToast, loadSubscribers])

  const handleAdd = async () => {
    if (!addEmail.trim()) return
    setAdding(true)
    try {
      const res = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ email: addEmail.trim(), locale: addLocale, source: 'admin' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to add subscriber', 'error')
        return
      }
      showToast(data.alreadySubscribed ? 'Already subscribed' : 'Subscriber added', 'success')
      setAddEmail('')
      loadSubscribers()
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (id: string, email: string) => {
    if (!confirm(`Unsubscribe ${email}?`)) return
    try {
      const res = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to unsubscribe', 'error')
        return
      }
      showToast(data.alreadyInactive ? 'Already inactive' : 'Subscriber unsubscribed', 'success')
      loadSubscribers()
    } catch (e) {
      errorLog('[NewsletterTab] remove error:', e)
      showToast('Failed to unsubscribe', 'error')
    }
  }

  const handleExport = () => {
    const params = new URLSearchParams()
    if (filterLocale !== 'all') params.set('locale', filterLocale)
    if (filterActive !== 'all') params.set('isActive', filterActive)
    // The export endpoint authenticates via the httpOnly `admin-session` cookie
    // set on admin login — window.open automatically sends cookies with GETs.
    const url = `/api/admin/newsletter/subscribers/export?${params.toString()}`
    window.open(url, '_blank', 'noopener')
  }

  const handleSendTest = async () => {
    if (!subject.trim() || !bodyMarkdown.trim() || !testEmail.trim()) {
      showToast('Fill subject, body, and test email before sending a test.', 'warning')
      return
    }
    setSending('test')
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          subject: subject.trim(),
          bodyMarkdown,
          localeFilter: composerLocale === 'all' ? null : composerLocale,
          sourceFilter: composerSource === 'all' ? null : composerSource,
          isTest: true,
          testEmail: testEmail.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Test send failed', 'error')
      } else {
        showToast(`Test sent to ${testEmail}`, 'success')
      }
      loadCampaigns()
    } catch (e) {
      errorLog('[NewsletterTab] test send error:', e)
      showToast('Test send failed', 'error')
    } finally {
      setSending('idle')
    }
  }

  const handleSendProduction = async () => {
    if (!subject.trim() || !bodyMarkdown.trim()) {
      showToast('Fill subject and body before sending.', 'warning')
      return
    }
    const expectedCount =
      composerLocale === 'all'
        ? stats.totalActive
        : stats.byLocale[composerLocale]?.active ?? 0
    const confirmMsg =
      `You're about to email ~${expectedCount} subscribers.\n\n` +
      `Locale: ${composerLocale === 'all' ? 'All locales' : composerLocale}\n` +
      `Source: ${composerSource === 'all' ? 'All sources' : composerSource}\n\n` +
      `This cannot be undone. Continue?`
    if (!confirm(confirmMsg)) return

    setSending('production')
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({
          subject: subject.trim(),
          bodyMarkdown,
          localeFilter: composerLocale === 'all' ? null : composerLocale,
          sourceFilter: composerSource === 'all' ? null : composerSource,
          isTest: false,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to start campaign', 'error')
        return
      }
      showToast(`Campaign started — sending to ${data.campaign.totalRecipients} subscribers`, 'success')
      setActiveCampaignId(data.campaign.id)
      setCampaigns(prev => [data.campaign, ...prev])
      // Clear composer so the admin doesn't accidentally re-send
      setSubject('')
      setBodyMarkdown('')
    } catch (e) {
      errorLog('[NewsletterTab] production send error:', e)
      showToast('Failed to start campaign', 'error')
    } finally {
      setSending('idle')
    }
  }

  const handlePreview = async () => {
    if (!bodyMarkdown.trim()) {
      showToast('Write something first.', 'warning')
      return
    }
    try {
      // Render on the server path so the preview matches what recipients will see.
      // We don't have a standalone "render" endpoint; piggyback on the MD renderer client-side.
      const rendered = await renderMarkdownClient(bodyMarkdown)
      setPreviewHtml(rendered)
      setPreviewOpen(true)
    } catch (e) {
      errorLog('[NewsletterTab] preview error:', e)
      showToast('Failed to generate preview', 'error')
    }
  }

  const recipientCount = useMemo(() => {
    if (composerLocale === 'all') return stats.totalActive
    return stats.byLocale[composerLocale]?.active ?? 0
  }, [composerLocale, stats])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Newsletter</h2>
              <p className="text-sm text-gray-500">Manage subscribers and send email campaigns.</p>
            </div>
          </div>
          <button
            onClick={() => {
              loadSubscribers()
              loadCampaigns()
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* Stats cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Users className="h-4 w-4" />} label="Active subscribers" value={stats.totalActive} tone="default" />
          <StatCard icon={<Globe className="h-4 w-4" />} label="English" value={stats.byLocale.en?.active ?? 0} tone="subtle" />
          <StatCard icon={<Globe className="h-4 w-4" />} label="Arabic" value={stats.byLocale.ar?.active ?? 0} tone="subtle" />
          <StatCard icon={<Globe className="h-4 w-4" />} label="Russian" value={stats.byLocale.ru?.active ?? 0} tone="subtle" />
        </div>
      </div>

      {/* Composer */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">Compose campaign</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. New launch: ND Cell Premium Cream"
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="mt-1 text-xs text-gray-500">{subject.length}/200</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Body (Markdown)</label>
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>
            <textarea
              value={bodyMarkdown}
              onChange={e => setBodyMarkdown(e.target.value)}
              rows={12}
              placeholder={`# Great skin starts here\n\nHey there,\n\nWe just launched our new **ND Cell Anti-Wrinkle Cream**. Here's why it matters:\n\n- Clinically tested in Korea\n- 15+ years of research\n- Official UAE distributor — [shop now](https://genosys.ae/products)\n\n> "Best cream I've used in years." — Dr Shadrina, UAE\n`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Supports: <code className="px-1 bg-gray-100 rounded">**bold**</code>,
              <code className="px-1 bg-gray-100 rounded">*italic*</code>,
              <code className="px-1 bg-gray-100 rounded"># headings</code>,
              <code className="px-1 bg-gray-100 rounded">[links](url)</code>,
              <code className="px-1 bg-gray-100 rounded">- lists</code>,
              <code className="px-1 bg-gray-100 rounded">&gt; quotes</code>.
              HTML is auto-escaped; images/scripts stripped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locale filter</label>
              <select
                value={composerLocale}
                onChange={e => setComposerLocale(e.target.value as 'all' | Locale)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All locales ({stats.totalActive})</option>
                <option value="en">English ({stats.byLocale.en?.active ?? 0})</option>
                <option value="ar">Arabic ({stats.byLocale.ar?.active ?? 0})</option>
                <option value="ru">Russian ({stats.byLocale.ru?.active ?? 0})</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source filter</label>
              <select
                value={composerSource}
                onChange={e => setComposerSource(e.target.value as typeof composerSource)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All sources</option>
                <option value="homepage">Homepage</option>
                <option value="footer">Footer</option>
                <option value="checkout">Checkout</option>
                <option value="admin">Admin-added</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                Recipients: <span className="font-semibold">{recipientCount}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Test email</label>
              <input
                type="email"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
                placeholder="your@email.com — always test before sending to everyone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSendTest}
                disabled={sending !== 'idle'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending === 'test' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send test
              </button>
              <button
                type="button"
                onClick={handleSendProduction}
                disabled={sending !== 'idle' || activeCampaignId !== null}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending === 'production' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send to {recipientCount}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign history */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <h3 className="text-base font-semibold text-gray-900">Recent campaigns</h3>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-sm text-gray-500 py-4">No campaigns yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Filters</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Progress</th>
                  <th className="py-2 pr-4">Sent by</th>
                  <th className="py-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-900 truncate max-w-[280px]" title={c.subject}>
                        {c.subject}
                      </div>
                      {c.isTest && c.testEmail && (
                        <div className="text-xs text-gray-500">Test → {c.testEmail}</div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600">
                      {c.localeFilter || 'all'}
                      {c.sourceFilter ? ` · ${c.sourceFilter}` : ''}
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                    <td className="py-3 pr-4 text-xs text-gray-700 whitespace-nowrap">
                      {c.sentCount}/{c.totalRecipients} sent
                      {c.failedCount > 0 && <span className="text-red-600"> · {c.failedCount} failed</span>}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600 truncate max-w-[160px]">{c.sentByEmail}</td>
                    <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subscribers table */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <h3 className="text-base font-semibold text-gray-900">Subscribers</h3>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        {/* Manual add row */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-2">
          <input
            type="email"
            value={addEmail}
            onChange={e => setAddEmail(e.target.value)}
            placeholder="Add subscriber email"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={addLocale}
            onChange={e => setAddLocale(e.target.value as Locale)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={adding || !addEmail.trim()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={filterLocale}
            onChange={e => setFilterLocale(e.target.value as 'all' | Locale)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All locales</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
          </select>
          <select
            value={filterActive}
            onChange={e => setFilterActive(e.target.value as 'all' | 'true' | 'false')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="true">Active only</option>
            <option value="false">Unsubscribed only</option>
            <option value="all">All</option>
          </select>
        </div>

        {loadingSubs ? (
          <div className="text-sm text-gray-500 py-6 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-sm text-gray-500 py-6">No subscribers match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Locale</th>
                  <th className="py-2 pr-4">Source</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Subscribed</th>
                  <th className="py-2 pr-4">Last sent</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-900 truncate max-w-[260px]" title={s.email}>
                        {s.email}
                      </div>
                      {s.userId && <div className="text-xs text-gray-500">linked to customer</div>}
                    </td>
                    <td className="py-3 pr-4 text-xs uppercase text-gray-700">{s.locale}</td>
                    <td className="py-3 pr-4 text-xs text-gray-600">{s.source}</td>
                    <td className="py-3 pr-4">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                          <AlertCircle className="h-3 w-3" /> Off
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600 whitespace-nowrap">
                      {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600 whitespace-nowrap">
                      {s.lastSentAt ? new Date(s.lastSentAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      {s.isActive && (
                        <button
                          onClick={() => handleRemove(s.id, s.email)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                          aria-label={`Unsubscribe ${s.email}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Unsubscribe
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="text-sm font-semibold text-gray-900 truncate">
                  Preview — <span className="text-gray-600 font-normal">{subject || '(no subject)'}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-900 px-2"
                aria-label="Close preview"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-white">
              {/* eslint-disable-next-line react/no-danger — bodyHtml is output of our sanitized markdown renderer, not user HTML */}
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              Preview uses the same renderer as production. Unsubscribe link + branded wrapper are added automatically before sending.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────── helpers ────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'default' | 'subtle'
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${tone === 'default' ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
    >
      <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${tone === 'default' ? 'text-gray-300' : 'text-gray-500'}`}>
        {icon} <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold">{value.toLocaleString()}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: Campaign['status'] }) {
  const map: Record<Campaign['status'], { label: string; cls: string }> = {
    draft: { label: 'Draft', cls: 'text-gray-700 bg-gray-100 border-gray-200' },
    sending: { label: 'Sending…', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
    sent: { label: 'Sent', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    failed: { label: 'Failed', cls: 'text-red-700 bg-red-50 border-red-200' },
    cancelled: { label: 'Cancelled', cls: 'text-gray-700 bg-gray-100 border-gray-200' },
  }
  const { label, cls } = map[status]
  return <span className={`inline-flex items-center text-xs border px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
}

/**
 * Client-side markdown renderer used only for preview.
 * Imports the same server helper dynamically so preview stays consistent with send output.
 */
async function renderMarkdownClient(md: string): Promise<string> {
  const mod = await import('@/lib/newsletterMarkdown')
  return mod.renderNewsletterMarkdown(md)
}
