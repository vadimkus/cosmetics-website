import { User } from 'lucide-react'

/**
 * The account control at the end of every mobile bar.
 *
 * Fifteen hand-rolled copies of this had drifted into two colours — twelve on ink, three
 * on rose — which is how the blog index and the article one tap away from it ended up
 * looking like different sites.
 *
 * The app is the reference, and its rule is not "pick a colour". It is that the avatar
 * tells you whether you are signed in:
 *
 * - Signed in: your initial in white on ink, with a presence dot.
 * - Signed out: a neutral person outline on the pale surface, with a hairline.
 *
 * The web showed a signed-out visitor a white "G" on a dark circle, which reads as an
 * account that is already logged in. It was not their initial and stood for nothing.
 *
 * Colours are the app's, token for token: `cta` is `--cera-ink`, `subtleBg` is
 * `--cera-cream-deep`, `separator` is `--cera-line`, `secondaryLabel` is `--cera-muted`,
 * and `green` is `--status-green` — which is the same #2e7d4f the app uses, where the old
 * copies had Tailwind's `green-500`.
 */
export default function AccountAvatar({
  name,
  signedIn,
}: {
  name?: string | null | undefined
  signedIn: boolean
}) {
  if (!signedIn) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
        <User className="h-[18px] w-[18px] text-[var(--cera-muted)]" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cera-ink)]">
        <span className="text-sm font-semibold text-white">
          {name?.charAt(0)?.toUpperCase() || 'G'}
        </span>
      </div>
      {/* Logical inset, so the dot follows the writing direction in Arabic as the app's
          `end: -1` does. */}
      <div className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-[1.5px] border-white bg-[var(--status-green)]" />
    </div>
  )
}
