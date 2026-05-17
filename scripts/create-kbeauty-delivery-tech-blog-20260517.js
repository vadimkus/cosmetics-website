#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const { PrismaClient } = require('@prisma/client')

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
  console.error('Set PRISMA_DATABASE_URL or POSTGRES_URL')
  process.exit(1)
}

let prisma

if (databaseUrl.startsWith('prisma+')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ['error'] })
}

const slug = 'k-beauty-delivery-tech-pdrn-exosomes-spicules-2026'
const featuredImage = '/blog/kbeauty-delivery-tech-2026.jpg'
const publishedAt = new Date('2026-05-17T02:45:00.000Z')
const authorName = 'GENOSYS Team'
const tags = JSON.stringify([
  'k-beauty',
  'korean skincare',
  'delivery technology',
  'pdrn',
  'exosomes',
  'spicules',
  'peptides',
  'skin boosters',
])

const title = 'The Next K-Beauty Breakthrough: Delivery Tech, PDRN and Exosome-Inspired Skin Boosters'
const excerpt = 'Korean skincare is moving beyond hero ingredients into delivery technology: spicules, PDRN, peptides and exosome-inspired formulas designed for smarter, barrier-aware routines.'

const titleRu = 'Новый прорыв K-beauty: delivery tech, PDRN и exosome-inspired бустеры'
const excerptRu = 'Корейский уход уходит дальше “модных ингредиентов”: в фокусе технологии доставки, спикулы, PDRN, пептиды и exosome-inspired формулы для умного и бережного ухода.'

const titleAr = 'الجيل الجديد من K-Beauty: تقنيات التوصيل و PDRN وتركيبات مستوحاة من الإكسوسومات'
const excerptAr = 'العناية الكورية تتحول من مجرد مكونات رائجة إلى تقنيات توصيل أذكى: السبيكولات، PDRN، الببتيدات وتركيبات مستوحاة من الإكسوسومات بروتين لطيف على حاجز البشرة.'

