'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle, Clock, PackageCheck, RefreshCw, Search, Send, ShoppingBag, Truck, UserRound, Users, X as XIcon } from 'lucide-react'
import { Order, OrderItem } from '@prisma/client'
import CustomerProfile from '@/components/CustomerProfile'
import OrderDetails from '@/components/admin/OrderDetails'
import StatusBadge from '@/components/shared/StatusBadge'
import { addCsrfToBody, fetchCsrfToken } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import type { User as CustomerUser } from '@/types/user'

type OrderWithItems = Order & {
  items: OrderItem[]
}

type MobileTab = 'orders' | 'users'

interface MobileUser extends CustomerUser {
  orderCount?: number
  totalSpent?: number
  lastOrderDate?: string | null
  lastActiveAt?: string | null
}

interface MobileOwnerAdminProps {
  adminName?: string | undefined
  orders: OrderWithItems[]
  users: MobileUser[]
  ordersLoading: boolean
  ordersRefreshing: boolean
  usersRefreshing: boolean
  userSearch: string
  setUserSearch: (search: string) => void
  onRefreshOrders: () => Promise<void>
  onRefreshUsers: () => Promise<void>
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>
  selectedCustomer: MobileUser | null
  onSelectCustomer: (user: MobileUser) => void
  onBackCustomer: () => void
  onUpdateCustomer: (id: string, updates: Partial<CustomerUser>) => Promise<void>
  onDeleteCustomer: (id: string, name: string) => Promise<void>
  getAdminHeaders: (additionalHeaders?: Record<string, string>) => HeadersInit
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void
  onLogout: () => void
  onMoySkladPushed: (orderId: string, moySkladOrderId: string) => void
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount)

const formatShortDate = (value: Date | string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-AE', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getOrderNumber = (order: OrderWithItems) => {
  const orderNumber = String(order.orderNumber || '').trim()
  return orderNumber || String(order.id).slice(-8)
}

const isOperationalOrder = (order: OrderWithItems) =>
  !['DELIVERED', 'CANCELLED'].includes(String(order.status).toUpperCase())

