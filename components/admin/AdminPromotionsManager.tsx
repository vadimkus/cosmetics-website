/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Megaphone, Save, PlusCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import { addCsrfToBody } from '@/lib/csrfClient'
import RichTextEditor from './RichTextEditor'

type Promotion = {
  id: string
  date: string
  textEn: string
  textRu?: string | null
  textAr?: string | null
  isActive: boolean
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

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/promotions', { headers: getAdminHeaders() })
      const body = await res.json()
      if (!res.ok || !body?.success) {
        showToast(body?.error || 'Failed to load promotions', 'error')
        return
      }
      setPromotions(Array.isArray(body.promotions) ? body.promotions : [])
    } catch (e: any) {
      showToast(e?.message || 'Failed to load promotions', 'error')
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders, showToast])

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
      const body = await res.json()
      if (!res.ok || !body?.success) {
        showToast(body?.error || 'Failed to save promotion', 'error')
        return
      }
      showToast('Promotion saved', 'success')
      await load()
    } catch (e: any) {
      showToast(e?.message || 'Failed to save promotion', 'error')
    } finally {
      setSaving(false)
    }
  }, [activePromotion, form, getAdminHeaders, load, showToast])

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
      const body = await res.json()
      if (!res.ok || !body?.success) {
        showToast(body?.error || 'Failed to create promotion', 'error')
        return
      }
      showToast('Promotion created', 'success')
      await load()
    } catch (e: any) {
      showToast(e?.message || 'Failed to create promotion', 'error')
    } finally {
      setSaving(false)
    }
  }, [form, getAdminHeaders, load, showToast])

  const hasAny = promotions.length > 0

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
    </div>
  )
}