const content = `<div class="blog-content space-y-8">
  <section class="space-y-4">
    <p class="text-lg leading-relaxed text-gray-700">K-beauty’s most interesting shift for 2026 is not another single “miracle ingredient.” It is the move from <strong>what is inside the formula</strong> to <strong>how the formula is delivered</strong>.</p>
    <p class="leading-relaxed text-gray-700">Across Korean beauty, the language is becoming more technical: PDRN, peptides, spicules, exosome-inspired vesicles, skin boosters, barrier recovery and bioavailability. This is the clinical-meets-consumer moment: professional ideas translated into textures people can actually use at home.</p>
  </section>

  <section class="rounded-2xl bg-gray-50 p-5 md:p-7">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">From hero ingredients to delivery systems</h2>
    <p class="leading-relaxed text-gray-700">For years the beauty conversation was dominated by actives: retinol, vitamin C, acids, niacinamide and peptides. Those still matter. But the new Korean question is sharper: <em>can the active reach the right layer of the skin in a controlled, comfortable way?</em></p>
    <p class="mt-4 leading-relaxed text-gray-700">That is why delivery technology is getting attention. Spicules create a physical delivery story. Exosome-inspired formulas create a signaling story. PDRN and peptides create a repair-and-resilience story. The winning routines will combine science with restraint.</p>
  </section>

  <section class="space-y-5">
    <h2 class="text-2xl font-bold text-gray-900">The four technologies to watch</h2>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">1. PDRN: the recovery-coded ingredient</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">PDRN, often discussed as “salmon DNA” in beauty media, moved from clinic language into serums, ampoules and masks. For retail skincare, the strongest positioning is not “miracle regeneration” but <strong>comfortable support for skin that looks calmer, smoother and more resilient</strong>.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">2. Peptides: slow-aging without the drama</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">Peptides remain important because they fit daily use: firming, smoothing and barrier-friendly anti-aging positioning without the irritation profile many clients associate with strong retinoids or acids.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">3. Spicules: “liquid microneedling” needs education</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">Spicules are tiny needle-like structures used in some Korean formulas to create a tingling, delivery-focused skincare experience. They are exciting, but they require clear guidance: patch test, avoid overuse, and do not layer immediately with strong acids or retinoids unless your skin is already trained.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">4. Exosome-inspired skincare: prestige with nuance</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">Exosomes are part of the global biotech vocabulary, but cosmetics must be precise. In consumer skincare, the trustworthy language is <strong>exosome-inspired, biomimetic, signal-support, texture refinement and hydration support</strong> — not clinic-equivalent claims.</p>
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">Why this matters in the UAE and GCC</h2>
    <p class="leading-relaxed text-gray-700">The GCC is becoming more ingredient-literate. Clients no longer ask only for “something hydrating” or “something brightening.” They ask about barrier repair, pigmentation, peptides, PDRN and Korean manufacturing. At the same time, UAE skin lives under heat, UV, humidity swings and heavy air-conditioning. That means high-tech skincare has to be paired with barrier discipline.</p>
    <div class="rounded-2xl border border-red-100 bg-red-50 p-5">
      <h3 class="font-semibold text-gray-900 mb-3">GENOSYS view: advanced does not mean aggressive</h3>
      <ul class="list-disc space-y-2 pl-5 text-gray-700">
        <li>Introduce one high-performance step at a time.</li>
        <li>Protect the barrier before chasing tingling or “instant” sensations.</li>
        <li>Use sunscreen consistently when using any texture-refining routine.</li>
        <li>For sensitive or inflamed skin, start with calming and hydration first.</li>
      </ul>
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">The real trend: smarter routines</h2>
    <p class="leading-relaxed text-gray-700">The future of K-beauty is not just glass skin. It is <strong>educated skin</strong>: routines that understand delivery, recovery, climate, texture and tolerance. The most credible formulas will not shout the biggest claim. They will explain how the product works, who it is for, and how to use it safely.</p>
    <p class="leading-relaxed text-gray-700">That is the kind of innovation we are watching from Korea: high-performance, but still wearable; technical, but still elegant; advanced, but respectful of the skin barrier.</p>
  </section>

  <section class="rounded-2xl bg-gray-900 p-6 text-white">
    <h2 class="text-2xl font-bold mb-3">Need help choosing a routine?</h2>
    <p class="text-gray-200 leading-relaxed">Start with your skin condition, not the trend. Use our AI skin analysis or speak to the GENOSYS team before adding strong actives or delivery-focused formulas.</p>
    <div class="mt-5 flex flex-wrap gap-3">
      <a href="/skin-recommendation" class="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">Try AI Skin Analysis</a>
      <a href="/products" class="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">Explore GENOSYS products</a>
    </div>
  </section>

  <section class="border-t border-gray-200 pt-5 text-sm text-gray-500">
    <p class="font-semibold text-gray-700 mb-2">Sources and trend reading</p>
    <ul class="list-disc space-y-1 pl-5">
      <li><a href="https://magazinekave.com/en-us/articles/130" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline">Magazine Kave: 2026 K-Beauty delivery technology report</a></li>
      <li><a href="https://dermletter.com/skin-care-beauty/k-beauty-2025/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline">DermLetter: PDRN serums, spicules and K-beauty texture trends</a></li>
      <li><a href="https://kbeautyproduction.com/blog/pdrn-peptides-exosomes-korean-skincare-ingredients/" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline">K-Beauty Production: PDRN, peptides and exosome trend context for GCC brands</a></li>
    </ul>
  </section>
</div>`

