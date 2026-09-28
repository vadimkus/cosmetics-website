import { beautyBoxImagesJson, beautyBoxMemberNumbers } from '@/lib/beautyBoxGallery'

const members = new Map(beautyBoxMemberNumbers('55').map((n) => [n, `/images/m${n}.jpg`]))
const memberImages = beautyBoxMemberNumbers('55').map((n) => `/images/m${n}.jpg`)

describe('beautyBoxImagesJson', () => {
  it('leads with the kit shot, then the box slides, then the members in page order', () => {
    const slides = ['/images/bb/s1.jpg', '/images/bb/s2.jpg']
    const out = JSON.parse(beautyBoxImagesJson('55', '/images/bb/main.jpg', JSON.stringify(slides), members)!)
    expect(out).toEqual(['/images/bb/main.jpg', ...slides, ...memberImages])
  })

  it('keeps a member packshot listed in the box record in its routine position', () => {
    const listed = JSON.stringify([memberImages[2], '/images/bb/s1.jpg'])
    const out = JSON.parse(beautyBoxImagesJson('55', '/images/bb/main.jpg', listed, members)!)
    expect(out).toEqual(['/images/bb/main.jpg', '/images/bb/s1.jpg', ...memberImages])
  })

  it('leaves a product that is not a box untouched', () => {
    expect(beautyBoxImagesJson('15', '/images/a.jpg', '["/images/b.jpg"]', members)).toBe('["/images/b.jpg"]')
  })
})
