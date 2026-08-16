"""Take the lookbook grid back off every bespoke page.

The grid listed the whole slide set in the body, which repeats what the
section figures already show. Slides stay where they earn their place: beside
what-it-does, beside the complex, beside how-to. Anything without a section
stays in the thumbnail strip under the hero.
"""
import glob
import re

LOOKBOOK = """      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {STUDIO_SLIDES.map((src, i) => (
            <CeraReveal key={src} delay={i * 50}>
              <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[var(--cera-line)] bg-white">
                <Image
                  src={src}
                  alt={`${product.name} - GENOSYS, slide ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 32vw"
                  quality={85}
                  className="object-contain"
                />
              </div>
            </CeraReveal>
          ))}
        </div>
      </section>

"""

BIOMESO = """      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {config.slides.map((src, i) => (
            <CeraReveal key={src} delay={i * 50}>
              <div className={`relative ${config.figureAspect} overflow-hidden rounded-[24px] border border-[var(--cera-line)] bg-white`}>
                <Image
                  src={src}
                  alt={`${product.name} - GENOSYS, slide ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 32vw"
                  quality={85}
                  className="object-contain"
                />
              </div>
            </CeraReveal>
          ))}
        </div>
      </section>

"""

POWERSOLUTION = """      {variant.studioSlides.length ? (
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {variant.studioSlides.map((src, i) => (
              <CeraReveal key={src} delay={i * 50}>
                <div className="relative aspect-square overflow-hidden rounded-[24px] border border-[var(--cera-line)] bg-white">
                  <Image
                    src={src}
                    alt={`${product.name} - GENOSYS, slide ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 32vw"
                    quality={85}
                    className="object-contain"
                  />
                </div>
              </CeraReveal>
            ))}
          </div>
        </section>
      ) : null}

"""

COMMENT_FIXES = [
    ('Studio slides go on the page, not only in the thumbs.',
     'Section art, each slide paired with the section it illustrates.'),
    ('so they run in the lookbook only\n * *  and are queued for re-export',
     'so they stay in the thumbnail\n *  strip only and are queued for re-export'),
    ('so they\n *  run in the lookbook only and are queued for re-export',
     'so they\n *  stay in the thumbnail strip only and are queued for re-export'),
    ('so they run in the lookbook only\n *  and are queued for re-export',
     'so they stay in the thumbnail strip\n *  only and are queued for re-export'),
    ('so it runs in the lookbook only and is\n *  queued for re-export',
     'so it stays in the thumbnail strip and is\n *  queued for re-export'),
    ('so it\n *  runs in the lookbook only and is queued for re-export',
     'so it\n *  stays in the thumbnail strip and is queued for re-export'),
    ('so it runs in the lookbook\n *  only and is queued for re-export',
     'so it stays in the thumbnail\n *  strip only and is queued for re-export'),
    ('there is no problem-framing\n// section on this page, so it runs in the lookbook after the stats.',
     'there is no problem-framing\n// section on this page, so it appears in the thumbnail strip only.'),
    ('those three carry\n * no section of their own, so they run in the lookbook after the stats, since\n * the page already states the same figures in text.',
     'those three carry\n * no section of their own, so they stay in the thumbnail strip, since the\n * page already states the same figures in text.'),
]

changed = []

for path in sorted(glob.glob('components/product/*/*ProductPage.tsx')):
    src = open(path).read()
    before = src

    for block in (LOOKBOOK, BIOMESO, POWERSOLUTION):
        src = src.replace(block, '')

    # Drop the constant once nothing reads it any more.
    if 'STUDIO_SLIDES' in src and 'STUDIO_SLIDES.map' not in src:
        src = re.sub(r'const STUDIO_SLIDES = \[\n(?:.*\n)*?\] as const\n\n', '', src, count=1)

    for a, b in COMMENT_FIXES:
        src = src.replace(a, b)

    if src != before:
        open(path, 'w').write(src)
        changed.append(path)

print('\n'.join(changed))
print(f'{len(changed)} pages updated')
