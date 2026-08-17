/**
 * Creates or updates the localized Skin Rescue Overnight Cream Mask article.
 *
 * Sources:
 * - Product 34 current gallery (/images/overnight/main.jpeg + S1-S5.jpeg)
 * - Product video (/videos/overnight.mp4)
 * - GENOSYS product deck / marketing-slide source notes
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-overnight-mask-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'skin-rescue-overnight-cream-mask-night-ritual'
const MAIN = '/images/overnight/main.jpeg'
const VIDEO = '/videos/overnight.mp4'

/* Same wrapper + video classes as ProductPageClientRefactored (/products/52) */
const videoBlock = (label: string) => `
  <div>
    <h2 class="text-3xl font-bold">${label}</h2>
    <div class="mt-5 mx-auto max-w-sm">
      <div class="flex justify-center rounded-xl overflow-hidden shadow-lg bg-black">
        <video
          src="${VIDEO}"
          poster="${MAIN}"
          controls="controls"
          playsinline="playsinline"
          preload="auto"
          class="w-auto max-w-full max-h-[65vh]"
          width="1080"
          height="1920"
        ></video>
      </div>
    </div>
  </div>`

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Meet the GENOSYS <strong>SKIN RESCUE OVERNIGHT CREAM MASK</strong>: a 100g leave-on mask that combines oxygen capsules with a Pink Ceramide cream base for an intensive final step when skin looks tired, dry or stressed. Apply it at night, massage until the capsules disperse, and leave it on while you sleep.</p>
  </div>

  <img src="/images/overnight/S1.jpeg" alt="GENOSYS Skin Rescue Overnight Cream Mask — oxygen capsules and Pink Ceramide Complex" class="w-full h-auto rounded-2xl" loading="lazy" />

  ${videoBlock('See the texture and ritual')}

  <div>
    <h2 class="text-3xl font-bold">Dual formula: oxygen capsules meet Pink Ceramide</h2>
    <img src="/images/overnight/S2.jpeg" alt="Skin Rescue Overnight Cream Mask dual formula explained" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">The formula has two visible parts that come together during massage. Oxygenated-water capsules disperse through the cream, while the Pink Ceramide base melts into a soft leave-on film. The result is a rich overnight layer designed to support moisture, comfort and a revitalized appearance by morning.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">What the manufacturer’s clinical data reports</h2>
    <img src="/images/overnight/S3.jpeg" alt="Skin Rescue Overnight Cream Mask clinical results after four weeks" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">In the manufacturer-provided four-week study, measured transepidermal water loss (TEWL) improved by <strong>15%</strong> and erythema by <strong>26%</strong>. These figures describe the tested protocol and should not be interpreted as a promise that every skin type will respond identically.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Inside the Rescue Complex</h2>
    <img src="/images/overnight/S4.jpeg" alt="Skin Rescue Overnight Cream Mask key complex overview" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Pink Ceramide Complex</strong> — fireweed, Lactobacillus-derived care and Ceramide NP.</li>
      <li><strong>Oxygen capsules</strong> — the signature capsules that disperse as the mask is massaged in.</li>
      <li><strong>Growth-factor complex</strong> — part of the professional GENOSYS Rescue Complex positioning.</li>
      <li><strong>Barrier and comfort support</strong> — with phytosphingosine, centella, macadamia and pumpkin-derived care.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">How to use it</h2>
    <img src="/images/overnight/S5.jpeg" alt="How to apply GENOSYS Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-2 text-gray-700">
      <li><strong>1. Cleanse:</strong> remove sunscreen, makeup and daily impurities.</li>
      <li><strong>2. Apply:</strong> use the mask as the final step of your evening routine.</li>
      <li><strong>3. Massage:</strong> continue gently until the oxygen capsules disperse into the cream.</li>
      <li><strong>4. Sleep:</strong> leave it on overnight. Do not rinse after application.</li>
    </ol>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">The perfect pair: CERABARRIER + Overnight Mask</h2>
    <p class="text-gray-700 mt-3">A good overnight ritual begins with cleansing that does not make the skin feel aggressively stripped. Use <a href="/products/66" class="text-primary-600 font-semibold hover:underline">CERABARRIER BIOME GEL CLEANSER</a> to remove the day, then apply the <a href="/products/34" class="text-primary-600 font-semibold hover:underline">Skin Rescue Overnight Cream Mask</a> as the last PM layer. It is a simple barrier-first sequence: cleanse gently, then leave focused moisture on overnight.</p>
    <div class="grid gap-5 sm:grid-cols-2 mt-6">
      <a href="/products/66" class="block rounded-2xl border border-rose-100 bg-white p-4">
        <img src="/images/cera/main2.jpeg" alt="GENOSYS CERABARRIER BIOME GEL CLEANSER" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">Step 1 · CERABARRIER BIOME GEL CLEANSER</strong>
      </a>
      <a href="/products/34" class="block rounded-2xl border border-rose-100 bg-white p-4">
        <img src="/images/overnight/S1.jpeg" alt="GENOSYS Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">Step 2 · Skin Rescue Overnight Cream Mask</strong>
      </a>
    </div>
  </div>

  <div class="rounded-2xl bg-gray-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Sleep. Rescue. Wake up renewed.</h3>
    <p class="text-gray-300 mt-3 mb-6">100g · leave-on overnight mask · dermatologically tested · made in Korea</p>
    <a href="/products/34" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-950">View the Overnight Mask</a>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Знакомьтесь: GENOSYS <strong>SKIN RESCUE OVERNIGHT CREAM MASK</strong> — несмываемая ночная маска 100 г, которая сочетает кислородные капсулы и кремовую основу с Pink Ceramide. Это насыщенный финальный этап для кожи, которая выглядит уставшей, сухой или перегруженной. Нанесите вечером, массируйте до растворения капсул и оставьте на ночь.</p>
  </div>

  <img src="/images/overnight/S1.jpeg" alt="Ночная маска GENOSYS Skin Rescue — кислородные капсулы и Pink Ceramide Complex" class="w-full h-auto rounded-2xl" loading="lazy" />

  ${videoBlock('Посмотрите текстуру и способ нанесения')}

  <div>
    <h2 class="text-3xl font-bold">Двойная формула: кислородные капсулы + Pink Ceramide</h2>
    <img src="/images/overnight/S2.jpeg" alt="Двойная формула Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Две видимые части соединяются во время массажа. Капсулы с оксигенированной водой распределяются в креме, а основа с Pink Ceramide превращается в мягкую несмываемую плёнку. Получается насыщенный ночной слой для поддержки увлажнения, комфорта и более свежего вида кожи утром.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Данные клинического теста производителя</h2>
    <img src="/images/overnight/S3.jpeg" alt="Результаты теста Skin Rescue Overnight Cream Mask за четыре недели" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">По данным предоставленного производителем четырёхнедельного исследования, показатель трансэпидермальной потери воды (TEWL) улучшился на <strong>15%</strong>, а эритема — на <strong>26%</strong>. Эти цифры относятся к тестовому протоколу и не гарантируют одинаковый результат для каждого типа кожи.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Что входит в Rescue Complex</h2>
    <img src="/images/overnight/S4.jpeg" alt="Ключевые комплексы Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Pink Ceramide Complex</strong> — кипрей, уход на основе Lactobacillus и Ceramide NP.</li>
      <li><strong>Кислородные капсулы</strong> — фирменные капсулы, которые распределяются при массаже.</li>
      <li><strong>Комплекс факторов роста</strong> — часть профессионального позиционирования Rescue Complex.</li>
      <li><strong>Поддержка барьера и комфорта</strong> — фитосфингозин, центелла, макадамия и компоненты тыквы.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Как использовать</h2>
    <img src="/images/overnight/S5.jpeg" alt="Как наносить GENOSYS Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-2 text-gray-700">
      <li><strong>1. Очистите:</strong> удалите санскрин, макияж и дневные загрязнения.</li>
      <li><strong>2. Нанесите:</strong> используйте маску последним этапом вечернего ухода.</li>
      <li><strong>3. Массируйте:</strong> мягко продолжайте, пока кислородные капсулы не распределятся в креме.</li>
      <li><strong>4. Оставьте на ночь:</strong> после нанесения маску не смывают.</li>
    </ol>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Идеальная пара: CERABARRIER + Overnight Mask</h2>
    <p class="text-gray-700 mt-3">Ночной уход начинается с очищения без ощущения агрессивной стянутости. Снимите дневные загрязнения с <a href="/ru/products/66" class="text-primary-600 font-semibold hover:underline">CERABARRIER BIOME GEL CLEANSER</a>, затем нанесите <a href="/ru/products/34" class="text-primary-600 font-semibold hover:underline">Skin Rescue Overnight Cream Mask</a> последним вечерним слоем. Простая барьерная последовательность: мягко очистить и оставить увлажняющий уход на ночь.</p>
    <div class="grid gap-5 sm:grid-cols-2 mt-6">
      <a href="/ru/products/66" class="block rounded-2xl border border-rose-100 bg-white p-4">
        <img src="/images/cera/main2.jpeg" alt="GENOSYS CERABARRIER BIOME GEL CLEANSER" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">Шаг 1 · CERABARRIER BIOME GEL CLEANSER</strong>
      </a>
      <a href="/ru/products/34" class="block rounded-2xl border border-rose-100 bg-white p-4">
        <img src="/images/overnight/S1.jpeg" alt="GENOSYS Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">Шаг 2 · Skin Rescue Overnight Cream Mask</strong>
      </a>
    </div>
  </div>

  <div class="rounded-2xl bg-gray-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Засыпайте. Восстанавливайте. Просыпайтесь обновлённой.</h3>
    <p class="text-gray-300 mt-3 mb-6">100 г · несмываемая ночная маска · дерматологически протестирована · сделано в Корее</p>
    <a href="/ru/products/34" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-950">Смотреть ночную маску</a>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
  <div>
    <p class="text-lg text-gray-700">تعرّفي على GENOSYS <strong>SKIN RESCUE OVERNIGHT CREAM MASK</strong> — ماسك ليلي يُترك على البشرة بحجم 100 غ، يجمع كبسولات الأكسجين مع قاعدة كريم Pink Ceramide كخطوة نهائية مكثفة عندما تبدو البشرة متعبة أو جافة أو مجهدة. ضعيه مساءً ودلكي حتى تتوزع الكبسولات واتركيه أثناء النوم.</p>
  </div>

  <img src="/images/overnight/S1.jpeg" alt="ماسك GENOSYS Skin Rescue الليلي مع كبسولات الأكسجين وPink Ceramide" class="w-full h-auto rounded-2xl" loading="lazy" />

  ${videoBlock('شاهدي القوام وطريقة الاستخدام')}

  <div>
    <h2 class="text-3xl font-bold">تركيبة مزدوجة: الأكسجين يلتقي Pink Ceramide</h2>
    <img src="/images/overnight/S2.jpeg" alt="شرح التركيبة المزدوجة لماسك Skin Rescue الليلي" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">يمتزج الجزآن الظاهران أثناء التدليك. تتوزع كبسولات الماء المؤكسج داخل الكريم، بينما تذوب قاعدة Pink Ceramide لتكوّن طبقة ناعمة تُترك على البشرة. والنتيجة طبقة ليلية غنية لدعم الترطيب والراحة ومظهر أكثر حيوية في الصباح.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ما الذي تذكره بيانات الاختبار المقدمة من الشركة</h2>
    <img src="/images/overnight/S3.jpeg" alt="نتائج اختبار Skin Rescue Overnight Cream Mask بعد أربعة أسابيع" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">وفق دراسة الأربعة أسابيع التي قدمتها الشركة المصنّعة، تحسن فقد الماء عبر البشرة (TEWL) بنسبة <strong>15%</strong> وتحسن الاحمرار بنسبة <strong>26%</strong>. تصف هذه الأرقام بروتوكول الاختبار ولا تعني أن كل أنواع البشرة ستحصل على النتيجة نفسها.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">داخل Rescue Complex</h2>
    <img src="/images/overnight/S4.jpeg" alt="نظرة على مكونات Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Pink Ceramide Complex</strong> — الفايرويد وعناية مشتقة من Lactobacillus وCeramide NP.</li>
      <li><strong>كبسولات الأكسجين</strong> — الكبسولات المميزة التي تتوزع عند تدليك الماسك.</li>
      <li><strong>مركب عوامل النمو</strong> — جزء من مفهوم Rescue Complex الاحترافي لدى GENOSYS.</li>
      <li><strong>دعم الحاجز والراحة</strong> — مع الفيتوسفينغوزين والسنتيلا والمكاديميا ومكونات اليقطين.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">طريقة الاستخدام</h2>
    <img src="/images/overnight/S5.jpeg" alt="طريقة تطبيق GENOSYS Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-2 text-gray-700">
      <li><strong>1. نظفي:</strong> أزيلي واقي الشمس والمكياج وشوائب اليوم.</li>
      <li><strong>2. ضعي الماسك:</strong> استخدميه كآخر خطوة في روتين المساء.</li>
      <li><strong>3. دلكي:</strong> استمري بلطف حتى تتوزع كبسولات الأكسجين في الكريم.</li>
      <li><strong>4. نامي:</strong> اتركيه طوال الليل ولا تشطفيه بعد التطبيق.</li>
    </ol>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-rose-50 to-pink-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">الثنائي المثالي: CERABARRIER + الماسك الليلي</h2>
    <p class="text-gray-700 mt-3">يبدأ الروتين الليلي الجيد بتنظيف لا يترك البشرة مشدودة بقسوة. استخدمي <a href="/ar/products/66" class="text-primary-600 font-semibold hover:underline">CERABARRIER BIOME GEL CLEANSER</a> لإزالة آثار اليوم، ثم ضعي <a href="/ar/products/34" class="text-primary-600 font-semibold hover:underline">Skin Rescue Overnight Cream Mask</a> كآخر طبقة مسائية. تسلسل بسيط يراعي الحاجز: تنظيف لطيف ثم ترطيب مركّز يُترك طوال الليل.</p>
    <div class="grid gap-5 sm:grid-cols-2 mt-6">
      <a href="/ar/products/66" class="block rounded-2xl border border-rose-100 bg-white p-4">
        <img src="/images/cera/main2.jpeg" alt="GENOSYS CERABARRIER BIOME GEL CLEANSER" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">الخطوة 1 · CERABARRIER BIOME GEL CLEANSER</strong>
      </a>
      <a href="/ar/products/34" class="block rounded-2xl border border-rose-100 bg-white p-4">
        <img src="/images/overnight/S1.jpeg" alt="GENOSYS Skin Rescue Overnight Cream Mask" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">الخطوة 2 · Skin Rescue Overnight Cream Mask</strong>
      </a>
    </div>
  </div>

  <div class="rounded-2xl bg-gray-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">نامي. أنقذي بشرتك. واستيقظي بإطلالة متجددة.</h3>
    <p class="text-gray-300 mt-3 mb-6">100 غ · ماسك ليلي يُترك على البشرة · مختبر جلدياً · صنع في كوريا</p>
    <a href="/ar/products/34" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-950">عرض الماسك الليلي</a>
  </div>