export default function MobileOwnerAdmin({
  adminName,
  orders,
  users,
  ordersLoading,
  ordersRefreshing,
  usersRefreshing,
  userSearch,
  setUserSearch,
  onRefreshOrders,
  onRefreshUsers,
  onUpdateOrderStatus,
  selectedCustomer,
  onSelectCustomer,
  onBackCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  getAdminHeaders,
  showToast,
  onLogout,
  onMoySkladPushed,
}: MobileOwnerAdminProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>('orders')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [pushingOrderId, setPushingOrderId] = useState<string | null>(null)

  const operationalOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => {
          const aNeedsWork = isOperationalOrder(a) ? 1 : 0
          const bNeedsWork = isOperationalOrder(b) ? 1 : 0
          if (aNeedsWork !== bNeedsWork) return bNeedsWork - aNeedsWork
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        .slice(0, 40),
    [orders]
  )

  const filteredUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase()
    return users
      .filter((user) => user.name !== 'Deleted User' && !user.email.includes('deleted+'))
      .filter((user) => {
        if (!query) return true
        return [user.name, user.email, user.phone || ''].some((value) => value.toLowerCase().includes(query))
      })
      .sort((a, b) => {
        const aTime = new Date(a.lastActiveAt || a.lastLoginAt || a.createdAt).getTime()
        const bTime = new Date(b.lastActiveAt || b.lastLoginAt || b.createdAt).getTime()
        return bTime - aTime
      })
      .slice(0, 40)
  }, [userSearch, users])

  const openOrders = orders.filter(isOperationalOrder).length
  const unsyncedOrders = orders.filter((order) => isOperationalOrder(order) && !order.moySkladOrderId).length

  const pushOrderToMoySklad = async (order: OrderWithItems) => {
    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        showToast('Security error. Refresh the page and try again.', 'error')
        return
      }

      setPushingOrderId(order.id)
      const response = await fetch(`/api/admin/orders/${order.id}/push-moysklad`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(addCsrfToBody({})),
      })

      const result = await response.json()
      if (!result.success) {
        showToast(`MoySklad push failed: ${result.error || 'Unknown error'}`, 'error')
        return
      }

      onMoySkladPushed(order.id, result.moySkladOrderId)
      showToast(result.message || `Order #${getOrderNumber(order)} sent to MoySklad`, 'success')
    } catch (error) {
      errorLog('Mobile admin MoySklad push failed:', error)
      showToast('Error sending order to MoySklad', 'error')
    } finally {
      setPushingOrderId(null)
    }
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-slate-100 px-3 pb-6 pt-3">
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onUpdateStatus={onUpdateOrderStatus}
          getAdminHeaders={getAdminHeaders}
          showToast={showToast}
          onMoySkladPushed={onMoySkladPushed}
        />
      </div>
    )
  }

  if (selectedCustomer) {
    return (
      <div className="min-h-screen bg-slate-100 px-3 pb-6 pt-3">
        <CustomerProfile
          customer={selectedCustomer}
          onBack={onBackCustomer}
          onUpdateCustomer={onUpdateCustomer}
          onDeleteCustomer={onDeleteCustomer}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-950">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 px-4 pb-3 pt-4 text-white backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-red-200">Owner Admin</p>
            <h1 className="mt-1 text-2xl font-bold">GENOSYS Control</h1>
            <p className="mt-1 text-xs text-slate-300">{adminName ? `Signed in as ${adminName}` : 'Mobile operations cockpit'}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white active:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <MetricCard label="Open" value={openOrders} tone="red" />
          <MetricCard label="MoySklad" value={unsyncedOrders} tone="amber" />
          <MetricCard label="Users" value={users.length} tone="blue" />
        </div>

        <div className="mt-3 rounded-3xl bg-white/10 p-1 ring-1 ring-white/10" aria-label="Admin navigation">
          <div className="grid grid-cols-2 gap-1">
            <AdminNavButton
              active={activeTab === 'orders'}
              icon={<ShoppingBag className="h-4 w-4" />}
              label="Orders"
              count={openOrders}
              onClick={() => setActiveTab('orders')}
            />
            <AdminNavButton
              active={activeTab === 'users'}
              icon={<Users className="h-4 w-4" />}
              label="Users"
              count={users.length}
              onClick={() => setActiveTab('users')}
            />
          </div>
        </div>
      </div>

      <main className="space-y-4 px-3 py-4">
        {activeTab === 'orders' ? (
          <section className="space-y-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Orders first</h2>
                  <p className="text-sm text-slate-500">Check status, send to MoySklad, deliver.</p>
                </div>
                <button
                  onClick={onRefreshOrders}
                  disabled={ordersRefreshing}
                  className="rounded-2xl bg-slate-100 p-3 text-slate-700 active:bg-slate-200 disabled:opacity-50"
                  aria-label="Refresh orders"
                >
                  <RefreshCw className={`h-5 w-5 ${ordersRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <LoadingCard label="Loading orders..." />
            ) : operationalOrders.length === 0 ? (
              <EmptyCard title="No orders yet" body="New customer orders will appear here." />
            ) : (
              operationalOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  pushing={pushingOrderId === order.id}
                  onOpen={() => setSelectedOrder(order)}
                  onPush={() => pushOrderToMoySklad(order)}
                  onStatus={onUpdateOrderStatus}
                />
              ))
            )}
          </section>
        ) : (
          <section className="space-y-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Users</h2>
                  <p className="text-sm text-slate-500">Search by name, email, or phone.</p>
                </div>
                <button
                  onClick={onRefreshUsers}
                  disabled={usersRefreshing}
                  className="rounded-2xl bg-slate-100 p-3 text-slate-700 active:bg-slate-200 disabled:opacity-50"
                  aria-label="Refresh users"
                >
                  <RefreshCw className={`h-5 w-5 ${usersRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Find customer..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-base outline-none focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-100"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <EmptyCard title="No users found" body="Try another name, phone, or email." />
            ) : (
              filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} onOpen={() => onSelectCustomer(user)} />
              ))
            )}
          </section>
        )}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-slate-200 bg-white/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-2xl backdrop-blur">
        <div className="grid grid-cols-2 gap-2">
          <BottomNavButton active={activeTab === 'orders'} icon={<ShoppingBag className="h-5 w-5" />} label="Orders" onClick={() => setActiveTab('orders')} />
          <BottomNavButton active={activeTab === 'users'} icon={<Users className="h-5 w-5" />} label="Users" onClick={() => setActiveTab('users')} />
        </div>
      </nav>
    </div>
  )
}

