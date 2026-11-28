import fs from 'node:fs'
import path from 'node:path'

import { getBespokeContent } from '@/lib/bespokeContent'
import { getMobileHowFilm } from '@/lib/mobileHowFilm'
import { HOW_FILM_MEDIA } from '@/components/product/biomeso/biomesoHowFilmCopy'

const locales = ['en', 'ru', 'ar'] as const

/**
 * The mobile app draws the "How to use it" films of product 65 from this payload, so what the web player reads and what
 * the app is told must stay one thing. These checks keep the payload plain data, tied to the web module, and off every
 * product that has no films.
 */
describe('the How to use it film in the mobile bespoke content', () => {
  it('rides on the howTo block of product 65 in every language', () => {
    for (const locale of locales) {
      const content = getBespokeContent('65', locale)
      const howTo = content?.blocks.find((block) => block.key === 'howTo')
      expect(howTo).toBeDefined()
      expect(howTo?.film).toBeDefined()
      expect(howTo?.film?.steps).toHaveLength(3)
      expect(howTo?.film?.media).toHaveLength(3)
      // the cards beside the films are still there, and the film belongs to the block that holds them
      expect(howTo?.entries?.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('is plain JSON: nothing is lost or invented on the way through the API', () => {
    for (const locale of locales) {
      const film = getMobileHowFilm('65', locale)
      expect(film).not.toBeNull()
      expect(JSON.parse(JSON.stringify(film))).toEqual(film)
      for (const step of film!.steps) {
        for (const field of [step.id, step.eyebrow, step.title, step.body, step.alt]) {
          expect(typeof field).toBe('string')
          expect(field.trim().length).toBeGreaterThan(0)
        }
      }
      for (const text of Object.values(film!.ui).flat()) {
        expect(typeof text).toBe('string')
        expect((text as string).trim().length).toBeGreaterThan(0)
      }
      expect(film!.ui.stepLabels).toHaveLength(3)
      expect(new Set(film!.ui.stepLabels).size).toBe(3)
    }
  })

  it('names the same three files the web player plays, and they are really in /public', () => {
    const film = getMobileHowFilm('65', 'en')!
    expect(film.media).toEqual(HOW_FILM_MEDIA.map(({ poster, video }) => ({ poster, video })))
    for (const { poster, video } of film.media) {
      // site-relative, so the app puts its own asset origin in front like it does for every other picture
      expect(poster.startsWith('/images/')).toBe(true)
      expect(video.startsWith('/videos/')).toBe(true)
      expect(fs.existsSync(path.join(process.cwd(), 'public', poster))).toBe(true)
      expect(fs.existsSync(path.join(process.cwd(), 'public', video))).toBe(true)
    }
  })

  it('lights up cards that exist, in order', () => {
    for (const locale of locales) {
      const howTo = getBespokeContent('65', locale)!.blocks.find((block) => block.key === 'howTo')!
      const cards = howTo.entries!.length
      let previous = -1
      for (const card of howTo.film!.cardForStep) {
        expect(card).toBeGreaterThan(previous)
        expect(card).toBeLessThan(cards)
        previous = card
      }
    }
  })

  it('speaks the locale the app asks for, in the forms the API sees', () => {
    const english = getMobileHowFilm('65', 'en')!
    expect(getMobileHowFilm('65', 'EN-us')).toEqual(english)
    expect(getMobileHowFilm('65', 'de')).toEqual(english)
    expect(getMobileHowFilm('65', '')).toEqual(english)
    const russian = getMobileHowFilm('65', 'ru')!
    expect(getMobileHowFilm('65', 'ru-RU')).toEqual(russian)
    expect(russian.steps[0]?.eyebrow).not.toBe(english.steps[0]?.eyebrow)
    const arabic = getMobileHowFilm('65', 'ar-AE')!
    expect(arabic).toEqual(getMobileHowFilm('65', 'ar'))
    expect(arabic.steps[0]?.eyebrow).not.toBe(english.steps[0]?.eyebrow)
  })

  it('is on no other product', () => {
    expect(getMobileHowFilm('60', 'en')).toBeNull()
    expect(getMobileHowFilm(undefined, 'en')).toBeNull()
    expect(getMobileHowFilm(null, 'en')).toBeNull()
    for (let n = 1; n <= 80; n += 1) {
      if (n === 65) continue
      const content = getBespokeContent(String(n), 'en')
      for (const block of content?.blocks ?? []) expect(block.film).toBeUndefined()
    }
  })
})
