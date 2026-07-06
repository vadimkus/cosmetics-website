import { prisma } from '../lib/prisma'

async function main() {
  const productData = {
    name: 'Bio Meso PDRN Ampoule 60000',
    price: 0, // Set price later
    category: 'Bio Meso',
    image: '/images/Second/Prof_Meso.jpg',
    inStock: true,
    size: '2ml x 5 ampoules',
    
    description: `The Genosys Bio Meso PDRN Expert Ampoule 60000 is a specialized skincare treatment ampoule designed for bio-meso therapy, a no-needle microneedling approach. It utilizes microscopic spicules (needle-like components extracted from freshwater sponges) to create temporary microchannels in the skin, enhancing the absorption of active ingredients without the need for actual needles. This product is enriched with the uniquely formulated BIO-MESO™ PDRN (Polydeoxyribonucleotide), panthenol, and an anti-aging complex to regenerate skin and strengthen the skin barrier.

It features a 2-way system for customizable care:
• Professional Use (Expert Ampoule 60000): Higher concentration for clinic-based treatments.
• Home-Use (Homecare Ampoule 5000): Lower concentration for ongoing maintenance.

The ampoule functions as a spicule peeling or bio-meso peeling treatment, inducing a peel-off effect on the skin. It contains a significantly higher concentration of spicules compared to other products, delivering intensive results.`,

    productDetails: JSON.stringify({
      form: 'Professional Treatment Ampoule',
      size: '2ml x 5 ampoules',
      skinType: 'All skin types',
      technology: 'BIO-MESO™ PDRN with 3rd generation cog spicules',
      keyBenefits: 'Skin regeneration, anti-aging, barrier strengthening',
      usage: 'Professional: monthly; Home: as needed',
      origin: 'South Korea',
      pdfBrochure: '/documents/PPT/GENOSYS_BIO_MESO_PDRN_EXPERT_AMPOULE_60000.pdf'
    }),

    benefits: JSON.stringify([
      'Boosts skin turnover and exfoliation through mild inflammatory response',
      'Enhances collagen and elastin production for firmer skin',
      'Improves skin tone and reduces blemishes',
      'Soothes damaged skin by promoting anti-inflammatory cytokines',
      'Accelerates cell turnover for visible anti-aging effects',
      'Strengthens the skin barrier against external aggressors',
      'Up to 7.446% decrease in periorbital wrinkles after 4 weeks',
      'Up to 19.858% improvement in skin elasticity after 4 weeks',
      'Up to 52.247% improvement in moisture content after 4 weeks',
      'Customizable intensive (professional) and maintenance (home) care'
    ]),

    ingredients: JSON.stringify([
      {
        name: 'BIO-MESO™ PDRN (Sodium DNA)',
        description: '60,000 ppm concentration. Derived from salmon (95% similarity to human DNA). Encapsulated in phytosome form and coated onto spicules for direct penetration and optimal stability.'
      },
      {
        name: 'Hydrolyzed Sponge Spicules',
        description: '300,000–360,000 spicules per 1ml. Needle-shaped natural components from freshwater sponges that provide bio-peeling and promote skin turnover.'
      },
      {
        name: 'Panthenol',
        description: '10,000 ppm concentration. Soothes and deeply hydrates the skin.'
      },
      {
        name: '5 Ceramides Complex',
        description: 'Supports skin barrier repair and strengthening.'
      },
      {
        name: '8 Anti-Aging Peptides',
        description: 'Target wrinkles and improve skin firmness.'
      },
      {
        name: '9 Growth Factor Peptides',
        description: 'Promote cell regeneration and stimulate collagen/elastin synthesis.'
      }
    ]),

    howToUse: `Professional Treatment (Expert 60000): Equivalent to a 1.0mm needle depth; recommended once a month. Start with professional sessions for deep stimulation, then transition to home care.

Home Care (Homecare 5000): Use for frequent, gentle reinforcement to maintain results. Apply after professional treatment to support barrier repair and collagen remodeling.

General Approach: Apply topically to create microchannels. High-dose spicules (60,000 ppm) for periodic intensive therapy; moderate-dose for daily/weekly reinforcement.

Frequency: Professional – monthly; Home – as needed between visits.`,

    directions: `Precautions and Contraindications:
• Avoid use around eyes and lips; protect eyes with wet cotton.
• Use only after skin recovers from irritating treatments (e.g., peels, devices, high-concentration products).
• Mild irritation may last up to 3 days; exfoliation may occur 2–3 days post-treatment.
• Stop retinoids 7–10 days before (14 days for stronger prescriptions like 0.05–0.1% tretinoin); resume after 14 days post-treatment.
• Defer if used oral isotretinoin (Accutane) in past 6 months.
• Contraindications: Active infections, severe acne/rosacea, open wounds, allergies/hypersensitivity, autoimmune disorders (e.g., lupus, psoriasis, eczema), recent procedures (chemical peel, laser, microneedling), skin cancers, recent sunburn/tanning.`,

    skinType: 'all',
    targetConcerns: JSON.stringify(['anti-aging', 'regeneration', 'hydration', 'brightening']),
    usage: 'morning-evening',
    ageGroup: 'adult',
    rating: 5,
    noDiscount: false,
    isHidden: false
  }

  console.log('Creating Bio Meso PDRN Ampoule 60000...')
  
  const result = await prisma.product.create({
    data: productData
  })
  
  console.log('✅ Created product:', result.name)
  console.log('   ID:', result.id)
  console.log('   Category:', result.category)
  console.log('   Image:', result.image)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

