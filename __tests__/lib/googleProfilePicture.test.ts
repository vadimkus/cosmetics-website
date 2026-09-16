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