function AdminNavButton({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-[1.25rem] px-3 py-2 text-sm font-bold transition ${
        active ? 'bg-white text-slate-950 shadow-sm' : 'text-white/80 active:bg-white/10'
      }`}
      aria-pressed={active}
    >
      {icon}
      <span>{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${active ? 'bg-red-50 text-red-700' : 'bg-white/10 text-white'}`}>
        {count > 99 ? '99+' : count}
      </span>
    </button>
  )
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone: 'red' | 'amber' | 'blue' }) {
  const tones = {
    red: 'bg-red-500/15 text-red-50 ring-red-400/20',
    amber: 'bg-amber-500/15 text-amber-50 ring-amber-400/20',
    blue: 'bg-blue-500/15 text-blue-50 ring-blue-400/20',
  }

  return (
    <div className={`rounded-2xl p-3 ring-1 ${tones[tone]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide opacity-75">{label}</div>
    </div>
  )
}

function OrderCard({
  order,
  pushing,
  onOpen,
  onPush,
  onStatus,
}: {
  order: OrderWithItems
  pushing: boolean
  onOpen: () => void
  onPush: () => void
  onStatus: (orderId: string, status: string) => Promise<void>
}) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <article className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">#{getOrderNumber(order)}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-slate-700">{order.customerName}</p>
          <p className="truncate text-xs text-slate-500">{order.customerPhone || order.customerEmail}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-red-600">{formatCurrency(order.total)}</div>
          <div className="text-xs text-slate-500">{itemCount} pcs</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatShortDate(order.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <PackageCheck className="h-3.5 w-3.5" />
          {order.moySkladOrderId ? 'Synced' : 'Not in MoySklad'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onOpen} className="rounded-2xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white active:bg-slate-700">
          Open order
        </button>
        <button
          onClick={onPush}
          disabled={Boolean(order.moySkladOrderId) || pushing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-50 px-3 py-3 text-sm font-semibold text-orange-700 ring-1 ring-orange-200 active:bg-orange-100 disabled:bg-green-50 disabled:text-green-700"
        >
          {order.moySkladOrderId ? <CheckCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {order.moySkladOrderId ? 'MoySklad OK' : pushing ? 'Sending...' : 'MoySklad'}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <button onClick={() => onStatus(order.id, 'CONFIRMED')} className="rounded-2xl bg-blue-50 px-2 py-2.5 text-xs font-semibold text-blue-700 active:bg-blue-100">
          Confirm
        </button>
        <button onClick={() => onStatus(order.id, 'SHIPPED')} className="inline-flex items-center justify-center gap-1 rounded-2xl bg-purple-50 px-2 py-2.5 text-xs font-semibold text-purple-700 active:bg-purple-100">
          <Truck className="h-3.5 w-3.5" />
          Ship
        </button>
        <button onClick={() => onStatus(order.id, 'DELIVERED')} className="rounded-2xl bg-green-50 px-2 py-2.5 text-xs font-semibold text-green-700 active:bg-green-100">
          Delivered
        </button>
      </div>

      {['PENDING', 'PAID', 'CONFIRMED'].includes(String(order.status).toUpperCase()) && (
        <button onClick={() => onStatus(order.id, 'CANCELLED')} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 active:bg-red-100">
          <XIcon className="h-3.5 w-3.5" />
          Cancel order
        </button>
      )}
    </article>
  )
}

function UserCard({ user, onOpen }: { user: MobileUser; onOpen: () => void }) {
  return (
    <article className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <UserRound className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-900">{user.name || 'Unknown customer'}</h3>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
              {user.phone && <p className="text-sm text-slate-500">{user.phone}</p>}
            </div>
            {user.discountPercentage ? (
              <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700">{user.discountPercentage}%</span>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <UserStat label="Orders" value={user.orderCount || 0} />
            <UserStat label="Spent" value={formatCurrency(user.totalSpent || 0)} />
            <UserStat label="Last" value={user.lastOrderDate ? formatShortDate(user.lastOrderDate) : '—'} />
          </div>

          <button onClick={onOpen} className="mt-3 w-full rounded-2xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-800 active:bg-slate-200">
            Open customer
          </button>
        </div>
      </div>
    </article>
  )
}

function UserStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-2 py-2">
      <div className="truncate text-sm font-bold text-slate-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  )
}

function BottomNavButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
        active ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <RefreshCw className="mx-auto mb-3 h-7 w-7 animate-spin text-red-600" />
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  )
}

function EmptyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </div>
  )
}
