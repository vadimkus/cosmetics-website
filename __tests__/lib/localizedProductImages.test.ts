import {
  getLocalizedSlideManifest,
  localizeProductImage,
  localizeProductImages,
  localizeProductImagesJson,
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

  it('swaps Arabic too', () => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'ar')).toBe('/images/cera_o/ar/s1.jpeg')
  })

  it('leaves a locale with no translated set alone', () => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'de')).toBe('/images/cera_o/s1.jpeg')
  })

  it('leaves an unregistered file in a registered folder alone', () => {
    // Main.jpeg is a packshot with no text, so it has no Russian version.
    expect(localizeProductImage('/images/cera_o/Main.jpeg', 'ru')).toBe('/images/cera_o/Main.jpeg')
  })

  it('localizes the PDRN slide set by its content-aligned filename', () => {
    expect(localizeProductImage('/images/pdrn_5000_new/S3.jpeg', 'ru')).toBe(
      '/images/pdrn_5000_new/ru/S3.jpeg'
    )
    expect(localizeProductImage('/images/pdrn_5000_new/S8.jpeg', 'ar')).toBe(
      '/images/pdrn_5000_new/ar/S8.jpeg'
    )
  })

  it('localizes the corrected PDRN composition slide in both languages', () => {
    expect(localizeProductImage('/images/pdrn_5000_new/S4.jpeg', 'ru')).toBe(
      '/images/pdrn_5000_new/ru/S4.jpeg'
    )
    expect(localizeProductImage('/images/pdrn_5000_new/S4.jpeg', 'ar')).toBe(
      '/images/pdrn_5000_new/ar/S4.jpeg'
    )
  })

  it('localizes approved Revita Glow slides', () => {
    expect(localizeProductImage('/images/revita_o/s1.jpg', 'ru')).toBe(
      '/images/revita_o/ru/s1.jpg'
    )
    expect(localizeProductImage('/images/revita_o/s7.jpg', 'ar')).toBe(
      '/images/revita_o/ar/s7.jpg'
    )
    expect(localizeProductImage('/images/revita_o/closing.jpg', 'ru-RU')).toBe(
      '/images/revita_o/ru/closing.jpg'
    )
  })

  it('falls back from Revita Glow exports that add unsupported claims', () => {
    expect(localizeProductImage('/images/revita_o/s7.jpg', 'ru')).toBe(
      '/images/revita_o/s7.jpg'
    )
    expect(localizeProductImage('/images/revita_o/s1.jpg', 'ar')).toBe(
      '/images/revita_o/s1.jpg'
    )
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

describe('locale tags from the mobile app', () => {
  // The website sends 'ru'; the app's x-locale header can be a full tag.
  it.each(['ru', 'ru-RU', 'RU', 'ru_RU'])('treats %s as Russian', tag => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', tag)).toBe('/images/cera_o/ru/s1.jpeg')
  })

  it.each(['ar', 'ar-AE', 'AR'])('treats %s as Arabic', tag => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', tag)).toBe('/images/cera_o/ar/s1.jpeg')
  })

  it('ignores a locale with no registered set', () => {
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'en-GB')).toBe('/images/cera_o/s1.jpeg')
    expect(localizeProductImage('/images/cera_o/s1.jpeg', 'fr-FR')).toBe('/images/cera_o/s1.jpeg')
  })
})

describe('localizeProductImagesJson', () => {
  it('maps the JSON column and returns JSON', () => {
    const json = JSON.stringify(['/images/cera_o/s1.jpeg', '/images/cera_o/Main.jpeg'])
    expect(JSON.parse(localizeProductImagesJson(json, 'ru-RU')!)).toEqual([
      '/images/cera_o/ru/s1.jpeg',
      '/images/cera_o/Main.jpeg',
    ])
  })

  it('passes null and English straight through', () => {
    const json = JSON.stringify(['/images/cera_o/s1.jpeg'])
    expect(localizeProductImagesJson(null, 'ru')).toBeNull()
    expect(localizeProductImagesJson(json, 'en')).toBe(json)
  })

  it('does not turn a malformed column into a crash', () => {
    expect(localizeProductImagesJson('not json', 'ru')).toBe('not json')
    expect(localizeProductImagesJson('{"a":1}', 'ru')).toBe('{"a":1}')
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
