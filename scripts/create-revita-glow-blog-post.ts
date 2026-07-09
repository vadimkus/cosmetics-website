/**
 * One-off: create the REVITA GLOW BB Cream blog post (EN/AR/RU) using the
 * product's own gallery images (/images/revita/*).
 *
 * Run:  npx tsx --env-file=.env.local scripts/create-revita-glow-blog-post.ts
 * Idempotent: skips if the slug already exists.
 */
import { prisma } from '../lib/prisma'

const SLUG = 'revita-glow-bb-cream-glass-skin-spf38'

const contentEn = `
<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Meet <strong>REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]</strong> — a regenerative Korean BB cream that gives your skin the coveted <strong>clear, glass-like glow</strong> while it covers imperfections, protects from the UAE sun and actively cares for your skin all day.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Skincare first, makeup second</h2>
    <p class="text-gray-700">Most BB creams are makeup with a hint of skincare. REVITA GLOW flips that: a <strong>10 Vitamin Complex</strong> (A, B1, B2, B3, B4, B5, B7, B9, C, E) energizes the skin while a <strong>7 Herb Complex</strong> — green tea, rosemary, centella, chamomile and more — soothes and protects the barrier. The result is skin that looks better at the end of the day, not worse.</p>
    <img src="/images/revita/s1.jpg" alt="REVITA GLOW BB Cream — texture and glow" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Instant revitalizing glow</strong> — enhances the skin's natural luminosity for a glass-skin finish.</li>
      <li><strong>Natural coverage</strong> — conceals imperfections without a mask effect.</li>
      <li><strong>UV protection</strong> — SPF 38 PA+++ built into your base.</li>
      <li><strong>All-day comfort</strong> — hydrating, plant-derived moisturizers prevent dryness and caking.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Two shades, one glow</h3>
    <p class="text-gray-700 mb-3">REVITA GLOW comes in two adaptive shades:</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>#01 Bright</strong> — an illuminating glow for a clear, radiant complexion.</li>
      <li><strong>#02 Natural</strong> — a refined glow for a natural, healthy-looking finish.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The secret is in the puff</h2>
    <img src="/images/revita/s2.jpg" alt="REVITA GLOW BB Cream — dedicated micro air-cell puff" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">The dedicated <strong>micro air-cell puff</strong> is engineered for a thin, even layer with every tap — no streaks, no caking. The formula sets into a <strong>transparent gel film</strong> that locks the finish in place: no smudging, no transfer, just a smooth radiant complexion that lasts all day.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">SPF 38 PA+++ — daily protection built in</h2>
    <img src="/images/revita/s3.jpg" alt="REVITA GLOW BB Cream — SPF 38 PA+++ protection" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Under the UAE sun, daily UV protection is non-negotiable. REVITA GLOW builds <strong>SPF 38 PA+++</strong> into your makeup base, so your coverage step doubles as your last line of defense against photo-aging, dark spots and dullness.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">How to wear it: the Radiant Glow Routine</h2>
    <img src="/images/revita/s4.jpg" alt="REVITA GLOW BB Cream — application and routine" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">For the full glass-skin effect, apply REVITA GLOW as the final step of your morning routine: cleanse with <a href="/products/10" class="text-primary-600 font-semibold hover:underline">Snow O₂ Cleanser</a>, balance with <a href="/products/16" class="text-primary-600 font-semibold hover:underline">Snow Booster</a>, brighten with <a href="/products/21" class="text-primary-600 font-semibold hover:underline">Multi Vita Radiance Serum</a>, hydrate with <a href="/products/29" class="text-primary-600 font-semibold hover:underline">Hyaluron Cream</a> — then tap on REVITA GLOW with the puff.</p>
  </div>

  <div class="bg-gray-900 text-white p-8 rounded-2xl text-center">
    <h3 class="text-2xl font-semibold mb-2">Try REVITA GLOW</h3>
    <p class="text-gray-300 mb-4">50g · two shades · SPF 38 PA+++ · dermatologically tested</p>
    <a href="/products/63" class="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">Shop REVITA GLOW BB Cream</a>
    <p class="text-gray-400 text-sm mt-4">Already tried it? Leave a review on the product page and earn 50 GENOSYS Rewards points.</p>
  </div>
</div>
`

