/**
 * Product 62 — SENSITIVE SKIN BEAUTY BOX.
 *
 * Two changes, both of which the new box photograph forced:
 *
 * 1. NEW MAIN IMAGE. /images/bb_box_sensitive/main.jpeg, the six products standing
 *    in front of the white outer carton, shot the same way as the other five boxes.
 *
 * 2. THE EGF SUBSTITUTION. The box shipped with EGF REPAIR OXYMASK CREAM (50 g,
 *    290 AED) in its treatment slot. That product is discontinued — its record is
 *    already inStock: false and isHidden: true — so the box was selling a unit that
 *    no longer exists, and lib/moyskladBeautyBoxExplosion.ts was still raising a
 *    picking line for it.
 *
 *    It is replaced by SKIN RESCUE OVERNIGHT CREAM MASK (100 g, 340 AED), which the
 *    new photograph shows. Same cream-mask format, same oxygen capsules that burst
 *    on contact, double the size, and unlike the oxymask it carries a four-week
 *    trial: erythema improved 26%, transepidermal water loss improved 15%.
 *
 * PRICING DECISION. The parts total rises 1,696 → 1,746. The box price is
 * deliberately LEFT AT 1,442 rather than raised to 1,484 to hold the 15% margin, so
 * customers see no price increase and the saving becomes 304 AED, about 17%. That
 * costs roughly 50 AED of margin per box. Flip the numbers here, in
 * lib/productQuickFactsCatalog.ts and in the two translation files if the margin
 * should be held instead.
 *
 * Claims removed while rewriting: "EGF", "Epidermal Growth Factor", "Oxygen
 * Capsules", "CELLASURE™ 5X" (in no document for product 19 — the real complex is
 * MultiEx BSASM Plus at 1%) and "5-Ceramide Complex" (product 27 carries ONE
 * ceramide, Ceramide NP, at 5,000 ppm, which is the better and truer story).
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-62-sensitive-box-20260817.ts
 */

import { prisma } from '../lib/prisma'

const IMAGE = '/images/bb_box_sensitive/main.jpeg'

const EN_DESCRIPTION = [
  'A soothing routine for sensitive and reactive skin. Six full-size GENOSYS products that calm, seal and rebuild the barrier, with the one clinically measured item in the set aimed at the symptom most people mean by sensitive skin: redness.',
  '',
  'Regular Price: 1,746 AED | Box Price: 1,442 AED | Save 304 AED (17%)',
  '',
  '💗 Beauty Box: For Sensitive Skin',
  '',
  'Kit includes:',
  '',
  '1. Snow O₂ 180ml (1 pc) = 330 AED',
  'All-in-one gentle cleanser with oxygen bubbles. Applied to a dry face, where naturally generated oxygen bubbles lift make-up and impurities without scrubbing or irritation. Bubble agent at 3.000%, pH 5.86. Contains fragrance and limonene.',
  '',
  '2. Snow Booster 200ml (1 pc) = 260 AED',
  'Daily hydrating and skin-refining toner for all skin types, and the only item in this box with no fragrance at all. Botanical extracts hydrate and soothe while pH is brought back down after cleansing. Betaine 3.000%, pumpkin ferment 1.000%, pH 6.08.',
  '',
  '3. All For Sensitive Serum 30ml (1 pc) = 330 AED',
  'The calming step. Built on a botanical complex at a full 1% of the bottle carrying seven plants — centella, polygonum, scutellaria, green tea, licorice, chamomile and rosemary — with allantoin at 0.1% and betaine at 0.5% behind them. Function: soothing, moisturizing. pH 5.77. Dermatologically tested. Contains orange peel oil.',
  '',
  '4. Skin Barrier Protecting Cream 100g (1 pc) = 450 AED',
  'The richest cream in the range. Ceramide NP at 5,000 ppm, a dose the Korean carton panel prints in brackets next to the ingredient because ceramide creams normally run it far lower, with glycerin at 17.49% and shea butter at 3%. Apply on the face and gently pat, morning and evening. pH 6.07. Dermatologically tested.',
  '',
  '5. Skin Rescue Overnight Cream Mask 100g (1 pc) = 340 AED',
  'The treatment step, and the only item here with a clinical trial behind it: over four weeks, erythema improved 26% and transepidermal water loss improved 15%. Oxygen capsules burst on contact and melt into a pink ceramide cream. Niacinamide 2% and adenosine 0.04%. Goes on last at night and is not washed off; avoid the eye area. Once or twice a week. pH 5.71.',
  '',
  '6. Soothing Bomb Sea Algae Mask (1 pc) = 36 AED',
  'One Eucalace® sheet soaked in a sea algae complex with centella. Fifteen to twenty minutes after toning on an evening skin feels hot or tight. pH 5.69, no artificial pigment.',
  '',
  'Note on fragrance: the cleanser, the serum and the cream are all fragranced, and the toner and both masks are not. Every fragrance ingredient is named on the labels. If fragrance is what sets your skin off, buy the fragrance-free pieces individually rather than the box.',
].join('\n')

