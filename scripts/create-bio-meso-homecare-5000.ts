import { prisma } from '../lib/prisma'

async function main() {
  const productNumber = '65'

  const existing = await prisma.product.findFirst({
    where: { OR: [{ productNumber }, { name: 'Bio-Meso PDRN Homecare Ampoule 5000' }] },
  })
  if (existing) {
    console.log('⚠️  Product already exists:', existing.id, existing.productNumber, existing.name)
    process.exit(0)
  }

  const productData = {
    productNumber,
    name: 'Bio-Meso PDRN Homecare Ampoule 5000',
    nameRu: 'Ампула Bio-Meso PDRN Homecare 5000',
    nameAr: 'أمبولة Bio-Meso PDRN للعناية المنزلية 5000',
    price: 300,
    category: 'Bio Meso',
    image: '/images/Bio_Meso_5000.png',
    images: null,
    inStock: true,
    size: '50ml',
    isPriceOnRequest: false,
    isHidden: false,
    noDiscount: false,

    description: `A specialized homecare treatment ampoule, enriched with the uniquely formulated BIO-MESO™ PDRN, panthenol, and an anti-aging complex to regenerate skin and strengthen the skin barrier.

BIO-MESO™ PDRN coated spicules have a needle-shaped structure that enables direct skin penetration, providing a bio-peeling effect that promotes skin turnover and delivers excellent skin regeneration benefits — all without classic needles. Designed for ongoing, gentle home care to maintain and reinforce results between professional treatments.`,

    descriptionRu: `Специализированная ампула для домашнего ухода с уникальной формулой BIO-MESO™ PDRN, пантенолом и антивозрастным комплексом для восстановления кожи и укрепления её защитного барьера. Спикулы с покрытием PDRN имеют игольчатую структуру и обеспечивают прямое проникновение активных компонентов, создавая эффект био-пилинга без классических игл. Предназначена для регулярного бережного домашнего ухода между профессиональными процедурами.`,

    descriptionAr: `أمبولة متخصصة للعناية المنزلية، غنية بتركيبة BIO-MESO™ PDRN الفريدة والبانثينول ومركب مضاد للشيخوخة لتجديد البشرة وتقوية حاجزها الواقي. تتميز الـ Spicules المغلفة بـ PDRN ببنية إبرية تتيح اختراقاً مباشراً للبشرة وتأثير تقشير حيوي يعزز تجدد الخلايا دون إبر تقليدية. مخصصة للعناية المنزلية اللطيفة المنتظمة بين الجلسات الاحترافية.`,

    productDetails: JSON.stringify({
      form: 'Homecare Treatment Ampoule',
      productType: 'Ampoule',
      size: '50ml',
      refCode: 'GCAP01',
      skinType: 'All skin types',
      technology: 'BIO-MESO™ PDRN coated spicules',
      keyBenefits: 'Skin regeneration, anti-aging, barrier strengthening, brightening',
      usage: 'Home care — regular use between professional treatments',
      origin: 'South Korea',
    }),

    benefits: JSON.stringify([
      'Boosts skin turnover',
      'Enhances collagen & elastin production',
      'Promotes skin regeneration',
      'Improves skin tone',
      'Improves blemishes',
    ]),

    ingredients: JSON.stringify([
      {
        name: 'BIO-MESO™ PDRN (Sodium DNA)',
        description: 'PDRN-coated spicules with a needle-shaped structure that enable direct skin penetration. Salmon-derived DNA promotes the release of anti-inflammatory cytokines to help soothe damaged skin and supports collagen and elastin synthesis.',
      },
      {
        name: 'Hydrolyzed Sponge Spicules',
        description: 'Needle-shaped natural components that provide a bio-peeling effect, promoting skin turnover and excellent regeneration benefits.',
      },
      {
        name: 'EGF (sh-Oligopeptide-1)',
        description: 'Epidermal Growth Factor; promotes proliferation and differentiation of keratinocytes and epidermal cells.',
      },
      {
        name: 'Peptide Complex',
        description: 'Copper Tripeptide-1 and Hexapeptide-9 promote collagen and elastin production; Nonapeptide-1 inhibits melanin production to help prevent pigmentation and brighten skin tone; Tripeptide-1 stimulates collagen and elastin synthesis; Acetyl Hexapeptide-8 reduces expression lines and wrinkles; Palmitoyl Pentapeptide-4 and Palmitoyl Tripeptide-1 stimulate collagen synthesis; Palmitoyl Tetrapeptide-7 helps reduce inflammation and soothes the skin.',
      },
      {
        name: 'Collagen & Elastin',
        description: 'Collagen enhances the appearance of dry or damaged skin by reducing flaking and restoring suppleness. Elastin provides elasticity to the skin.',
      },
      {
        name: '5 Ceramides Complex',
        description: 'Ceramide NP, AS, NS, AP and EOP strengthen the skin barrier — protecting against external aggressors, preventing moisture loss and reducing TEWL, keeping skin hydrated, and preserving lipid balance for firmness, flexibility and soothed, improved sensitive skin.',
      },
      {
        name: 'Phytosphingosine',
        description: 'A precursor of ceramide that creates a protective layer for the stratum corneum, helping skin retain moisture and maintain homeostasis. It also strengthens skin structure and improves firmness by inhibiting the collagen-breakdown enzyme MMP-1.',
      },
      {
        name: 'Panthenol (Provitamin B5)',
        description: 'Reduces itching and inflammation of the skin and provides deep, penetrating moisture.',
      },
      {
        name: 'Full INCI',
        description: 'Aqua (Water), Glycerin, Butylene Glycol, Niacinamide, 1,2-Hexanediol, Limnanthes Alba (Meadowfoam) Seed Oil, Panthenol, Hydrolyzed Sponge, Sodium DNA (1010ppm), sh-Oligopeptide-1, Acetyl Hexapeptide-8, Copper Tripeptide-1, Hexapeptide-9, Nonapeptide-1, Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Tripeptide-1, Ceramide NP, Ceramide EOP, Ceramide AS, Ceramide AP, Ceramide NS, Phytosphingosine, Collagen, Elastin, Adenosine, Squalane, Hydrogenated Lecithin, Ethylhexylglycerin, Butyrospermum Parkii (Shea) Butter, Olea Europaea (Olive) Fruit Oil, Cholesterol, Hydroxyacetophenone, Carbomer, Polyisobutene, Calcium Silicate, Disodium EDTA, Sodium Silicate, Sorbitan Oleate, Cetyl Ethylhexanoate, Cetearyl Olivate, Sorbitan Olivate, Caprylyl/Capryl Glucoside, Dipropylene Glycol, Caprylic/Capric Triglyceride, Glyceryl Stearate, Caprylyl Glycol, Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Tromethamine.',
      },
    ]),

    howToUse: `After cleansing the skin, apply the Bio-Meso PDRN Homecare Ampoule 5000 — around 3ml on the face.

Spread the ampoule on the face evenly, then press the treatment area using palms or fingers. Massage the face with a rolling motion for around 30 seconds.

To calm the skin, apply the Skin Reboot PDRN Mask Pack and leave it for 10–15 minutes.`,

    skinType: 'all',
    targetConcerns: JSON.stringify(['anti-aging', 'regeneration', 'hydration', 'brightening']),
    usage: 'morning-evening',
    ageGroup: 'adult',
    rating: 5,
  }

  console.log('Creating Bio-Meso PDRN Homecare Ampoule 5000...')

  const result = await prisma.product.create({ data: productData })

  console.log('✅ Created product:', result.name)
  console.log('   ID:', result.id)
  console.log('   Product Number:', result.productNumber)
  console.log('   Price:', result.price)
  console.log('   Size:', result.size)
  console.log('   Image:', result.image)
  console.log('   In Stock:', result.inStock)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
