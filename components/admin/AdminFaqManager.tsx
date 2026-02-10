'use client'

import { useCallback, useEffect, useState } from 'react'
import { HelpCircle, Save, PlusCircle, RefreshCw, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import { addCsrfToBody, fetchCsrfToken } from '@/lib/csrfClient'

type FaqItem = {
  id: string
  sortOrder: number
  isActive: boolean
  questionEn: string
  answerEn: string
  questionAr: string | null
  answerAr: string | null
  questionRu: string | null
  answerRu: string | null
  createdAt: string
  updatedAt: string
}

type FormState = {
  questionEn: string
  answerEn: string
  questionAr: string
  answerAr: string
  questionRu: string
  answerRu: string
  isActive: boolean
}

const emptyForm: FormState = {
  questionEn: '',
  answerEn: '',
  questionAr: '',
  answerAr: '',
  questionRu: '',
  answerRu: '',
  isActive: true,
}

export default function AdminFaqManager({
  getAdminHeaders,
  showToast,
}: {
  getAdminHeaders: (additionalHeaders?: Record<string, string>) => HeadersInit
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void
}) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState<FaqItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [showNewForm, setShowNewForm] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/faq-items', { headers: getAdminHeaders() })
      const data = await res.json()
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items)
      } else {
        showToast(data.error || 'Failed to load FAQ items', 'error')
      }
    } catch (e: unknown) {
      showToast((e as Error)?.message || 'Failed to load FAQ items', 'error')
    } finally {
      setLoading(false)
    }
  }, [getAdminHeaders, showToast])

  useEffect(() => { load() }, [load])

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id)
    setExpandedId(item.id)
    setShowNewForm(false)
    setForm({
      questionEn: item.questionEn,
      answerEn: item.answerEn,
      questionAr: item.questionAr || '',
      answerAr: item.answerAr || '',
      questionRu: item.questionRu || '',
      answerRu: item.answerRu || '',
      isActive: item.isActive,
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSave = useCallback(async () => {
    if (!editingId) return
    const questionEn = form.questionEn.trim()
    const answerEn = form.answerEn.trim()
    if (!questionEn || !answerEn) {
      showToast('Question and Answer (EN) are required', 'warning')
      return
    }
    setSaving(true)
    try {
      await fetchCsrfToken()
      const payload = addCsrfToBody({
        questionEn,
        answerEn,
        questionAr: form.questionAr.trim() || null,
        answerAr: form.answerAr.trim() || null,
        questionRu: form.questionRu.trim() || null,
        answerRu: form.answerRu.trim() || null,
        isActive: form.isActive,
      })
      const res = await fetch(`/api/admin/faq-items/${editingId}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        showToast('FAQ item updated', 'success')
        setEditingId(null)
        setForm(emptyForm)
        await load()
      } else {
        showToast(data.error || 'Failed to update', 'error')
      }
    } catch (e: unknown) {
      showToast((e as Error)?.message || 'Failed to update', 'error')
    } finally {
      setSaving(false)
    }
  }, [editingId, form, getAdminHeaders, load, showToast])

  const handleCreate = useCallback(async () => {
    const questionEn = form.questionEn.trim()
    const answerEn = form.answerEn.trim()
    if (!questionEn || !answerEn) {
      showToast('Question and Answer (EN) are required', 'warning')
      return
    }
    setSaving(true)
    try {
      await fetchCsrfToken()
      const payload = addCsrfToBody({
        questionEn,
        answerEn,
        questionAr: form.questionAr.trim() || null,
        answerAr: form.answerAr.trim() || null,
        questionRu: form.questionRu.trim() || null,
        answerRu: form.answerRu.trim() || null,
        isActive: form.isActive,
      })
      const res = await fetch('/api/admin/faq-items', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        showToast('FAQ item created', 'success')
        setShowNewForm(false)
        setForm(emptyForm)
        await load()
      } else {
        showToast(data.error || 'Failed to create', 'error')
      }
    } catch (e: unknown) {
      showToast((e as Error)?.message || 'Failed to create', 'error')
    } finally {
      setSaving(false)
    }
  }, [form, getAdminHeaders, load, showToast])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return
    try {
      await fetchCsrfToken()
      const res = await fetch(`/api/admin/faq-items/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({})),
      })
      const data = await res.json()
      if (data.success) {
        showToast('FAQ item deleted', 'success')
        if (editingId === id) { setEditingId(null); setForm(emptyForm) }
        await load()
      } else {
        showToast(data.error || 'Failed to delete', 'error')
      }
    } catch (e: unknown) {
      showToast((e as Error)?.message || 'Failed to delete', 'error')
    }
  }, [editingId, getAdminHeaders, load, showToast])

  const handleToggleActive = useCallback(async (item: FaqItem) => {
    try {
      await fetchCsrfToken()
      const res = await fetch(`/api/admin/faq-items/${item.id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({ isActive: !item.isActive })),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`FAQ item ${!item.isActive ? 'activated' : 'deactivated'}`, 'success')
        await load()
      }
    } catch {
      showToast('Failed to toggle', 'error')
    }
  }, [getAdminHeaders, load, showToast])

  const handleMoveUp = useCallback(async (index: number) => {
    if (index === 0) return
    const current = items[index]
    const prev = items[index - 1]
    if (!current || !prev) return
    try {
      await fetchCsrfToken()
      await Promise.all([
        fetch(`/api/admin/faq-items/${current.id}`, {
          method: 'PUT', headers: getAdminHeaders(),
          body: JSON.stringify(addCsrfToBody({ sortOrder: prev.sortOrder })),
        }),
        fetch(`/api/admin/faq-items/${prev.id}`, {
          method: 'PUT', headers: getAdminHeaders(),
          body: JSON.stringify(addCsrfToBody({ sortOrder: current.sortOrder })),
        }),
      ])
      await load()
    } catch {
      showToast('Failed to reorder', 'error')
    }
  }, [items, getAdminHeaders, load, showToast])

  const handleMoveDown = useCallback(async (index: number) => {
    if (index >= items.length - 1) return
    const current = items[index]
    const next = items[index + 1]
    if (!current || !next) return
    try {
      await fetchCsrfToken()
      await Promise.all([
        fetch(`/api/admin/faq-items/${current.id}`, {
          method: 'PUT', headers: getAdminHeaders(),
          body: JSON.stringify(addCsrfToBody({ sortOrder: next.sortOrder })),
        }),
        fetch(`/api/admin/faq-items/${next.id}`, {
          method: 'PUT', headers: getAdminHeaders(),
          body: JSON.stringify(addCsrfToBody({ sortOrder: current.sortOrder })),
        }),
      ])
      await load()
    } catch {
      showToast('Failed to reorder', 'error')
    }
  }, [items, getAdminHeaders, load, showToast])

  const renderForm = (isNew: boolean) => (
    <div className="bg-gray-50 border rounded-xl p-4 sm:p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">{isNew ? 'New FAQ Item' : 'Edit FAQ Item'}</h3>

      {/* EN */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Question (EN) *</label>
        <input type="text" value={form.questionEn} onChange={e => setForm(p => ({ ...p, questionEn: e.target.value }))}
          placeholder="English question..." className="w-full rounded-lg border px-3 py-2 bg-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Answer (EN) *</label>
        <textarea value={form.answerEn} onChange={e => setForm(p => ({ ...p, answerEn: e.target.value }))}
          placeholder="English answer... (supports bullet lists with - prefix)" className="w-full rounded-lg border px-3 py-2 bg-white resize-none" rows={4} />
      </div>

      {/* AR */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Question (AR)</label>
        <input type="text" value={form.questionAr} onChange={e => setForm(p => ({ ...p, questionAr: e.target.value }))}
          placeholder="السؤال بالعربية..." className="w-full rounded-lg border px-3 py-2 bg-white" dir="rtl" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Answer (AR)</label>
        <textarea value={form.answerAr} onChange={e => setForm(p => ({ ...p, answerAr: e.target.value }))}
          placeholder="الإجابة بالعربية..." className="w-full rounded-lg border px-3 py-2 bg-white resize-none" rows={4} dir="rtl" />
      </div>

      {/* RU */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Question (RU)</label>
        <input type="text" value={form.questionRu} onChange={e => setForm(p => ({ ...p, questionRu: e.target.value }))}
          placeholder="Вопрос на русском..." className="w-full rounded-lg border px-3 py-2 bg-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Answer (RU)</label>
        <textarea value={form.answerRu} onChange={e => setForm(p => ({ ...p, answerRu: e.target.value }))}
          placeholder="Ответ на русском..." className="w-full rounded-lg border px-3 py-2 bg-white resize-none" rows={4} />
      </div>

      {/* Active toggle */}
      <label className="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
        <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4" />
        Active (visible to users)
      </label>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button onClick={isNew ? () => { setShowNewForm(false); setForm(emptyForm) } : handleCancelEdit}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm">Cancel</button>
        <button onClick={isNew ? handleCreate : handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 text-sm">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : isNew ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">FAQ Management</h2>
            <p className="text-sm text-gray-600">
              Manage frequently asked questions. Changes appear on the website and mobile app automatically.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => { setShowNewForm(true); setEditingId(null); setForm(emptyForm) }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700">
            <PlusCircle className="h-4 w-4" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* New item form */}
      {showNewForm && renderForm(true)}

      {/* Item list */}
      <div className="space-y-2 mt-4">
        {loading && items.length === 0 && (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        )}

        {items.map((item, index) => (
          <div key={item.id} className={`border rounded-xl overflow-hidden transition-colors ${item.isActive ? 'bg-white' : 'bg-gray-50 opacity-70'} ${editingId === item.id ? 'ring-2 ring-primary-300' : ''}`}>
            {/* Row header */}
            <div className="flex items-center gap-2 px-4 py-3">
              {/* Order controls */}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMoveUp(index)} disabled={index === 0}
                  className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowUp className="h-3 w-3 text-gray-500" />
                </button>
                <button onClick={() => handleMoveDown(index)} disabled={index >= items.length - 1}
                  className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowDown className="h-3 w-3 text-gray-500" />
                </button>
              </div>

              {/* Number badge */}
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                {index + 1}
              </span>

              {/* Question text */}
              <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex-1 text-left text-sm font-medium text-gray-900 truncate hover:text-primary-600">
                {item.questionEn}
              </button>

              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => handleToggleActive(item)} title={item.isActive ? 'Deactivate' : 'Activate'}
                  className={`p-1.5 rounded-md transition-colors ${item.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {item.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => handleEdit(item)} title="Edit"
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-xs font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} title="Delete"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
                  {expandedId === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Expanded view */}
            {expandedId === item.id && (
              <div className="border-t px-4 py-3">
                {editingId === item.id ? (
                  renderForm(false)
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 mb-1">Answer (EN)</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{item.answerEn}</div>
                    </div>
                    {item.questionAr && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">Question (AR)</div>
                        <div className="text-sm text-gray-700" dir="rtl">{item.questionAr}</div>
                        <div className="text-xs font-semibold text-gray-500 mb-1 mt-2">Answer (AR)</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap" dir="rtl">{item.answerAr}</div>
                      </div>
                    )}
                    {item.questionRu && (
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">Question (RU)</div>
                        <div className="text-sm text-gray-700">{item.questionRu}</div>
                        <div className="text-xs font-semibold text-gray-500 mb-1 mt-2">Answer (RU)</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{item.answerRu}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No FAQ items yet. Click &quot;Add FAQ&quot; to create one.
          </div>
        )}
      </div>

      {/* Count */}
      {items.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {items.length} FAQ items ({items.filter(i => i.isActive).length} active)
        </div>
      )}
    </div>
  )
}
