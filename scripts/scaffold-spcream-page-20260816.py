"""Create the product 27 page from the product 20 layout.

Single size, so the serum layout is the right base rather than either of the
two-tube creams. The "clean" slot holds the three-cream comparison instead of
a no-additions badge, because this carton has no such badge and the useful
thing to tell a shopper is which of the three creams is theirs.
"""
SRC = 'components/product/pcserum/PcserumProductPage.tsx'
DST = 'components/product/spcream/SpcreamProductPage.tsx'

src = open(SRC).read()

for a, b in [
    ("./pcserum.css", "./spcream.css"),
    ("getPcserumCopy", "getSpcreamCopy"),
    ("./pcserumCopy", "./spcreamCopy"),
    ("PcserumProductPage", "SpcreamProductPage"),
    ("pcserum-page", "spcream-page"),
    ("pcserum-not", "spcream-not"),
    ("pcserum-video", "spcream-video"),
    ("PcSerum:", "SpCream:"),
]:
    src = src.replace(a, b)

head_start = src.index("/**\n * Bespoke product page for")
head_end = src.index(" */\n", head_start) + len(" */\n")
src = src[:head_start] + """/**
 * Bespoke product page for SKIN BARRIER PROTECTING CREAM (product 27).
 *
 * The cream half of the pair whose serum is product 19, which the gallery
 * ritual slide states outright. Single 100g tube, so this runs the serum
 * layout rather than either two-tube cream, with a warm sage palette from
 * spcream.css.
 *
 * Section order:
 *
 *   effects  Barrier. Amino. Moisture.
 *   engine   three names on the box, one of them is a dose
 *   clean    where it sits against the other two creams
 *   howTo    serum first, then pat this in, AM and PM, plus video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   sensitive and dry skin; has a lavender scent; not for oily skin
 *   routine  cleanse, sensitive serum, this cream
 *
 * See spcreamCopy.ts. The distinctive fact is Ceramide NP at 0.5%, which the
 * Korean carton panel prints as 5,000 ppm. Do not lead on MultiEx BSASM Plus:
 * it is here at 0.0001%, ten thousand times less than in product 19, and it
 * was the technology line on this record until 16 Aug 2026.
 */
""" + src[head_end:]

a = src.index("/** Section art")
b = src.index("const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'")
b += len("const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'")
src = src[:a] + """/** Section art, each slide paired with the section it illustrates. s2 is the
 *  barrier / amino / moisture slide, s4 the breakdown that prints Ceramide NP
 *  0.5% and 5,000 ppm, s5 the 19 + 27 ritual and s3 the who-it-is-for slide.
 *
 *  s4 lists the botanicals last as a "botanical soothe stack" without a dose.
 *  They are at 0.0001%, so the copy names them and credits the ceramide. */
const ENGINE_IMAGE = '/images/skin_barr/s4.jpeg'
const HOWTO_IMAGE = '/images/skin_barr/s5.jpeg'
const EFFECTS_IMAGE = '/images/skin_barr/s2.jpeg'
const PROOF_IMAGE = '/images/skin_barr/s3.jpeg'""" + src[b:]

open(DST, 'w').write(src)
print('wrote', DST)
