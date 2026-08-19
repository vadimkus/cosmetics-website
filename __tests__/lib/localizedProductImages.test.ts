import {
  getLocalizedSlideManifest,
  localizeProductImage,
  localizeProductImages,
} from '@/lib/localizedProductImages'
import { existsSync } from 'fs'
import { join } from 'path'

describe('localizeProductImage', () => {
  it('swaps a registered slide for its localized file', () => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'ru')).toBe('/images/cera_o/ru/s1.jpeg')
  })

  it('leaves English alone', () => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'en')).toBe('/images/cera_o/s1.jpeg')
  })

  it('leaves a locale with no translated set alone', () => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'ar')).toBe('/images/cera_o/s1.jpeg')
  })

  it('leaves an unregistered file in a registered folder alone', () => {
    // Main.jpeg is a packshot with no text, so it has no Russian version.
    expect(localizeProductImage('/images/cera_o/Main.jpeg', 'ru')).toBe('/images/cera_o/Main.jpeg')
  })

  it('leaves folders with no localization alone', () => {
    expect(localizeProductImage('/images/pdrn_5000_new/S1.jpeg', 'ru')).toBe('/images/pdrn_5000_new/S1.jpeg')
  })

  it('survives empty and malformed input', () => {
    expect(localizeProductImage('', 'ru')).toBe('')
    expect(localizeProductImage('/images/cera_o/s1.jpeg', undefined)).toBe('/images/cera_o/s1.jpeg')
    expect(localizeProductImage('no-slashes.jpeg', 'ru')).toBe('no-slashes.jpeg')
  })

  it('preserves order and length across a gallery', () => {
    const gallery = ['/images/cera_o/s1.jpeg', '/images/cera_o/Main.jpeg', '/images/cera_o/s7.jpeg']
    expect(localizeProductImages(gallery, 'ru')).toEqual([
      '/images/cera_o/ru/s1.jpeg',
      '/images/cera_o/Main.jpeg',
      '/images/cera_o/ru/s7.jpeg',
    ])
  })
})

describe('the manifest matches what is on disk', () => {
  // A registered file that does not exist would 404 on the translated page only,
  // which is exactly the kind of thing nobody notices until a customer does.
  it('every registered localized slide exists', () => {
    const manifest = getLocalizedSlideManifest()
    const missing: string[] = []

    for (const [folder, byLocale] of Object.entries(manifest)) {
      for (const [locale, files] of Object.entries(byLocale)) {
        for (const file of files ?? []) {
          const path = join(process.cwd(), 'public', folder, locale, file)
          if (!existsSync(path)) missing.push(`${folder}/${locale}/${file}`)
        }
      }
    }

    expect(missing).toEqual([])
  })
})
