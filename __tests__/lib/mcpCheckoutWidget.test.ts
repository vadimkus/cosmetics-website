import { CHECKOUT_UI_META, CHECKOUT_UI_URI, MCP_APP_MIME, checkoutHtml } from '@/lib/mcp/checkoutWidget'

describe('MCP checkout widget', () => {
  const html = checkoutHtml()

  it('is a small self-contained MCP App', () => {
    expect(CHECKOUT_UI_URI.startsWith('ui://')).toBe(true)
    expect(MCP_APP_MIME).toBe('text/html;profile=mcp-app')
    expect(html.length).toBeLessThan(50_000)
    expect(html).not.toMatch(/<script[^>]+src=/)
    expect(CHECKOUT_UI_META.ui.csp.connectDomains).toEqual([])
  })

  it('speaks the MCP Apps protocol and submits through place_order', () => {
    for (const s of ['ui/initialize', 'ui/notifications/initialized', 'ui/notifications/tool-result', 'tools/call', 'ui/open-link', 'ui/notifications/size-changed', "'place_order'"]) {
      expect(html).toContain(s)
    }
  })

  it('carries labels in all three languages', () => {
    expect(html).toContain('Continue to secure payment')
    expect(html).toContain('Перейти к безопасной оплате')
    expect(html).toContain('المتابعة إلى الدفع الآمن')
  })
})
