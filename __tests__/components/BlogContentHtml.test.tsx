import { fireEvent, render, screen } from '@testing-library/react'
import BlogContentHtml from '@/components/blog/BlogContentHtml'

describe('BlogContentHtml', () => {
  beforeEach(() => {
    jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('shows an accessible play control and restores it when playback ends', () => {
    const { container, unmount } = render(
      <BlogContentHtml
        html={'<div><div><video controls src="/videos/product.mp4"></video></div></div>'}
      />
    )

    const video = container.querySelector('video') as HTMLVideoElement
    const player = video.parentElement as HTMLElement
    const playButton = screen.getByRole('button', { name: 'Watch product video' })

    expect(player).toHaveAttribute('hidden')
    expect(player.style.width).toBe('fit-content')

    fireEvent.click(playButton)
    expect(playButton).toHaveAttribute('hidden')
    expect(player).not.toHaveAttribute('hidden')
    expect(video.play).toHaveBeenCalled()

    fireEvent.ended(video)
    expect(player).toHaveAttribute('hidden')
    expect(playButton).not.toHaveAttribute('hidden')

    unmount()
    expect(player.style.width).toBe('')
  })
})
