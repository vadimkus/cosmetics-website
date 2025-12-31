/**
 * NOTE (Vercel / Next.js 16 Turbopack):
 * `isomorphic-dompurify` pulls in `jsdom/parse5` which can crash serverless runtime with ERR_REQUIRE_ESM.
 * Keep this module dependency-free so API routes and SSR never fail to boot.
 *
 * This is a pragmatic sanitizer: it removes the most dangerous patterns and strips unknown tags,
 * while allowing basic formatting commonly produced by our RichTextEditor.
 *
 * If you later want full HTML sanitization, prefer a server-safe sanitizer library that doesn't
 * depend on JSDOM, or run sanitization in a separate Node service.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'span', 'div',
  'blockquote', 'pre', 'code',
  // Extended tags for blog content
  'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'hr', 'time', 'article', 'section', 'header', 'footer', 'nav', 'aside',
  'dl', 'dt', 'dd', 'sub', 'sup', 'mark', 'abbr', 'cite', 'dfn', 'kbd', 'samp', 'var',
])

function stripDangerousContent(input: string): string {
  let out = input
  // Remove scripts/iframes/embeds/objects completely
  out = out.replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
  out = out.replace(/<\s*(iframe|object|embed)[\s\S]*?>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
  // Remove inline event handlers
  out = out.replace(/\son\w+="[^"]*"/gi, '')
  out = out.replace(/\son\w+='[^']*'/gi, '')
  // Remove javascript: and data:text/html URLs
  out = out.replace(/javascript:/gi, '')
  out = out.replace(/data:text\/html/gi, '')
  return out
}

function sanitizeTagAttributes(tagName: string, attrs: string): string {
  const t = tagName.toLowerCase()
  const allowedAttrs = new Set<string>(['class', 'dir'])
  if (t === 'a') {
    allowedAttrs.add('href')
    allowedAttrs.add('target')
    allowedAttrs.add('rel')
  }
  if (t === 'span' || t === 'div' || t === 'td' || t === 'th' || t === 'table' || t === 'tr') {
    // Allow inline styling for formatting
    allowedAttrs.add('style')
  }
  if (t === 'img') {
    allowedAttrs.add('src')
    allowedAttrs.add('alt')
    allowedAttrs.add('width')
    allowedAttrs.add('height')
    allowedAttrs.add('loading')
  }
  if (t === 'td' || t === 'th') {
    allowedAttrs.add('colspan')
    allowedAttrs.add('rowspan')
  }
  if (t === 'time') {
    allowedAttrs.add('datetime')
  }

  const attrMatches = attrs.match(/([a-zA-Z:-]+)\s*=\s*(".*?"|'.*?')/g) || []
  const kept: string[] = []
  for (const raw of attrMatches) {
    const keyMatch = raw.match(/^([a-zA-Z:-]+)\s*=/)
    const key = (keyMatch?.[1] || '').toLowerCase()
    if (!key || !allowedAttrs.has(key)) continue
    if (key === 'href' || key === 'src') {
      const v = raw.replace(/^(href|src)\s*=\s*/i, '').trim()
      const unq = v.replace(/^['"]|['"]$/g, '')
      // Only allow http(s), mailto, tel, or relative links/paths
      if (!/^(https?:|mailto:|tel:|\/)/i.test(unq)) continue
    }
    if (key === 'style') {
      // Keep only "color:" declarations
      const v = raw.replace(/^style\s*=\s*/i, '').trim()
      const unq = v.replace(/^['"]|['"]$/g, '')
      const colorMatch = unq.match(/color\s*:\s*[^;]+/i)
      if (!colorMatch) continue
      kept.push(`style="${colorMatch[0]}"`)
      continue
    }
    kept.push(raw)
  }

  // Normalize rel for external targets
  if (t === 'a' && kept.some(a => a.toLowerCase().startsWith('target='))) {
    if (!kept.some(a => a.toLowerCase().startsWith('rel='))) {
      kept.push(`rel="noopener noreferrer"`)
    }
  }

  return kept.length ? ' ' + kept.join(' ') : ''
}

function stripUnknownTags(input: string): string {
  // Keep allowed tags, strip others but keep inner text.
  return input.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (m, tagNameRaw, attrsRaw) => {
    const tagName = String(tagNameRaw || '').toLowerCase()
    const isClosing = m.startsWith('</')
    if (!ALLOWED_TAGS.has(tagName)) {
      return '' // strip tag
    }
    if (isClosing) return `</${tagName}>`
    const attrs = sanitizeTagAttributes(tagName, String(attrsRaw || ''))
    // Self-close <br>
    if (tagName === 'br') return '<br />'
    return `<${tagName}${attrs}>`
  })
}

export function sanitizeHtml(html: string | null | undefined): string {
  const s = String(html ?? '')
  if (!s.trim()) return ''
  const noDanger = stripDangerousContent(s)
  const cleaned = stripUnknownTags(noDanger)
  return cleaned.trim()
}

export function stripHtml(html: string | null | undefined): string {
  const s = String(html ?? '')
  if (!s.trim()) return ''
  return s.replace(/<\/?[^>]+>/g, '').trim()
}

