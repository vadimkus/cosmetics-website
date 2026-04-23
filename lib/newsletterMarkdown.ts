/**
 * Minimal, XSS-safe Markdown → HTML renderer for newsletter campaigns.
 *
 * Why hand-roll instead of pulling in `marked` / `remark`?
 *  - Newsletter copy needs maybe 8 constructs; a full MD toolchain is 40kB+
 *  - We escape HTML FIRST (no `dangerouslySetInnerHTML` of unsanitized input)
 *  - Output is email-safe (no <style>, <script>, <iframe>, no class attrs)
 *
 * Supports:
 *  - `# Heading`, `## Subheading`, `### Small heading`
 *  - `**bold**`, `__bold__`
 *  - `*italic*`, `_italic_`
 *  - `[text](https://url)` — only http(s)/mailto schemes allowed
 *  - `> quote`
 *  - `- item` bulleted lists
 *  - Horizontal rule `---`
 *  - Paragraphs (double newlines)
 *  - Line breaks (single newlines inside a paragraph)
 *  - Auto-link bare URLs
 *
 * Deliberately NOT supported:
 *  - Raw HTML (escaped to text)
 *  - Images (email image handling is its own beast; add later)
 *  - Tables (CSS-heavy; won't render consistently in Outlook)
 *  - Numbered lists (punt until asked)
 *  - Inline code / code blocks (not a newsletter construct)
 */

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, ch => ESCAPE_MAP[ch] || ch)
}

const SAFE_URL_RE = /^(?:https?:|mailto:)/i

function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null
  if (!SAFE_URL_RE.test(trimmed)) return null
  return trimmed
}

/**
 * Inline transforms applied after HTML escaping — order matters.
 * Each transform runs over already-escaped text, so we emit raw `<a>`, `<strong>`, etc.
 */
function applyInline(escaped: string): string {
  let out = escaped

  // Links: [text](url) — allow only safe schemes. Text has already been escaped.
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, url: string) => {
    const safe = sanitizeUrl(url)
    if (!safe) return `[${text}]`
    // NOTE: `safe` was just validated; it still came from user input, so escape attribute-style.
    const href = safe.replace(/"/g, '&quot;')
    return `<a href="${href}" style="color:#0071e3; text-decoration:underline;">${text}</a>`
  })

  // Bold: **x** or __x__
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>')

  // Italic: *x* or _x_ (single, non-greedy, must not match already-consumed ** or __)
  out = out.replace(/(?<![*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '<em>$1</em>')
  out = out.replace(/(?<![_\w])_([^_\s][^_]*?)_(?!\w)/g, '<em>$1</em>')

  // Bare URL autolink — skip if it's already inside an <a href=...>
  out = out.replace(
    /(^|[^"'>])(https?:\/\/[^\s<]+)/g,
    (_m, pre: string, url: string) => `${pre}<a href="${url.replace(/"/g, '&quot;')}" style="color:#0071e3; text-decoration:underline;">${url}</a>`
  )

  return out
}

/**
 * Block-level renderer. Input is the raw markdown string; output is an HTML fragment.
 */
export function renderNewsletterMarkdown(source: string): string {
  // Normalize newlines, strip trailing whitespace, cap runs of blank lines
  const normalized = String(source || '')
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, '  ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (!normalized) return ''

  const blocks = normalized.split(/\n\n+/)
  const htmlBlocks: string[] = []

  for (const block of blocks) {
    const lines = block.split('\n')
    const first = lines[0] ?? ''

    // Horizontal rule
    if (/^-{3,}$/.test(block.trim())) {
      htmlBlocks.push('<hr style="border:none; border-top:1px solid #d2d2d7; margin:24px 0;" />')
      continue
    }

    // Heading
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(first)
    if (headingMatch && lines.length === 1) {
      const level = headingMatch[1]!.length
      const text = applyInline(escapeHtml(headingMatch[2]!))
      const sizes = ['', '28px', '22px', '18px']
      const margins = ['', '32px 0 16px', '28px 0 12px', '20px 0 8px']
      htmlBlocks.push(
        `<h${level} style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif; font-size:${sizes[level]}; font-weight:600; color:#1d1d1f; letter-spacing:-0.02em; margin:${margins[level]};">${text}</h${level}>`
      )
      continue
    }

    // Blockquote (all lines start with >)
    if (lines.every(l => /^>\s?/.test(l))) {
      const inner = lines.map(l => applyInline(escapeHtml(l.replace(/^>\s?/, '')))).join('<br />')
      htmlBlocks.push(
        `<blockquote style="border-left:3px solid #d2d2d7; padding:4px 16px; margin:16px 0; color:#515154; font-style:italic;">${inner}</blockquote>`
      )
      continue
    }

    // Unordered list (all lines start with - or *)
    if (lines.every(l => /^[-*]\s+/.test(l))) {
      const items = lines.map(l => `<li style="margin:4px 0;">${applyInline(escapeHtml(l.replace(/^[-*]\s+/, '')))}</li>`).join('')
      htmlBlocks.push(
        `<ul style="margin:12px 0; padding-left:20px; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif; font-size:15px; color:#1d1d1f; line-height:1.6;">${items}</ul>`
      )
      continue
    }

    // Plain paragraph — single newlines become <br />
    const joined = lines.map(l => applyInline(escapeHtml(l))).join('<br />')
    htmlBlocks.push(
      `<p style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif; font-size:15px; color:#1d1d1f; line-height:1.6; margin:12px 0;">${joined}</p>`
    )
  }

  return htmlBlocks.join('\n')
}
