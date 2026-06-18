/**
 * Creates (or updates) the Bio-Meso PDRN line blog post.
 *
 * Covers Product 60 (Bio-Meso PDRN Expert Ampoule 60000, professional) and
 * Product 65 (Bio-Meso PDRN Homecare Ampoule 5000). Content is sourced from the
 * GENOSYS Bio-Meso PDRN line training manual (DTS MG, rev. Aug 2025).
 *
 * Run: npx tsx --env-file=.env.local scripts/create-bio-meso-pdrn-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'bio-meso-pdrn-spicule-treatment-line'

const PROF_IMG = '/images/Second/Prof_Meso.jpg' // Product 60 (also featured/hero)
const HOME_IMG = '/images/Bio_Meso_5000.png' // Product 65

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Meet GENOSYS <strong>Bio-Meso PDRN</strong> — a needle-free "liquid microneedling" treatment that uses microscopic <strong>spicules</strong> coated with <strong>PDRN</strong> to renew, regenerate and strengthen the skin. One technology, two strengths: a high-intensity <strong>professional ampoule</strong> for the clinic and a gentle <strong>homecare ampoule</strong> to maintain results between sessions.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">What is spicule (bio-meso) treatment?</h2>
    <p class="text-gray-700">Spicules are microscopic, needle-like structures purified from freshwater sponges. Applied topically, they create temporary microchannels in the stratum corneum <strong>without bleeding or visible injury</strong> — also called <em>liquid microneedling</em> or <em>bio-microneedling</em> because the effect closely mimics microneedling.</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>Create microchannels</strong> — tiny temporary channels that boost penetration of actives.</li>
      <li><strong>Stimulate renewal</strong> — trigger fibroblast activity, collagen production and cell turnover.</li>
      <li><strong>Enhance absorption</strong> — deliver PDRN and peptides deeper into the skin.</li>
      <li><strong>Trigger natural exfoliation</strong> — spicules remain 24–72h, gently shedding and renewing skin.</li>
    </ul>
    <p class="text-gray-700">Penetration depth is roughly <strong>0.1–0.25 mm</strong>, controlled by spicule size and application — deep enough to stimulate, gentle enough to avoid puncturing the dermis.</p>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Why GENOSYS Bio-Meso is different: 3rd-generation COG spicules</h3>
    <p class="text-gray-700">GENOSYS uses the latest <strong>3rd-generation COG (Coated) spicules</strong>: PDRN is first encapsulated in a <strong>phytosome</strong>, then uniformly coated onto the spicule surface. Phytosome encapsulation binds the active to phospholipids — mimicking skin lipids — for superior stability, skin compatibility and direct transdermal delivery. The result is a controlled, safe treatment with a <strong>dual action</strong>: mechanical micro-stimulation plus targeted delivery of potent actives.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">PDRN + spicules: a synergy for regeneration</h2>
    <ul class="space-y-2 text-gray-700">
      <li><strong>Enhanced transdermal delivery</strong> — thousands of microchannels carry PDRN into the dermis where it works best.</li>
      <li><strong>Regeneration support</strong> — PDRN (salmon-derived DNA) stimulates fibroblast activity and collagen/elastin synthesis.</li>
      <li><strong>Less downtime</strong> — PDRN soothes inflammation and reduces redness, making treatment tolerable even for sensitive skin.</li>
      <li><strong>Dual-action mechanism</strong> — spicules stimulate mechanically, PDRN supports biochemically.</li>
    </ul>
    <p class="text-gray-700"><strong>Key benefits:</strong> boosts skin turnover · enhances collagen &amp; elastin · promotes regeneration · improves skin tone · improves blemishes.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">A 2-way system: Professional + Homecare</h2>
    <div class="grid gap-8 md:grid-cols-2 mt-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 class="text-xl font-semibold mb-2">Bio-Meso PDRN Expert Ampoule 60000</h3>
        <p class="text-sm text-primary-600 font-medium mb-4">Professional · 3 ml × 4 syringes · 60,000 ppm spicules</p>
        <p class="text-gray-700 mb-4">The in-clinic powerhouse. Contains a significantly higher spicule concentration than other products on the market for intensive, peel-off renewal. Equivalent to a <strong>1.0 mm needle depth</strong> and recommended <strong>once a month</strong>.</p>
        <p class="text-gray-700">Formulated with PDRN-coated spicules, a <strong>9 growth-factor complex</strong>, multiple anti-aging peptides, 5 ceramides and panthenol (10,000 ppm).</p>
        <a href="/products/60" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">View Professional Ampoule</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${HOME_IMG}" alt="Bio-Meso PDRN Homecare Ampoule 5000" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Bio-Meso PDRN Homecare Ampoule 5000</h3>
        <p class="text-sm text-primary-600 font-medium mb-4">Homecare · 50 ml · gentle daily-care concentration</p>
        <p class="text-gray-700 mb-4">The take-home companion that maintains and reinforces results between professional visits. Equivalent to a <strong>0.25 mm needle depth</strong> and recommended <strong>once a week, in the evening</strong>.</p>
        <p class="text-gray-700">Same Bio-Meso PDRN technology with EGF, soothing PDRN, peptides, 5 ceramides, collagen, elastin and panthenol.</p>
        <a href="/products/65" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">View Homecare Ampoule</a>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Professional vs. Homecare at a glance</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4">Feature</th>
          <th class="py-3 pr-4">Expert Ampoule 60000</th>
          <th class="py-3">Homecare Ampoule 5000</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Use</td><td class="py-3 pr-4">In-clinic professional</td><td class="py-3">At-home maintenance</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Size</td><td class="py-3 pr-4">3 ml × 4 syringes</td><td class="py-3">50 ml</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Intensity</td><td class="py-3 pr-4">~1.0 mm needle equivalent</td><td class="py-3">~0.25 mm needle equivalent</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Frequency</td><td class="py-3 pr-4">Once a month (3–4 weeks)</td><td class="py-3">Once a week (evening)</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Spicule level</td><td class="py-3 pr-4">60,000 ppm</td><td class="py-3">Gentle homecare level</td></tr>
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-3xl font-bold">How to use</h2>
    <h3 class="text-2xl font-semibold mt-6">Professional (Expert 60000)</h3>
    <p class="text-gray-700">After cleansing and prep, protect the eyes with wet cotton pads and apply the full 3 ml on the face (avoid eyes and lips). Spread evenly, press the spicules in with palms/fingers, then massage with a rolling motion. To calm the skin, finish with the Skin Reboot PDRN Mask Pack (10–15 min) or, for sensitive skin, the Bio Ferment Age-Defying Mask (~20 min). Interval: 3–4 weeks.</p>
    <h3 class="text-2xl font-semibold mt-6">Homecare (Homecare 5000)</h3>
    <p class="text-gray-700">In the evening, after cleansing, apply about 3 ml on the face. Spread evenly, press into the treatment area with palms/fingers, then massage in a rolling motion for ~30 seconds. To calm the skin, apply the Skin Reboot PDRN Mask Pack for 10–15 minutes. Use once a week.</p>
  </div>

  <div class="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Aftercare &amp; precautions</h3>
    <ul class="space-y-2 text-gray-700">
      <li>Mild tingling/prickling and light peeling for 1–3 days is normal as spicules shed naturally.</li>
      <li>Hydrate and repair with Soothing Repair Postcream and Skin Rescue Overnight Cream Mask; avoid alcohol-based or exfoliating products.</li>
      <li>Apply sunscreen daily and avoid direct sun for ~1 week. Pause retinoids, AHAs/BHAs and vitamin C for 3–5 days.</li>
      <li>Avoid around eyes and lips. Do not combine in the same session as microneedling; space treatments apart.</li>
      <li><strong>Avoid</strong> on active infections, severe acne/rosacea, open wounds, known ingredient allergies, autoimmune skin conditions, recent peels/laser, recent sunburn, or during pregnancy/breastfeeding.</li>
    </ul>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Renew your skin the needle-free way</h3>
    <p class="text-lg mb-6">Experience the Bio-Meso PDRN line — professional intensity in clinic, gentle care at home.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/products/60" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">Professional Ampoule 60000</a>
      <a href="/products/65" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">Homecare Ampoule 5000</a>
    </div>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Знакомьтесь — GENOSYS <strong>Bio-Meso PDRN</strong> — безыгольная процедура «жидкого микронидлинга», в которой микроскопические <strong>спикулы</strong> с покрытием из <strong>PDRN</strong> обновляют, регенерируют и укрепляют кожу. Одна технология, две концентрации: высокоинтенсивная <strong>профессиональная ампула</strong> для клиники и мягкая <strong>домашняя ампула</strong> для поддержания результата между процедурами.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Что такое спикулярная (био-мезо) процедура?</h2>
    <p class="text-gray-700">Спикулы — это микроскопические игольчатые структуры, очищенные из пресноводных губок. При нанесении на кожу они создают временные микроканалы в роговом слое <strong>без крови и видимых повреждений</strong> — поэтому процедуру называют <em>жидким микронидлингом</em> или <em>био-микронидлингом</em>.</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>Создают микроканалы</strong> — крошечные временные каналы усиливают проникновение активов.</li>
      <li><strong>Стимулируют обновление</strong> — активируют фибробласты, выработку коллагена и клеточное обновление.</li>
      <li><strong>Усиливают впитывание</strong> — доставляют PDRN и пептиды глубже в кожу.</li>
      <li><strong>Запускают естественное отшелушивание</strong> — спикулы остаются в коже 24–72 часа, мягко обновляя её.</li>
    </ul>
    <p class="text-gray-700">Глубина проникновения — примерно <strong>0,1–0,25 мм</strong>: достаточно, чтобы стимулировать, и мягко, чтобы не повреждать дерму.</p>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Чем отличается GENOSYS Bio-Meso: спикулы COG 3-го поколения</h3>
    <p class="text-gray-700">GENOSYS использует новейшие <strong>спикулы COG 3-го поколения</strong>: PDRN сначала инкапсулируется в <strong>фитосому</strong>, а затем равномерно наносится на поверхность спикул. Фитосомная инкапсуляция связывает актив с фосфолипидами — подобно липидам кожи — для лучшей стабильности, совместимости и прямой трансдермальной доставки. Итог — контролируемая безопасная процедура с <strong>двойным действием</strong>: механическая микростимуляция плюс адресная доставка мощных активов.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">PDRN + спикулы: синергия для регенерации</h2>
    <ul class="space-y-2 text-gray-700">
      <li><strong>Усиленная трансдермальная доставка</strong> — тысячи микроканалов доставляют PDRN в дерму.</li>
      <li><strong>Поддержка регенерации</strong> — PDRN (ДНК из лосося) стимулирует фибробласты и синтез коллагена/эластина.</li>
      <li><strong>Меньше восстановительный период</strong> — PDRN успокаивает воспаление и уменьшает покраснение, подходит даже для чувствительной кожи.</li>
      <li><strong>Двойной механизм</strong> — спикулы стимулируют механически, PDRN поддерживает биохимически.</li>
    </ul>
    <p class="text-gray-700"><strong>Ключевые преимущества:</strong> ускоряет обновление кожи · усиливает коллаген и эластин · способствует регенерации · улучшает тон · уменьшает несовершенства.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Система 2-в-1: профессиональный + домашний уход</h2>
    <div class="grid gap-8 md:grid-cols-2 mt-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 class="text-xl font-semibold mb-2">Bio-Meso PDRN Expert Ampoule 60000</h3>
        <p class="text-sm text-primary-600 font-medium mb-4">Профессиональный · 3 мл × 4 шприца · 60 000 ppm спикул</p>
        <p class="text-gray-700 mb-4">Мощное средство для клиники со значительно более высокой концентрацией спикул для интенсивного обновления с эффектом пилинга. Эквивалент <strong>глубины иглы 1,0 мм</strong>, рекомендуется <strong>раз в месяц</strong>.</p>
        <p class="text-gray-700">В составе: спикулы с покрытием PDRN, <strong>комплекс из 9 факторов роста</strong>, антивозрастные пептиды, 5 церамидов и пантенол (10 000 ppm).</p>
        <a href="/ru/products/60" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">Профессиональная ампула</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${HOME_IMG}" alt="Bio-Meso PDRN Homecare Ampoule 5000" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Bio-Meso PDRN Homecare Ampoule 5000</h3>
        <p class="text-sm text-primary-600 font-medium mb-4">Домашний уход · 50 мл · мягкая концентрация</p>
        <p class="text-gray-700 mb-4">Домашний компаньон, который поддерживает и закрепляет результат между визитами в клинику. Эквивалент <strong>глубины иглы 0,25 мм</strong>, рекомендуется <strong>раз в неделю, вечером</strong>.</p>
        <p class="text-gray-700">Та же технология Bio-Meso PDRN с EGF, успокаивающим PDRN, пептидами, 5 церамидами, коллагеном, эластином и пантенолом.</p>
        <a href="/ru/products/65" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">Домашняя ампула</a>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Профессиональный и домашний — сравнение</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4">Параметр</th>
          <th class="py-3 pr-4">Expert Ampoule 60000</th>
          <th class="py-3">Homecare Ampoule 5000</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Применение</td><td class="py-3 pr-4">Профессионально в клинике</td><td class="py-3">Домашний уход</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Объём</td><td class="py-3 pr-4">3 мл × 4 шприца</td><td class="py-3">50 мл</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Интенсивность</td><td class="py-3 pr-4">~1,0 мм (эквивалент иглы)</td><td class="py-3">~0,25 мм (эквивалент иглы)</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Частота</td><td class="py-3 pr-4">Раз в месяц (3–4 недели)</td><td class="py-3">Раз в неделю (вечером)</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Концентрация спикул</td><td class="py-3 pr-4">60 000 ppm</td><td class="py-3">Мягкая, для дома</td></tr>
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Как применять</h2>
    <h3 class="text-2xl font-semibold mt-6">Профессионально (Expert 60000)</h3>
    <p class="text-gray-700">После очищения и подготовки защитите глаза влажными ватными дисками и нанесите все 3 мл на лицо (избегая зоны глаз и губ). Распределите равномерно, вбейте спикулы ладонями/пальцами, затем сделайте массаж круговыми движениями. Для успокоения завершите маской Skin Reboot PDRN (10–15 мин) или, для чувствительной кожи, маской Bio Ferment Age-Defying (~20 мин). Интервал: 3–4 недели.</p>
    <h3 class="text-2xl font-semibold mt-6">Домашний уход (Homecare 5000)</h3>
    <p class="text-gray-700">Вечером, после очищения, нанесите около 3 мл на лицо. Распределите равномерно, вбейте в зону обработки ладонями/пальцами, затем массируйте круговыми движениями около 30 секунд. Для успокоения нанесите маску Skin Reboot PDRN на 10–15 минут. Используйте раз в неделю.</p>
  </div>

  <div class="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Уход после процедуры и меры предосторожности</h3>
    <ul class="space-y-2 text-gray-700">
      <li>Лёгкое покалывание и небольшое шелушение в течение 1–3 дней — норма, спикулы выводятся естественно.</li>
      <li>Увлажняйте и восстанавливайте кожу с Soothing Repair Postcream и Skin Rescue Overnight Cream Mask; избегайте спиртосодержащих и отшелушивающих средств.</li>
      <li>Ежедневно наносите солнцезащиту и избегайте прямого солнца ~1 неделю. На 3–5 дней приостановите ретиноиды, AHA/BHA и витамин C.</li>
      <li>Избегайте зоны вокруг глаз и губ. Не сочетайте в одной процедуре с микронидлингом — разнесите по времени.</li>
      <li><strong>Не используйте</strong> при активных инфекциях, тяжёлом акне/розацеа, открытых ранах, аллергии на компоненты, аутоиммунных заболеваниях кожи, после недавних пилингов/лазера, при свежем загаре/ожоге, во время беременности и кормления.</li>
    </ul>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Обновите кожу без игл</h3>
    <p class="text-lg mb-6">Откройте для себя линию Bio-Meso PDRN — профессиональная интенсивность в клинике, мягкий уход дома.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ru/products/60" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">Профессиональная ампула 60000</a>
      <a href="/ru/products/65" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">Домашняя ампула 5000</a>
    </div>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
  <div>
    <p class="text-lg text-gray-700">تعرّفي على GENOSYS <strong>Bio-Meso PDRN</strong> — علاج «الميكرونيدلينج السائل» بدون إبر يستخدم <strong>Spicules</strong> مجهرية مغلّفة بـ <strong>PDRN</strong> لتجديد البشرة وتعزيز تجددها وتقوية حاجزها. تقنية واحدة بقوّتين: <strong>أمبولة احترافية</strong> عالية التركيز للعيادة و<strong>أمبولة للعناية المنزلية</strong> لطيفة للحفاظ على النتائج بين الجلسات.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ما هو علاج الـ Spicules (بايو-ميزو)؟</h2>
    <p class="text-gray-700">الـ Spicules هي بُنى مجهرية على شكل إبر مستخلصة ومنقّاة من الإسفنج المائي العذب. عند تطبيقها موضعياً تنشئ قنوات دقيقة مؤقتة في الطبقة القرنية <strong>دون نزيف أو إصابة مرئية</strong> — لذلك يُسمّى العلاج <em>الميكرونيدلينج السائل</em> أو <em>البايو-ميكرونيدلينج</em>.</p>
    <ul class="space-y-2 text-gray-700">
      <li><strong>إنشاء قنوات دقيقة</strong> — قنوات مؤقتة تعزّز اختراق المكونات النشطة.</li>
      <li><strong>تحفيز التجدد</strong> — تنشّط الخلايا الليفية وإنتاج الكولاجين وتجدد الخلايا.</li>
      <li><strong>تعزيز الامتصاص</strong> — توصيل الـ PDRN والببتيدات بعمق أكبر.</li>
      <li><strong>تقشير طبيعي</strong> — تبقى الـ Spicules من 24 إلى 72 ساعة لتجدّد البشرة بلطف.</li>
    </ul>
    <p class="text-gray-700">عمق الاختراق حوالي <strong>0.1–0.25 مم</strong>: كافٍ للتحفيز ولطيف بما يكفي لتجنّب اختراق الأدمة.</p>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">ما الذي يميّز GENOSYS Bio-Meso: Spicules COG من الجيل الثالث</h3>
    <p class="text-gray-700">تستخدم GENOSYS أحدث <strong>Spicules COG من الجيل الثالث</strong>: يُغلَّف الـ PDRN أولاً داخل <strong>فيتوسوم</strong> ثم يُطلى بانتظام على سطح الـ Spicules. يربط التغليف الفيتوسومي المادة الفعّالة بالفوسفوليبيدات — محاكياً دهون البشرة — لثبات أعلى وتوافق أفضل وتوصيل مباشر عبر الجلد. والنتيجة علاج آمن ومضبوط ذو <strong>تأثير مزدوج</strong>: تحفيز ميكانيكي دقيق مع توصيل موجّه لمكونات فعّالة قوية.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">PDRN + Spicules: تآزر للتجديد</h2>
    <ul class="space-y-2 text-gray-700">
      <li><strong>توصيل أعمق عبر الجلد</strong> — آلاف القنوات الدقيقة تنقل الـ PDRN إلى الأدمة.</li>
      <li><strong>دعم التجديد</strong> — الـ PDRN (حمض نووي من السلمون) يحفّز الخلايا الليفية وتخليق الكولاجين والإيلاستين.</li>
      <li><strong>وقت تعافٍ أقل</strong> — يهدّئ الـ PDRN الالتهاب ويقلّل الاحمرار، ومناسب حتى للبشرة الحساسة.</li>
      <li><strong>آلية مزدوجة</strong> — الـ Spicules تحفّز ميكانيكياً، والـ PDRN يدعم بيوكيميائياً.</li>
    </ul>
    <p class="text-gray-700"><strong>أهم الفوائد:</strong> تعزيز تجدد البشرة · زيادة الكولاجين والإيلاستين · دعم التجديد · تحسين لون البشرة · تقليل العيوب.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">نظام ثنائي: احترافي + منزلي</h2>
    <div class="grid gap-8 md:grid-cols-2 mt-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 class="text-xl font-semibold mb-2">Bio-Meso PDRN Expert Ampoule 60000</h3>
        <p class="text-sm text-primary-600 font-medium mb-4">احترافي · 3 مل × 4 محاقن · 60,000 جزء بالمليون</p>
        <p class="text-gray-700 mb-4">القوة الاحترافية للعيادة بتركيز Spicules أعلى بكثير من المنتجات الأخرى لتجديد مكثّف بتأثير تقشير. يعادل <strong>عمق إبرة 1.0 مم</strong> ويُنصح به <strong>مرة شهرياً</strong>.</p>
        <p class="text-gray-700">يحتوي على Spicules مغلّفة بـ PDRN و<strong>مجمّع 9 عوامل نمو</strong> وببتيدات مضادة للشيخوخة و5 سيراميدات وبانثينول (10,000 جزء بالمليون).</p>
        <a href="/ar/products/60" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">الأمبولة الاحترافية</a>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <img src="${HOME_IMG}" alt="Bio-Meso PDRN Homecare Ampoule 5000" class="w-full h-auto rounded-xl mb-5" />
        <h3 class="text-xl font-semibold mb-2">Bio-Meso PDRN Homecare Ampoule 5000</h3>
        <p class="text-sm text-primary-600 font-medium mb-4">عناية منزلية · 50 مل · تركيز لطيف</p>
        <p class="text-gray-700 mb-4">الرفيق المنزلي الذي يحافظ على النتائج ويعزّزها بين زيارات العيادة. يعادل <strong>عمق إبرة 0.25 مم</strong> ويُنصح به <strong>مرة أسبوعياً مساءً</strong>.</p>
        <p class="text-gray-700">نفس تقنية Bio-Meso PDRN مع EGF وPDRN مهدّئ وببتيدات و5 سيراميدات وكولاجين وإيلاستين وبانثينول.</p>
        <a href="/ar/products/65" class="inline-block mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-700 transition-colors">أمبولة العناية المنزلية</a>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الاحترافي مقابل المنزلي — لمحة سريعة</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4">الميزة</th>
          <th class="py-3 pr-4">Expert Ampoule 60000</th>
          <th class="py-3">Homecare Ampoule 5000</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">الاستخدام</td><td class="py-3 pr-4">احترافي في العيادة</td><td class="py-3">عناية منزلية</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">الحجم</td><td class="py-3 pr-4">3 مل × 4 محاقن</td><td class="py-3">50 مل</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">الكثافة</td><td class="py-3 pr-4">~1.0 مم (مكافئ إبرة)</td><td class="py-3">~0.25 مم (مكافئ إبرة)</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">التكرار</td><td class="py-3 pr-4">مرة شهرياً (3–4 أسابيع)</td><td class="py-3">مرة أسبوعياً (مساءً)</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">تركيز الـ Spicules</td><td class="py-3 pr-4">60,000 جزء بالمليون</td><td class="py-3">لطيف للمنزل</td></tr>
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-3xl font-bold">طريقة الاستخدام</h2>
    <h3 class="text-2xl font-semibold mt-6">احترافي (Expert 60000)</h3>
    <p class="text-gray-700">بعد التنظيف والتحضير، احمي العينين بقطن مبلل وطبّقي كامل الـ 3 مل على الوجه (تجنّبي العينين والشفاه). وزّعي بالتساوي، ثم اضغطي الـ Spicules براحتي اليدين أو الأصابع، ثم دلّكي بحركة دائرية. لتهدئة البشرة، أنهي بقناع Skin Reboot PDRN (10–15 دقيقة) أو، للبشرة الحساسة، قناع Bio Ferment Age-Defying (~20 دقيقة). الفاصل: 3–4 أسابيع.</p>
    <h3 class="text-2xl font-semibold mt-6">العناية المنزلية (Homecare 5000)</h3>
    <p class="text-gray-700">مساءً، بعد التنظيف، طبّقي حوالي 3 مل على الوجه. وزّعي بالتساوي واضغطي على منطقة العلاج براحتي اليدين أو الأصابع، ثم دلّكي بحركة دائرية لنحو 30 ثانية. لتهدئة البشرة، طبّقي قناع Skin Reboot PDRN لمدة 10–15 دقيقة. استخدمي مرة أسبوعياً.</p>
  </div>

  <div class="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">العناية بعد العلاج والاحتياطات</h3>
    <ul class="space-y-2 text-gray-700">
      <li>وخز خفيف وتقشّر بسيط لمدة 1–3 أيام أمر طبيعي مع خروج الـ Spicules تدريجياً.</li>
      <li>رطّبي وأصلحي البشرة بـ Soothing Repair Postcream وSkin Rescue Overnight Cream Mask؛ تجنّبي المنتجات الكحولية أو المقشّرة.</li>
      <li>طبّقي واقي الشمس يومياً وتجنّبي الشمس المباشرة نحو أسبوع. أوقفي الريتينويد وأحماض AHA/BHA وفيتامين C لمدة 3–5 أيام.</li>
      <li>تجنّبي محيط العينين والشفاه. لا تجمعي بين العلاج والميكرونيدلينج في الجلسة نفسها — باعدي بينهما.</li>
      <li><strong>تجنّبي الاستخدام</strong> مع العدوى النشطة وحب الشباب/الوردية الشديدة والجروح المفتوحة وحساسية المكونات وأمراض المناعة الذاتية الجلدية وبعد التقشير/الليزر الحديث والحروق الشمسية الحديثة وأثناء الحمل والرضاعة.</li>
    </ul>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">جدّدي بشرتك بدون إبر</h3>
    <p class="text-lg mb-6">اكتشفي خط Bio-Meso PDRN — قوة احترافية في العيادة وعناية لطيفة في المنزل.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ar/products/60" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">الأمبولة الاحترافية 60000</a>
      <a href="/ar/products/65" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">أمبولة العناية المنزلية 5000</a>
    </div>
  </div>
</div>`

async function main() {
  const data = {
    title: 'Bio-Meso PDRN: Needle-Free Spicule Renewal — Professional 60000 & Homecare 5000',
    slug: SLUG,
    excerpt:
      'Discover the GENOSYS Bio-Meso PDRN line — needle-free "liquid microneedling" powered by 3rd-generation PDRN-coated spicules. A 2-way system: the professional Expert Ampoule 60000 for the clinic and the gentle Homecare Ampoule 5000 to maintain results at home.',
    content: contentEn,
    featuredImage: PROF_IMG,
    titleRu: 'Bio-Meso PDRN: обновление спикулами без игл — профессиональная 60000 и домашняя 5000',
    excerptRu:
      'Откройте для себя линию GENOSYS Bio-Meso PDRN — безыгольный «жидкий микронидлинг» на спикулах 3-го поколения с покрытием PDRN. Система 2-в-1: профессиональная Expert Ampoule 60000 для клиники и мягкая Homecare Ampoule 5000 для поддержания результата дома.',
    contentRu,
    titleAr: 'Bio-Meso PDRN: تجديد بالـ Spicules بدون إبر — الاحترافية 60000 والمنزلية 5000',
    excerptAr:
      'اكتشفي خط GENOSYS Bio-Meso PDRN — «ميكرونيدلينج سائل» بدون إبر بفضل Spicules من الجيل الثالث مغلّفة بـ PDRN. نظام ثنائي: الأمبولة الاحترافية Expert 60000 للعيادة والأمبولة المنزلية Homecare 5000 للحفاظ على النتائج في المنزل.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'bio-meso',
      'pdrn',
      'spicules',
      'liquid-microneedling',
      'skin-regeneration',
      'professional-treatment',
      'homecare',
      'korean-skincare',
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
