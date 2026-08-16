"""Create the product 30 page from the product 20 layout, plus size selection.

The cream is the serum's sibling in shape: leave-on, five no-additions carton
badge, AM/PM with a video, actives, suited/not, routine, spec, FAQ. The one
structural difference is that it ships in two tubes, 50g and 250g, so the
hero needs the size selector and every cart call needs the size passed
through. Both are lifted from the Cerabarrier page, which already does this
for its 200ml and 600ml bottles.
"""
SRC = 'components/product/pcserum/PcserumProductPage.tsx'
DST = 'components/product/pccream/PccreamProductPage.tsx'

src = open(SRC).read()

for a, b in [
    ("./pcserum.css", "./pccream.css"),
    ("getPcserumCopy", "getPccreamCopy"),
    ("./pcserumCopy", "./pccreamCopy"),
    ("PcserumProductPage", "PccreamProductPage"),
    ("pcserum-page", "pccream-page"),
    ("pcserum-not", "pccream-not"),
    ("pcserum-video", "pccream-video"),
    ("PcSerum:", "PcCream:"),
]:
    src = src.replace(a, b)

# ── Header ────────────────────────────────────────────────────────────────
head_start = src.index("/**\n * Bespoke product page for")
head_end = src.index(" */\n", head_start) + len(" */\n")
src = src[:head_start] + """/**
 * Bespoke product page for INTENSIVE PROBLEM CONTROL CREAM (product 30).
 *
 * The third step of the Problem Control line and the sibling of product 20,
 * so it runs the serum's layout with a cool blue palette from pccream.css.
 * The one structural difference is the size selector: this ships as a 50g
 * homecare tube and a 250g professional tube, so a size travels with every
 * cart call, the way it does on product 66.
 *
 * Section order:
 *
 *   effects  Sebum. Hydrate. Soothe.
 *   engine   water thickened rather than oil emulsified
 *   clean    the five no-additions, plus the oil-free sixth
 *   howTo    toner, serum, then massage this in, AM and PM, plus video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   oily and combination skin; not for dry skin; not a rich cream
 *   routine  cleanse, problem toner, problem serum, this cream
 *
 * See pccreamCopy.ts. The distinctive fact is that there is no oil in it at
 * all. Do not add "non-comedogenic", "all skin types" or "no Phytolex SC":
 * the first two have no document and the third is contradicted by the safety
 * assessment.
 */
""" + src[head_end:]

# ── Section art ───────────────────────────────────────────────────────────
a = src.index("/** Section art")
b = src.index("const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'")
b += len("const PROOF_IMAGE = '/images/problems_serum/s5.jpeg'")
src = src[:a] + """/** Section art, each slide paired with the section it illustrates. s2 is the
 *  sebum / hydrate / soothe slide, s4 the complex with the percentages, s5
 *  the toner-serum-cream ritual and s3 the oil-free texture claim.
 *
 *  Two of these still need a re-export and neither line is repeated in copy:
 *  s2 prints "sebum control", but the cream's registered function is
 *  "anti-blemishes, oil control" and it is the serum that adds sebum; s4
 *  prints "No Phytolex SC", which the safety assessment contradicts at
 *  0.500%. */
const ENGINE_IMAGE = '/images/problem_cream/s4.jpeg'
const HOWTO_IMAGE = '/images/problem_cream/s5.jpeg'
const EFFECTS_IMAGE = '/images/problem_cream/s2.jpeg'
const PROOF_IMAGE = '/images/problem_cream/s3.jpeg'""" + src[b:]

# ── Size state ────────────────────────────────────────────────────────────
src = src.replace(
    """  // Single SKU - one 23g sheet - so no size is ever passed to the cart.
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay(product, user)

  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', '')
  const inCartQty = cartLine?.quantity || 0""",
    """  // Two tubes, 50g and 250g, so a size travels with every cart call.
  const sizeOptions = useMemo(() => getProductSizeOptions('30', product), [product])
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || '')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const unitPrice = getPriceForSize(product, selectedSize)
  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay({ ...product, price: unitPrice }, user, { selectedSize })

  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', selectedSize)
  const inCartQty = cartLine?.quantity || 0""",
)

# ── Cart actions carry the size ───────────────────────────────────────────
src = src.replace(
    """      try {
        await addItem(product, qty)
        try {
          trackAddToCart({
            id: product.id,
            name: product.name,
            category: product.category || 'Cosmetics',
            price: product.price,
            quantity: qty,
          })""",
    """      try {
        await addItem(product, qty, undefined, size)
        try {
          trackAddToCart({
            id: product.id,
            name: product.name,
            category: product.category || 'Cosmetics',
            price: unitPrice,
            quantity: qty,
          })""",
)
src = src.replace(
    """  const addToCart = useCallback(
    async (qty: number) => {""",
    """  const addToCart = useCallback(
    async (qty: number, size: string = selectedSize) => {""",
)
src = src.replace(
    """    [addItem, locale, product, router, user]
  )""",
    """    [addItem, locale, product, router, selectedSize, unitPrice, user]
  )""",
)
src = src.replace(
    """    updateQuantity(product.id, inCartQty - 1, '', '')
  }, [inCartQty, product.id, updateQuantity])""",
    """    updateQuantity(product.id, inCartQty - 1, '', selectedSize)
  }, [inCartQty, product.id, selectedSize, updateQuantity])""",
)

# ── Size selector in the hero, above the price ────────────────────────────
PRICE_ANCHOR = """            {/* Price + CTA */}
            <div ref={ctaSentinel} className="mt-7">"""
SELECTOR = """            {sizeOptions.length > 1 && (
              <fieldset className="mt-8">
                <legend className="cera-eyebrow mb-3">{copy.chooseSize}</legend>
                <div className="grid grid-cols-2 gap-3">
                  {sizeOptions.map((option, index) => {
                    const isActive = option.value === selectedSize
                    const optionPrice = getPriceForSize(product, option.value)
                    const label = index === 0 ? copy.sizes.homecareLabel : copy.sizes.proLabel
                    const note = index === 0 ? copy.sizes.homecareNote : copy.sizes.proNote
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSize(option.value)}
                        aria-pressed={isActive}
                        className={`group relative overflow-hidden rounded-2xl border p-4 text-start transition-all duration-300 ${
                          isActive
                            ? 'border-[var(--cera-rose)] bg-white shadow-[0_16px_36px_-26px_rgba(31,68,99,0.65)]'
                            : 'border-[var(--cera-line)] bg-white/60 hover:border-[var(--cera-blush-deep)] hover:bg-white'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute top-3 flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                            isRtl ? 'left-3' : 'right-3'
                          } ${isActive ? 'border-[var(--cera-rose)] bg-[var(--cera-rose)]' : 'border-[var(--cera-line)]'}`}
                        >
                          {isActive ? <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} /> : null}
                        </span>
                        <span className="cera-serif block text-[24px] leading-none text-[var(--cera-ink)]">
                          {option.label}
                        </span>
                        <span className="mt-1.5 block text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-rose-ink)]">
                          {label}
                        </span>
                        <span className="mt-2 block text-[13.5px] leading-snug text-[var(--cera-body)]">{note}</span>
                        {canSeePrices ? (
                          <span className="mt-3 block text-[15px] font-semibold text-[var(--cera-ink)]">
                            {optionPrice.toFixed(2)} {isRtl ? 'درهم' : 'AED'}
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}

"""
assert PRICE_ANCHOR in src, 'price anchor not found'
src = src.replace(PRICE_ANCHOR, SELECTOR + PRICE_ANCHOR, 1)

open(DST, 'w').write(src)
print('wrote', DST)