const contentRu = `
<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Знакомьтесь: <strong>REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]</strong> — регенерирующий корейский BB-крем, который даёт коже эффект <strong>стеклянного сияния</strong>, маскирует несовершенства, защищает от солнца ОАЭ и ухаживает за кожей весь день.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Сначала уход, потом макияж</h2>
    <p class="text-gray-700">Большинство BB-кремов — это макияж с намёком на уход. REVITA GLOW устроен наоборот: <strong>комплекс из 10 витаминов</strong> (A, B1, B2, B3, B4, B5, B7, B9, C, E) наполняет кожу энергией, а <strong>комплекс из 7 трав</strong> — зелёный чай, розмарин, центелла, ромашка и другие — успокаивает и защищает барьер. К вечеру кожа выглядит лучше, а не хуже.</p>
    <img src="/images/revita/s1.jpg" alt="BB-крем REVITA GLOW — текстура и сияние" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Мгновенное сияние</strong> — усиливает естественную люминозность кожи, эффект glass skin.</li>
      <li><strong>Естественное покрытие</strong> — скрывает несовершенства без эффекта маски.</li>
      <li><strong>UV-защита</strong> — SPF 38 PA+++ прямо в основе под макияж.</li>
      <li><strong>Комфорт весь день</strong> — растительные увлажнители не дают сухости и заломам.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Два оттенка — одно сияние</h3>
    <ul class="space-y-2 text-gray-700">
      <li><strong>#01 Bright</strong> — сияющий тон для чистого, лучезарного цвета лица.</li>
      <li><strong>#02 Natural</strong> — деликатное сияние для естественного, здорового финиша.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Секрет — в спонже</h2>
    <img src="/images/revita/s2.jpg" alt="BB-крем REVITA GLOW — фирменный спонж" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Фирменный <strong>спонж с микроячейками</strong> создан для тонкого, ровного слоя лёгкими похлопываниями — без полос и наслоений. Формула застывает в <strong>прозрачную гелевую плёнку</strong>: не смазывается, не отпечатывается и держится весь день.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">SPF 38 PA+++ — ежедневная защита</h2>
    <img src="/images/revita/s3.jpg" alt="BB-крем REVITA GLOW — защита SPF 38 PA+++" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Под солнцем ОАЭ ежедневная UV-защита обязательна. REVITA GLOW встраивает <strong>SPF 38 PA+++</strong> в макияж — ваш тон одновременно защищает от фотостарения, пигментации и тусклости.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Как носить: сияющий утренний уход</h2>
    <img src="/images/revita/s4.jpg" alt="BB-крем REVITA GLOW — нанесение и уход" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Для полного эффекта glass skin наносите REVITA GLOW финальным шагом утреннего ухода: очищение <a href="/ru/products/10" class="text-primary-600 font-semibold hover:underline">Snow O₂ Cleanser</a>, тонизация <a href="/ru/products/16" class="text-primary-600 font-semibold hover:underline">Snow Booster</a>, сияние с <a href="/ru/products/21" class="text-primary-600 font-semibold hover:underline">Multi Vita Radiance Serum</a>, увлажнение <a href="/ru/products/29" class="text-primary-600 font-semibold hover:underline">Hyaluron Cream</a> — и затем REVITA GLOW спонжем.</p>
  </div>

  <div class="bg-gray-900 text-white p-8 rounded-2xl text-center">
    <h3 class="text-2xl font-semibold mb-2">Попробуйте REVITA GLOW</h3>
    <p class="text-gray-300 mb-4">50 г · два оттенка · SPF 38 PA+++ · дерматологически протестирован</p>
    <a href="/ru/products/63" class="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">Купить REVITA GLOW BB Cream</a>
    <p class="text-gray-400 text-sm mt-4">Уже попробовали? Оставьте отзыв на странице продукта и получите 50 баллов GENOSYS Rewards.</p>
  </div>
</div>
`

