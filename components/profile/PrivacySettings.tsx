'use client'

import { useState } from 'react'
import { Shield, Eye, Edit3, Trash2, Download, MessageCircle, ChevronDown, ChevronUp, Lock, Database, Clock, UserCheck } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface AccordionItemProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string
}

function AccordionItem({ title, icon, children, defaultOpen = false, badge }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border border-[var(--cera-line)] rounded-lg md:rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 md:p-4 bg-white hover:bg-[var(--cera-cream-deep)] transition-colors"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 bg-[var(--cera-cream-deep)] rounded-md md:rounded-lg text-[var(--cera-body)]">
            {icon}
          </div>
          <span className="text-sm md:text-base font-medium text-[var(--cera-ink)]">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] md:text-xs rounded-full font-medium">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-muted)]" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 md:p-4 pt-0 bg-white">
          <div className="pt-3 md:pt-4 border-t border-[var(--cera-line)]">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PrivacySettings() {
  const { t } = useTranslation()
  
  return (
    <div className="rounded-3xl border border-[var(--cera-line)] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)] md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="rounded-xl bg-[var(--cera-cream-deep)] p-2 text-[var(--cera-body)] md:p-3">
          <Shield className="h-4 w-4 md:h-6 md:w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--cera-ink)] md:text-2xl">{t('profile.privacyPolicyHeader')}</h2>
          <p className="text-[10px] md:text-xs text-[var(--cera-muted)]">{t('profile.yourDataYourRights')}</p>
        </div>
      </div>

      {/* Quick Summary Card */}
      <div className="mb-4 rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] p-3 md:mb-6 md:p-4">
        <div className="flex items-start gap-2 md:gap-3">
          <UserCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--cera-body)] md:h-5 md:w-5" />
          <div>
            <h3 className="mb-1 text-xs font-semibold text-[var(--cera-ink)] md:text-sm">{t('profile.yourPrivacyRights')}</h3>
            <p className="text-[10px] leading-relaxed text-[var(--cera-body)] md:text-xs">
              {t('profile.privacyRightsShort')}
            </p>
          </div>
        </div>
      </div>

      {/* Your Rights - Quick Actions */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="bg-blue-50 rounded-lg p-2.5 md:p-4 border border-blue-100">
          <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mb-1.5 md:mb-2" />
          <h4 className="text-xs md:text-sm font-semibold text-blue-800">{t('profile.access')}</h4>
          <p className="text-[10px] md:text-xs text-blue-600 mt-0.5">{t('profile.viewYourData')}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2.5 md:p-4 border border-green-100">
          <Edit3 className="h-4 w-4 md:h-5 md:w-5 text-green-600 mb-1.5 md:mb-2" />
          <h4 className="text-xs md:text-sm font-semibold text-green-800">{t('profile.correction')}</h4>
          <p className="text-[10px] md:text-xs text-green-600 mt-0.5">{t('profile.editInfo')}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2.5 md:p-4 border border-red-100">
          <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-[var(--cera-rose-ink)] mb-1.5 md:mb-2" />
          <h4 className="text-xs md:text-sm font-semibold text-red-800">{t('profile.deletion')}</h4>
          <p className="text-[10px] md:text-xs text-red-600 mt-0.5">{t('profile.removeData')}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2.5 md:p-4 border border-purple-100">
          <Download className="h-4 w-4 md:h-5 md:w-5 text-purple-600 mb-1.5 md:mb-2" />
          <h4 className="text-xs md:text-sm font-semibold text-purple-800">{t('profile.portability')}</h4>
          <p className="text-[10px] md:text-xs text-purple-600 mt-0.5">{t('profile.downloadData')}</p>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-2 md:space-y-3">
        <AccordionItem 
          title={t('profile.dataWeCollect')} 
          icon={<Database className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          defaultOpen={false}
        >
          <ul className="space-y-2 text-xs md:text-sm text-[var(--cera-body)]">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong className="text-[var(--cera-body)]">{t('profile.accountLabel')}</strong> {t('profile.accountDataShort')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong className="text-[var(--cera-body)]">{t('profile.profileLabel')}</strong> {t('profile.profileDataShort')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong className="text-[var(--cera-body)]">{t('profile.ordersLabel')}</strong> {t('profile.ordersDataShort')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span><strong className="text-[var(--cera-body)]">{t('profile.usageLabel')}</strong> {t('profile.usageDataShort')}</span>
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem 
          title={t('profile.howWeUseData')} 
          icon={<Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />}
        >
          <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-[var(--cera-body)]">
            {[
              t('profile.processAndFulfillOrders'),
              t('profile.provideCustomerSupport'),
              t('profile.sendUpdatesWithConsent'),
              t('profile.improveOurServices'),
              t('profile.complyWithUaeLaw')
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>

        <AccordionItem 
          title={t('profile.dataRetention')} 
          icon={<Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />}
        >
          <div className="space-y-2 text-xs md:text-sm text-[var(--cera-body)]">
            <p className="text-[var(--cera-body)] font-medium mb-2">{t('profile.retentionPeriodsPerUaeRegulations')}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--cera-line)]">
                <span>{t('profile.accountData')}</span>
                <span className="text-[var(--cera-muted)] text-[10px] md:text-xs">{t('profile.untilDeletion')}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[var(--cera-line)]">
                <span>{t('profile.orderHistoryRetention')}</span>
                <span className="text-[var(--cera-muted)] text-[10px] md:text-xs">{t('profile.legalCompliance')}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span>{t('profile.afterDeletion')}</span>
                <span className="text-[var(--cera-muted)] text-[10px] md:text-xs">{t('profile.permanentlyRemoved')}</span>
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem 
          title={t('profile.securityMeasures')} 
          icon={<Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          badge={t('profile.protected')}
        >
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
            {[
              { icon: '🔒', text: t('profile.sslEncryption') },
              { icon: '🛡️', text: t('profile.secureServers') },
              { icon: '🔄', text: t('profile.regularBackups') },
              { icon: '🔐', text: t('profile.accessControls') }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-[var(--cera-cream-deep)] rounded-md p-2">
                <span>{item.icon}</span>
                <span className="text-[var(--cera-body)]">{item.text}</span>
              </div>
            ))}
          </div>
        </AccordionItem>
      </div>

      {/* Contact Section */}
      <div className="mt-4 md:mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg md:rounded-xl p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          <h4 className="text-xs md:text-sm font-semibold text-green-800">{t('profile.privacyQuestions')}</h4>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <a 
            href="mailto:sales@genosys.ae" 
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm font-medium"
          >
            <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('profile.emailUs')}
          </a>
          <a 
            href="https://wa.me/971585487665" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-white border border-green-500 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-xs md:text-sm font-medium"
          >
            <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {t('common.whatsapp')}
          </a>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-3 md:mt-4 text-[10px] md:text-xs text-[var(--cera-muted)] text-center">
        {t('profile.lastUpdated')} March 2026 • GENOSYS MIDDLE EAST FZ-LLC
      </p>
    </div>
  )
}
