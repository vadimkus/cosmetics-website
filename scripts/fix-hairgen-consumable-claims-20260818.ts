/**
 * Two fixes found while building product 3's page.
 *
 * 1. PRODUCT 3 — PRICES IN productDetails LEAK TO SIGNED-OUT VISITORS.
 *    The `consumables` field written earlier today read "Roughly AED 167 per session at
 *    list prices — AED 92.50 for a vial and AED 75 for a stamp". The bespoke page never
 *    renders productDetails, but the whole product record is serialised into the RSC
 *    payload, so those figures appeared in the HTML for logged-out users — which is the
 *    exact thing the canSeePrices gate exists to prevent. The running-cost table on the
 *    page is gated; this field is now price-free and the arithmetic lives only there.
 *
 * 2. PRODUCT 64 — THE STAMP STILL CARRIES THE LEAFLET'S DRUG MECHANISM.
 *    Its record repeats the HairGen Booster leaflet's wound-healing section almost
 *    verbatim: "The micro-injuries also trigger the skin's natural wound-healing response,
 *    supporting scalp regeneration, improved blood circulation and a healthier environment
 *    for hair growth", with matching benefits lines. That is the same claim family
 *    stripped from products 43–47, and it was surfacing inside product 3's page payload
 *    because 64 is one of its companions — a device page whose consumable contradicts it
 *    is the product-47 problem again.
 *
 *    Also removed: "dramatically increasing skin permeability", "delivered directly to
 *    the hair follicles and surrounding tissue", and "gentle" — the last being the same
 *    word refused on product 46.
 *
 *    Kept, because they are documented: 52 microneedles (2021 DTS MG leaflet, "52EA"),
 *    single use, eight per box, the ~10-minute session, and Korean manufacture.
 *
 * NOT CHANGED HERE: product 64's bespoke page still has a "A wound-healing response
 * starts" section built from the same leaflet text. Its own copy file documents that as a
 * deliberate sourcing decision, so it needs an owner call rather than a silent edit.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-hairgen-consumable-claims-20260818.ts
 */

import { prisma } from '../lib/prisma'

const STAMP_DESCRIPTION = [
  'The applicator the GENOSYS HairGen Booster runs on. Each stamp head carries 52 ultra-fine microneedles that',
  'open temporary micro-channels in the scalp, and it screws onto a sealed HR³ MATRIX HAIR SOLUTION α vial so',
  'the solution feeds through the head while the device works — the liquid goes in as the needles open the way,',
  'rather than being rubbed on afterwards.',
  '',
  'Mounted on the Booster it stamps automatically, at a rate you set rather than one your hand drifts into, which',
  'is the practical difference between a powered handpiece and a hand roller.',
  '',
  'Eight stamps per box. One stamp and one fresh ampoule per treatment — it is single use, it is not a cleanable',
  'part, and it is personal. Made in South Korea.',
].join(' ')

const STAMP_BENEFITS = JSON.stringify([
  'Opens micro-channels so HR³ MATRIX HAIR SOLUTION α is delivered rather than left on the surface',
  'Screws onto the sealed ampoule, so nothing is decanted and nothing is measured',
  'Stamps automatically on the HairGen Booster, at an even rate and even pressure',
  '52 microneedles per stamp',
  'Single use, eight per box — a fresh one every session, never shared',
])

const STAMP_DETAILS = JSON.stringify({
  form: 'Single-use microneedle stamp applicator',
  size: '1 box — 8 stamps',
  needles: '52 microneedles per stamp',
  needleDepth:
    '0.3 mm, per the product artwork. The figure appears in neither the DTS MG leaflet nor the user manual, and '
    + 'confirmation has been requested from the manufacturer in writing',
  compatibility: 'GENOSYS HairGen Booster. Screws onto an HR³ MATRIX HAIR SOLUTION α vial',
  usage: 'One stamp and one fresh 4 ml ampoule per session, roughly ten minutes. Discard both afterwards',
  reuse: 'None. Single use, and personal — never share a stamp',
  evidence: 'No efficacy study is held for the stamp or the device it fits',
  origin: 'South Korea — DTS MG Co., Ltd.',
})

const BOOSTER_CONSUMABLES =
  'A new stamp and a new sealed 4 ml ampoule every session — neither is reusable. Both are sold in boxes of '
  + 'eight, so buying them in pairs keeps them in step at eight sessions each.'

async function main() {
  // ── Product 3: strip the prices out of productDetails ──
  const booster = await prisma.product.findFirst({ where: { name: { contains: 'HairGen BOOSTER' } } })
  if (!booster) throw new Error('HairGen BOOSTER not found')
  const details = JSON.parse(booster.productDetails || '{}') as Record<string, string>
  details.consumables = BOOSTER_CONSUMABLES
  details.needleDepth =
    '0.3 mm — the depth of the fitted HR³ MATRIX HAIR STAMP, per the product artwork. Neither the leaflet nor '
    + 'the user manual states a depth for the device itself'
  await prisma.product.update({
    where: { id: booster.id },
    data: { productDetails: JSON.stringify(details) },
  })

  // ── Product 64: strip the wound-healing / circulation claims ──
  const stamp = await prisma.product.findFirst({ where: { productNumber: '64' } })
  if (!stamp) throw new Error('Hair Stamp (64) not found')
  await prisma.product.update({
    where: { id: stamp.id },
    data: {
      description: STAMP_DESCRIPTION,
      benefits: STAMP_BENEFITS,
      productDetails: STAMP_DETAILS,
    },
  })

  const banned = [
    'wound-healing', 'wound healing', 'blood circulation', 'scalp circulation', 'regeneration',
    'hair growth', 'dramatically', 'gentle', 'AED',
  ]
  for (const id of [booster.id, stamp.id]) {
    const p = await prisma.product.findUnique({ where: { id } })
    const blob = [p?.description, p?.benefits, p?.keyFeatures, p?.productDetails].join(' ').toLowerCase()
    const hits = banned.filter(term => blob.includes(term.toLowerCase()))
    console.log(`${p?.name}: ${hits.length ? `STILL PRESENT → ${hits.join(', ')}` : 'clean'}`)
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
