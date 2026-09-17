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

import { isGoogleDefaultAvatar, isGoogleDefaultAvatarSize } from '@/lib/googleProfilePicture'

describe('isGoogleDefaultAvatar', () => {
  const fake = (bytes: number, ok = true) =>
    (async () =>
      ({
        ok,
        headers: new Headers({ 'content-length': String(bytes) }),
        arrayBuffer: async () => new ArrayBuffer(bytes),
      }) as unknown as Response) as unknown as typeof fetch

  it('flags the 567-byte blue silhouette Google serves for photo-less accounts', async () => {
    expect(isGoogleDefaultAvatarSize(567)).toBe(true)
    expect(await isGoogleDefaultAvatar('https://lh3.googleusercontent.com/a-/x=s96-c', fake(567))).toBe(true)
  })

  it('accepts a real portrait', async () => {
    expect(isGoogleDefaultAvatarSize(7974)).toBe(false)
    expect(await isGoogleDefaultAvatar('https://lh3.googleusercontent.com/a/y=s96-c', fake(7974))).toBe(false)
  })

  it('never blocks a refresh on a fetch failure', async () => {
    const failing = (async () => { throw new Error('offline') }) as unknown as typeof fetch
    expect(await isGoogleDefaultAvatar('https://lh3.googleusercontent.com/a/z', failing)).toBe(false)
    expect(await isGoogleDefaultAvatar('https://lh3.googleusercontent.com/a/z', fake(0, false))).toBe(false)
  })
})
