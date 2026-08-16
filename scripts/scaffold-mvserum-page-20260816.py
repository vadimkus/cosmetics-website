"""Create the product 21 page from the product 20 layout.

Single 30ml dropper, so the serum layout carries over unchanged. The "clean"
slot holds the melanin trial rather than a no-additions badge, because this
carton has no such badge and this product does have a clinical.
"""
SRC = 'components/product/pcserum/PcserumProductPage.tsx'
DST = 'components/product/mvserum/MvserumProductPage.tsx'

src = open(SRC).read()

for a, b in [
    ("./pcserum.css", "./mvserum.css"),
    ("getPcserumCopy", "getMvserumCopy"),
    ("./pcserumCopy", "./mvserumCopy"),
    ("PcserumProductPage", "MvserumProductPage"),
    ("pcserum-page", "mvserum-page"),
    ("pcserum-not", "mvserum-not"),
    ("pcserum-video", "mvserum-video"),
    ("PcSerum:", "MvSerum:"),
]:
    src = src.replace(a, b)

head_start = src.index("/**\n * Bespoke product page for")
head_end = src.index(" */\n", head_start) + len(" */\n")
src = src[:head_start] + """/**
 * Bespoke product page for MULTI VITA RADIANCE SERUM (product 21).
 *
 * Single 30ml dropper, so this runs the product 20 layout with an amber and
 * champagne palette from mvserum.css, taken from the serum itself.
 *
 * Section order:
 *
 *   effects  four ways at one problem
 *   engine   the dose ladder, all of it printed on the carton
 *   clean    the two-week melanin trial and the 21-woman panel
 *   howTo    pat it in, start small, sunscreen over it, plus video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   dull or uneven tone; not in pregnancy; has a bergamot scent
 *   routine  cleanse, toner, this serum, cream
 *
 * See mvserumCopy.ts. The distinctive fact is that the carton prints the dose
 * of every vitamin: four in ppm and eleven in ppb. Niacinamide at 20,000 ppm
 * is the functional active on the Korean registration. Do not credit
 * glutathione (1 ppb) or gluconolactone (10 ppb) with anything.
 */
""" + src[head_end:]

a = src.index("/** Section art")
b = src.index("const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'")
b += len("const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'")
src = src[:a] + """/** Section art, each slide paired with the section it illustrates. s1 is the
 *  four-step melanin mechanism, s3 the complex with the ppm figures, s2 the
 *  two-week trial and the panel, s4 the routine with the go-slowly and
 *  close-the-cap notes.
 *
 *  s1 credits step 4 to PHA / gluconolactone, which sits at 10 ppb. Queued
 *  for re-export; the copy does not repeat it. */
const ENGINE_IMAGE = '/images/radiance_serum/s3.jpeg'
const HOWTO_IMAGE = '/images/radiance_serum/s4.jpeg'
const EFFECTS_IMAGE = '/images/radiance_serum/s1.jpeg'
const PROOF_IMAGE = '/images/radiance_serum/s2.jpeg'""" + src[b:]

open(DST, 'w').write(src)
print('wrote', DST)
