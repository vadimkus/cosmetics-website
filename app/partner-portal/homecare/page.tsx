'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Check, ChevronDown, Clock, Copy, ExternalLink, Gift,
  Loader2, MessageCircle, Pencil, Plus, Search, Send, Trash2,
} from 'lucide-react'
import { PartnerGuard } from '@/components/partners/PartnerGuard'
import { useTranslation } from '@/hooks/useTranslation'
import { useWebShare } from '@/hooks/useWebShare'
import { classifyPartnerLine } from '@/lib/partnerCatalog'
import { fetchCsrfToken, getCsrfHeaders } from '@/lib/csrfClient'
import type { Product } from '@/types'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface ScriptItem {
  id: string
  productId: string
  size: string | null
  quantity: number
  product: Product
}

interface HomecareScript {
  id: string
  publicToken: string
  patientLabel: string | null
  status: string
  effectiveStatus: string
  expiresAt: string
  createdAt: string
  openCount: number
  versions: Array<{
    id: string
    versionNumber: number
    careInstructions: string | null
    items: ScriptItem[]
  }>
}

interface ScriptsResponse {
  scripts: HomecareScript[]
  points: {
    pending: number
    available: number
    transactions: Array<{
      id: string
      points: number
      type: string
      status: string
      description: string | null
      createdAt: string
    }>
  }
}

type SelectedLine = { productId: string; size: string | null; quantity: number }
const lineKey = (productId: string, size: string | null) => `${productId}::${size || ''}`