const EN_HOW_TO = [
  'Use products according to the enclosed instructions. Cleanse, tone, serum and cream, morning and evening.',
  '',
  'Daily:',
  '1. Cleanse with Snow O₂ — apply to a dry face, wait for the oxygen bubbles, massage in circles, rinse with tepid water',
  '2. Tone with Snow Booster while skin is still damp, pressing it in with your palms',
  '3. Apply All For Sensitive Serum — two or three drops patted over face and neck',
  '4. Seal with Skin Barrier Protecting Cream — apply on the face and gently pat rather than rubbing',
  '',
  'Weekly:',
  '- Skin Rescue Overnight Cream Mask once or twice a week, as the last step at night instead of the cream. Leave it on until morning and do not wash it off. Avoid the eye area',
  '- Soothing Bomb Sea Algae Mask for 15 to 20 minutes after toning on an evening skin feels hot or tight, then continue with serum and cream. There is one sheet in the box',
  '',
  'On very reactive skin, start with the toner and barrier cream only for about a week, then add the serum, then the overnight mask. Introducing six products at once makes it impossible to tell which one helped.',
].join('\n')

const AR_DESCRIPTION = [
  'روتين مهدّئ للبشرة الحساسة والمتفاعلة. ستة منتجات GENOSYS بالحجم الكامل تهدّئ وتُغلق وتعيد بناء الحاجز، والمنتج الوحيد المقيس سريرياً في المجموعة موجَّه إلى العَرَض الذي يقصده معظم الناس بالبشرة الحساسة: الاحمرار.',
  '',
  'السعر العادي: 1,746 درهماً | سعر المجموعة: 1,442 درهماً | توفير 304 دراهم (17%)',
  '',
  '💗 صندوق الجمال: للبشرة الحساسة',
  '',
  'تشمل المجموعة:',
  '',
  '1. Snow O₂ 180 مل (قطعة واحدة) = 330 درهماً',
  'منظف لطيف شامل بفقاعات الأكسجين. يوضع على وجه جافّ، حيث ترفع فقاعات الأكسجين المتكوّنة طبيعياً المكياج والشوائب بلا فرك ولا تهيّج. عامل الفقاعات 3.000%، الحموضة 5.86. يحتوي عطراً وليمونين.',
  '',
  '2. Snow Booster 200 مل (قطعة واحدة) = 260 درهماً',
  'تونر يومي مرطّب ومحسّن للبشرة لكل الأنواع، وهو المنتج الوحيد في هذا الصندوق بلا أي عطر. مستخلصات نباتية ترطّب وتهدّئ مع إعادة الحموضة إلى مستواها بعد التنظيف. بيتايين 3.000%، خميرة اليقطين 1.000%، الحموضة 6.08.',
  '',
  '3. All For Sensitive Serum 30 مل (قطعة واحدة) = 330 درهماً',
  'خطوة التهدئة. مبني على مركّب نباتي بنسبة 1% كاملة من العبوة يحمل سبعة نباتات — السنتيلا والبوليجونوم والسكوتيلاريا والشاي الأخضر وعرق السوس والبابونج وإكليل الجبل — ووراءها ألانتوين 0.1% وبيتايين 0.5%. الوظيفة: تهدئة وترطيب. الحموضة 5.77. مختبر جلدياً. يحتوي زيت قشر البرتقال.',
  '',
  '4. Skin Barrier Protecting Cream 100 غ (قطعة واحدة) = 450 درهماً',
  'أغنى كريم في المجموعة. سيراميد NP بـ 5,000 جزء من المليون، وهي جرعة تطبعها اللوحة الكورية بين قوسين إلى جانب المكوّن لأن كريمات السيراميد تحمله عادة بأقل من ذلك بكثير، مع جليسرين 17.49% وزبدة شيا 3%. يوضع على الوجه مع طبطبة لطيفة صباحاً ومساءً. الحموضة 6.07. مختبر جلدياً.',
  '',
  '5. Skin Rescue Overnight Cream Mask 100 غ (قطعة واحدة) = 340 درهماً',
  'خطوة المعالجة، والمنتج الوحيد هنا الذي تقف خلفه تجربة سريرية: خلال أربعة أسابيع تحسّن الاحمرار 26% وتحسّن فقدان الماء عبر البشرة 15%. تنفجر كبسولات الأكسجين عند الملامسة وتذوب في كريم سيراميد وردي. نياسيناميد 2% وأدينوزين 0.04%. يوضع أخيراً ليلاً ولا يُشطف؛ تجنّبي منطقة العين. مرة أو مرتين أسبوعياً. الحموضة 5.71.',
  '',
  '6. Soothing Bomb Sea Algae Mask (قطعة واحدة) = 36 درهماً',
  'ورقة Eucalace® واحدة مشبعة بمركّب طحالب البحر مع السنتيلا. خمس عشرة إلى عشرين دقيقة بعد التونر في أمسية تشعر فيها البشرة بالحرارة أو الشدّ. الحموضة 5.69، بلا صبغات صناعية.',
  '',
  'ملاحظة عن العطر: المنظف والسيروم والكريم كلها معطَّرة، أما التونر والقناعان فلا. وكل مكوّن عطري مذكور على الملصقات. فإن كان العطر هو ما يهيّج بشرتك، فاشتري القطع الخالية من العطر منفصلة بدل الصندوق.',
].join('\n')

