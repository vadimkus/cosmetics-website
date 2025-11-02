'use client'

import Link from 'next/link'
import { ArrowLeft, Settings, Trash2, Zap, ShoppingBag, Heart, MessageCircle, RefreshCw } from 'lucide-react'

interface SettingsPanelProps {
  isRefreshing: boolean
  onLogout: () => void
  onDeleteAccount: () => void
  onRefresh: () => void
}

export default function SettingsPanel({
  isRefreshing,
  onLogout,
  onDeleteAccount,
  onRefresh
}: SettingsPanelProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Account Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
            <Settings className="h-6 w-6 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Account Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 group min-h-[44px] touch-manipulation"
          >
            <div className="p-3 bg-red-200 rounded-lg group-hover:bg-red-300 transition-colors">
              <ArrowLeft className="h-6 w-6 text-red-700" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Logout</h3>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
          </button>

          {/* Delete Account */}
          <button
            onClick={onDeleteAccount}
            className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 hover:from-red-100 hover:to-red-200 transition-all duration-200 group min-h-[44px] touch-manipulation"
          >
            <div className="p-3 bg-red-200 rounded-lg group-hover:bg-red-300 transition-colors">
              <Trash2 className="h-6 w-6 text-red-700" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Delete Account</h3>
              <p className="text-sm text-gray-600">Permanently delete your account</p>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl">
            <Zap className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            href="/products"
            className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 group min-h-[100px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-3 bg-emerald-200 rounded-lg group-hover:bg-emerald-300 transition-colors">
              <ShoppingBag className="h-6 w-6 text-emerald-700" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Browse Products</h3>
              <p className="text-sm text-gray-600">Shop our collection</p>
            </div>
          </Link>

          <Link
            href="/favorites"
            className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200 hover:from-pink-100 hover:to-pink-200 transition-all duration-200 group min-h-[100px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-3 bg-pink-200 rounded-lg group-hover:bg-pink-300 transition-colors">
              <Heart className="h-6 w-6 text-pink-700" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Favorites</h3>
              <p className="text-sm text-gray-600">Your saved items</p>
            </div>
          </Link>

          <a
            href="https://wa.me/971585487665"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group min-h-[100px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-3 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
              <MessageCircle className="h-6 w-6 text-green-700" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Support</h3>
              <p className="text-sm text-gray-600">Get help via WhatsApp</p>
            </div>
          </a>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] sm:min-h-[120px] touch-manipulation"
          >
            <div className="p-3 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
              <RefreshCw className={`h-6 w-6 text-green-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Refresh</h3>
              <p className="text-sm text-gray-600">Update profile data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