function HomecareScriptsInner() {
  const router = useRouter()
  const { locale, dir } = useTranslation()
  const { share, isSupported } = useWebShare()
  const [data, setData] = useState<ScriptsResponse | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [patientLabel, setPatientLabel] = useState('')
  const [careInstructions, setCareInstructions] = useState('')
  const [selected, setSelected] = useState<Record<string, SelectedLine>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const t = (en: string, ru: string, ar: string) => locale === 'ru' ? ru : locale === 'ar' ? ar : en
  const publicUrl = useCallback((token: string) =>
    `${typeof window === 'undefined' ? '' : window.location.origin}/r/${token}`, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [scriptsResponse, productsResponse] = await Promise.all([
        fetch('/api/partner/homecare-scripts', { cache: 'no-store' }),
        fetch('/api/products'),
      ])
      if (!scriptsResponse.ok) throw new Error('Unable to load Homecare Scripts.')
      const scriptsData = await scriptsResponse.json()
      const productsData = await productsResponse.json()
      const list: Product[] = Array.isArray(productsData) ? productsData : productsData?.data || []
      setData({ scripts: scriptsData.scripts || [], points: scriptsData.points })
      setProducts(list.filter(product =>
        product && product.inStock && !product.isHidden &&
        (
          classifyPartnerLine(product) === 'retail' ||
          (product.variants || []).some(variant =>
            variant.available && classifyPartnerLine(product, variant.size) === 'retail'
          )
        )
      ))
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCsrfToken().then(load)
  }, [load])

  const resetBuilder = () => {
    setPatientLabel('')
    setCareInstructions('')
    setSelected({})
    setEditingId(null)
    setShowBuilder(false)
    setError('')
  }

  const startEdit = (script: HomecareScript) => {
    const version = script.versions[0]
    const lines: Record<string, SelectedLine> = {}
    for (const item of version?.items || []) {
      lines[lineKey(item.productId, item.size)] = {
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
      }
    }
    setPatientLabel(script.patientLabel || '')
    setCareInstructions(version?.careInstructions || '')
    setSelected(lines)
    setEditingId(script.id)
    setShowBuilder(true)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLine = (productId: string, size: string | null) => {
    const key = lineKey(productId, size)
    setSelected(current => {
      const next = { ...current }
      if (next[key]) delete next[key]
      else next[key] = { productId, size, quantity: 1 }
      return next
    })
  }

  const save = async () => {
    if (Object.keys(selected).length === 0) {
      setError(t('Select at least one retail product.', 'Выберите хотя бы один розничный продукт.', 'اختر منتج تجزئة واحدًا على الأقل.'))
      return
    }
    setSaving(true)
    setError('')
    try {
      const endpoint = editingId
        ? `/api/partner/homecare-scripts/${editingId}`
        : '/api/partner/homecare-scripts'
      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: getCsrfHeaders(),
        body: JSON.stringify({
          patientLabel,
          careInstructions,
          items: Object.values(selected),
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to save.')
      setNotice(editingId
        ? t('Recommendation updated.', 'Рекомендация обновлена.', 'تم تحديث التوصية.')
        : t('Private recommendation link created.', 'Создана приватная ссылка рекомендации.', 'تم إنشاء رابط توصية خاص.'))
      resetBuilder()
      await load()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save.')
    } finally {
      setSaving(false)
    }
  }

  const revoke = async (script: HomecareScript) => {
    if (!window.confirm(t('Revoke this recommendation link?', 'Отозвать эту ссылку?', 'إلغاء رابط التوصية؟'))) return
    const response = await fetch(`/api/partner/homecare-scripts/${script.id}`, {
      method: 'DELETE',
      headers: getCsrfHeaders(),
    })
    if (!response.ok) {
      const result = await response.json()
      setError(result.error || 'Unable to revoke.')
      return
    }
    await load()
  }

  const shareScript = async (script: HomecareScript) => {
    const url = publicUrl(script.publicToken)
    const text = t(
      `Your GENOSYS homecare recommendation from our clinic is ready: ${url}`,
      `Ваша рекомендация GENOSYS от нашей клиники готова: ${url}`,
      `توصيتك المنزلية من GENOSYS جاهزة: ${url}`,
    )
    if (isSupported && await share({ title: 'GENOSYS Homecare', text, url })) return
    await navigator.clipboard.writeText(url)
    setNotice(t('Link copied.', 'Ссылка скопирована.', 'تم نسخ الرابط.'))
  }

  const whatsapp = (script: HomecareScript) => {
    const url = publicUrl(script.publicToken)
    const text = t(
      `Your GENOSYS homecare recommendation from our clinic is ready: ${url}`,
      `Ваша рекомендация GENOSYS от нашей клиники готова: ${url}`,
      `توصيتك المنزلية من GENOSYS جاهزة: ${url}`,
    )
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products
    return products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      String(product.productNumber || '').toLowerCase().includes(query)
    )
  }, [products, search])

  const selectionSummary = useMemo(() => {
    let count = 0
    let total = 0
    for (const line of Object.values(selected)) {
      const product = products.find(item => item.id === line.productId)
      if (!product) continue
      count += 1
      const qty = Math.max(1, Number(line.quantity) || 1)
      if (line.size) {
        const variant = (product.variants || []).find(item => item.size === line.size)
        total += (Number(variant?.price ?? product.price) || 0) * qty
      } else {
        total += (Number(product.price) || 0) * qty
      }
    }
    return { count, total }
  }, [selected, products])

  const formatAed = (amount: number) =>
    amount.toLocaleString(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  return (
    <main className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen bg-[var(--cera-cream-deep)] pb-24`} dir={dir}>
      <div className="bg-[var(--cera-ink)] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5">
          <button onClick={() => router.push('/partner-portal')} className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-[var(--cera-muted)] transition-all duration-200 hover:-translate-x-0.5 hover:bg-white/10 hover:text-white active:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]">
            <ArrowLeft className="w-4 h-4" /> {t('Partner portal', 'Портал партнёра', 'بوابة الشريك')}
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[var(--cera-rose)] uppercase">GENOSYS</p>
              <h1 className="cera-serif text-2xl sm:text-3xl mt-1">{t('Homecare Scripts', 'Домашние рекомендации', 'توصيات العناية المنزلية')}</h1>
              <p className="text-sm text-[var(--cera-muted)] mt-2 max-w-xl">
                {t('Select retail products, send a private link, and earn 5 Clinic Points per AED 100 of eligible patient purchases.', 'Выберите продукты, отправьте приватную ссылку и получайте 5 баллов за каждые 100 AED покупок пациента.', 'اختر المنتجات وأرسل رابطًا خاصًا واكسب 5 نقاط عيادة لكل 100 درهم من مشتريات المريض المؤهلة.')}
              </p>
            </div>
            <button onClick={() => { resetBuilder(); setShowBuilder(true) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cera-ink)] px-5 py-3 font-semibold shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-rose-ink)] hover:shadow-xl hover:shadow-red-600/30 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950">
              <Plus className="w-5 h-5" /> {t('New recommendation', 'Новая рекомендация', 'توصية جديدة')}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        {notice && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3 mb-5">
            <Check className="w-4 h-4" /> <span className="text-sm">{notice}</span>
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-[var(--cera-blush)] border border-[var(--cera-blush-deep)] text-[var(--cera-rose-ink)] px-4 py-3 mb-5 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="rounded-2xl bg-white border border-[var(--cera-line)] p-4 sm:p-5 shadow-sm">
            <Gift className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-[var(--cera-ink)]">{Number(data?.points.available || 0).toFixed(2)}</p>
            <p className="text-xs text-[var(--cera-muted)]">{t('Available Clinic Points', 'Доступные баллы клиники', 'نقاط العيادة المتاحة')}</p>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--cera-line)] p-4 sm:p-5 shadow-sm">
            <Clock className="w-5 h-5 text-amber-500 mb-2" />
            <p className="text-2xl font-bold text-[var(--cera-ink)]">{Number(data?.points.pending || 0).toFixed(2)}</p>
            <p className="text-xs text-[var(--cera-muted)]">{t('Pending (14-day hold)', 'Ожидают (14 дней)', 'معلقة (14 يومًا)')}</p>
          </div>
        </div>

        {data?.points.transactions?.length ? (
          <details className="rounded-2xl bg-white border border-[var(--cera-line)] shadow-sm mb-6 overflow-hidden">
            <summary className="cursor-pointer list-none flex items-center justify-between px-4 sm:px-5 py-4 font-semibold text-[var(--cera-ink)]">
              <span>{t('Clinic Points history', 'История баллов клиники', 'سجل نقاط العيادة')}</span>
              <ChevronDown className="w-4 h-4 text-[var(--cera-muted)]" />
            </summary>
            <div className="divide-y divide-[var(--cera-line)] border-t border-[var(--cera-line)]">
              {data.points.transactions.map(transaction => (
                <div key={transaction.id} className="flex items-start justify-between gap-4 px-4 sm:px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--cera-ink)]">
                      {transaction.description || transaction.type.replaceAll('_', ' ')}
                    </p>
                    <p className="text-xs text-[var(--cera-muted)]">
                      {new Date(transaction.createdAt).toLocaleDateString(locale)}
                      {' · '}
                      {transaction.status.toLowerCase()}
                    </p>
                  </div>
                  <span className={`shrink-0 text-sm font-bold ${transaction.points >= 0 ? 'text-green-700' : 'text-[var(--cera-rose-ink)]'}`}>
                    {transaction.points >= 0 ? '+' : ''}{Number(transaction.points).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        ) : null}

        {showBuilder && (
          <section className="rounded-2xl bg-white border border-[var(--cera-line)] shadow-sm p-4 sm:p-6 mb-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="cera-serif text-lg ">{editingId ? t('Update recommendation', 'Обновить рекомендацию', 'تحديث التوصية') : t('Create recommendation', 'Создать рекомендацию', 'إنشاء توصية')}</h2>
              <button onClick={resetBuilder} className="rounded-lg px-2.5 py-1.5 text-sm text-[var(--cera-muted)] transition-all duration-200 hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)]">{t('Cancel', 'Отмена', 'إلغاء')}</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <label className="block">
                <span className="text-sm font-medium text-[var(--cera-body)]">{t('Patient reference (optional)', 'Метка пациента (необязательно)', 'مرجع المريض (اختياري)')}</span>
                <input value={patientLabel} onChange={event => setPatientLabel(event.target.value)} maxLength={80} placeholder={t('e.g. Anna - July visit', 'напр. Анна - визит в июле', 'مثال: سارة - زيارة يوليو')} className="mt-1.5 w-full rounded-xl border border-[var(--cera-line)] px-4 py-3 outline-none focus:border-[var(--cera-rose)]" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[var(--cera-body)]">{t('Product-use notes (optional)', 'Инструкции по применению', 'ملاحظات استخدام المنتجات')}</span>
                <textarea value={careInstructions} onChange={event => setCareInstructions(event.target.value)} maxLength={1000} rows={3} placeholder={t('AM/PM order and usage instructions', 'Порядок и способ применения утром/вечером', 'ترتيب وتعليمات الاستخدام صباحًا ومساءً')} className="mt-1.5 w-full rounded-xl border border-[var(--cera-line)] px-4 py-3 outline-none focus:border-[var(--cera-rose)] resize-none" />
              </label>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-[var(--cera-muted)]" />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('Search retail products', 'Поиск розничных продуктов', 'البحث عن منتجات التجزئة')} className="w-full rounded-xl border border-[var(--cera-line)] py-3 pl-10 pr-4 outline-none focus:border-[var(--cera-rose)]" />
            </div>
            <div className="max-h-[430px] overflow-y-auto divide-y divide-[var(--cera-line)] border border-[var(--cera-line)] rounded-xl">
              {filteredProducts.map(product => {
                const retailSizes = (product.variants || []).filter(variant =>
                  variant.available && variant.size && variant.size !== 'default' &&
                  classifyPartnerLine(product, variant.size) === 'retail'
                )
                const options = retailSizes.length > 0
                  ? retailSizes.map(variant => ({ size: variant.size, price: variant.price }))
                  : classifyPartnerLine(product) === 'retail'
                    ? [{ size: null, price: product.price }]
                    : []
                return options.map(option => {
                  const key = lineKey(product.id, option.size)
                  const active = Boolean(selected[key])
                  return (
                    <button key={key} onClick={() => toggleLine(product.id, option.size)} className={`w-full flex items-center gap-3 p-3 text-left transition-all duration-200 hover:bg-[var(--cera-cream-deep)] hover:pl-4 active:bg-[var(--cera-cream-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--cera-rose)] ${active ? 'bg-[var(--cera-blush)]/60 hover:bg-[var(--cera-blush)]' : ''}`}>
                      <Image src={product.image || '/images/genosys-logo-transparent.png'} alt="" width={52} height={52} className="w-13 h-13 object-cover rounded-lg bg-[var(--cera-cream-deep)]" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-[var(--cera-ink)] truncate">{product.name}</span>
                        <span className="block text-xs text-[var(--cera-muted)]">{option.size ? `${option.size} · ` : ''}{Number(option.price).toFixed(2)} AED</span>
                      </span>
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center ${active ? 'bg-[var(--cera-ink)] border-[var(--cera-rose)] text-white' : 'border-[var(--cera-line)]'}`}>
                        {active && <Check className="w-4 h-4" />}
                      </span>
                    </button>
                  )
                })
              })}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
              <div className="min-w-0">
                {selectionSummary.count === 0 ? (
                  <p className="text-sm text-[var(--cera-muted)]">
                    {t('No products selected', 'Продукты не выбраны', 'لم يتم اختيار منتجات')}
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-[var(--cera-muted)]">
                      {selectionSummary.count}{' '}
                      {t('products selected', 'продуктов выбрано', 'منتجات مختارة')}
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-[var(--cera-ink)] tabular-nums">
                      {t('Patient total', 'Итого для пациента', 'إجمالي المريض')}{' '}
                      <span className="text-[var(--cera-rose-ink)]">{formatAed(selectionSummary.total)} AED</span>
                    </p>
                  </>
                )}
              </div>
              <button onClick={save} disabled={saving || selectionSummary.count === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cera-ink)] px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-ink)] hover:shadow-lg hover:shadow-red-600/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {editingId ? t('Save new version', 'Сохранить новую версию', 'حفظ نسخة جديدة') : t('Create private link', 'Создать приватную ссылку', 'إنشاء رابط خاص')}
              </button>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="cera-serif text-lg ">{t('Sent recommendations', 'Отправленные рекомендации', 'التوصيات المرسلة')}</h2>
            <span className="text-sm text-[var(--cera-muted)]">{data?.scripts.length || 0}</span>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[var(--cera-muted)]" /></div>
          ) : !data?.scripts.length ? (
            <div className="rounded-2xl bg-white border border-[var(--cera-line)] p-10 text-center text-[var(--cera-muted)]">
              <Send className="w-10 h-10 mx-auto mb-3 text-[var(--cera-blush-deep)]" />
              <p className="font-medium text-[var(--cera-ink)]">{t('No recommendations yet', 'Рекомендаций пока нет', 'لا توجد توصيات بعد')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.scripts.map(script => {
                const version = script.versions[0]
                const active = script.effectiveStatus === 'ACTIVE'
                return (
                  <article key={script.id} className="rounded-2xl bg-white border border-[var(--cera-line)] shadow-sm p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="cera-serif  text-[var(--cera-ink)]">{script.patientLabel || t('Patient recommendation', 'Рекомендация пациенту', 'توصية المريض')}</h3>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-green-50 text-green-700' : 'bg-[var(--cera-cream-deep)] text-[var(--cera-muted)]'}`}>
                            {script.effectiveStatus}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--cera-muted)] mt-1">{version?.items.length || 0} {t('products', 'продуктов', 'منتجات')} · {script.openCount} {t('opens', 'открытий', 'مرات فتح')}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-[var(--cera-blush-deep)]" />
                    </div>
                    <div className="flex -space-x-2 mt-4">
                      {(version?.items || []).slice(0, 5).map(item => (
                        <Image key={item.id} src={item.product.image || '/images/genosys-logo-transparent.png'} alt="" width={44} height={44} className="w-11 h-11 object-cover rounded-full border-2 border-white bg-[var(--cera-cream-deep)]" />
                      ))}
                    </div>
                    {active && (
                      <div className="grid grid-cols-2 sm:flex gap-2 mt-4 pt-4 border-t border-[var(--cera-line)]">
                        <button onClick={() => whatsapp(script)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2">
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                        <button onClick={() => shareScript(script)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cera-ink)] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-ink)] hover:shadow-lg hover:shadow-red-600/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2">
                          <Copy className="w-4 h-4" /> {t('Share', 'Поделиться', 'مشاركة')}
                        </button>
                        <a href={publicUrl(script.publicToken)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cera-cream-deep)] px-3 py-2.5 text-sm font-semibold text-[var(--cera-body)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)] hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2">
                          <ExternalLink className="w-4 h-4" /> {t('Preview', 'Просмотр', 'معاينة')}
                        </a>
                        <button onClick={() => startEdit(script)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cera-cream-deep)] px-3 py-2.5 text-sm font-semibold text-[var(--cera-body)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)] hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2">
                          <Pencil className="w-4 h-4" /> {t('Edit', 'Изменить', 'تعديل')}
                        </button>
                        <button onClick={() => revoke(script)} aria-label="Revoke" className="inline-flex items-center justify-center rounded-lg bg-[var(--cera-blush)] px-3 py-2.5 text-[var(--cera-rose-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-ink)] hover:text-white hover:shadow-lg hover:shadow-red-600/20 active:translate-y-0 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default function HomecareScriptsPage() {
  return <PartnerGuard><HomecareScriptsInner /></PartnerGuard>
}
