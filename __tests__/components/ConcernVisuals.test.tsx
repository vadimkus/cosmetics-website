import fs from 'node:fs'
import path from 'node:path'
import { cleanup, render, screen } from '@testing-library/react'
import ConcernHero from '@/components/ConcernHero'
import ConcernShowcase from '@/components/concerns/ConcernShowcase'
import { CONCERN_PAGES, getAllConcernSlugs } from '@/lib/concernsData'
import { CONCERN_VISUALS, getConcernVisual } from '@/lib/concernVisuals'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

const EXPECTED_IMAGES = {
  'sun-protection': '/images/home/skin_concern/sun-protection.webp',
  'acne-treatment': '/images/home/skin_concern/acne-blemishes.webp',
  pigmentation: '/images/home/skin_concern/pigmentation.webp',
  'scars-treatment': '/images/home/skin_concern/scar-treatment.webp',
  'hair-loss': '/images/home/skin_concern/hair-loss.webp',
  'anti-aging': '/images/home/skin_concern/anti-aging.webp',
  hydration: '/images/home/skin_concern/hydration.webp',
  sensitivity: '/images/home/skin_concern/sensitive-skin.webp',
}

describe('shared concern visuals', () => {
  it('covers every canonical concern slug with the exact optimized WebP', () => {
    expect(Object.keys(CONCERN_VISUALS)).toEqual(getAllConcernSlugs())
    expect(
      Object.fromEntries(
        getAllConcernSlugs().map(slug => [slug, getConcernVisual(slug)?.image])
      )
    ).toEqual(EXPECTED_IMAGES)

    for (const image of Object.values(EXPECTED_IMAGES)) {
      expect(image).toMatch(/\.webp$/)
      expect(fs.existsSync(path.join(process.cwd(), 'public', image))).toBe(true)
    }
  })

  it('renders the shared image in every English concern hero', () => {
    for (const concern of CONCERN_PAGES) {
      const { container } = render(<ConcernHero concern={concern} locale="en" />)
      const hero = screen.getByTestId('concern-hero')
      const image = container.querySelector('img')

      expect(hero).toHaveAttribute('data-concern-slug', concern.slug)
      expect(image).toHaveAttribute('src', EXPECTED_IMAGES[concern.slug as keyof typeof EXPECTED_IMAGES])
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(concern.seo.en.h1)
      cleanup()
    }
  })

  it('renders the same eight images in the shared concern showcase', () => {
    // /products and the homepage render this identical block, so one assertion
    // covers both. Nine links: eight concerns plus the skin-analysis CTA.
    const { container } = render(<ConcernShowcase locale="en" dir="ltr" />)
    const images = Array.from(container.querySelectorAll('img')).map(image =>
      image.getAttribute('src')
    )

    expect(images).toEqual(Object.values(EXPECTED_IMAGES))
    expect(screen.getAllByRole('link')).toHaveLength(9)
  })

  it('mirrors the shared visual and preserves RTL Arabic composition', () => {
    const concern = CONCERN_PAGES.find(item => item.slug === 'sensitivity')
    expect(concern).toBeDefined()

    const { container } = render(<ConcernHero concern={concern!} locale="ar" />)
    expect(screen.getByTestId('concern-hero')).toHaveAttribute('dir', 'rtl')
    expect(container.querySelector('img')).toHaveStyle({ transform: 'scaleX(-1)' })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(concern!.seo.ar.h1)
  })
})
