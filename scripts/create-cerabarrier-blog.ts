/**
 * Creates (or updates) the CERABARRIER BIOME GEL CLEANSER launch blog post.
 *
 * Content sourced from the official GENOSYS CERABARRIER BIOME GEL CLEANSER
 * presentation (Jul 2026). Sizes: Homecare 200ml / Professional 600ml.
 *
 * Run: npx tsx --env-file=.env.local scripts/create-cerabarrier-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'cerabarrier-biome-gel-cleanser-launch'

const HERO_IMG = '/images/cera/cera.jpeg'
const IMG_200 = '/images/cera/cerabar_200ml.jpeg'
const IMG_600 = '/images/cera/cerabar_600ml.jpeg'
const IMG_HOW = '/images/cera/cerabar_how.jpeg'

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Launching today: GENOSYS <strong>CERABARRIER BIOME GEL CLEANSER</strong> — a daily cleanser powered by the synergy of <strong>Pink Ceramide</strong> and the <strong>skin microbiome</strong>. It goes beyond cleansing: <strong>cleansing + soothing + hydration all at once</strong>, supporting a long-lasting moisture barrier for a soft, hydrated finish.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Beyond cleansing</h2>
    <p class="text-gray-700">Most cleansers do their job and leave your skin tight and stripped. CERABARRIER BIOME is a <strong>barrier-first cleanser</strong>: powerful cleansing performance that thoroughly removes sebum, impurities and base makeup — while it soothes, hydrates and strengthens the skin barrier in the same step.</p>
    <ul class="space-y-2 text-gray-700 mt-3">
      <li><strong>Superior cleansing</strong> — sebum, impurities and base makeup removed in one wash.</li>
      <li><strong>Soothing</strong> — calms the skin with resurrection plant extract and fructan.</li>
      <li><strong>Hydrating</strong> — clinically proven moisture boost right after washing.</li>
      <li><strong>Barrier strengthening</strong> — pink ceramide complex, 5 ceramides and microbiome care.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Gel-to-foam texture</h3>
    <p class="text-gray-700">A soft gel that transforms into a <strong>dense, rich foam</strong> on contact with water. The smooth-rolling gel and abundant bubbles minimize skin friction for a gentle, comfortable cleanse — <strong>non-stripping</strong>, with a refreshing finish and no slippery or greasy residue.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Clinically proven hydration — in one use</h2>
    <div class="grid gap-6 sm:grid-cols-2 mt-4">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <p class="text-4xl font-extrabold text-primary-600">145.8%</p>
        <p class="text-gray-700 mt-2">Immediate skin hydration improvement right after washing</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <p class="text-4xl font-extrabold text-primary-600">2.4×</p>
        <p class="text-gray-700 mt-2">Increase in skin hydration — a powerful barrier cleanser that inhibits moisture loss</p>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">How it works: 3 steps in one wash</h2>
    <img src="${IMG_HOW}" alt="CERABARRIER BIOME GEL CLEANSER — how it works" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Step 1 — Cleansing:</strong> all-in-one removal of sebum, impurities and base makeup.</li>
      <li><strong>Step 2 — Moisturizing &amp; soothing:</strong> simultaneous hydration and calming care with resurrection plant and fructan.</li>
      <li><strong>Step 3 — Strengthening the barrier:</strong> the synergy of the pink ceramide complex, 5 ceramides and microbiome care keeps skin healthy — comfortable, hydrated skin after every wash.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">CERABARRIER BIOME™ — the complex inside</h3>
    <p class="text-gray-700 mb-3">A synergistic complex that supports both the <strong>skin barrier</strong> and <strong>microbiome balance</strong>:</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>Barrier Lipid Complex</strong> — 5 ceramides (NP, AS, AP, NS, EOP; ceramides make up ~50% of the skin barrier), cholesterol and phytosphingosine to stabilize the barrier's lipid structure, plus shea butter for intensive lipid nourishment.</li>
      <li><strong>Microbiome Complex</strong> — probiotics (Bifida &amp; Lactobacillus ferment lysates) and prebiotics (fructan, chicory root, dandelion root) working together to balance the skin's microbiome.</li>
      <li><strong>Pink Ceramide Complex</strong> — fireweed extract, lactobacillus ferment lysate and ceramide NP to re-energize the skin.</li>
      <li><strong>Resurrection plant (Anastatica hierochuntica)</strong> — the desert survivor rich in flavonoids and phenolic compounds for antioxidant, anti-inflammatory and soothing benefits.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Two sizes: 200ml homecare · 600ml professional</h2>
    <div class="grid gap-8 md:grid-cols-2 mt-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${IMG_200}" alt="CERABARRIER BIOME GEL CLEANSER 200ml — Homecare" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Homecare — 200ml</h3>
        <p class="text-gray-700">Your daily gel-to-foam cleanser at home: gentle enough for morning and evening use, powerful enough to remove base makeup — while keeping the barrier hydrated and calm.</p>
        <a href="/products/66" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">View product — 380 AED</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${IMG_600}" alt="CERABARRIER BIOME GEL CLEANSER 600ml — Professional" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Professional — 600ml</h3>
        <p class="text-gray-700">The clinic-size format for professional treatment rooms — the ideal first step of every facial and microneedling protocol, prepping skin without stripping it.</p>
        <a href="/products/66" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">View product — 620 AED</a>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">CERABARRIER BIOME vs. SNOW O₂ — which cleanser for you?</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4"></th>
          <th class="py-3 pr-4">CERABARRIER BIOME</th>
          <th class="py-3">SNOW O₂</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Texture</td><td class="py-3 pr-4">Gel-to-foam, smooth rolling, moisture-locking finish</td><td class="py-3">Instant oxygen bubbles on application</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Approach</td><td class="py-3 pr-4">Barrier-first: hydrating &amp; soothing cleanse</td><td class="py-3">Oxygen bubble tech: deep cleansing &amp; radiance</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Key ingredients</td><td class="py-3 pr-4">Pink ceramide complex · 5 ceramides · microbiome complex</td><td class="py-3">Phytolex SC · MultiEx Phytrogen</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Best for</td><td class="py-3 pr-4">Gentle daily cleansing + hydration + soothing in one</td><td class="py-3">Deep pore cleansing and an instant radiance boost</td></tr>
      </tbody>
    </table>
    <p class="text-gray-700 mt-3">Together they complete the GENOSYS cleansing line — pick by skin need, or alternate: SNOW O₂ for deep-clean days, CERABARRIER BIOME for everyday barrier care.</p>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Available now in the UAE</h3>
    <p class="text-lg mb-6">CERABARRIER BIOME GEL CLEANSER — 200ml for home (380 AED), 600ml for the treatment room (620 AED). Official GENOSYS distributor.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/products/66" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">View product</a>
      <a href="/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">Contact us</a>
    </div>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Сегодня в продаже: GENOSYS <strong>CERABARRIER BIOME GEL CLEANSER</strong> — ежедневное очищающее средство на основе синергии <strong>розовых церамидов (Pink Ceramide)</strong> и <strong>микробиома кожи</strong>. Это больше, чем умывание: <strong>очищение + успокоение + увлажнение одновременно</strong> и поддержка влагозащитного барьера для мягкой, увлажнённой кожи.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Больше, чем очищение</h2>
    <p class="text-gray-700">Большинство средств очищают — и оставляют кожу стянутой. CERABARRIER BIOME — это <strong>очищение с приоритетом барьера</strong>: мощно удаляет себум, загрязнения и базовый макияж, одновременно успокаивая, увлажняя и укрепляя кожный барьер.</p>
    <ul class="space-y-2 text-gray-700 mt-3">
      <li><strong>Превосходное очищение</strong> — себум, загрязнения и базовый макияж за одно умывание.</li>
      <li><strong>Успокоение</strong> — экстракт иерихонской розы и фруктан снимают дискомфорт.</li>
      <li><strong>Увлажнение</strong> — клинически доказанный прирост увлажнённости сразу после умывания.</li>
      <li><strong>Укрепление барьера</strong> — комплекс розовых церамидов, 5 церамидов и забота о микробиоме.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Текстура «гель-в-пену»</h3>
    <p class="text-gray-700">Мягкий гель при контакте с водой превращается в <strong>плотную, насыщенную пену</strong>. Скользящий гель и обильные пузырьки минимизируют трение — умывание получается деликатным и комфортным, <strong>без ощущения стянутости</strong>, со свежим финишем без скользкой или жирной плёнки.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Клинически доказанное увлажнение — с первого применения</h2>
    <div class="grid gap-6 sm:grid-cols-2 mt-4">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <p class="text-4xl font-extrabold text-primary-600">145,8%</p>
        <p class="text-gray-700 mt-2">Мгновенное повышение увлажнённости кожи сразу после умывания</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <p class="text-4xl font-extrabold text-primary-600">2,4×</p>
        <p class="text-gray-700 mt-2">Рост увлажнённости кожи — мощный барьерный клинсер, сдерживающий потерю влаги</p>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Как это работает: 3 шага за одно умывание</h2>
    <img src="${IMG_HOW}" alt="CERABARRIER BIOME GEL CLEANSER — механизм действия" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>Шаг 1 — Очищение:</strong> себум, загрязнения и базовый макияж удаляются за один приём.</li>
      <li><strong>Шаг 2 — Увлажнение и успокоение:</strong> одновременный уход с иерихонской розой и фруктаном.</li>
      <li><strong>Шаг 3 — Укрепление барьера:</strong> синергия комплекса розовых церамидов, 5 церамидов и микробиом-ухода — комфортная, увлажнённая кожа после каждого умывания.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">CERABARRIER BIOME™ — комплекс внутри</h3>
    <p class="text-gray-700 mb-3">Синергетический комплекс, поддерживающий и <strong>кожный барьер</strong>, и <strong>баланс микробиома</strong>:</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>Липидный комплекс барьера</strong> — 5 церамидов (NP, AS, AP, NS, EOP; церамиды — это ~50% кожного барьера), холестерол и фитосфингозин для стабилизации липидной структуры, плюс масло ши для интенсивного питания.</li>
      <li><strong>Микробиом-комплекс</strong> — пробиотики (лизаты ферментов Bifida и Lactobacillus) и пребиотики (фруктан, экстракт корня цикория, экстракт корня одуванчика) для баланса микробиома кожи.</li>
      <li><strong>Комплекс розовых церамидов</strong> — экстракт иван-чая, лизат Lactobacillus и церамид NP возвращают коже энергию.</li>
      <li><strong>Иерихонская роза (Anastatica hierochuntica)</strong> — «растение-воскресение» из пустыни, богатое флавоноидами и фенольными соединениями: антиоксидантное, противовоспалительное и успокаивающее действие.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Два объёма: 200 мл для дома · 600 мл для профессионалов</h2>
    <div class="grid gap-8 md:grid-cols-2 mt-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${IMG_200}" alt="CERABARRIER BIOME GEL CLEANSER 200 мл — домашний уход" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Домашний уход — 200 мл</h3>
        <p class="text-gray-700">Ежедневное умывание дома: достаточно деликатное для утра и вечера и достаточно эффективное, чтобы снять базовый макияж — сохраняя барьер увлажнённым и спокойным.</p>
        <a href="/ru/products/66" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">К товару — 380 AED</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${IMG_600}" alt="CERABARRIER BIOME GEL CLEANSER 600 мл — профессиональный" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Профессиональный — 600 мл</h3>
        <p class="text-gray-700">Кабинетный формат для процедурных: идеальный первый шаг каждого ухода и протокола микронидлинга — подготавливает кожу, не пересушивая её.</p>
        <a href="/ru/products/66" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">К товару — 620 AED</a>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">CERABARRIER BIOME или SNOW O₂ — какой клинсер выбрать?</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4"></th>
          <th class="py-3 pr-4">CERABARRIER BIOME</th>
          <th class="py-3">SNOW O₂</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Текстура</td><td class="py-3 pr-4">Гель-в-пену, мягкое скольжение, влагозапирающий финиш</td><td class="py-3">Мгновенные кислородные пузырьки при нанесении</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Подход</td><td class="py-3 pr-4">Барьер прежде всего: увлажняющее и успокаивающее очищение</td><td class="py-3">Кислородная технология: глубокое очищение и сияние</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Ключевые ингредиенты</td><td class="py-3 pr-4">Комплекс розовых церамидов · 5 церамидов · микробиом-комплекс</td><td class="py-3">Phytolex SC · MultiEx Phytrogen</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Кому подходит</td><td class="py-3 pr-4">Деликатное ежедневное очищение + увлажнение + успокоение</td><td class="py-3">Глубокое очищение пор и мгновенное сияние</td></tr>
      </tbody>
    </table>
    <p class="text-gray-700 mt-3">Вместе они составляют линию очищения GENOSYS: выбирайте по потребности кожи или чередуйте — SNOW O₂ для глубокого очищения, CERABARRIER BIOME для ежедневного барьерного ухода.</p>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Уже в продаже в ОАЭ</h3>
    <p class="text-lg mb-6">CERABARRIER BIOME GEL CLEANSER — 200 мл для дома (380 AED) и 600 мл для кабинета (620 AED). Официальный дистрибьютор GENOSYS.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ru/products/66" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">К товару</a>
      <a href="/ru/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">Связаться с нами</a>
    </div>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">نطلق اليوم: GENOSYS <strong>CERABARRIER BIOME GEL CLEANSER</strong> — منظّف يومي يعتمد على تآزر <strong>السيراميد الوردي (Pink Ceramide)</strong> و<strong>ميكروبيوم البشرة</strong>. أكثر من مجرد تنظيف: <strong>تنظيف + تهدئة + ترطيب في خطوة واحدة</strong>، مع دعم حاجز الرطوبة لبشرة ناعمة ورطبة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ما بعد التنظيف</h2>
    <p class="text-gray-700">معظم المنظّفات تُنظّف وتترك البشرة مشدودة وجافة. CERABARRIER BIOME هو <strong>منظّف يضع الحاجز أولاً</strong>: أداء تنظيف قوي يزيل الزهم والشوائب ومكياج الأساس بالكامل — بينما يهدّئ ويرطّب ويقوّي حاجز البشرة في الخطوة نفسها.</p>
    <ul class="space-y-2 text-gray-700 mt-3">
      <li><strong>تنظيف فائق</strong> — الزهم والشوائب ومكياج الأساس بغسلة واحدة.</li>
      <li><strong>تهدئة</strong> — بخلاصة نبتة القيامة والفروكتان.</li>
      <li><strong>ترطيب</strong> — تحسّن مُثبت سريرياً في ترطيب البشرة فور الغسل.</li>
      <li><strong>تقوية الحاجز</strong> — مركّب السيراميد الوردي و5 سيراميدات وعناية بالميكروبيوم.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">قوام يتحوّل من جل إلى رغوة</h3>
    <p class="text-gray-700">جل ناعم يتحوّل عند ملامسة الماء إلى <strong>رغوة كثيفة وغنية</strong>. انزلاق الجل ووفرة الفقاعات يقلّلان الاحتكاك لتجربة تنظيف لطيفة ومريحة — <strong>من دون تجريد البشرة</strong>، مع لمسة نهائية منعشة بلا ملمس زلق أو دهني.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ترطيب مُثبت سريرياً — من أول استخدام</h2>
    <div class="grid gap-6 sm:grid-cols-2 mt-4">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <p class="text-4xl font-extrabold text-primary-600">%145.8</p>
        <p class="text-gray-700 mt-2">تحسّن فوري في ترطيب البشرة مباشرة بعد الغسل</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
        <p class="text-4xl font-extrabold text-primary-600">×2.4</p>
        <p class="text-gray-700 mt-2">زيادة في ترطيب البشرة — منظّف قوي للحاجز يحدّ من فقدان الرطوبة</p>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">كيف يعمل: 3 خطوات في غسلة واحدة</h2>
    <img src="${IMG_HOW}" alt="CERABARRIER BIOME GEL CLEANSER — آلية العمل" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>الخطوة 1 — التنظيف:</strong> إزالة شاملة للزهم والشوائب ومكياج الأساس.</li>
      <li><strong>الخطوة 2 — الترطيب والتهدئة:</strong> عناية مزدوجة بخلاصة نبتة القيامة والفروكتان.</li>
      <li><strong>الخطوة 3 — تقوية الحاجز:</strong> تآزر مركّب السيراميد الوردي و5 سيراميدات والميكروبيوم للحفاظ على بشرة صحية — مريحة ورطبة بعد كل غسلة.</li>
    </ul>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">™CERABARRIER BIOME — المركّب في الداخل</h3>
    <p class="text-gray-700 mb-3">مركّب تآزري يدعم <strong>حاجز البشرة</strong> و<strong>توازن الميكروبيوم</strong> معاً:</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>مركّب دهون الحاجز</strong> — 5 سيراميدات (NP، AS، AP، NS، EOP؛ تشكّل السيراميدات نحو 50% من حاجز البشرة) مع الكوليسترول والفيتوسفينغوزين لتثبيت البنية الدهنية، وزبدة الشيا لتغذية مكثّفة.</li>
      <li><strong>مركّب الميكروبيوم</strong> — بروبيوتيك (مُحلَّلات تخمّر Bifida وLactobacillus) وبريبيوتيك (فروكتان، خلاصة جذر الهندباء البرية، خلاصة جذر الهندباء) لتوازن ميكروبيوم البشرة.</li>
      <li><strong>مركّب السيراميد الوردي</strong> — خلاصة نبات الفايرويد مع مُحلَّل Lactobacillus وسيراميد NP لإعادة الحيوية للبشرة.</li>
      <li><strong>نبتة القيامة (Anastatica hierochuntica)</strong> — نبتة الصحراء الغنية بالفلافونويدات والمركّبات الفينولية: مضادة للأكسدة وللالتهاب ومهدئة.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">حجمان: 200 مل للمنزل · 600 مل للمحترفين</h2>
    <div class="grid gap-8 md:grid-cols-2 mt-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${IMG_200}" alt="CERABARRIER BIOME GEL CLEANSER 200 مل — للعناية المنزلية" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">العناية المنزلية — 200 مل</h3>
        <p class="text-gray-700">منظّفك اليومي في المنزل: لطيف بما يكفي صباحاً ومساءً، وفعّال بما يكفي لإزالة مكياج الأساس — مع الحفاظ على حاجز رطب وهادئ.</p>
        <a href="/ar/products/66" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">عرض المنتج — 380 درهم</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${IMG_600}" alt="CERABARRIER BIOME GEL CLEANSER 600 مل — للاستخدام الاحترافي" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">الاحترافي — 600 مل</h3>
        <p class="text-gray-700">عبوة العيادات لغرف العلاج — الخطوة الأولى المثالية لكل بروتوكول عناية بالوجه وميكرونيدلينج، تُحضّر البشرة من دون تجريدها.</p>
        <a href="/ar/products/66" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">عرض المنتج — 620 درهم</a>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">CERABARRIER BIOME أم SNOW O₂ — أي منظّف يناسبك؟</h2>
    <table class="w-full text-right border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pl-4"></th>
          <th class="py-3 pl-4">CERABARRIER BIOME</th>
          <th class="py-3">SNOW O₂</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">القوام</td><td class="py-3 pl-4">جل إلى رغوة، انزلاق ناعم، لمسة نهائية حابسة للرطوبة</td><td class="py-3">فقاعات أكسجين فورية عند الاستخدام</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">النهج</td><td class="py-3 pl-4">الحاجز أولاً: تنظيف مرطّب ومهدئ</td><td class="py-3">تقنية فقاعات الأكسجين: تنظيف عميق وإشراقة</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">المكوّنات الرئيسية</td><td class="py-3 pl-4">مركّب السيراميد الوردي · 5 سيراميدات · مركّب الميكروبيوم</td><td class="py-3">Phytolex SC · MultiEx Phytrogen</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الأنسب لـ</td><td class="py-3 pl-4">تنظيف يومي لطيف + ترطيب + تهدئة معاً</td><td class="py-3">تنظيف عميق للمسام ودفعة إشراقة فورية</td></tr>
      </tbody>
    </table>
    <p class="text-gray-700 mt-3">معاً يكتمل خط التنظيف من GENOSYS — اختاري بحسب حاجة بشرتك أو بالتناوب: SNOW O₂ لأيام التنظيف العميق، وCERABARRIER BIOME للعناية اليومية بالحاجز.</p>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">متوفر الآن في الإمارات</h3>
    <p class="text-lg mb-6">CERABARRIER BIOME GEL CLEANSER — 200 مل للمنزل (380 درهم) و600 مل لغرفة العلاج (620 درهم). الموزّع الرسمي لـ GENOSYS.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ar/products/66" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">عرض المنتج</a>
      <a href="/ar/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">تواصلي معنا</a>
    </div>
  </div>
</div>`

async function main() {
  const data = {
    title: 'New: CERABARRIER BIOME GEL CLEANSER — Barrier-First Cleansing with Pink Ceramide & Microbiome Care (200ml / 600ml)',
    slug: SLUG,
    excerpt:
      'Launching today: the GENOSYS CERABARRIER BIOME GEL CLEANSER — a gel-to-foam daily cleanser that cleanses, soothes and hydrates in one step. Clinically proven +145.8% hydration right after washing. Homecare 200ml and Professional 600ml.',
    content: contentEn,
    featuredImage: HERO_IMG,
    titleRu: 'Новинка: CERABARRIER BIOME GEL CLEANSER — очищение с заботой о барьере, розовыми церамидами и микробиомом (200 мл / 600 мл)',
    excerptRu:
      'Сегодня в продаже: GENOSYS CERABARRIER BIOME GEL CLEANSER — ежедневный клинсер «гель-в-пену», который очищает, успокаивает и увлажняет за один шаг. Клинически доказано: +145,8% увлажнённости сразу после умывания. 200 мл для дома и 600 мл для профессионалов.',
    contentRu,
    titleAr: 'جديد: CERABARRIER BIOME GEL CLEANSER — تنظيف يضع الحاجز أولاً مع السيراميد الوردي والميكروبيوم (200 مل / 600 مل)',
    excerptAr:
      'نطلق اليوم: GENOSYS CERABARRIER BIOME GEL CLEANSER — منظّف يومي بقوام يتحوّل من جل إلى رغوة، ينظّف ويهدّئ ويرطّب في خطوة واحدة. مُثبت سريرياً: %145.8+ ترطيباً فور الغسل. 200 مل للمنزل و600 مل للمحترفين.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'cerabarrier',
      'gel-cleanser',
      'ceramides',
      'microbiome',
      'skin-barrier',
      'new-product',
      'korean-skincare',
      'cleansing',
    ]),
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } })
  if (existing) {
    const updated = await prisma.blogPost.update({ where: { slug: SLUG }, data })
    console.log('Updated existing blog post:', updated.slug, updated.id)
  } else {
    const created = await prisma.blogPost.create({ data })
    console.log('Created blog post:', created.slug, created.id)
  }
  console.log('URLs:')
  console.log('  EN: https://genosys.ae/blog/' + SLUG)
  console.log('  RU: https://genosys.ae/ru/blog/' + SLUG)
  console.log('  AR: https://genosys.ae/ar/blog/' + SLUG)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