const contentAr = `
<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">تعرّفي على <strong>REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]</strong> — كريم BB كوري متجدد يمنح بشرتك <strong>توهجاً صافياً كالزجاج</strong>، ويخفي العيوب، ويحميك من شمس الإمارات، ويعتني ببشرتك طوال اليوم.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">العناية أولاً، ثم المكياج</h2>
    <p class="text-gray-700">معظم كريمات BB مكياجٌ مع لمسة عناية. أما REVITA GLOW فيعكس المعادلة: <strong>مركب من 10 فيتامينات</strong> (A، B1، B2، B3، B4، B5، B7، B9، C، E) ينشّط البشرة، بينما <strong>مركب من 7 أعشاب</strong> — الشاي الأخضر وإكليل الجبل والسنتيلا والبابونج وغيرها — يهدئ البشرة ويحمي حاجزها. النتيجة: بشرة تبدو أجمل في نهاية اليوم.</p>
    <img src="/images/revita/s1.jpg" alt="كريم REVITA GLOW BB — الملمس والتوهج" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>توهج فوري</strong> — يعزز إشراق البشرة الطبيعي لمظهر زجاجي.</li>
      <li><strong>تغطية طبيعية</strong> — تخفي العيوب دون مظهر القناع.</li>
      <li><strong>حماية من الأشعة</strong> — SPF 38 PA+++ مدمجة في أساس مكياجك.</li>
      <li><strong>راحة طوال اليوم</strong> — مرطبات نباتية تمنع الجفاف والتكتل.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">درجتان، توهج واحد</h3>
    <ul class="space-y-2 text-gray-700">
      <li><strong>#01 Bright</strong> — توهج مضيء لبشرة صافية ومشرقة.</li>
      <li><strong>#02 Natural</strong> — توهج ناعم لمظهر طبيعي وصحي.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">السر في الإسفنجة</h2>
    <img src="/images/revita/s2.jpg" alt="كريم REVITA GLOW BB — الإسفنجة المخصصة" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">صُممت <strong>الإسفنجة ذات الخلايا الهوائية الدقيقة</strong> لتوزيع طبقة رقيقة ومتساوية بكل تربيتة — دون خطوط أو تكتل. وتتحول التركيبة إلى <strong>طبقة جل شفافة</strong> تثبّت المكياج: لا تلطيخ ولا انتقال، بل إشراق يدوم طوال اليوم.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">حماية يومية SPF 38 PA+++</h2>
    <img src="/images/revita/s3.jpg" alt="كريم REVITA GLOW BB — حماية SPF 38 PA+++" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">تحت شمس الإمارات، الحماية اليومية من الأشعة ضرورة. يدمج REVITA GLOW حماية <strong>SPF 38 PA+++</strong> في أساس المكياج — فتصبح خطوة التغطية خط الدفاع الأخير ضد التصبغات والشيخوخة الضوئية.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">طريقة الاستخدام: روتين التوهج المشرق</h2>
    <img src="/images/revita/s4.jpg" alt="كريم REVITA GLOW BB — التطبيق والروتين" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">للحصول على مظهر الزجاج الكامل، ضعي REVITA GLOW كخطوة أخيرة في روتينك الصباحي: التنظيف بـ<a href="/ar/products/10" class="text-primary-600 font-semibold hover:underline">Snow O₂ Cleanser</a>، التوازن بـ<a href="/ar/products/16" class="text-primary-600 font-semibold hover:underline">Snow Booster</a>، الإشراق بـ<a href="/ar/products/21" class="text-primary-600 font-semibold hover:underline">Multi Vita Radiance Serum</a>، الترطيب بـ<a href="/ar/products/29" class="text-primary-600 font-semibold hover:underline">Hyaluron Cream</a> — ثم REVITA GLOW بالإسفنجة.</p>
  </div>

  <div class="bg-gray-900 text-white p-8 rounded-2xl text-center">
    <h3 class="text-2xl font-semibold mb-2">جرّبي REVITA GLOW</h3>
    <p class="text-gray-300 mb-4">50 غ · درجتان · SPF 38 PA+++ · مختبر طبياً</p>
    <a href="/ar/products/63" class="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">تسوّقي REVITA GLOW BB Cream</a>
    <p class="text-gray-400 text-sm mt-4">جرّبتِه بالفعل؟ اتركي تقييماً على صفحة المنتج واكسبي 50 نقطة من مكافآت GENOSYS.</p>
  </div>
</div>
`

async function main() {
  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } })
  if (existing) {
    console.log('Post already exists:', existing.id, '- skipping')
    return
  }
  const post = await prisma.blogPost.create({
    data: {
      slug: SLUG,
      title: 'REVITA GLOW BB Cream: Glass Skin Glow with SPF 38 PA+++',
      excerpt:
        'A regenerative Korean BB cream with 10 vitamins, 7 herbal extracts and SPF 38 PA+++ — natural coverage and a glass-like glow that cares for your skin all day.',
      content: contentEn,
      featuredImage: '/images/revita/main.jpg',
      authorName: 'GENOSYS Team',
      published: true,
      publishedAt: new Date(),
      tags: JSON.stringify([
        'revita-glow',
        'bb-cream',
        'glass-skin',
        'spf',
        'sun-protection',
        'korean-skincare',
        'makeup',
        'new-product',
      ]),
      titleAr: 'كريم REVITA GLOW BB: توهج زجاجي مع حماية SPF 38 PA+++',
      excerptAr:
        'كريم BB كوري متجدد بعشرة فيتامينات وسبعة مستخلصات عشبية وحماية SPF 38 PA+++ — تغطية طبيعية وتوهج زجاجي مع عناية تدوم طوال اليوم.',
      contentAr,
      titleRu: 'BB-крем REVITA GLOW: эффект стеклянной кожи с SPF 38 PA+++',
      excerptRu:
        'Регенерирующий корейский BB-крем с 10 витаминами, 7 растительными экстрактами и SPF 38 PA+++ — естественное покрытие и стеклянное сияние с уходом весь день.',
      contentRu,
    },
  })
  console.log('Created blog post:', post.id, post.slug)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