const RU_DESCRIPTION = [
  'Успокаивающий уход для чувствительной и реактивной кожи. Шесть полноразмерных продуктов GENOSYS, которые успокаивают, запечатывают и восстанавливают барьер, а единственный клинически измеренный продукт набора направлен на тот симптом, который большинство и имеет в виду под чувствительной кожей: покраснение.',
  '',
  'Обычная цена: 1 746 AED | Цена набора: 1 442 AED | Экономия 304 AED (17%)',
  '',
  '💗 Beauty Box: Для чувствительной кожи',
  '',
  'Набор включает:',
  '',
  '1. Snow O₂ 180 мл (1 шт.) = 330 AED',
  'Универсальное мягкое очищающее средство с кислородными пузырьками. Наносится на сухое лицо, где естественно образующиеся пузырьки поднимают макияж и загрязнения без трения и раздражения. Пузырьковый агент 3,000%, pH 5,86. Содержит ароматизатор и лимонен.',
  '',
  '2. Snow Booster 200 мл (1 шт.) = 260 AED',
  'Ежедневный увлажняющий тоник для всех типов кожи и единственный продукт в наборе вообще без ароматизатора. Растительные экстракты увлажняют и успокаивают, возвращая pH после очищения. Бетаин 3,000%, тыквенный фермент 1,000%, pH 6,08.',
  '',
  '3. All For Sensitive Serum 30 мл (1 шт.) = 330 AED',
  'Успокаивающий шаг. Построен на растительном комплексе в полный 1% флакона, несущем семь растений — центелла, горец, шлемник, зелёный чай, лакрица, ромашка и розмарин, — а за ними аллантоин 0,1% и бетаин 0,5%. Функция: успокоение, увлажнение. pH 5,77. Дерматологически протестирован. Содержит масло апельсиновой корки.',
  '',
  '4. Skin Barrier Protecting Cream 100 г (1 шт.) = 450 AED',
  'Самый богатый крем линейки. Керамид NP при 5 000 ppm — дозу корейская панель коробки печатает в скобках рядом с ингредиентом, потому что керамидные кремы обычно содержат его существенно меньше, — плюс глицерин 17,49% и масло ши 3%. Наносить на лицо и мягко вбивать, утром и вечером. pH 6,07. Дерматологически протестирован.',
  '',
  '5. Skin Rescue Overnight Cream Mask 100 г (1 шт.) = 340 AED',
  'Уходовый шаг и единственный продукт здесь, за которым стоит клиническое исследование: за четыре недели эритема улучшилась на 26%, а трансэпидермальная потеря влаги — на 15%. Кислородные капсулы лопаются при нанесении и растворяются в розовом керамидном креме. Ниацинамид 2% и аденозин 0,04%. Наносится последним на ночь и не смывается; избегайте области глаз. Раз или два в неделю. pH 5,71.',
  '',
  '6. Soothing Bomb Sea Algae Mask (1 шт.) = 36 AED',
  'Одна салфетка Eucalace®, пропитанная комплексом морских водорослей с центеллой. Пятнадцать-двадцать минут после тоника в вечер, когда кожа горит или стянута. pH 5,69, без искусственных пигментов.',
  '',
  'Примечание об ароматизаторе: очищающее средство, сыворотка и крем ароматизированы, тоник и обе маски — нет. Каждый ароматический компонент указан на этикетках. Если реакцию вызывает именно ароматизатор, покупайте продукты без него по отдельности, а не набор.',
].join('\n')

