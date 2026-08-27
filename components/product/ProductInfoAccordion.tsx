'use client'

import { ReactNode, useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface AccordionItemProps {
  title: string
  icon?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

/**
 * Lightweight accordion item for product info sections.
 * Clean white/gray design - no colored boxes.
 * Height animates via CSS grid 0fr→1fr (progressive; reduced-motion friendly).
 */
export default function ProductInfoAccordion({
  title,
  icon,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const accordionId = useId()
  const triggerId = `${accordionId}-trigger`
  const panelId = `${accordionId}-panel`

  return (
    <div className="border-b border-[var(--color-border-primary)] first:border-t">
      <button
        id={triggerId}
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`w-full flex items-center ${isRtl ? 'flex-row-reverse' : ''} justify-between gap-3 py-3.5 lg:py-4 text-left group min-h-[44px]`}
      >
        <span className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''} text-sm lg:text-base font-semibold text-[var(--color-text-primary)] group-hover:text-primary-700 transition-colors`}>
          {icon}
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 lg:h-5 lg:w-5 text-[var(--color-text-tertiary)] group-hover:text-primary-600 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className="accordion-panel"
        data-open={isOpen ? 'true' : 'false'}
      >
        <div className="accordion-panel__inner">
          <div className="pb-4 lg:pb-5 text-sm lg:text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
