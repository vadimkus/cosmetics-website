"""Create the product 31 page from the product 30 layout (two-tube cream)."""
SRC = 'components/product/pccream/PccreamProductPage.tsx'
DST = 'components/product/mvcream/MvcreamProductPage.tsx'

src = open(SRC).read()
for a, b in [
    ("./pccream.css", "./mvcream.css"),
    ("getPccreamCopy", "getMvcreamCopy"),
    ("./pccreamCopy", "./mvcreamCopy"),
    ("PccreamProductPage", "MvcreamProductPage"),
    ("pccream-page", "mvcream-page"),
    ("pccream-not", "mvcream-not"),
    ("pccream-video", "mvcream-video"),
    ("PcCream:", "MvCream:"),
    ("getProductSizeOptions('30'", "getProductSizeOptions('31'"),
]:
    src = src.replace(a, b)

h = src.index("/**\n * Bespoke product page for")
he = src.index(" */\n", h) + len(" */\n")
src = src[:h] + """/**
 * Bespoke product page for MULTI VITA RADIANCE CREAM (product 31).
 *
 * The cream half of the pair whose serum is product 21, and structurally the
 * twin of product 30: two tubes, so a size travels with every cart call. The
 * palette is the cream's own orange, which comes from the astaxanthin rather
 * than from a pigment.
 *
 * Section order:
 *
 *   effects  even tone, real glow
 *   engine   the number that gets checked
 *   clean    the two-week trial, including the 95% that is not 100%
 *   howTo    serum first, cream last, sunscreen over it, plus video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   normal to dry with uneven tone; too rich for oily skin
 *   routine  cleanse, toner, multi vita serum, this cream
 *
 * See mvcreamCopy.ts. The distinctive fact is that the certificate assays the
 * niacinamide: specified 2.00%, found 2.04%. Do not print the astaxanthin
 * "6,000 times stronger than vitamin C" line: that is raw-material data and
 * the finished cream carries ten parts per million of it.
 */
""" + src[he:]

a = src.index("/** Section art")
b = src.index("const PROOF_IMAGE = '/images/problem_cream/s3.jpeg'")
b += len("const PROOF_IMAGE = '/images/problem_cream/s3.jpeg'")
src = src[:a] + """/** Section art, each slide paired with the section it illustrates. s2 is the
 *  four-step mechanism, s4 the radiance complex, s3 the two-week trial with
 *  the 95% figure, s5 the routine.
 *
 *  s4 prints "6,000x vs Vitamin C" under astaxanthin. That is raw-material
 *  antioxidant data and the cream carries 10 ppm of it. Queued for
 *  re-export; the copy does not repeat it. */
const ENGINE_IMAGE = '/images/radiance/s4.jpeg'
const HOWTO_IMAGE = '/images/radiance/s5.jpeg'
const EFFECTS_IMAGE = '/images/radiance/s2.jpeg'
const PROOF_IMAGE = '/images/radiance/s3.jpeg'""" + src[b:]

open(DST, 'w').write(src)
print('wrote', DST)
