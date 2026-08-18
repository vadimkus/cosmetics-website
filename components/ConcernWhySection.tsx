'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface WhyItem {
  icon: string
  label: string
  detail: string
}

interface ConcernWhySectionProps {
  title: string
  items: WhyItem[]
}

export default function ConcernWhySection({ title, items }: ConcernWhySectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="px-4 pb-8 sm:pb-10">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-2"
        >
          <h2 className="cera-serif text-[20px] leading-tight text-[var(--cera-ink)]">{title}</h2>
          <ChevronDown
            className={`w-5 h-5 text-[var(--cera-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="mt-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((item, i) => (
                <div key={i} className="rounded-xl bg-[var(--cera-cream-deep)] border border-[var(--cera-line)] p-4 text-center">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="font-semibold text-[var(--cera-ink)] text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-[var(--cera-muted)] leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
