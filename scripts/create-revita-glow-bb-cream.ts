import { prisma } from '../lib/prisma'

async function main() {
  const productData = {
    productNumber: '62',
    name: 'REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]',
    nameAr: 'كريم ريفيتا جلو BB [SPF 38 PA+++]',
    nameRu: 'REVITA GLOW BB КРЕМ [SPF 38 PA+++]',
    price: 250,
    category: 'Cream, Sun, Cushion BB',
    image: '/images/REVITA_GLOW_BB_CREAM_01_BRIGHT.png',
    images: JSON.stringify([
      '/images/REVITA_GLOW_BB_CREAM_01_BRIGHT.png',
      '/images/REVITA_GLOW_BB_CREAM_02_NATURAL.png',
      '/images/Color_revita.png'
    ]),
    inStock: true,
    size: '50g',

    description: `Genosys REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]. 50g. An instantly revitalizing complexion formula that enhances the skin's natural luminosity for a clear, glass-like glow. A regenerative BB cream infused with a complex of 10 vitamins and 7 herbal extracts, instantly energizing the skin while naturally covering skin imperfections. Available in two shades: #01 Bright for an illuminating glow with a clear, radiant complexion, and #02 Natural for a refined glow with a natural, healthy-looking complexion. UV protection (SPF 38 PA+++). Enhanced adhesion and long-lasting wear with the dedicated puff. Key ingredients: 10 Vitamin Complex (Vitamins A, B1, B2, B3, B4, B5, B7, B9, C, E), 7 Herb Complex (Camellia Sinensis Leaf Extract, Rosmarinus Officinalis Leaf Extract, Centella Asiatica Extract, Tremella Fuciformis Extract, Chamomilla Recutita Flower Extract, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, Glycyrrhiza Uralensis Root Extract), Adenosine, Erythritol. Effects: Revitalizing, Hydrating, Soothing & Barrier Protecting, Coverage. Dermatologically tested.`,

    descriptionAr: 'Genosys كريم ريفيتا جلو BB [SPF 38 PA+++]. 50 جم. تركيبة منشطة فورية للبشرة تعزز الإشراق الطبيعي لبشرة صافية كالزجاج. كريم BB مجدد غني بمركب 10 فيتامينات و7 مستخلصات عشبية، ينشط البشرة فورياً مع تغطية طبيعية لعيوب البشرة. متوفر بلونين: #01 برايت لتوهج مضيء لبشرة مشرقة وصافية، و#02 ناتشورال لتوهج طبيعي لبشرة صحية ومشرقة. حماية من الأشعة فوق البنفسجية (SPF 38 PA+++). التصاق محسّن وثبات طويل الأمد مع الإسفنجة المخصصة. المكونات الرئيسية: مركب 10 فيتامينات، مركب 7 أعشاب، أدينوسين، إريثريتول. التأثيرات: تنشيط البشرة، ترطيب، تهدئة وحماية الحاجز، تغطية. مختبر طبياً.',

    descriptionRu: 'Genosys REVITA GLOW BB КРЕМ [SPF 38 PA+++]. 50 г. Мгновенно оживляющая формула для цвета лица, которая усиливает естественное сияние кожи для чистого, стеклянного блеска. Восстанавливающий BB-крем, обогащённый комплексом из 10 витаминов и 7 растительных экстрактов, мгновенно заряжает кожу энергией, естественно скрывая несовершенства. Доступен в двух оттенках: #01 Bright для сияющего лучезарного цвета лица и #02 Natural для естественного здорового цвета лица. Защита от УФ (SPF 38 PA+++). Улучшенная адгезия и длительная стойкость с фирменным спонжем. Ключевые ингредиенты: Комплекс 10 витаминов, Комплекс 7 трав, Аденозин, Эритритол. Эффекты: Оживление, Увлажнение, Успокоение и Защита барьера, Покрытие. Дерматологически протестировано.',

    productDetails: JSON.stringify({
      form: 'BB Cream',
      size: '50g',
      spf: 'SPF 38 PA+++',
      skinType: 'All skin types',
      keyBenefits: 'Revitalizing, Hydrating, Soothing & Barrier Protecting, Coverage',
      origin: 'South Korea'
    }),

    benefits: JSON.stringify([
      'Instantly revitalizes complexion with a clear, glass-like glow',
      'Natural coverage that conceals skin imperfections',
      'UV protection with SPF 38 PA+++',
      'Infused with 10 Vitamin Complex for skin energizing',
      '7 Herb Complex for soothing and barrier protection',
      'Enhanced adhesion and long-lasting wear with dedicated puff',
      'Micro air-cell puff structure for thin, even finish without caking',
      'Transparent gel film sets quickly without smudging or transfer',
      'Maintains smooth, radiant complexion all day without dryness',
      'Hydrating formula with plant-derived moisturizing ingredients'
    ]),

    ingredients: JSON.stringify([
      {
        name: '10 Vitamin Complex',
        description: 'Vitamin A Derivative (antioxidant, anti-aging), Vitamins B1, B2, B3, B4, B5, B7, B9 (oil-moisture balance, soothing, barrier support), Vitamin C (anti-aging, brightening, pigmentation care), Vitamin E (antioxidant, hydration, firming)'
      },
      {
        name: '7 Herb Complex',
        description: 'Camellia Sinensis Leaf Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, Centella Asiatica Extract, Tremella Fuciformis (Mushroom) Extract, Chamomilla Recutita (Matricaria) Flower Extract, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, Glycyrrhiza Uralensis (Licorice) Root Extract — provides anti-inflammatory, soothing, antioxidant, barrier protection, and hydration benefits'
      },
      {
        name: 'Adenosine',
        description: 'Improves wrinkles and firms skin by increasing collagen synthesis and stimulating fibroblasts. Anti-inflammatory effect.'
      },
      {
        name: 'Erythritol',
        description: 'Skin cooling and moisture attraction for a refreshed feel.'
      },
      {
        name: 'Tremella Fuciformis (Mushroom) Extract',
        description: 'Plant-derived hyaluronic acid alternative for long-lasting hydration.'
      },
      {
        name: 'Hydroxyethylcellulose',
        description: 'Skin barrier protection and moisture retention.'
      },
      {
        name: 'Dextrin',
        description: 'Protective film against external stress and moisture loss.'
      }
    ]),

    howToUse: `Step 1 - Skin Smoothing & Fitting: The advanced smoothing mechanism reduces skin surface irregularities, creating a smooth, uniform surface. The high-adhesion fitting system enhances even, seamless skin adherence.

Step 2 - Skin Revitalizing: A powerful blend of 10 vitamins, herbal complexes, and naturally derived moisturizing ingredients energizes the skin to create a naturally radiant, glass-like glow.

Step 3 - Film Gel Network: A transparent, flexible gel film forms on the skin to set quickly without smudging or transfer, protecting moisture and active ingredients to maintain a smooth, radiant complexion all day without dryness.`,

    directions: `Apply an appropriate amount to face using the dedicated puff with gentle tapping motions. Build coverage as desired. Use daily as the final step in your skincare routine before sun exposure.

Dedicated Puff Features:
• Micro Air-Cell Structure: Evenly distributes formula for smooth, firm adherence without clumping
• Glass Skin Glow: Each gentle tapping motion enhances radiance and adherence for a clear, glass-like finish
• Quadruple Adhesion Coating: Four-layer coating prevents formula absorption into sponge, reducing waste and ensuring efficient delivery

Available Shades:
• #01 Bright: Illuminating glow for a clear, radiant complexion
• #02 Natural: Refined glow for a natural, healthy-looking complexion`,

    skinType: 'all',
    targetConcerns: JSON.stringify(['coverage', 'brightening', 'hydration', 'anti-aging', 'sun-protection']),
    usage: 'morning',
    ageGroup: 'adult',
    rating: 5,
    noDiscount: false,
    isHidden: false,
    isPriceOnRequest: false
  }

  console.log('Creating REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]...')

  // Check if product with productNumber '62' already exists
  const existing = await prisma.product.findUnique({
    where: { productNumber: '62' }
  })

  if (existing) {
    console.log('⚠️  Product with productNumber 62 already exists:', existing.name)
    console.log('   ID:', existing.id)
    console.log('   Updating product...')
    
    const updated = await prisma.product.update({
      where: { productNumber: '62' },
      data: productData
    })
    
    console.log('✅ Updated product:', updated.name)
    console.log('   ID:', updated.id)
  } else {
    const result = await prisma.product.create({
      data: productData
    })

    console.log('✅ Created product:', result.name)
    console.log('   ID:', result.id)
    console.log('   Product Number:', result.productNumber)
    console.log('   Category:', result.category)
    console.log('   Price:', result.price, 'AED')
    console.log('   Size:', result.size)
    console.log('   Image:', result.image)
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
