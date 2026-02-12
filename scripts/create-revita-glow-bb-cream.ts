import { prisma } from '../lib/prisma'

async function main() {
  // ── Step 1: Restore Sensitive Skin Beauty Box as product 62 ──
  console.log('\n── Restoring SENSITIVE SKIN BEAUTY BOX (product 62) ──')
  const beautyBoxData = {
    productNumber: '62',
    name: 'SENSITIVE SKIN BEAUTY BOX',
    nameAr: 'صندوق الجمال للبشرة الحساسة',
    nameRu: 'НАБОР ДЛЯ ЧУВСТВИТЕЛЬНОЙ КОЖИ',
    price: 1442,
    category: 'Beauty Boxes',
    image: '/images/beauty_boxes/sskin_beauty_box.png',
    images: JSON.stringify(['/images/beauty_boxes/sskin_beauty_box.png']),
    inStock: true,
    size: '1 set',
    description: `A powerful soothing collection for sensitive and reactive skin. Calms, protects, and strengthens the skin barrier with gentle, clinically proven ingredients suited for even the most sensitive skin types.

Regular Price: 1,696 AED | Box Price: 1,442 AED | Save 15% (254 AED)

💗 Beauty Box: For Sensitive Skin

Kit includes:

1. Snow O2 180ml (1 pc) = 330 AED
All-in-one gentle cleanser with oxygen bubbles. A gentle and effective cleanser that provides an excellent therapeutic feel. Naturally generated oxygen bubbles clean makeup, dirt, and impurities from the skin without excessive cleansing motions or skin irritation. Features oxygen therapy mechanism for deep cleansing and nourishment. Key Ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.

2. Snow Booster 200ml (1 pc) = 260 AED
Daily hydrating and skin-refining toner for all skin types. Contains various plant extracts to hydrate and soothe the skin. Helps refine skin texture while balancing pH levels after cleansing. Key Ingredients: Phytolex SC, Lotus Flower Extract, Fermented Pumpkin Extract, Betaine.

3. All For Sensitive Serum 30ml (1 pc) = 330 AED
Calming serum for sensitive and reactive skin with CELLASURE™ 5X technology. Specially designed for sensitive skin prone to redness or irritation. Soothes the skin and strengthens its protective barrier while reducing sensitivity. Key Ingredients: CELLASURE™ 5X, calming plant extracts, Panthenol.

4. Skin Barrier Protecting Cream with Ceramides 100ml (1 pc) = 450 AED
Rich cream with ceramides to strengthen and protect the skin barrier. Provides intensive, long-lasting hydration while protecting skin from external irritants. Ideal for sensitive and dry skin. Key Ingredients: 5-Ceramide Complex, Hyaluronic Acid, Shea Butter, Squalane.

5. EGF Repair Oxymask 50ml (1 pc) = 290 AED
Intensive repair mask with Epidermal Growth Factor (EGF) and oxygen bubbles. Revitalizes and regenerates sensitive, tired skin with deep nourishment. Key Ingredients: EGF, Oxygen Capsules, Panthenol, Hyaluronic Acid.

6. Soothing Bomb Sea Algae Mask (1 pc) = 36 AED
Soothing and hydrating sheet mask with sea algae complex. Provides intensive hydration and instant soothing for sensitive, irritated skin. Key Ingredients: Sea Algae Extract, Hyaluronic Acid, Calming Plant Extracts.`,
    descriptionAr: 'مجموعة مهدئة قوية للبشرة الحساسة والمتفاعلة. تعمل على تهدئة وحماية وتقوية حاجز البشرة مع مكونات لطيفة مثبتة إكلينيكياً تناسب أكثر أنواع البشرة حساسية.',
    descriptionRu: 'Комплексный набор для ухода за чувствительной и реактивной кожей. Мягкая, но эффективная формула успокаивает, защищает и укрепляет защитный барьер кожи с клинически проверенными ингредиентами.',
    productDetails: JSON.stringify({
      form: 'Sensitive Skin Beauty Box',
      target: 'Comprehensive sensitive and reactive skin care',
      technology: 'Soothing and barrier-strengthening ingredients',
      keyBenefits: 'Soothing, Protection, Barrier Strengthening, Deep Hydration',
      usage: 'Daily use for sensitive skin',
      skinType: 'Sensitive and reactive skin',
      application: 'Use products according to instructions',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Skin soothing - calms and reduces redness and irritation',
      'Barrier strengthening - strengthens and enhances the skin\'s protective barrier',
      'Deep hydration - provides intensive, long-lasting moisture',
      'Protection from irritants - protects skin from harmful external factors',
      'Reduced sensitivity - helps reduce skin reactivity',
      'Skin regeneration - supports regeneration of sensitive skin cells',
      'Gentle ingredients - contains safe ingredients for sensitive skin',
      'Comprehensive care - provides complete care for sensitive skin'
    ]),
    ingredients: null,
    howToUse: 'Use products according to the enclosed instructions. Typically used as part of a daily skincare routine.',
    directions: 'This product is suitable for sensitive and reactive skin. Use regularly for best results. Store in a cool, dry place.',
    skinType: 'sensitive',
    targetConcerns: JSON.stringify(['sensitivity', 'redness', 'barrier-repair', 'hydration', 'soothing']),
    usage: 'daily',
    ageGroup: 'adult',
    rating: 5,
    noDiscount: false,
    isHidden: false,
    isPriceOnRequest: false
  }

  const existingBeautyBox = await prisma.product.findUnique({
    where: { productNumber: '62' }
  })

  if (existingBeautyBox) {
    // Product 62 exists but was overwritten with BB cream data - restore it
    console.log('⚠️  Product 62 exists as:', existingBeautyBox.name)
    console.log('   Restoring SENSITIVE SKIN BEAUTY BOX...')
    const restored = await prisma.product.update({
      where: { productNumber: '62' },
      data: beautyBoxData
    })
    console.log('✅ Restored:', restored.name, '(ID:', restored.id, ')')
  } else {
    const created = await prisma.product.create({
      data: beautyBoxData
    })
    console.log('✅ Created:', created.name, '(ID:', created.id, ')')
  }

  // ── Step 2: Create Revita Glow BB Cream as product 63 ──
  console.log('\n── Creating REVITA GLOW BB CREAM (product 63) ──')
  const productData = {
    productNumber: '63',
    name: 'REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]',
    nameAr: 'كريم ريفيتا جلو BB [SPF 38 PA+++]',
    nameRu: 'REVITA GLOW BB КРЕМ [SPF 38 PA+++]',
    price: 250,
    category: 'Cream, Sun, Cushion BB',
    image: '/images/bright.jpg',
    images: JSON.stringify([
      '/images/bright.jpg',
      '/images/natural.jpg',
      '/images/vita_color.jpg'
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

  // Check if product with productNumber '63' already exists
  const existing = await prisma.product.findUnique({
    where: { productNumber: '63' }
  })

  if (existing) {
    console.log('⚠️  Product with productNumber 63 already exists:', existing.name)
    console.log('   ID:', existing.id)
    console.log('   Updating product...')
    
    const updated = await prisma.product.update({
      where: { productNumber: '63' },
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