</div>`

async function main() {
  const data = {
    title: 'Skin Rescue Overnight Cream Mask: Oxygen Capsules, Pink Ceramide & the Perfect Night Pair',
    slug: SLUG,
    excerpt:
      'Discover the GENOSYS Skin Rescue Overnight Cream Mask through its new images and video, then build the two-step barrier-first night ritual with CERABARRIER BIOME GEL CLEANSER.',
    content: contentEn,
    featuredImage: MAIN,
    titleRu: 'Skin Rescue Overnight Cream Mask: кислородные капсулы, Pink Ceramide и идеальная ночная пара',
    excerptRu:
      'Новые фото и видео ночной маски GENOSYS Skin Rescue, её двойная формула и простой двухэтапный ритуал с CERABARRIER BIOME GEL CLEANSER.',
    contentRu,
    titleAr: 'ماسك Skin Rescue الليلي: كبسولات الأكسجين وPink Ceramide والثنائي المثالي للمساء',
    excerptAr:
      'اكتشفي صور وفيديو ماسك GENOSYS Skin Rescue الجديد وتركيبته المزدوجة وطقساً ليلياً من خطوتين مع CERABARRIER BIOME GEL CLEANSER.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'overnight-mask',
      'skin-rescue',
      'ceramide',
      'oxygen-capsules',
      'skin-barrier',
      'night-routine',
      'cerabarrier',
      'korean-skincare',
    ]),
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } })
  if (existing) {
    const { publishedAt: _ignored, ...updateData } = data
    const updated = await prisma.blogPost.update({ where: { slug: SLUG }, data: updateData })
    console.log('Updated existing blog post:', updated.slug, updated.id)
  } else {
    const created = await prisma.blogPost.create({ data })
    console.log('Created blog post:', created.slug, created.id)
  }

  console.log('EN: https://genosys.ae/blog/' + SLUG)
  console.log('RU: https://genosys.ae/ru/blog/' + SLUG)
  console.log('AR: https://genosys.ae/ar/blog/' + SLUG)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
