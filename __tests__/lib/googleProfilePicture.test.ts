import {
  isGoogleHostedProfilePicture,
  shouldRefreshGoogleProfilePicture,
} from '@/lib/googleProfilePicture'

describe('Google profile picture refresh', () => {
  it('recognizes only HTTPS Google-hosted avatars', () => {
    expect(isGoogleHostedProfilePicture('https://lh3.googleusercontent.com/a/photo')).toBe(true)
    expect(isGoogleHostedProfilePicture('https://evilgoogleusercontent.com/photo')).toBe(false)
    expect(isGoogleHostedProfilePicture('http://lh3.googleusercontent.com/a/photo')).toBe(false)
  })

  it('refreshes missing and changed Google-hosted pictures', () => {
    const latest = 'https://lh3.googleusercontent.com/a/latest'
    expect(shouldRefreshGoogleProfilePicture(null, latest)).toBe(true)
    expect(
      shouldRefreshGoogleProfilePicture(
        'https://lh3.googleusercontent.com/a/old',
        latest,
      ),
    ).toBe(true)
  })

  it('does not overwrite a customer-uploaded GENOSYS photo', () => {
    expect(
      shouldRefreshGoogleProfilePicture(
        'data:image/jpeg;base64,customer-photo',
        'https://lh3.googleusercontent.com/a/google',
      ),
    ).toBe(false)
  })

  it('does not write when Google returns no new picture or the same URL', () => {
    const current = 'https://lh3.googleusercontent.com/a/current'
    expect(shouldRefreshGoogleProfilePicture(current, '')).toBe(false)
    expect(shouldRefreshGoogleProfilePicture(current, current)).toBe(false)
  })
})

import sharp from 'sharp'
import { randomBytes } from 'crypto'
import { googlePictureForNewUser, googlePictureUpdate, isGoogleDefaultAvatar } from '@/lib/googleProfilePicture'

const png = (r: number, g: number, b: number, whiteBox = 0) =>
  sharp({ create: { width: 96, height: 96, channels: 3, background: { r, g, b } } })
    .composite(whiteBox ? [{ input: { create: { width: whiteBox, height: whiteBox, channels: 3, background: { r: 255, g: 255, b: 255 } } }, top: 30, left: 30 }] : [])
    .png()
    .toBuffer()

const serve = (images: Record<string, Buffer>) =>
  (async (url: string) => {
    const b = images[url]
    if (!b) throw new Error('offline')
    return { ok: true, headers: new Headers({ 'content-length': String(b.length) }), arrayBuffer: async () => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) } as unknown as Response
  }) as unknown as typeof fetch

const G = 'https://lh3.googleusercontent.com/a/'
let IMG: Record<string, Buffer>

beforeAll(async () => {
  const noise = await sharp(randomBytes(96 * 96 * 3), { raw: { width: 96, height: 96, channels: 3 } }).png().toBuffer()
  IMG = {
    [G + 'silhouette']: await png(160, 195, 255),
    [G + 'blank']: await png(255, 255, 255),
    [G + 'letter']: await png(233, 30, 99, 19),
    [G + 'photo']: noise,
    [G + 'photo2']: noise,
  }
})

describe('isGoogleDefaultAvatar', () => {
  it('flags the silhouette and the blank tile', async () => {
    expect(await isGoogleDefaultAvatar(G + 'silhouette', serve(IMG))).toBe(true)
    expect(await isGoogleDefaultAvatar(G + 'blank', serve(IMG))).toBe(true)
  })

  it('keeps coloured letter avatars and real photos', async () => {
    expect(await isGoogleDefaultAvatar(G + 'letter', serve(IMG))).toBe(false)
    expect(await isGoogleDefaultAvatar(G + 'photo', serve(IMG))).toBe(false)
  })

  it('never blocks a refresh on a fetch failure', async () => {
    expect(await isGoogleDefaultAvatar(G + 'missing', serve(IMG))).toBe(false)
  })
})

describe('googlePictureUpdate', () => {
  it('never touches a photo uploaded through GENOSYS', async () => {
    expect(await googlePictureUpdate('/uploads/me.jpg', G + 'silhouette', serve(IMG))).toBeUndefined()
    expect(await googlePictureUpdate('https://genosys.ae/uploads/me.jpg', G + 'photo', serve(IMG))).toBeUndefined()
  })

  it('stores a real Google portrait or letter avatar', async () => {
    expect(await googlePictureUpdate(null, G + 'photo', serve(IMG))).toBe(G + 'photo')
    expect(await googlePictureUpdate(G + 'photo', G + 'photo2', serve(IMG))).toBe(G + 'photo2')
    expect(await googlePictureUpdate(null, G + 'letter', serve(IMG))).toBe(G + 'letter')
    expect(await googlePictureUpdate(G + 'photo', G + 'photo', serve(IMG))).toBeUndefined()
  })

  it('never stores the placeholder, and clears one already stored', async () => {
    expect(await googlePictureUpdate(null, G + 'silhouette', serve(IMG))).toBeUndefined()
    expect(await googlePictureUpdate(G + 'silhouette', G + 'silhouette', serve(IMG))).toBeNull()
  })

  it('keeps an earlier real Google photo when Google now serves the placeholder', async () => {
    expect(await googlePictureUpdate(G + 'photo', G + 'silhouette', serve(IMG))).toBeUndefined()
  })

  it('new accounts get initials instead of the placeholder', async () => {
    expect(await googlePictureForNewUser(G + 'silhouette', serve(IMG))).toBeNull()
    expect(await googlePictureForNewUser(G + 'photo', serve(IMG))).toBe(G + 'photo')
    expect(await googlePictureForNewUser(undefined, serve(IMG))).toBeNull()
  })
})
