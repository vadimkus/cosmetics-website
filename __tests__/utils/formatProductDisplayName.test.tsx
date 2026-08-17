import { render } from '@testing-library/react'
import {
  formatProductDisplayName,
  formatProductDisplayNamePlain,
} from '@/utils/formatProductDisplayName'

describe('formatProductDisplayName', () => {
  it('keeps non Beauty Box names unchanged', () => {
    expect(formatProductDisplayName('MULTI SUN CREAM')).toBe('MULTI SUN CREAM')
    expect(formatProductDisplayNamePlain('MULTI SUN CREAM')).toBe('MULTI SUN CREAM')
  })

  it('puts Beauty Box on its own second line', () => {
    const { container } = render(
      <div>{formatProductDisplayName('PROBLEM SKIN CARE BEAUTY BOX')}</div>
    )
    const lines = Array.from(container.querySelectorAll('span.block')).map(
      (el) => el.textContent
    )
    expect(lines).toEqual(['PROBLEM SKIN CARE', 'BEAUTY\u00A0BOX'])
  })

  it('handles title-case Beauty Box names', () => {
    expect(formatProductDisplayNamePlain('Problem Skin Care Beauty Box')).toBe(
      'Problem Skin Care\nBeauty Box'
    )
  })

  it('handles short names that would otherwise fit on one line', () => {
    expect(formatProductDisplayNamePlain('ANTI-AGING BEAUTY BOX')).toBe(
      'ANTI-AGING\nBEAUTY BOX'
    )
  })
})
