"""Put the studio / claim slides on the bespoke pages, not only in the thumbs.

Same treatment already shipped on products 17, 18, 19 and 24: a lookbook grid
after the stats strip, plus a sticky figure beside "what it does" and beside
"how to use". Engine figures are left exactly as the page already chose them.
"""
import re
import sys

PAGES = {
    'components/product/snowo2/SnowO2ProductPage.tsx': {
        'folder': '/images/cleanser/',
        'slides': ['S1.jpg', 'S2.jpg', 'S3.jpg', 'S4.jpg', 'S5.jpg', 'S6.jpg'],
        'effects': 'S5.jpg',
        'howto': 'S4.jpg',
        'engine_contain': False,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. S5 is the\n'
            ' *  fresh-and-clean results slide, S4 the four-step how-to. Leftover slide\n'
            ' *  copy (paraben-free, sensitive, Phytolex-as-engine) is queued for\n'
            ' *  re-export; the editorial copy does not repeat it. The engine figure\n'
            ' *  stays on the two-pump packshot. */'
        ),
    },
    'components/product/remover/RemoverProductPage.tsx': {
        'folder': '/images/remover/',
        'slides': ['S1b.jpg', 'S2b.jpg', 'S3b.jpg', 'S4b.jpg', 'S5b.jpg', 'S6b.jpg'],
        'effects': 'S5b.jpg',
        'howto': 'S4b.jpg',
        'engine_contain': False,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. S5b is the\n'
            ' *  clean-not-greasy results slide, S4b the shake-and-wipe how-to. Leftover\n'
            ' *  slide copy (peptides, waterproof, no sting) is queued for re-export; the\n'
            ' *  editorial copy does not repeat it. The engine figure stays on the\n'
            ' *  bottle packshot. */'
        ),
    },
    'components/product/epi/EpiProductPage.tsx': {
        'folder': '/images/epi/',
        'slides': ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg'],
        'effects': 's5.jpeg',
        'howto': 's4.jpeg',
        'engine_contain': False,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. s5 is the\n'
            ' *  smooth-not-stripped results slide, s4 the once-or-twice-weekly how-to.\n'
            ' *  s1 still carries the old "without irritation" line and is queued for\n'
            ' *  re-export; the editorial copy does not repeat it. The engine figure\n'
            ' *  stays on the tube packshot. */'
        ),
    },
    'components/product/mist/MistProductPage.tsx': {
        'folder': '/images/mist/',
        'slides': ['S1.jpeg', 'S2.jpeg', 'S3.jpeg', 'S4.jpeg', 'S5.jpeg', 'S6.jpeg'],
        'effects': 'S6.jpeg',
        'howto': 'S4.jpeg',
        'engine_contain': True,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. S6 is the\n'
            ' *  dewy-balanced-luminous results slide, S4 the shake-spray-glow how-to.\n'
            ' *  Leftover slide copy (FENSEBIOME-as-engine, HA10, pat-in) is queued for\n'
            ' *  re-export; the editorial copy does not repeat it. */'
        ),
    },
    'components/product/pcttoner/PctTonerProductPage.tsx': {
        'folder': '/images/problem/',
        'slides': ['S1.jpg', 'S2.jpg', 'S3.jpg', 'S4.jpg', 'S5.jpg', 'S6.jpg'],
        'effects': 'S5.jpg',
        'howto': 'S4.jpg',
        'engine_contain': True,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. S5 is the\n'
            ' *  clear-calm-not-stripped results slide, S4 the three-ways-to-use how-to.\n'
            ' *  Leftover slide copy (patented Anti Sebum P, pH balance) is queued for\n'
            ' *  re-export; the editorial copy does not repeat it. */'
        ),
    },
    'components/product/eyepatch/EyePatchProductPage.tsx': {
        'folder': '/images/patch/',
        'slides': ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg'],
        'effects': 's3.jpeg',
        'howto': 's5.jpeg',
        'engine_contain': True,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. s3 is the\n'
            ' *  four-jobs slide, s4 the formula breakdown (Niacinamide 2%, Adenosine\n'
            ' *  0.04%, 46.5 ppb) and s5 the eye ritual. Main / s1 / s6 still print\n'
            ' *  10 Years Back on the jar and s4 bakes in "Intertek formula"; both are\n'
            ' *  later image jobs. The editorial copy does not repeat them. */'
        ),
    },
    'components/product/overnight/OvernightProductPage.tsx': {
        'folder': '/images/overnight/',
        'slides': ['S1.jpeg', 'S2.jpeg', 'S3.jpeg', 'S4.jpeg', 'S5.jpeg'],
        'effects': None,
        'howto': 'S5.jpeg',
        'engine_contain': True,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. S3 prints the\n'
            ' *  documented four-week TEWL / erythema figures and stays beside the\n'
            ' *  complex; S5 is the overnight ritual. S1 / S2 / S4 still sell oxygen\n'
            ' *  therapy and the growth-factor list, so they run in the lookbook only\n'
            ' *  and are queued for re-export. */'
        ),
    },
    'components/product/peptidegel/PeptideGelProductPage.tsx': {
        'folder': '/images/peptide_mask/',
        'slides': ['s1c.jpeg', 's2c.jpeg', 's3c.jpeg', 's4c.jpeg', 's5c.jpeg'],
        'effects': 's4c.jpeg',
        'howto': 's3c.jpeg',
        'engine_contain': False,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. s4c is the\n'
            ' *  post-procedure cool-down slide, s3c the twenty-to-forty-minute how-to.\n'
            ' *  s1c / s2c / s5c still print patented thermo-sensitive delivery, so they\n'
            ' *  run in the lookbook only and are queued for re-export. The engine\n'
            ' *  figure stays on the pouch. */'
        ),
    },
    'components/product/ezco2/EzCo2ProductPage.tsx': {
        'folder': '/images/ez_mask/',
        'slides': ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg', 's7.jpeg', 's8.jpeg'],
        'effects': 's5.jpeg',
        'howto': 's6.jpeg',
        'engine_contain': True,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. s5 is the\n'
            ' *  four-dimensions results slide, s6 the ten-minute ritual. s8 prints the\n'
            ' *  official kit name and the spatula, so it stays beside the complex. */'
        ),
    },
    'components/product/collagenmask/CollagenMaskProductPage.tsx': {
        'folder': '/images/collagen_mask/',
        'slides': ['S1.jpeg', 'S2.jpeg', 'S3.jpeg', 'S4.jpeg', 'S5.jpeg'],
        'effects': 'S5.jpeg',
        'howto': 'S4.jpeg',
        'engine_contain': True,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. S3 is the\n'
            ' *  ingredient breakdown and stays beside the essence section, S5 is the\n'
            ' *  firm-hydrated-repaired results slide, S4 the fifteen-to-twenty-minute\n'
            ' *  how-to. S2 still carries brightening and anti-ageing lines this page\n'
            ' *  does not claim, so it runs in the lookbook only and is queued for\n'
            ' *  re-export. */'
        ),
    },
}