const contentRu = `<div class="blog-content space-y-8">
  <section class="space-y-4">
    <p class="text-lg leading-relaxed text-gray-700">Самый интересный сдвиг в K-beauty в 2026 году — это не очередной “волшебный ингредиент”. Фокус смещается с вопроса <strong>что внутри формулы</strong> на вопрос <strong>как именно формула доставляет активы к коже</strong>.</p>
    <p class="leading-relaxed text-gray-700">В корейском уходе всё чаще звучат технические слова: PDRN, пептиды, спикулы, exosome-inspired формулы, skin boosters, восстановление барьера и биодоступность. Это момент, когда клиническая эстетика становится понятной домашней рутиной.</p>
  </section>

  <section class="rounded-2xl bg-gray-50 p-5 md:p-7">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">От “герой-ингредиента” к системе доставки</h2>
    <p class="leading-relaxed text-gray-700">Раньше разговор шёл вокруг активов: ретинол, витамин C, кислоты, ниацинамид, пептиды. Они всё ещё важны. Но новый корейский вопрос звучит точнее: <em>может ли актив дойти до нужного слоя кожи контролируемо и комфортно?</em></p>
    <p class="mt-4 leading-relaxed text-gray-700">Поэтому растёт интерес к delivery technology. Спикулы дают физическую историю доставки. Exosome-inspired формулы — историю клеточной коммуникации. PDRN и пептиды — историю восстановления и устойчивости кожи.</p>
  </section>

  <section class="space-y-5">
    <h2 class="text-2xl font-bold text-gray-900">Четыре технологии, за которыми стоит следить</h2>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">1. PDRN: ингредиент про восстановление</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">PDRN часто называют “salmon DNA” в beauty-медиа. В домашнем уходе корректнее говорить не о чудесной регенерации, а о поддержке кожи, которая выглядит более спокойной, гладкой и устойчивой.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">2. Пептиды: slow-aging без агрессии</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">Пептиды остаются сильной категорией, потому что подходят для регулярного ухода: упругость, гладкость и anti-aging позиционирование без ощущения “слишком сильного” актива.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">3. Спикулы: “liquid microneedling” требует грамотности</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">Спикулы — микроскопические иглоподобные структуры, которые дают покалывание и delivery-эффект. Это интересная технология, но с ней важны правила: patch test, не перебарщивать и не сочетать сразу с сильными кислотами или ретиноидами.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">4. Exosome-inspired skincare: престиж, но без преувеличений</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">Экзосомы стали частью biotech-лексики, но в косметике важно быть точными. Надёжнее говорить: exosome-inspired, biomimetic, поддержка сигналинга, текстура кожи и увлажнение — без обещаний уровня клинической процедуры.</p>
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">Почему это важно для ОАЭ и GCC</h2>
    <p class="leading-relaxed text-gray-700">Покупатели в GCC становятся всё более грамотными: спрашивают не просто “что-то увлажняющее”, а барьер, пигментацию, пептиды, PDRN и корейское производство. Но кожа в ОАЭ живёт в условиях жары, UV, влажности и кондиционеров. Поэтому high-tech уход должен идти вместе с уважением к кожному барьеру.</p>
    <div class="rounded-2xl border border-red-100 bg-red-50 p-5">
      <h3 class="font-semibold text-gray-900 mb-3">Позиция GENOSYS: advanced не значит aggressive</h3>
      <ul class="list-disc space-y-2 pl-5 text-gray-700">
        <li>Добавляйте только один активный шаг за раз.</li>
        <li>Сначала барьер, потом “покалывание” и instant-effect.</li>
        <li>SPF обязателен при любом уходе, который работает с текстурой кожи.</li>
        <li>Если кожа чувствительная или воспалённая, начинайте с успокоения и увлажнения.</li>
      </ul>
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">Главный тренд — умные рутины</h2>
    <p class="leading-relaxed text-gray-700">Будущее K-beauty — не просто glass skin. Это <strong>образованный уход</strong>: рутины, которые учитывают доставку активов, восстановление, климат, текстуру и переносимость кожи.</p>
  </section>

  <section class="rounded-2xl bg-gray-900 p-6 text-white">
    <h2 class="text-2xl font-bold mb-3">Нужна помощь с выбором ухода?</h2>
    <p class="text-gray-200 leading-relaxed">Начинайте с состояния кожи, а не с тренда. Используйте AI Skin Analysis или напишите команде GENOSYS перед добавлением сильных активов.</p>
    <div class="mt-5 flex flex-wrap gap-3">
      <a href="/ru/skin-recommendation" class="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">Попробовать AI Skin Analysis</a>
      <a href="/ru/products" class="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">Смотреть продукты GENOSYS</a>
    </div>
  </section>
</div>`

