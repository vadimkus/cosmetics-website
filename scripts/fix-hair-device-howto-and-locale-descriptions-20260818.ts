/**
 * Products 3 (HairGen BOOSTER) and 48 (Hair-GENTRON) — the fields today's earlier scripts
 * never touched.
 *
 * ★ THE MISS. `scripts/fix-hair-devices-claims-20260818.ts` and
 * `scripts/fix-product-48-gentron-record-20260818.ts` rewrote `description`, `benefits`,
 * `keyFeatures` and `productDetails`. A product row has three more claim-bearing surfaces:
 *
 *   howToUse       rendered on the generic PDP and the mobile app
 *   directions      same
 *   descriptionAr / descriptionRu   DB columns, and NOT the same thing as
 *                   data/productTranslations*.ts — lib/seo.ts prefers these columns for
 *                   the localized meta description, so a page can be clean in the body
 *                   and still ship the old claim to Google in Arabic and Russian
 *
 * All three still carried the claims stripped from the rest of the record:
 *
 *   3  howToUse       "Light therapy stimulates hair follicles", "essential nutrients for
 *                      hair growth", "Natural wound healing process promotes collagen"
 *   3  descriptionAr  "دعم برامج تقليل تساقط الشعر" (supporting hair-loss reduction programmes)
 *   3  descriptionRu  "поддержать программы против выпадения волос"
 *   48 howToUse       "LED lights stimulate hair follicles", "improves blood circulation",
 *                      "increases blood flow and light penetration"
 *   48 descriptionAr  "تحسين الدورة الدموية"، "بيئة أفضل لنمو الشعر"
 *   48 descriptionRu  "улучшить микроциркуляцию", "среду для роста волос"
 *
 * Found by grepping the rendered /products/48 HTML for banned terms after the page was
 * built — the record and the page disagreed again, which is the third time this week that
 * checking the payload rather than the layout caught it.
 *
 * SOURCES. Product 48: User's manual-HAIR GENTRON.pdf. Product 3: the 2021 leaflet and
 * the HairGen Booster user manual. Both in ~/Desktop/Drive/Genosys/.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-hair-device-howto-and-locale-descriptions-20260818.ts
 */

import { prisma } from '../lib/prisma'

const GENTRON_HOWTO = [
  '1. Wash the scalp and dry it — the manual puts this first.',
  '2. If a main treatment is part of the protocol, do it before the helmet: the manufacturer positions this as a supplement after a medical or aesthetic procedure.',
  '3. Put the helmet on so the front does not cover the eyes, and size it with the height and width dials.',
  '4. Hold On/Time/OFF for a second to start the ten-minute preset — air-pressure massage, heat, all three lights and music. A short press sets 20 or 30 minutes instead.',
  '5. Choose the LED mode, the massage and the heat on their own buttons. The helmet stops itself when the time is up.',
  '',
  'Never run it longer than thirty minutes at a time.',
].join('\n')

const GENTRON_DIRECTIONS = [
  'For external use on the scalp. Consult a doctor before use if you are under medical treatment, have an',
  'implanted electronic medical device, heart disease, a disease of the head, are pregnant, have osteoporosis or',
  'a fractured spine, have circulation problems caused by diabetes or another disease, or have a body',
  'temperature over 38 °C.',
  '',
  'Keep out of reach of children and away from liquid and heat. Do not use a damaged adaptor and do not operate',
  'with wet hands. Do not run the device longer than thirty minutes at a time. Users who are insensitive to heat',
  'should use the heating function carefully or turn it off. Stop and consult a doctor if anything feels',
  'abnormal. Store at 5–40 °C, humidity 80% or below.',
].join(' ')

const GENTRON_AR =
  'خوذة LED لفروة الرأس بتدليك بضغط الهواء ووظيفة تسخين، على جهاز تحكّم منفصل. أربعة أوضاع للإضاءة ومؤقّت '
  + 'يُضبط على 10 أو 20 أو 30 دقيقة، ثم تنطفئ وحدها. معتمدة كجهاز تدليك منزلي وفق IEC/EN 60335-2-32، وغير '
  + 'مسجّلة لعلاج تساقط الشعر. الطراز HGHY01، براءة اختراع كورية 10-2151442.'

