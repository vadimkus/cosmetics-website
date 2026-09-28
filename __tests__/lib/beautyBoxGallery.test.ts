import { beautyBoxImagesJson, beautyBoxMemberNumbers } from '@/lib/beautyBoxGallery'

const members = new Map(beautyBoxMemberNumbers('55').map((n) => [n, `/images/m${n}.jpg`]))
const memberImages = beautyBoxMemberNumbers('55').map((n) => `/images/m${n}.jpg`)

describe('beautyBoxImagesJson', () => {
  it('shows the kit shot and the campaign slides only, once a box has slides', () => {
    const slides = ['/images/bb/s1.jpg', '/images/bb/s2.jpg']
    const out = JSON.parse(beautyBoxImagesJson('55', '/images/bb/main.jpg', JSON.stringify(slides), members)!)
    expect(out).toEqual(['/images/bb/main.jpg', ...slides])
  })

  it('falls back to the members in page order for a box without slides', () => {
    for (const images of [null, '[]']) {
      const out = JSON.parse(beautyBoxImagesJson('55', '/images/bb/main.jpg', images, members)!)
      expect(out).toEqual(['/images/bb/main.jpg', ...memberImages])
    }
  })

  it('does not count a member packshot in the box record as a campaign slide', () => {
    const listed = JSON.stringify([memberImages[2]])
    const out = JSON.parse(beautyBoxImagesJson('55', '/images/bb/main.jpg', listed, members)!)
    expect(out).toEqual(['/images/bb/main.jpg', ...memberImages])
  })

  it('leaves a product that is not a box untouched', () => {
    expect(beautyBoxImagesJson('15', '/images/a.jpg', '["/images/b.jpg"]', members)).toBe('["/images/b.jpg"]')
  })
})