const contentAr = `<div class="blog-content space-y-8" dir="rtl">
  <section class="space-y-4">
    <p class="text-lg leading-relaxed text-gray-700">أهم تحوّل في K-Beauty لعام 2026 ليس مكوّناً جديداً فقط، بل الانتقال من سؤال <strong>ما الموجود داخل التركيبة؟</strong> إلى سؤال <strong>كيف تصل التركيبة إلى البشرة؟</strong></p>
    <p class="leading-relaxed text-gray-700">أصبحت لغة العناية الكورية أكثر تقنية: PDRN، الببتيدات، السبيكولات، تركيبات مستوحاة من الإكسوسومات، مع دعم حاجز البشرة والامتصاص الذكي. الفكرة هي نقل مفاهيم العيادات إلى روتين منزلي أكثر واقعية.</p>
  </section>

  <section class="rounded-2xl bg-gray-50 p-5 md:p-7">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">من المكوّن البطل إلى تقنية التوصيل</h2>
    <p class="leading-relaxed text-gray-700">لسنوات كان التركيز على الريتينول، فيتامين C، الأحماض، النياسيناميد والببتيدات. هذه المكونات ما زالت مهمة، لكن السؤال الكوري الجديد هو: <em>هل يمكن توصيل المادة الفعالة بطريقة مريحة ومدروسة؟</em></p>
    <p class="mt-4 leading-relaxed text-gray-700">لهذا تظهر تقنيات التوصيل بقوة. السبيكولات تعطي قصة توصيل فيزيائية. التركيبات المستوحاة من الإكسوسومات تعطي قصة إشارات حيوية. و PDRN مع الببتيدات يدعمان مظهر البشرة الأكثر مرونة وراحة.</p>
  </section>

  <section class="space-y-5">
    <h2 class="text-2xl font-bold text-gray-900">أربع تقنيات نتابعها</h2>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">1. PDRN: مكوّن مرتبط براحة البشرة</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">يُعرف PDRN أحياناً في الإعلام باسم “salmon DNA”. في مستحضرات العناية اليومية، الرسالة الأكثر مصداقية هي دعم مظهر بشرة أكثر هدوءاً ونعومة ومرونة، وليس وعوداً مبالغاً بها.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">2. الببتيدات: عناية slow-aging ألطف</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">الببتيدات مناسبة للاستخدام المنتظم لأنها ترتبط بمظهر أكثر نعومة وتماسكاً، مع تموضع ألطف من بعض المكونات القوية مثل الأحماض أو الريتينويدات.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">3. السبيكولات: تقنية تحتاج إلى تعليم واضح</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">السبيكولات هي تراكيب دقيقة تشبه الإبر المجهرية وتمنح إحساساً بالوخز. التقنية مثيرة، لكنها تحتاج إلى اختبار حساسية، استخدام تدريجي، وتجنّب خلطها فوراً مع أحماض قوية أو ريتينويدات.</p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-5">
        <h3 class="text-lg font-semibold text-gray-900">4. تركيبات مستوحاة من الإكسوسومات</h3>
        <p class="mt-2 text-gray-700 leading-relaxed">الإكسوسومات أصبحت جزءاً من لغة التكنولوجيا الحيوية في الجمال. في مستحضرات التجميل، من الأفضل استخدام لغة دقيقة مثل biomimetic و signal-support ودعم الترطيب وتحسين ملمس البشرة، من دون ادعاءات طبية.</p>
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">لماذا يهم هذا في الإمارات والخليج؟</h2>
    <p class="leading-relaxed text-gray-700">المستهلك في الخليج أصبح أكثر معرفة بالمكونات: حاجز البشرة، التصبغات، الببتيدات، PDRN والتصنيع الكوري. وفي الوقت نفسه تعيش البشرة في حرارة، UV، رطوبة وتكييف مستمر. لذلك يجب أن تأتي التقنية العالية مع احترام حاجز البشرة.</p>
    <div class="rounded-2xl border border-red-100 bg-red-50 p-5">
      <h3 class="font-semibold text-gray-900 mb-3">رؤية GENOSYS: المتقدم لا يعني القاسي</h3>
      <ul class="list-disc space-y-2 pr-5 text-gray-700">
        <li>أضيفي خطوة فعالة واحدة فقط في كل مرة.</li>
        <li>ادعمي حاجز البشرة قبل البحث عن الوخز أو التأثير الفوري.</li>
        <li>استخدمي واقي الشمس بانتظام مع أي روتين لتحسين ملمس البشرة.</li>
        <li>للبشرة الحساسة أو الملتهبة، ابدئي بالتهدئة والترطيب أولاً.</li>
      </ul>
    </div>
  </section>

  <section class="rounded-2xl bg-gray-900 p-6 text-white">
    <h2 class="text-2xl font-bold mb-3">تحتاجين مساعدة في اختيار الروتين؟</h2>
    <p class="text-gray-200 leading-relaxed">ابدئي بحالة بشرتك وليس بالترند. استخدمي تحليل البشرة بالذكاء الاصطناعي أو تواصلي مع فريق GENOSYS قبل إضافة مكونات قوية.</p>
    <div class="mt-5 flex flex-wrap gap-3">
      <a href="/ar/skin-recommendation" class="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100">جربي تحليل البشرة AI</a>
      <a href="/ar/products" class="inline-flex rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">استكشفي منتجات GENOSYS</a>
    </div>
  </section>
</div>`

async function main() {
  const data = {
    title,
    titleRu,
    titleAr,
    slug,
    excerpt,
    excerptRu,
    excerptAr,
    content,
    contentRu,
    contentAr,
    featuredImage,
    authorName,
    published: true,
    publishedAt,
    tags,
  }

  const existingPost = await prisma.blogPost.findUnique({ where: { slug } })

  if (existingPost) {
    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data,
    })
    console.log(`UPDATED: ${updatedPost.id}`)
  } else {
    const createdPost = await prisma.blogPost.create({ data })
    console.log(`CREATED: ${createdPost.id}`)
  }

  console.log(`EN: https://genosys.ae/blog/${slug}`)
  console.log(`RU: https://genosys.ae/ru/blog/${slug}`)
  console.log(`AR: https://genosys.ae/ar/blog/${slug}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
