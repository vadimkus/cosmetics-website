'use client'

import { BarChart3, FileText, Users, Package, ShoppingBag, Filter, Megaphone, MessageCircle, HelpCircle, Mail } from 'lucide-react'

type AdminTab = 'analytics' | 'reporting' | 'segmentation' | 'users' | 'orders' | 'products' | 'promo' | 'blog' | 'faq' | 'chatbot' | 'newsletter'

interface AdminTabNavigationProps {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  userCount: number
  orderCount: number
  productCount: number
}

export default function AdminTabNavigation({
  activeTab,
  setActiveTab,
  userCount,
  orderCount,
  productCount
}: AdminTabNavigationProps) {
  const tabs = [
    { 
      id: 'analytics' as AdminTab, 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'Dashboard & metrics',
      count: undefined
    },
    { 
      id: 'reporting' as AdminTab, 
      label: 'Reports', 
      icon: FileText, 
      description: 'Advanced reporting',
      count: undefined
    },
    { 
      id: 'segmentation' as AdminTab, 
      label: 'Segments', 
      icon: Filter, 
      description: 'User segmentation',
      count: undefined
    },
    { 
      id: 'users' as AdminTab, 
      label: 'Users', 
      icon: Users, 
      description: 'User management',
      count: userCount
    },
    { 
      id: 'orders' as AdminTab, 
      label: 'Orders', 
      icon: ShoppingBag, 
      description: 'Order management',
      count: orderCount
    },
    { 
      id: 'products' as AdminTab, 
      label: 'Products', 
      icon: Package, 
      description: 'Product catalog',
      count: productCount
    },
    { 
      id: 'promo' as AdminTab, 
      label: 'Promo', 
      icon: Megaphone, 
      description: 'Promotions shown to users',
      count: undefined
    },
    { 
      id: 'blog' as AdminTab, 
      label: 'Blog', 
      icon: FileText, 
      description: 'Content management',
      count: undefined
    },
    { 
      id: 'faq' as AdminTab, 
      label: 'FAQ', 
      icon: HelpCircle, 
      description: 'FAQ management',
      count: undefined
    },
    { 
      id: 'chatbot' as AdminTab, 
      label: 'Chatbot', 
      icon: MessageCircle, 
      description: 'Genie chatbot analytics',
      count: undefined
    },
    {
      id: 'newsletter' as AdminTab,
      label: 'Newsletter',
      icon: Mail,
      description: 'Subscriber list & email campaigns',
      count: undefined
    }
  ]

  return (
    <div className="bg-white rounded-lg border mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center justify-center px-3 sm:px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 min-w-0 flex-1 sm:flex-none touch-manipulation
                  ${isActive
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`
                  h-4 w-4 sm:mr-2 flex-shrink-0
                  ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                <span className="hidden sm:block truncate">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`
                    ml-1 sm:ml-2 px-2 py-0.5 text-xs font-medium rounded-full min-w-[1.25rem] text-center
                    ${isActive 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }
                  `}>
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
      
      {/* Tab Description (visible on larger screens) */}
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 hidden sm:block">
        {tabs.find(tab => tab.id === activeTab)?.description}
      </div>
    </div>
  )
}