LOOKBOOK = """
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-20">
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

FIGURE = """        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <CeraReveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
              <Image
                src={%s}
                alt={%s}
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                quality={85}
                className="object-contain"
              />
            </div>
          </CeraReveal>
          <div>
"""

EFFECTS_MARK = '      {/* ──────────────────────── What it does ──────────────────────────── */}\n'
HOWTO_MARK = '      {/* ───────────────────────── How to use ───────────────────────────── */}\n'


def section_bounds(src, mark):
    """Return (body_start, body_end) for the section that follows a marker."""
    i = src.index(mark) + len(mark)
    open_end = src.index('>\n', i) + 2
    end = src.index('\n      </section>', open_end)
    return i, open_end, end


def build_consts(cfg):
    lines = [cfg['comment'], 'const STUDIO_SLIDES = [']
    for s in cfg['slides']:
        lines.append("  '%s%s'," % (cfg['folder'], s))
    lines.append('] as const')
    lines.append('')
    if cfg['effects']:
        lines.append("const EFFECTS_IMAGE = '%s%s'" % (cfg['folder'], cfg['effects']))
    lines.append("const HOWTO_IMAGE = '%s%s'" % (cfg['folder'], cfg['howto']))
    return '\n'.join(lines)


def apply(path, cfg):
    src = open(path).read()

    # 1. constants: replace the existing doc comment + ENGINE_IMAGE line.
    m = re.search(r"(/\*\*(?:[^*]|\*(?!/))*\*/\n)?const ENGINE_IMAGE = '([^']+)'", src)
    if not m:
        raise SystemExit('no ENGINE_IMAGE in ' + path)
    engine = m.group(2)
    src = src[:m.start()] + build_consts(cfg) + "\nconst ENGINE_IMAGE = '%s'" % engine + src[m.end():]

    # 2. lookbook grid before "What it does".
    src = src.replace(EFFECTS_MARK, LOOKBOOK.lstrip('\n') + '\n' + EFFECTS_MARK, 1)

    # 3. figure beside "What it does".
    if cfg['effects']:
        _, open_end, end = section_bounds(src, EFFECTS_MARK)
        body = src[open_end:end]
        wrapped = FIGURE % ('EFFECTS_IMAGE', 'copy.effects.title') + body + '\n          </div>\n        </div>'
        src = src[:open_end] + wrapped + src[end:]

    # 4. figure beside "How to use", and widen the section.
    _, open_end, end = section_bounds(src, HOWTO_MARK)
    open_tag_start = src.index('<section className="', src.index(HOWTO_MARK))
    open_tag = src[open_tag_start:open_end]
    new_open = open_tag.replace('max-w-[900px]', 'max-w-[1200px]')
    body = src[open_end:end]
    figure = FIGURE % ('HOWTO_IMAGE', 'copy.howTo.title')
    # the how-to body already opens with its own <div>, which becomes the right column
    figure = figure.rsplit('          <div>\n', 1)[0]
    wrapped = figure + body + '\n        </div>'
    src = src[:open_tag_start] + new_open + wrapped + src[end:]

    # 5. engine figure: crop to contain when it is a claim slide, not a packshot.
    if cfg['engine_contain']:
        needle = 'src={ENGINE_IMAGE}'
        i = src.index(needle)
        j = src.index('className="object-cover"', i)
        src = src[:j] + 'className="object-contain"' + src[j + len('className="object-cover"'):]

    open(path, 'w').write(src)
    print('updated', path)


for path, cfg in PAGES.items():
    apply(path, cfg)
