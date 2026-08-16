"""Create the product 20 page from the product 19 layout.

The two share a shape exactly: 30ml dropper serum, five no-additions carton
badge, AM/PM plus a video, actives, suited/not, routine, spec, FAQ. So the
page is the AFS layout with the identifiers and the section art swapped.
"""
SRC = 'components/product/afs/AfsProductPage.tsx'
DST = 'components/product/pcserum/PcserumProductPage.tsx'

src = open(SRC).read()

RENAMES = [
    ("./afs.css", "./pcserum.css"),
    ("getAfsCopy", "getPcserumCopy"),
    ("./afsCopy", "./pcserumCopy"),
    ("AfsProductPage", "PcserumProductPage"),
    ("afs-page", "pcserum-page"),
    ("afs-not", "pcserum-not"),
    ("afs-video", "pcserum-video"),
    ("'Afs'", "'Pcserum'"),
    ("[Afs]", "[Pcserum]"),
]
for a, b in RENAMES:
    src = src.replace(a, b)

# Section art: the product 20 slide set.
OLD_CONSTS_START = src.index('const STUDIO_SLIDES = [')
OLD_CONSTS_END = src.index("const PROOF_IMAGE = '/images/sensitive_serum/s1.jpeg'")
OLD_CONSTS_END += len("const PROOF_IMAGE = '/images/sensitive_serum/s1.jpeg'")

NEW_CONSTS = """/** Studio slides go on the page, not only in the thumbs. s2 is the
 *  sebum / texture / comfort slide, s3 the complex with the percentages,
 *  s4 the toner-serum-cream ritual and s5 the five no-additions. s3 still
 *  prints "non-comedogenic", which no test on file supports, so it is
 *  queued for re-export; the copy does not repeat it. */
const STUDIO_SLIDES = [
  '/images/problems_serum/s1.jpeg',
  '/images/problems_serum/s2.jpeg',
  '/images/problems_serum/s3.jpeg',
  '/images/problems_serum/s4.jpeg',
  '/images/problems_serum/s5.jpeg',
  '/images/problems_serum/s6.jpeg',
] as const

const ENGINE_IMAGE = '/images/problems_serum/s3.jpeg'
const HOWTO_IMAGE = '/images/problems_serum/s4.jpeg'
const EFFECTS_IMAGE = '/images/problems_serum/s2.jpeg'
const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'"""

src = src[:OLD_CONSTS_START] + NEW_CONSTS + src[OLD_CONSTS_END:]

# The header docblock is product 19's. Replace it wholesale.
head_start = src.index("/**\n * Bespoke product page for")
head_end = src.index(" */\n", head_start) + len(" */\n")

NEW_HEAD = """/**
 * Bespoke product page for PROBLEM CONTROL SERUM (product 20).
 *
 * Same editorial system as the rest of the range: primitives, gallery and
 * structural CSS come from ../cerabarrier, with a cool eucalyptus palette
 * on top from pcserum.css, taken from the black glass and the leaves in the
 * studio slides rather than from the toner's ice blue.
 *
 * Section order:
 *
 *   effects  Sebum. Texture. Comfort.
 *   engine   Zinc PCA 0.05%, neat, plus what sits behind it
 *   clean    the five no-additions from the carton
 *   howTo    toner first, two or three drops, pat, AM and PM, plus video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   oily and combination skin; not an acid step; not for dry skin
 *   routine  cleanse, problem toner, this serum, problem cream
 *
 * See pcserumCopy.ts. Do not rebuild the page around ACZERO, PORE LASER,
 * tea tree, niacinamide, salicylic acid or a -16.6% redness figure. None of
 * them is in this product.
 */
"""
src = src[:head_start] + NEW_HEAD + src[head_end:]

open(DST, 'w').write(src)
print('wrote', DST)