const BENEFITS = JSON.stringify([
  'Redness measured 26% lower after four weeks with the overnight mask',
  'Water loss through the skin measured 15% lower in the same study',
  'Barrier support from Ceramide NP at 5,000 ppm, a declared and printed dose',
  'Calming from a botanical complex at a full 1% carrying seven plants',
  'Deep hydration from glycerin at 17.49% in the barrier cream',
  'A fragrance-free toner and two fragrance-free masks for the worst days',
  'Comfort after procedures, when skin needs support rather than actives',
  'Six full retail sizes, in the order they are used',
])

const KEY_FEATURES = JSON.stringify([
  'Erythema −26% and water loss −15% over four weeks (overnight cream mask)',
  'Ceramide NP 5,000 ppm in the barrier cream',
  'Seven-botanical calming complex at 1% in the serum',
  'Glycerin 17.49% — the richest cream in the range',
  'Toner and both masks are fragrance-free; cleanser, serum and cream are not',
  'Cleanser, toner, serum and cream all dermatologically tested',
])

async function main() {
  const box = await prisma.product.findFirst({
    where: { name: { contains: 'SENSITIVE SKIN BEAUTY BOX' } },
  })
  if (!box) throw new Error('Product 62 (SENSITIVE SKIN BEAUTY BOX) not found')

  console.log(`Updating id=${box.id} pn=${box.productNumber} — ${box.name}`)
  console.log(`  image: ${box.image} → ${IMAGE}`)

  await prisma.product.update({
    where: { id: box.id },
    data: {
      image: IMAGE,
      description: EN_DESCRIPTION,
      howToUse: EN_HOW_TO,
      benefits: BENEFITS,
      keyFeatures: KEY_FEATURES,
    },
  })

  /* There is no translation table in the schema: Arabic and Russian product copy
     lives in data/productTranslations.ts and data/productTranslationsRu.ts, which
     are edited alongside this script rather than written from it. The two constants
     above are the text that went into those files, kept here so the three languages
     can be diffed against one another in one place. */
  void AR_DESCRIPTION
  void RU_DESCRIPTION

  const after = await prisma.product.findUnique({ where: { id: box.id } })
  console.log('\nImage now:', after?.image)
  console.log('Price unchanged at', after?.price, 'AED — parts now total 1,746, so the saving is 304 (17%)')
  console.log('\nEGF Repair Oxymask (26, discontinued) replaced by Skin Rescue Overnight Cream Mask (34).')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
