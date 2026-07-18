import { sanitizeHtml } from '@/lib/sanitizeHtml'

describe('sanitizeHtml video attributes', () => {
  it('keeps approved video layout styles and strips unrelated declarations', () => {
    const html = sanitizeHtml(
      '<video src="/videos/product.mp4" controls style="aspect-ratio: 9 / 16; max-height: 65vh; background: red; position: fixed"></video>'
    )

    expect(html).toContain('src="/videos/product.mp4"')
    expect(html).toContain('style="aspect-ratio: 9 / 16; max-height: 65vh"')
    expect(html).not.toContain('background:')
    expect(html).not.toContain('position:')
  })

  it('removes event handlers and unsafe video URLs', () => {
    const html = sanitizeHtml(
      '<video src="javascript:alert(1)" poster="data:text/html,bad" onplay="alert(1)" controls></video>'
    )

    expect(html).not.toContain('javascript:')
    expect(html).not.toContain('data:text/html')
    expect(html).not.toContain('onplay')
  })
})
