'use client'

import { suggestEmailAddressCorrection } from '@/lib/emailAddressValidation'

type Props = {
  email: string
  confirmedEmail?: string | null
  message: string
  useSuggestionLabel: string
  keepEnteredLabel: string
  onUseSuggestion: (email: string) => void
  onKeepEntered: (email: string) => void
}

export default function EmailDomainSuggestion({
  email,
  confirmedEmail,
  message,
  useSuggestionLabel,
  keepEnteredLabel,
  onUseSuggestion,
  onKeepEntered,
}: Props) {
  const suggestedEmail = suggestEmailAddressCorrection(email)
  if (!suggestedEmail || confirmedEmail === email.trim().toLowerCase()) return null

  return (
    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-start" role="alert">
      <p className="text-xs font-medium leading-relaxed text-amber-900">
        {message.replace('{email}', suggestedEmail)}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onUseSuggestion(suggestedEmail)}
          className="min-h-9 rounded-lg bg-amber-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
        >
          {useSuggestionLabel}
        </button>
        <button
          type="button"
          onClick={() => onKeepEntered(email.trim().toLowerCase())}
          className="min-h-9 rounded-lg border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
        >
          {keepEnteredLabel}
        </button>
      </div>
    </div>
  )
}
