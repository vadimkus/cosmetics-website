/**
 * Smoke-test the newsletter markdown renderer: XSS safety + happy paths.
 * Run: npx tsx scripts/check-newsletter-markdown.ts
 */
import { renderNewsletterMarkdown } from '../lib/newsletterMarkdown'

// Safety tests check for executable HTML — the raw tags/attributes that a
// browser would interpret. HTML-escaped text like "&lt;script&gt;alert(1)&lt;/script&gt;"
// is fine; it renders as literal text.
const cases = [
  { name: 'XSS script tag', md: '<script>alert(1)</script>', mustNotContain: ['<script>', '<script ', '</script>'] },
  // Dangerous part is the <img> tag itself; the literal " onerror=" text inside
  // an escaped tag is harmless — no browser can execute attributes on non-existent elements.
  { name: 'XSS img onerror', md: '<img src=x onerror=alert(1)>', mustNotContain: ['<img ', '<img>'] },
  { name: 'javascript: link', md: '[click](javascript:alert(1))', mustNotContain: ['href="javascript:', 'onclick='] },
  { name: 'safe link', md: '[shop](https://genosys.ae/products)', mustContain: ['href="https://genosys.ae/products"'] },
  { name: 'bold + italic', md: 'Hello **world** and _friend_', mustContain: ['<strong>world</strong>', '<em>friend</em>'] },
  { name: 'heading', md: '# Launch\n\nSecond paragraph.', mustContain: ['<h1', 'Launch</h1>'] },
  { name: 'bullet list', md: '- one\n- two', mustContain: ['<ul', '<li', 'one</li>'] },
  { name: 'quote', md: '> Best cream', mustContain: ['<blockquote'] },
  { name: 'bare url autolink', md: 'Visit https://genosys.ae now.', mustContain: ['href="https://genosys.ae'] },
  { name: 'mailto link', md: '[email us](mailto:info@genosys.ae)', mustContain: ['href="mailto:info@genosys.ae"'] },
  { name: 'data: URI rejected', md: '[exploit](data:text/html,<script>alert(1)</script>)', mustNotContain: ['data:', 'href="data:'] },
]

let pass = 0
let fail = 0
for (const c of cases) {
  const out = renderNewsletterMarkdown(c.md)
  const bads = (c.mustNotContain || []).filter(s => out.includes(s))
  const missings = (c.mustContain || []).filter(s => !out.includes(s))
  const ok = bads.length === 0 && missings.length === 0
  if (ok) pass++
  else fail++
  console.log(`[${ok ? 'OK  ' : 'FAIL'}] ${c.name}`)
  if (!ok) {
    if (bads.length) console.log('       contains forbidden:', bads)
    if (missings.length) console.log('       missing expected:', missings)
    console.log('       output:', out.replace(/\n/g, ' ').slice(0, 200))
  }
}

console.log(`\n${pass}/${pass + fail} tests passed.`)
if (fail > 0) process.exit(1)