const GENTRON_RU =
  'LED-шлем для кожи головы с массажем сжатым воздухом и нагревом, на отдельном пульте. Четыре режима света и '
  + 'таймер на 10, 20 или 30 минут, после чего шлем выключается сам. Сертифицирован как бытовой массажный '
  + 'прибор по IEC/EN 60335-2-32 и не зарегистрирован для лечения выпадения волос. Модель HGHY01, патент '
  + 'Кореи 10-2151442.'

const BOOSTER_HOWTO = [
  '1. Cleanse and dry the scalp.',
  '2. Screw a new HR³ MATRIX HAIR STAMP onto a sealed 4 ml HR³ MATRIX HAIR SOLUTION α vial, then load the vial into the device.',
  '3. Part the treatment area with a comb and glide the device along the parting.',
  '4. Set the speed — three levels, 280, 330 and 400 stamps per minute.',
  '5. The device runs for ten minutes and switches off by itself. That is one session.',
  '6. Discard the stamp and the vial afterwards and put the device on charge.',
  '',
  'Use only the products recommended for this system: the manual says not to use it with other cosmetics.',
].join('\n')

const BOOSTER_AR =
  'جهاز محمول لوخز فروة الرأس بالإبر الدقيقة مع إضاءة LED، يعمل مع أمبولة HR³ MATRIX HAIR SOLUTION α. ختم '
  + 'بـ 52 إبرة يُستخدم مرة واحدة يُركَّب على قارورة 4 مل مختومة، فيتدفّق المحلول عبر الرأس أثناء عمل الإبر. '
  + 'ثلاث سرعات وجلسة عشر دقائق يوقفها الجهاز وحده. غير مسجّل لعلاج تساقط الشعر، ولا نملك له دراسة فعالية.'

const BOOSTER_RU =
  'Ручной аппарат для микронидлинга кожи головы с LED, работающий с ампулой HR³ MATRIX HAIR SOLUTION α. '
  + 'Одноразовый штамп с 52 микроиглами накручивается на запечатанный флакон 4 мл, и раствор поступает через '
  + 'головку, пока работают иглы. Три скорости и десятиминутный сеанс, который прибор завершает сам. Не '
  + 'зарегистрирован для лечения выпадения волос; исследования эффективности у нас нет.'

const BANNED = [
  'hair growth', 'hair loss treatment', 'stimulates hair follicles', 'blood circulation',
  'blood flow', 'angiogenesis', 'wound healing', 'نمو الشعر', 'الدورة الدموية',
  'роста волос', 'кровообращ', 'микроциркул',
]

async function main() {
  const gentron = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '48' }, { name: { contains: 'GENTRON' } }] },
  })
  const booster = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '3' }, { name: { contains: 'HairGen' } }] },
  })
  if (!gentron) throw new Error('Hair-GENTRON not found')
  if (!booster) throw new Error('HairGen BOOSTER not found')

  await prisma.product.update({
    where: { id: gentron.id },
    data: {
      howToUse: GENTRON_HOWTO,
      directions: GENTRON_DIRECTIONS,
      descriptionAr: GENTRON_AR,
      descriptionRu: GENTRON_RU,
    },
  })

  await prisma.product.update({
    where: { id: booster.id },
    data: {
      howToUse: BOOSTER_HOWTO,
      descriptionAr: BOOSTER_AR,
      descriptionRu: BOOSTER_RU,
    },
  })

  for (const id of [gentron.id, booster.id]) {
    const p = await prisma.product.findUnique({ where: { id } })
    const blob = [
      p?.description, p?.benefits, p?.keyFeatures, p?.productDetails,
      p?.howToUse, p?.directions, p?.descriptionAr, p?.descriptionRu,
    ].join(' ').toLowerCase()
    const hits = BANNED.filter(t => blob.includes(t.toLowerCase()))
    console.log(`${p?.name}: ${hits.length ? `STILL PRESENT → ${hits.join(', ')}` : 'clean across all eight fields'}`)
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
