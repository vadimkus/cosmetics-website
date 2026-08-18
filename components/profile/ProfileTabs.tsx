'use client'

import { User, Package, Settings, Download, Shield, Sparkles } from 'lucide-react'
import { ProfileTab } from '@/types/profile'

interface ProfileTabsProps {
  activeTab: ProfileTab
  setActiveTab: (tab: ProfileTab) => void
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ] as const

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--cera-line)] mb-6">
      <div className="border-b border-[var(--cera-line)]">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-[var(--cera-rose)] text-[var(--cera-rose-ink)]'
                    : 'border-transparent text-[var(--cera-muted)] hover:text-[var(--cera-body)] hover:border-[var(--cera-line)]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}