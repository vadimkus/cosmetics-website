"""Create the product 29 page from the product 30 layout.

Both are two-tube creams with a size selector, so the structure carries over
unchanged. The one difference is what the "clean" slot holds: on product 30
it is the five no-additions badge, here it is the hydration trial, because
this product has a clinical on file and that carton badge does not exist.
"""
SRC = 'components/product/pccream/PccreamProductPage.tsx'
DST = 'components/product/mhcream/MhcreamProductPage.tsx'

src = open(SRC).read()

for a, b in [
    ("./pccream.css", "./mhcream.css"),
    ("getPccreamCopy", "getMhcreamCopy"),
    ("./pccreamCopy", "./mhcreamCopy"),
    ("PccreamProductPage", "MhcreamProductPage"),
    ("pccream-page", "mhcream-page"),
    ("pccream-not", "mhcream-not"),
    ("pccream-video", "mhcream-video"),
    ("PcCream:", "MhCream:"),
    ("getProductSizeOptions('30'", "getProductSizeOptions('29'"),
]:
    src = src.replace(a, b)

head_start = src.index("/**\n * Bespoke product page for")
head_end = src.index(" */\n", head_start) + len(" */\n")
src = src[:head_start] + """/**
 * Bespoke product page for MOISTURE REPLENISHING HYALURON CREAM (product 29).
 *
 * The cream half of the pair whose serum is product 18, and structurally the
 * twin of product 30: same two-tube size selector, same section order. The
 * palette is a glacier cyan from mhcream.css, taken from the sky-blue cream
 * itself.
 *
 * Section order:
 *
 *   effects  Fill, then lock
 *   engine   Hyaluronan 11, and where the weight actually sits
 *   clean    the hydration trial, which is the whole evidence file
 *   howTo    serum first, then massage this in like a film, plus video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   dry and dehydrated skin; has a scent; no wrinkle claim
 *   routine  cleanse, toner, hyaluron serum, this cream
 *
 * See mhcreamCopy.ts. The distinctive fact is that the carton prints the dose
 * of every hyaluronate beside its name, and only one of the nine is a working
 * dose. Hyaluronan 11 is a real manufacturer name and must not be banned: the
 * deck gives the eight INCI entries and explains the count of eleven grades.
 */
""" + src[head_end:]

a = src.index("/** Section art")
b = src.index("const PROOF_IMAGE = '/images/problem_cream/s3.jpeg'")
b += len("const PROOF_IMAGE = '/images/problem_cream/s3.jpeg'")
src = src[:a] + """/** Section art, each slide paired with the section it illustrates. s2 is the
 *  four-step mechanism, s4 the complex with the doses, s3 the +82% and
 *  72-hour trial result and s5 the routine.
 *
 *  Two need a re-export and neither line is repeated in copy: s5 prints
 *  "gently pat", which is the serum's instruction, where this carton asks for
 *  massage; and s4 credits the mushroom complex with anti-inflammatory and
 *  antioxidant action at 0.17 ppm. */
const ENGINE_IMAGE = '/images/hyaluron/s4.jpeg'
const HOWTO_IMAGE = '/images/hyaluron/s5.jpeg'
const EFFECTS_IMAGE = '/images/hyaluron/s2.jpeg'
const PROOF_IMAGE = '/images/hyaluron/s3.jpeg'""" + src[b:]

open(DST, 'w').write(src)
print('wrote', DST)
