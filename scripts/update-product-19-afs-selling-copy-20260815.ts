/**
 * Product 19 ALL FOR SENSITIVE SERUM — selling-tone + Intertek rewrite.
 *
 * Sets productNumber to '19' (legacy rows stored it only on id) and replaces
 * the drug-register EN fields (repair, anti-inflammatory, immune-boosting,
 * healing) with copy that matches Formula_up + the safety assessment.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'

const DESCRIPTION = `30ml. Serum for sensitive, reactive skin. Relieves, protects and moisturizes — MultiEx BSASM® Plus at 1%, with betaine, allantoin and hyaluronic acid. Morning and night. Dermatologically tested.`

const PRODUCT_DETAILS = JSON.stringify({
  size: '30ml',
  skinType: 'Sensitive, reactive, and easily irritated skin',
  formulation: 'Leave-on soothing, moisturizing serum',
  keyBenefits: 'Relieve, protect, moisturize',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Relieve — Centella, chamomile and allantoin settle reactive skin',
  'Protect — a light comfort film against a Gulf day',
  'Moisturize — betaine 0.5% and sodium hyaluronate hold water',
  'MultiEx BSASM® Plus at 1% — seven botanicals in one complex',
  'Morning and night — two or three drops, then pat',
  'Dermatologically tested — nothing harsh in the formula',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'MultiEx BSASM® Plus 1%',
    description:
      'Seven botanicals in one named complex: Centella Asiatica, knotweed, skullcap, green tea, licorice, chamomile and rosemary. This is the part of the serum the formula is built around.',
  },
  {
    name: 'Betaine 0.5%',
    description:
      'A comfort humectant at a level you can feel. Pulls water in and keeps skin from tightening while it drinks.',
  },
  {
    name: 'Allantoin 0.1%',
    description:
      'The classic soothing agent. Softens, settles, and leaves reactive skin willing to take the next step.',
  },
  {
    name: 'Centella Asiatica Extract 0.05%',
    description:
      'The lead botanical inside MultiEx BSASM® Plus. Calms reactive skin and leaves the face quieter, not coated.',
  },
  {
    name: 'Sodium Hyaluronate 0.01%',
    description:
      'The salt form of hyaluronic acid. Light, stable, and there to hold moisture rather than sit on the surface as a film.',
  },
  {
    name: 'Chamomile · Licorice · Green Tea · Skullcap',
    description:
      'The rest of the MultiEx complex, travelling with Centella. Soft daily comfort for skin that reacts easily.',
  },
  {
    name: 'Phytosphingosine',
    description:
      'A skin-identical lipid that supports the feel of a settled barrier, suitable for sensitive skin.',
  },
  {
    name: 'Full INCI',
    description:
      'Aqua (Water), Glycerin, PEG/PPG-17/6 Copolymer, Butylene Glycol, Betaine, Sodium Hyaluronate, Phytosphingosine, Aloe Barbadensis Leaf Extract, Nelumbo Nucifera Flower Extract, Hamamelis Virginiana (Witch Hazel) Water, Allantoin, Polyglyceryl-10 Laurate, Centella Asiatica Extract, Cellulose Gum, Polyglyceryl-10 Myristate, Potassium Hydroxide, Glyceryl Acrylate/Acrylic Acid Copolymer, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, Citrus Aurantium Dulcis (Orange) Peel Oil, Hydrogenated Lecithin, Camellia Sinensis Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Chamomilla Recutita (Matricaria) Flower Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, Beta-Glucan, Lactobacillus/Pumpkin Ferment Extract, Lecithin, Phaseolus Radiatus Extract, Lactic Acid, Prunus Mume Fruit Extract, Betula Platyphylla Japonica Bark Extract, Rumex Crispus Root Extract, Hydroxyethylcellulose, Carbomer, Dimethicone, Citric Acid, Disodium EDTA, Polysorbate 60, Disodium Phosphate, Sodium Phosphate, Sodium Glycolate, Sodium Chloride, Isopropyl Alcohol, Methyl Alcohol, Limonene.',
  },
])

const HOW_TO_USE = `1. Apply two or three drops to clean skin in the morning and evening.
2. Gently pat with fingers until absorbed. Keep clear of the eye area.
3. Seal with Skin Barrier Protecting Cream. In the morning, finish with SPF.`

const DIRECTIONS =
  'Dermatologically tested and formulated for sensitive skin. For external use only. Avoid the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool, dry place.'

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: '19' }, { productNumber: '19' }, { name: { contains: 'ALL FOR SENSITIVE' } }] },
  })
  if (!product) throw new Error('product 19 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '19',
      description: DESCRIPTION,
      productDetails: PRODUCT_DETAILS,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
    },
  })

  console.log('updated', product.id, product.name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
