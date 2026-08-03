/**
 * Creates or updates the multilingual product 43 feature article.
 *
 * Product source of truth:
 * - Intertek Formula_up: Formula-GENOSYS HR3 MATRIX HAIR TONIC α.pdf
 * - Intertek artwork: [GENOSYS]HR3 MATRIX HAIR TONIC α.pdf
 * - Intertek COA: COA-GENOSYS HR3 MATRIX HAIR TONIC α(NF002).pdf
 *
 * Public context:
 * - MFDS functional-cosmetics definition and approval process
 * - American Academy of Dermatology hair-loss care guidance
 * - 2025 systematic review of topical caffeine clinical evidence
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-hr3-hair-tonic-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'scalp-first-hair-care-hr3-matrix-hair-tonic-alpha'
const IMG = '/images/hair_tonic'

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Hair care usually begins with the strand: shine, softness, styling. But every strand begins in skin. A practical scalp routine is less glamorous than a miracle-growth promise, and far more honest: keep the scalp clean and comfortable, handle fragile hair gently, and use a leave-on product consistently enough to judge the routine rather than the first cooling sensation.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Scalp first, without the mythology</h2>
    <img src="${IMG}/s1.jpeg" alt="GENOSYS HR³ MATRIX HAIR TONIC alpha daily scalp care" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Hair shedding is not one diagnosis. Genetics, illness, stress, medication, nutrition, inflammation and styling damage can look similar in the mirror. The <a href="https://www.aad.org/public/diseases/hair-loss/treatment/tips" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">American Academy of Dermatology</a> therefore recommends early assessment when hair loss is persistent or concerning. It also advises gentle shampooing and conditioning because thinning hair is more fragile and prone to breakage.</p>
    <p class="text-gray-700 mt-3"><strong>HR³ MATRIX HAIR TONIC α is supportive cosmetic care, not a diagnosis or a medicine.</strong> Its registered artwork describes a scalp toner for scalp nourishment and hair conditioning, designed to be sprayed directly where the routine starts.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-cyan-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">What “functional cosmetic” actually means in Korea</h2>
    <img src="${IMG}/s2.jpeg" alt="HR³ MATRIX HAIR TONIC alpha functional cosmetic scalp tonic" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">The Korean pack identifies this tonic as a <strong>functional cosmetic that helps alleviate hair-loss symptoms</strong> and explicitly states that it is <strong>not a medicine for preventing or treating disease</strong>. This distinction matters. South Korea’s <a href="https://www.mfds.go.kr/eng/wpge/m_24/de011014l001.do" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Ministry of Food and Drug Safety (MFDS)</a> lists products that aid in alleviating hair-loss symptoms as a regulated functional-cosmetics category, subject to product evaluation or reporting for safety and effectiveness.</p>
    <p class="text-gray-700 mt-3">That is credible cosmetic positioning. It is not permission to promise new growth, reverse every cause of shedding, or replace dermatologist-directed treatment.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Inside the current α formula</h2>
    <img src="${IMG}/s3.jpeg" alt="Current Intertek formula ingredients in HR³ MATRIX HAIR TONIC alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">The current Intertek formula and pack INCI match. Its structure is straightforward: a light hydro-alcoholic leave-on base carrying cooling, conditioning and scalp-care ingredients.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-cyan-800">Cool and fresh</p>
        <p class="text-gray-700 text-sm mt-1"><strong>Menthol 0.30%</strong>, supported by menthyl lactate and a cooling sensory ingredient.</p>
      </div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-cyan-800">Clear-feeling scalp</p>
        <p class="text-gray-700 text-sm mt-1"><strong>Salicylic Acid 0.25%</strong>, a keratolytic used in scalp care to help loosen surface scale and buildup.</p>
      </div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-cyan-800">Condition and comfort</p>
        <p class="text-gray-700 text-sm mt-1"><strong>Panthenol 0.20%</strong> and <strong>Allantoin 0.10%</strong>, plus glycerin and botanical extracts.</p>
      </div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-cyan-800">Supporting complex</p>
        <p class="text-gray-700 text-sm mt-1">Copper Tripeptide-1, caffeine, Sophora, Acorus, centella, green tea, licorice, rosemary and chamomile extracts.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">Formula transparency: the tonic contains <strong>Alcohol Denat. 9.5%</strong>. It should not be described as alcohol-free.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Caffeine is interesting. The evidence still needs humility.</h2>
    <img src="${IMG}/s4.jpeg" alt="Caffeine copper peptide and botanical scalp care complex" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">A <a href="https://doi.org/10.3390/healthcare13040395" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">2025 systematic review</a> found nine clinical studies of topical caffeine preparations involving 684 people. Results generally favored caffeine, but only three studies provided medium-quality evidence; the rest were low or very low quality, often lacking randomization, controls or clear concentrations. The authors called for better-designed trials.</p>
    <p class="text-gray-700 mt-3">That research is useful context, not proof for this bottle. HR³ MATRIX HAIR TONIC α contains caffeine at <strong>0.001%</strong>; we do not extrapolate results from other formulations or concentrations. The same discipline applies to Copper Tripeptide-1 and the botanical blend: they are supporting ingredients in the verified formula, not a basis for invented growth percentages.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The leave-on ritual is the product</h2>
    <img src="${IMG}/s5.jpeg" alt="How to apply HR³ MATRIX HAIR TONIC alpha morning and evening" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Shake:</strong> shake the bottle well before use.</li>
      <li><strong>2. Target the scalp:</strong> part the hair and spray a small, even amount onto clean scalp rather than misting the lengths.</li>
      <li><strong>3. Massage:</strong> use fingertips in gentle circular motions. Do not scratch with nails.</li>
      <li><strong>4. Leave on:</strong> do not rinse; the registered English artwork says to leave it for at least <strong>3–4 hours</strong>.</li>
      <li><strong>5. Repeat:</strong> use <strong>morning and evening</strong>, as directed on the artwork.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">External use only. Avoid eyes, mucous membranes and wounded skin. Stop if redness, swelling or irritation occurs. Not for children under 3. The Korean pack carries additional salicylic-acid precautions, including avoidance during pregnancy or possible pregnancy.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">A routine you can actually sustain</h2>
    <img src="${IMG}/s6.jpeg" alt="GENOSYS HR³ scalp care system with Hair Tonic alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Use a gentle cleanser appropriate for your scalp, condition the lengths, reduce high-heat and tight-style damage, then apply the tonic to the scalp. Within the HR³ line, pair it with <a href="/products/44" class="text-primary-600 font-semibold hover:underline">MATRIX MEDI SCALP SHAMPOO α</a>; use <a href="/products/46" class="text-primary-600 font-semibold hover:underline">MATRIX SCALP PEELING α</a> as an occasional rather than automatic daily step.</p>
    <p class="text-gray-700 mt-3">Take consistent photos in the same light and parting if you want to observe change. If shedding is sudden, patchy, painful, accompanied by marked scaling, or continues despite a sensible routine, take the photos to a dermatologist. Better information beats a bigger promise.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Daily scalp care, accurately framed.</h3>
    <p class="text-slate-300 mt-3 mb-6">HR³ MATRIX HAIR TONIC α · 70ml · leave-on scalp tonic · made in Korea</p>
    <a href="/products/43" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">View HR³ MATRIX HAIR TONIC α</a>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Уход за волосами обычно начинается с длины: блеск, мягкость, укладка. Но каждый волос начинается в коже. Практичный уход за кожей головы звучит скромнее обещаний «чудо-роста», зато честнее: поддерживать чистоту и комфорт, бережно обращаться с хрупкими волосами и применять несмываемое средство достаточно регулярно, чтобы оценивать ритуал, а не первое ощущение прохлады.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Сначала кожа головы, без мифологии</h2>
    <img src="${IMG}/s1.jpeg" alt="Ежедневный уход за кожей головы с GENOSYS HR³ MATRIX HAIR TONIC alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Выпадение волос не является одним диагнозом. Генетика, болезнь, стресс, лекарства, питание, воспаление и повреждение при укладке могут выглядеть похоже. Поэтому <a href="https://www.aad.org/public/diseases/hair-loss/treatment/tips" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Американская академия дерматологии</a> советует не затягивать с обследованием при стойком или тревожном выпадении. Она также рекомендует мягкое мытьё и кондиционирование: истончающиеся волосы более хрупкие.</p>
    <p class="text-gray-700 mt-3"><strong>HR³ MATRIX HAIR TONIC α — поддерживающий косметический уход, не диагноз и не лекарство.</strong> Зарегистрированный макет упаковки определяет его как тоник для питания кожи головы и кондиционирования волос.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-cyan-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Что в Корее означает «функциональная косметика»</h2>
    <img src="${IMG}/s2.jpeg" alt="Функциональный косметический тоник HR³ MATRIX HAIR TONIC alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">На корейской упаковке тоник обозначен как <strong>функциональное косметическое средство, помогающее облегчать симптомы выпадения волос</strong>, и прямо указано: это <strong>не лекарство для профилактики или лечения заболеваний</strong>. <a href="https://www.mfds.go.kr/eng/wpge/m_24/de011014l001.do" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Министерство безопасности пищевых продуктов и лекарственных средств Кореи (MFDS)</a> относит средства для облегчения симптомов выпадения к регулируемой категории функциональной косметики, которая проходит оценку или уведомление по безопасности и эффективности.</p>
    <p class="text-gray-700 mt-3">Это серьёзное косметическое позиционирование, но не обещание новых волос, устранения любой причины выпадения или замены лечения у дерматолога.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Что внутри актуальной формулы α</h2>
    <img src="${IMG}/s3.jpeg" alt="Ингредиенты актуальной формулы HR³ MATRIX HAIR TONIC alpha по Intertek" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Актуальная формула Intertek совпадает с INCI на упаковке. Это лёгкая водно-спиртовая несмываемая основа с охлаждающими, кондиционирующими и ухаживающими за кожей головы компонентами.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">Прохлада и свежесть</p><p class="text-gray-700 text-sm mt-1"><strong>Ментол 0,30%</strong>, ментиллактат и дополнительный охлаждающий сенсорный компонент.</p></div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">Ощущение чистоты</p><p class="text-gray-700 text-sm mt-1"><strong>Салициловая кислота 0,25%</strong> — кератолитик, помогающий ослаблять поверхностные чешуйки и накопления.</p></div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">Кондиционирование и комфорт</p><p class="text-gray-700 text-sm mt-1"><strong>Пантенол 0,20%</strong> и <strong>аллантоин 0,10%</strong>, а также глицерин и растительные экстракты.</p></div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">Поддерживающий комплекс</p><p class="text-gray-700 text-sm mt-1">Copper Tripeptide-1, кофеин, софора, аир, центелла, зелёный чай, солодка, розмарин и ромашка.</p></div>
    </div>
    <p class="text-sm text-gray-600 mt-4">Прозрачность состава: тоник содержит <strong>9,5% Alcohol Denat.</strong> Его нельзя называть средством без спирта.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Кофеин интересен, но доказательства требуют скромности</h2>
    <img src="${IMG}/s4.jpeg" alt="Кофеин медный пептид и растительный комплекс для кожи головы" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700"><a href="https://doi.org/10.3390/healthcare13040395" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Систематический обзор 2025 года</a> нашёл девять клинических исследований местных средств с кофеином с участием 684 человек. Результаты в целом были в пользу кофеина, но лишь три исследования дали доказательства среднего качества; остальные имели низкое или очень низкое качество и часто не включали рандомизацию, контроль или точную концентрацию.</p>
    <p class="text-gray-700 mt-3">Это полезный контекст, но не доказательство эффективности конкретного флакона. В HR³ MATRIX HAIR TONIC α кофеин содержится в концентрации <strong>0,001%</strong>; переносить результаты других формул и концентраций нельзя. То же относится к Copper Tripeptide-1 и растительному комплексу: они есть в проверенной формуле, но не дают основания придумывать проценты роста.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Несмываемый ритуал — суть продукта</h2>
    <img src="${IMG}/s5.jpeg" alt="Как наносить HR³ MATRIX HAIR TONIC alpha утром и вечером" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Встряхните:</strong> хорошо встряхните флакон перед использованием.</li>
      <li><strong>2. Нанесите на кожу:</strong> разделяйте волосы проборами и равномерно распыляйте небольшое количество на чистую кожу головы, а не по длине.</li>
      <li><strong>3. Помассируйте:</strong> мягко, круговыми движениями подушечек пальцев, не царапая ногтями.</li>
      <li><strong>4. Не смывайте:</strong> английский макет упаковки требует оставить средство минимум на <strong>3–4 часа</strong>.</li>
      <li><strong>5. Повторяйте:</strong> используйте <strong>утром и вечером</strong>, как указано на упаковке.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">Только для наружного применения. Избегайте глаз, слизистых и повреждённой кожи. При покраснении, отёке или раздражении прекратите использование. Не применять детям младше 3 лет. Корейская упаковка содержит дополнительные ограничения для салициловой кислоты, включая беременность или возможную беременность.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Ритуал, которого реально придерживаться</h2>
    <img src="${IMG}/s6.jpeg" alt="Система ухода GENOSYS HR³ с тоником Hair Tonic alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Выберите мягкое очищение по состоянию кожи головы, наносите кондиционер на длину, уменьшите перегрев и натяжение при укладке, затем используйте тоник на коже. В линии HR³ сочетайте его с <a href="/ru/products/44" class="text-primary-600 font-semibold hover:underline">MATRIX MEDI SCALP SHAMPOO α</a>; <a href="/ru/products/46" class="text-primary-600 font-semibold hover:underline">MATRIX SCALP PEELING α</a> оставьте периодическим, а не автоматическим ежедневным шагом.</p>
    <p class="text-gray-700 mt-3">Если хотите наблюдать изменения, делайте фотографии при одинаковом освещении и проборе. При внезапном, очаговом или болезненном выпадении, выраженном шелушении либо продолжающейся проблеме покажите эти фото дерматологу. Точная информация важнее громкого обещания.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Ежедневный уход за кожей головы без преувеличений.</h3>
    <p class="text-slate-300 mt-3 mb-6">HR³ MATRIX HAIR TONIC α · 70 мл · несмываемый тоник · сделано в Корее</p>
    <a href="/ru/products/43" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">Смотреть HR³ MATRIX HAIR TONIC α</a>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
  <div>
    <p class="text-lg text-gray-700">غالباً ما تبدأ العناية بالشعر من الشعرة نفسها: اللمعان والنعومة والتصفيف. لكن كل شعرة تبدأ من الجلد. روتين فروة الرأس العملي أقل إثارة من وعود "النمو المعجزة"، لكنه أكثر صدقاً: حافظي على نظافة الفروة وراحتها، عاملي الشعر الهش بلطف، واستخدمي المنتج الذي يُترك على الفروة بانتظام كافٍ لتقييم الروتين لا مجرد إحساس البرودة الأول.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الفروة أولاً، من دون أساطير</h2>
    <img src="${IMG}/s1.jpeg" alt="العناية اليومية بفروة الرأس مع GENOSYS HR³ MATRIX HAIR TONIC alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">تساقط الشعر ليس تشخيصاً واحداً. فقد تتشابه الوراثة والمرض والتوتر والأدوية والتغذية والالتهاب وأضرار التصفيف في المرآة. لذلك توصي <a href="https://www.aad.org/public/diseases/hair-loss/treatment/tips" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">الأكاديمية الأمريكية للأمراض الجلدية</a> بالتقييم المبكر عندما يكون التساقط مستمراً أو مقلقاً، وبالغسل والتكييف اللطيفين لأن الشعر الخفيف أكثر هشاشة وعرضة للتكسر.</p>
    <p class="text-gray-700 mt-3"><strong>HR³ MATRIX HAIR TONIC α عناية تجميلية داعمة، وليس تشخيصاً أو دواءً.</strong> يصفه ملف العبوة المسجل بأنه تونر لتغذية فروة الرأس وتكييف الشعر، ويُرش مباشرة حيث يبدأ الروتين.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-cyan-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">ماذا تعني "مستحضرات تجميل وظيفية" في كوريا؟</h2>
    <img src="${IMG}/s2.jpeg" alt="تونر فروة الرأس الوظيفي HR³ MATRIX HAIR TONIC alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">تعرّف العبوة الكورية التونر بأنه <strong>مستحضر تجميلي وظيفي يساعد على تخفيف أعراض تساقط الشعر</strong>، وتذكر بوضوح أنه <strong>ليس دواءً للوقاية من الأمراض أو علاجها</strong>. تدرج <a href="https://www.mfds.go.kr/eng/wpge/m_24/de011014l001.do" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">وزارة سلامة الغذاء والدواء الكورية (MFDS)</a> المنتجات التي تساعد على تخفيف أعراض تساقط الشعر ضمن فئة مستحضرات التجميل الوظيفية الخاضعة للتقييم أو الإبلاغ من حيث السلامة والفعالية.</p>
    <p class="text-gray-700 mt-3">هذا توصيف تجميلي موثوق، لكنه لا يعني وعداً بإنبات شعر جديد أو عكس كل أسباب التساقط أو استبدال علاج طبيب الجلدية.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">داخل تركيبة α الحالية</h2>
    <img src="${IMG}/s3.jpeg" alt="مكونات تركيبة HR³ MATRIX HAIR TONIC alpha الحالية وفق Intertek" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">تتطابق تركيبة Intertek الحالية مع قائمة INCI على العبوة. وهي قاعدة مائية كحولية خفيفة تُترك على الفروة، تحمل مكونات للتبريد والتكييف والعناية بالفروة.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">برودة وانتعاش</p><p class="text-gray-700 text-sm mt-1"><strong>منثول 0.30%</strong> مع Menthyl Lactate ومكوّن حسي مبرد.</p></div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">إحساس بفروة أنظف</p><p class="text-gray-700 text-sm mt-1"><strong>حمض الساليسيليك 0.25%</strong>، وهو مقشّر كيراتيني يساعد على تفكيك القشور والتراكمات السطحية.</p></div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">تكييف وراحة</p><p class="text-gray-700 text-sm mt-1"><strong>بانثينول 0.20%</strong> و<strong>ألانتوين 0.10%</strong> مع الغليسرين ومستخلصات نباتية.</p></div>
      <div class="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><p class="font-bold text-cyan-800">مركب داعم</p><p class="text-gray-700 text-sm mt-1">Copper Tripeptide-1 والكافيين والسوفورا والأكوروس والسنتيلا والشاي الأخضر والعرقسوس وإكليل الجبل والبابونج.</p></div>
    </div>
    <p class="text-sm text-gray-600 mt-4">شفافية التركيبة: يحتوي التونر على <strong>Alcohol Denat. بنسبة 9.5%</strong>، لذلك لا يصح وصفه بأنه خالٍ من الكحول.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الكافيين مثير للاهتمام، لكن الدليل يحتاج إلى تواضع</h2>
    <img src="${IMG}/s4.jpeg" alt="الكافيين والببتيد النحاسي والمركب النباتي للعناية بالفروة" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">وجدت <a href="https://doi.org/10.3390/healthcare13040395" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">مراجعة منهجية نُشرت عام 2025</a> تسع دراسات سريرية لمستحضرات الكافيين الموضعية شملت 684 شخصاً. مالت النتائج عموماً لصالح الكافيين، لكن ثلاث دراسات فقط قدمت دليلاً متوسط الجودة، بينما كانت البقية منخفضة أو منخفضة جداً وغالباً افتقرت إلى العشوائية أو مجموعات الضبط أو توضيح التركيز.</p>
    <p class="text-gray-700 mt-3">هذا سياق مفيد وليس إثباتاً لهذه العبوة. يحتوي HR³ MATRIX HAIR TONIC α على كافيين بنسبة <strong>0.001%</strong>، ولا ننقل نتائج تركيبات أو تراكيز أخرى إليه. وينطبق الانضباط نفسه على Copper Tripeptide-1 والمزيج النباتي: هي مكونات داعمة مثبتة في التركيبة، وليست أساساً لاختراع نسب نمو.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">طقس الترك هو جوهر المنتج</h2>
    <img src="${IMG}/s5.jpeg" alt="طريقة تطبيق HR³ MATRIX HAIR TONIC alpha صباحاً ومساءً" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. رجّي:</strong> رجّي العبوة جيداً قبل الاستخدام.</li>
      <li><strong>2. استهدفي الفروة:</strong> قسّمي الشعر ورشي كمية صغيرة ومتساوية على فروة نظيفة بدلاً من رش الأطوال.</li>
      <li><strong>3. دلّكي:</strong> بحركات دائرية لطيفة بأطراف الأصابع، من دون حك بالأظافر.</li>
      <li><strong>4. اتركيه:</strong> لا تشطفيه؛ تنص العبوة الإنجليزية المسجلة على تركه لمدة <strong>3–4 ساعات</strong> على الأقل.</li>
      <li><strong>5. كرري:</strong> استخدميه <strong>صباحاً ومساءً</strong> حسب تعليمات العبوة.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">للاستخدام الخارجي فقط. تجنبي العينين والأغشية المخاطية والجروح. أوقفي الاستخدام عند ظهور احمرار أو تورم أو تهيج. غير مناسب للأطفال دون 3 سنوات. تحمل العبوة الكورية احتياطات إضافية لحمض الساليسيليك، تشمل تجنب الاستخدام أثناء الحمل أو احتمال الحمل.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">روتين يمكن الالتزام به فعلاً</h2>
    <img src="${IMG}/s6.jpeg" alt="نظام GENOSYS HR³ للعناية بالفروة مع Hair Tonic alpha" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">استخدمي منظفاً لطيفاً يناسب فروة رأسك، وضعي البلسم على الأطوال، وقللي الحرارة العالية والتسريحات المشدودة، ثم ضعي التونر على الفروة. ضمن خط HR³، اجمعيه مع <a href="/ar/products/44" class="text-primary-600 font-semibold hover:underline">MATRIX MEDI SCALP SHAMPOO α</a>، واستخدمي <a href="/ar/products/46" class="text-primary-600 font-semibold hover:underline">MATRIX SCALP PEELING α</a> كخطوة دورية لا يومية تلقائية.</p>
    <p class="text-gray-700 mt-3">التقطي صوراً متسقة بالإضاءة والفرق نفسه إذا أردت متابعة التغير. إذا كان التساقط مفاجئاً أو على شكل بقع أو مؤلماً أو مصحوباً بقشور واضحة، أو استمر رغم روتين منطقي، فخذي الصور إلى طبيب جلدية. المعلومة الأفضل أهم من الوعد الأكبر.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">عناية يومية بالفروة، بصياغة دقيقة.</h3>
    <p class="text-slate-300 mt-3 mb-6">HR³ MATRIX HAIR TONIC α · 70 مل · تونر يُترك على الفروة · صنع في كوريا</p>
    <a href="/ar/products/43" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">عرض HR³ MATRIX HAIR TONIC α</a>
  </div>
</div>`

async function main() {
  const data = {
    title: 'Scalp First: The Honest Story Behind HR³ MATRIX HAIR TONIC α',
    slug: SLUG,
    excerpt:
      'A scalp-first guide without miracle-growth promises: what Korea’s functional-cosmetic status means, what is really inside the current α formula, and how to use this leave-on tonic correctly.',
    content: contentEn,
    featuredImage: `${IMG}/main.jpeg`,
    titleRu: 'Сначала кожа головы: честная история HR³ MATRIX HAIR TONIC α',
    excerptRu:
      'Уход за кожей головы без обещаний чудо-роста: что означает корейский статус функциональной косметики, что реально входит в актуальную формулу α и как правильно применять несмываемый тоник.',
    contentRu,
    titleAr: 'الفروة أولاً: القصة الصادقة وراء HR³ MATRIX HAIR TONIC α',
    excerptAr:
      'دليل للعناية بالفروة من دون وعود نمو معجزة: معنى تصنيف المستحضر الوظيفي في كوريا، وما تحتويه تركيبة α الحالية فعلاً، وطريقة استخدام التونر الذي يُترك على الفروة.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'hr3-matrix',
      'hair-tonic',
      'scalp-care',
      'hair-loss-symptoms',
      'functional-cosmetic',
      'caffeine',
      'salicylic-acid',
      'panthenol',
      'korean-hair-care',
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
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
