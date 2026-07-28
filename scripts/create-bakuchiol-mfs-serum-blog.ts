/**
 * Creates (or updates) the blog post for the MULTI FUNCTIONAL ANTI-WRINKLE
 * SERUM (product 22) — the Bakuchiol story post.
 *
 * Sources:
 *  - Intertek brand deck + formula (bakuchiol 0.1%, niacinamide 2%,
 *    adenosine 0.04%, Peptide 6 names, Lipid Barrier Liposome)
 *  - Dhaliwal et al., British Journal of Dermatology 2019;180:289 —
 *    44 patients, 12 weeks, 0.5% bakuchiol BID vs 0.5% retinol QD
 *  - Draelos et al. 2020 — 60 sensitive-skin women, 1% bakuchiol, 4 weeks
 *  - P&K Skin Research Center product study (skin age index, 2024, n=24)
 *
 * Run: npx tsx --env-file=.env.local scripts/create-bakuchiol-mfs-serum-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'bakuchiol-multi-functional-anti-wrinkle-serum'

const IMG = '/images/multif_serum'

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">For decades, anti-aging skincare had one golden rule: <strong>retinol works — if your skin can survive it</strong>. The redness, the peeling, the weeks of "purging", the strict evening-only ritual, the constant warning that sunlight would break it down. Then dermatologists took a closer look at a seed that Ayurvedic medicine had been using for skin for centuries — and the rule book started to change.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The seed that challenged retinol</h2>
    <img src="${IMG}/s1.jpeg" alt="GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM with Bakuchiol" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Bakuchiol is extracted from the seeds of <em>Psoralea corylifolia</em> — the babchi plant, used for generations in Ayurvedic and traditional Chinese medicine. Chemically it is <strong>not a retinoid at all</strong>. Yet when scientists profiled gene expression in skin cells, bakuchiol switched on a remarkably similar pattern of genes to retinol: collagen support, cell turnover, antioxidant defense. A plant molecule, speaking the skin's own renewal language.</p>
    <p class="text-gray-700 mt-3">The obvious question followed: can it actually compete with retinol on wrinkles — in real people, measured objectively?</p>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">The head-to-head study dermatologists quote</h3>
    <p class="text-gray-700">In a randomized, double-blind trial published in the <strong>British Journal of Dermatology</strong> (Dhaliwal et al., 2019), 44 participants used either <strong>0.5% bakuchiol twice daily</strong> or <strong>0.5% retinol once daily</strong> for 12 weeks, with high-resolution facial imaging at weeks 0, 4, 8 and 12.</p>
    <div class="grid gap-6 sm:grid-cols-2 mt-5">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p class="text-xl font-bold text-primary-600">Wrinkles &amp; pigmentation</p>
        <p class="text-gray-700 mt-2">Both groups significantly improved wrinkle surface area and hyperpigmentation — with <strong>no statistical difference between bakuchiol and retinol</strong>.</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p class="text-xl font-bold text-primary-600">Tolerability</p>
        <p class="text-gray-700 mt-2">The retinol group reported <strong>significantly more scaling and stinging</strong>. Bakuchiol delivered comparable visible results — with a gentler experience.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">Ingredient-level research on bakuchiol vs retinol — the study that put bakuchiol on the dermatology map.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The photostability advantage nobody talks about</h2>
    <p class="text-gray-700 mt-2">Retinol degrades in ultraviolet light — which is why classic retinol lives in opaque tubes and evening routines. Bakuchiol is <strong>photostable</strong>: daylight doesn't break it down. That single property changes the ritual. An anti-wrinkle active you can use <strong>morning and evening</strong>, doubling the contact time your skin gets with the ingredient every single day.</p>
    <img src="${IMG}/s2.jpeg" alt="MULTI FUNCTIONAL ANTI-WRINKLE SERUM texture and dropper" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">And for sensitive skin? A separate 4-week study (Draelos et al., 2020) put bakuchiol on 60 women specifically selected for <strong>sensitive, eczema- or rosacea-prone</strong> skin. Result: significant improvement in smoothness, clarity, radiance and global anti-aging scores — on the very skin types that usually can't tolerate retinol.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">So we built it properly: the MFS formula</h2>
    <p class="text-gray-700 mt-2">GENOSYS <strong>MULTI FUNCTIONAL ANTI-WRINKLE SERUM</strong> (MFS PROFESSIONAL) doesn't just add bakuchiol and stop. It builds a complete anti-aging system around it — four pillars working at once:</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">① FIRMING</p>
        <p class="text-gray-700 text-sm mt-1">Bakuchiol · Anti-aging Peptide 6 · Hydrolyzed Collagen · Hydrolyzed Elastin · Adenosine</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">② ANTIOXIDANT · SOOTHING</p>
        <p class="text-gray-700 text-sm mt-1">Bakuchiol · Propolis extract</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">③ SKIN BARRIER</p>
        <p class="text-gray-700 text-sm mt-1">Lipid Barrier Liposome: Ceramide NP · Cholesterol · Phytosphingosine</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">④ BRIGHTENING</p>
        <p class="text-gray-700 text-sm mt-1">Niacinamide (2%) for tone balance</p>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Inside the bottle — the exact complex</h3>
    <img src="${IMG}/s4.jpeg" alt="MULTI FUNCTIONAL ANTI-WRINKLE SERUM ingredients" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-3 text-gray-700">
      <li><strong>Bakuchiol 0.1%</strong> — the plant-derived retinol alternative: firming, smoothing, antioxidant support.</li>
      <li><strong>Anti-aging Peptide 6</strong> — six targeted peptides: Palmitoyl Tripeptide-5, Dipeptide-2, Palmitoyl Tetrapeptide-7, Palmitoyl Tripeptide-1, Palmitoyl Hexapeptide-12 and Acetyl Hexapeptide-8 — covering collagen support, comfort and the look of expression lines.</li>
      <li><strong>Lipid Barrier Liposome</strong> — Ceramide NP, cholesterol and phytosphingosine, mimicking the skin's own barrier lipids for delivery and comfort.</li>
      <li><strong>ECM support</strong> — Hydrolyzed Collagen and Hydrolyzed Elastin, the building blocks of the skin's extracellular matrix.</li>
      <li><strong>Propolis · Adenosine · Niacinamide</strong> — soothing, firming and brightening co-factors.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Studied on real skin — not just in theory</h2>
    <img src="${IMG}/s3.jpeg" alt="MULTI FUNCTIONAL ANTI-WRINKLE SERUM clinical study" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">The finished formula was evaluated at the <strong>P&amp;K Skin Research Center</strong> in Korea (Feb 22 – May 13, 2024) on <strong>24 women aged 30–59</strong>, tracking the <strong>skin age index</strong> — a composite instrumental measure of visible aging. The study assessed efficacy on <strong>wrinkles and skin tone balance</strong>, and the serum is dermatologically tested.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Bakuchiol vs classic retinol — at a glance</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4"></th>
          <th class="py-3 pr-4">Bakuchiol (MFS)</th>
          <th class="py-3">Classic retinol</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Origin</td><td class="py-3 pr-4">Babchi seed (plant-derived)</td><td class="py-3">Vitamin A derivative</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Mechanism</td><td class="py-3 pr-4">Retinol-like gene expression pattern</td><td class="py-3">Retinoic acid receptor binding</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Photostability</td><td class="py-3 pr-4">Stable in daylight — AM &amp; PM use</td><td class="py-3">Degrades in UV — evening only</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Tolerability</td><td class="py-3 pr-4">Less scaling/stinging in head-to-head study</td><td class="py-3">Famous adjustment period: peeling, redness</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Sensitive skin</td><td class="py-3 pr-4">Studied on sensitive / rosacea-prone skin</td><td class="py-3">Often not tolerated</td></tr>
      </tbody>
    </table>
    <p class="text-sm text-gray-600 mt-3">Retinol remains a proven active — bakuchiol is the route for skin that wants the results without the fight.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The ritual: 2–3 drops, twice a day</h2>
    <img src="${IMG}/s5.jpeg" alt="How to use MULTI FUNCTIONAL ANTI-WRINKLE SERUM" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>①</strong> Cleanse and tone as usual.</li>
      <li><strong>②</strong> Apply 2–3 drops of the serum; pat gently or massage in upward motions.</li>
      <li><strong>③</strong> <strong>Morning and evening</strong> — bakuchiol is photostable, so no evening-only rule. By day, finish with SPF.</li>
      <li><strong>④</strong> Seal it in with the <a href="/products/32" class="text-primary-600 underline">MULTI FUNCTIONAL ANTI-WRINKLE CREAM</a> — the same Bakuchiol line, built to layer.</li>
    </ul>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Retinol results. Plant calm.</h3>
    <p class="text-lg mb-6">MULTI FUNCTIONAL ANTI-WRINKLE SERUM — Bakuchiol + Peptide 6 + Barrier Liposome. 30ml, dermatologically tested, Made in Korea. 330 AED.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/products/22" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">View product</a>
      <a href="/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">Contact us</a>
    </div>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Десятилетиями антивозрастной уход жил по одному золотому правилу: <strong>ретинол работает — если кожа это переживёт</strong>. Покраснения, шелушение, недели «адаптации», строгий ритуал «только на ночь» и постоянное предупреждение, что солнечный свет его разрушает. А затем дерматологи присмотрелись к семени, которое аюрведа использовала для кожи веками — и правила начали меняться.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Семя, бросившее вызов ретинолу</h2>
    <img src="${IMG}/s1.jpeg" alt="GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM с бакучиолом" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Бакучиол добывают из семян <em>Psoralea corylifolia</em> — растения бабчи, поколениями применявшегося в аюрведе и традиционной китайской медицине. Химически это <strong>вообще не ретиноид</strong>. Но когда учёные изучили экспрессию генов в клетках кожи, бакучиол включил удивительно похожий на ретинол паттерн генов: поддержка коллагена, обновление клеток, антиоксидантная защита. Растительная молекула, говорящая с кожей на её собственном языке обновления.</p>
    <p class="text-gray-700 mt-3">Возник очевидный вопрос: может ли он реально конкурировать с ретинолом по морщинам — на живых людях, при объективных измерениях?</p>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Исследование «голова к голове», которое цитируют дерматологи</h3>
    <p class="text-gray-700">В рандомизированном двойном слепом исследовании, опубликованном в <strong>British Journal of Dermatology</strong> (Dhaliwal и соавт., 2019), 44 участника 12 недель применяли либо <strong>0,5% бакучиол дважды в день</strong>, либо <strong>0,5% ретинол раз в день</strong>, с фотографированием высокого разрешения на 0, 4, 8 и 12 неделях.</p>
    <div class="grid gap-6 sm:grid-cols-2 mt-5">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p class="text-xl font-bold text-primary-600">Морщины и пигментация</p>
        <p class="text-gray-700 mt-2">Обе группы достоверно уменьшили площадь морщин и гиперпигментацию — <strong>без статистической разницы между бакучиолом и ретинолом</strong>.</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p class="text-xl font-bold text-primary-600">Переносимость</p>
        <p class="text-gray-700 mt-2">В группе ретинола было <strong>значительно больше шелушения и жжения</strong>. Бакучиол дал сопоставимый видимый результат — с более мягким опытом.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">Исследование на уровне ингредиента (бакучиол против ретинола) — именно оно вывело бакучиол на карту дерматологии.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Фотостабильность — преимущество, о котором мало говорят</h2>
    <p class="text-gray-700 mt-2">Ретинол разрушается под ультрафиолетом — поэтому классический ретинол живёт в непрозрачных тюбиках и вечерних ритуалах. Бакучиол <strong>фотостабилен</strong>: дневной свет его не разрушает. Одно это свойство меняет весь ритуал. Антивозрастной актив, который можно использовать <strong>утром и вечером</strong>, удваивая время контакта кожи с ингредиентом каждый день.</p>
    <img src="${IMG}/s2.jpeg" alt="Текстура и пипетка MULTI FUNCTIONAL ANTI-WRINKLE SERUM" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">А для чувствительной кожи? Отдельное 4-недельное исследование (Draelos и соавт., 2020) тестировало бакучиол на 60 женщинах, специально отобранных с <strong>чувствительной, склонной к экземе или розацеа</strong> кожей. Результат: достоверное улучшение гладкости, чистоты, сияния и глобальных антиэйдж-показателей — именно на тех типах кожи, которые обычно не переносят ретинол.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Поэтому мы сделали всё правильно: формула MFS</h2>
    <p class="text-gray-700 mt-2">GENOSYS <strong>MULTI FUNCTIONAL ANTI-WRINKLE SERUM</strong> (MFS PROFESSIONAL) — не просто бакучиол «и хватит». Вокруг него построена целая антивозрастная система — четыре столпа, работающие одновременно:</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">① УПРУГОСТЬ</p>
        <p class="text-gray-700 text-sm mt-1">Бакучиол · Пептидный комплекс 6 · Гидролизованный коллаген · Гидролизованный эластин · Аденозин</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">② АНТИОКСИДАНТ · УСПОКОЕНИЕ</p>
        <p class="text-gray-700 text-sm mt-1">Бакучиол · Экстракт прополиса</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">③ КОЖНЫЙ БАРЬЕР</p>
        <p class="text-gray-700 text-sm mt-1">Липидная липосома барьера: Церамид NP · Холестерол · Фитосфингозин</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">④ СИЯНИЕ</p>
        <p class="text-gray-700 text-sm mt-1">Ниацинамид (2%) для ровного тона</p>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Внутри флакона — точный комплекс</h3>
    <img src="${IMG}/s4.jpeg" alt="Ингредиенты MULTI FUNCTIONAL ANTI-WRINKLE SERUM" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-3 text-gray-700">
      <li><strong>Бакучиол 0,1%</strong> — растительная альтернатива ретинолу: упругость, гладкость, антиоксидантная поддержка.</li>
      <li><strong>Пептидный комплекс Anti-aging 6</strong> — шесть направленных пептидов: Palmitoyl Tripeptide-5, Dipeptide-2, Palmitoyl Tetrapeptide-7, Palmitoyl Tripeptide-1, Palmitoyl Hexapeptide-12 и Acetyl Hexapeptide-8 — поддержка коллагена, комфорт и вид мимических морщин.</li>
      <li><strong>Липидная липосома барьера</strong> — церамид NP, холестерол и фитосфингозин, имитирующие собственные липиды барьера кожи — для доставки и комфорта.</li>
      <li><strong>Поддержка ECM</strong> — гидролизованный коллаген и эластин, строительные блоки внеклеточного матрикса кожи.</li>
      <li><strong>Прополис · Аденозин · Ниацинамид</strong> — успокаивающие, укрепляющие и осветляющие кофакторы.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Проверено на реальной коже — не только в теории</h2>
    <img src="${IMG}/s3.jpeg" alt="Клиническое исследование MULTI FUNCTIONAL ANTI-WRINKLE SERUM" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Готовая формула оценивалась в <strong>P&amp;K Skin Research Center</strong> (Корея, 22 февраля – 13 мая 2024) на <strong>24 женщинах 30–59 лет</strong> с отслеживанием <strong>индекса возраста кожи</strong> — комплексного инструментального измерения видимых признаков старения. Исследование оценивало эффективность по <strong>морщинам и ровности тона кожи</strong>; сыворотка прошла дерматологическое тестирование.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Бакучиол против классического ретинола — коротко</h2>
    <table class="w-full text-left border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pr-4"></th>
          <th class="py-3 pr-4">Бакучиол (MFS)</th>
          <th class="py-3">Классический ретинол</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Происхождение</td><td class="py-3 pr-4">Семена бабчи (растительное)</td><td class="py-3">Производное витамина A</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Механизм</td><td class="py-3 pr-4">Ретинолоподобный паттерн экспрессии генов</td><td class="py-3">Связывание с рецепторами ретиноевой кислоты</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Фотостабильность</td><td class="py-3 pr-4">Стабилен при дневном свете — утром и вечером</td><td class="py-3">Разрушается под УФ — только вечер</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Переносимость</td><td class="py-3 pr-4">Меньше шелушения/жжения в прямом сравнении</td><td class="py-3">Знаменитый период адаптации: пилинг, покраснения</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Чувствительная кожа</td><td class="py-3 pr-4">Изучался на чувствительной / склонной к розацеа коже</td><td class="py-3">Часто не переносится</td></tr>
      </tbody>
    </table>
    <p class="text-sm text-gray-600 mt-3">Ретинол остаётся доказанным активом — бакучиол это путь для кожи, которая хочет результат без борьбы.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Ритуал: 2–3 капли, дважды в день</h2>
    <img src="${IMG}/s5.jpeg" alt="Как использовать MULTI FUNCTIONAL ANTI-WRINKLE SERUM" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>①</strong> Очистите кожу и нанесите тонер как обычно.</li>
      <li><strong>②</strong> Нанесите 2–3 капли сыворотки; мягко похлопайте или помассируйте восходящими движениями.</li>
      <li><strong>③</strong> <strong>Утром и вечером</strong> — бакучиол фотостабилен, правило «только на ночь» не нужно. Днём завершайте SPF.</li>
      <li><strong>④</strong> Закрепите результат <a href="/ru/products/32" class="text-primary-600 underline">MULTI FUNCTIONAL ANTI-WRINKLE CREAM</a> — той же линией с бакучиолом, созданной для наслаивания.</li>
    </ul>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Результат ретинола. Спокойствие растения.</h3>
    <p class="text-lg mb-6">MULTI FUNCTIONAL ANTI-WRINKLE SERUM — бакучиол + Пептид 6 + барьерная липосома. 30 мл, дерматологически протестировано, сделано в Корее. 330 AED.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ru/products/22" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">К товару</a>
      <a href="/ru/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">Связаться с нами</a>
    </div>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">لعقود، كانت العناية المضادة للشيخوخة تحكمها قاعدة ذهبية واحدة: <strong>الريتينول فعّال — إن تحمّلته بشرتك</strong>. الاحمرار، التقشّر، أسابيع "التكيّف"، طقوس "المساء فقط" الصارمة، والتحذير الدائم من أن ضوء الشمس يُفكّكه. ثم بدأ أطباء الجلد ينظرون عن قرب إلى بذرة استخدمها الطب الأيورفيدي للبشرة منذ قرون — وبدأت القواعد تتغيّر.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">البذرة التي تحدّت الريتينول</h2>
    <img src="${IMG}/s1.jpeg" alt="سيروم GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE مع الباكوتشيول" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">يُستخلص الباكوتشيول من بذور نبات <em>Psoralea corylifolia</em> — نبتة البابشي التي استُخدمت لأجيال في الأيورفيدا والطب الصيني التقليدي. كيميائياً، هو <strong>ليس ريتينويداً إطلاقاً</strong>. ومع ذلك، عندما درس العلماء التعبير الجيني في خلايا الجلد، أظهر الباكوتشيول نمطاً مشابهاً بشكل لافت للريتينول: دعم الكولاجين، تجدد الخلايا، والدفاع المضاد للأكسدة. جزيء نباتي يتحدث لغة التجدد الخاصة بالبشرة.</p>
    <p class="text-gray-700 mt-3">وطرح ذلك السؤال البديهي: هل يستطيع فعلاً منافسة الريتينول على التجاعيد — على أشخاص حقيقيين وبقياسات موضوعية؟</p>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">الدراسة وجهاً لوجه التي يستشهد بها أطباء الجلد</h3>
    <p class="text-gray-700">في تجربة عشوائية مزدوجة التعمية نُشرت في <strong>British Journal of Dermatology</strong> (داليوال وزملاؤه، 2019)، استخدم 44 مشاركاً إما <strong>باكوتشيول 0.5% مرتين يومياً</strong> أو <strong>ريتينول 0.5% مرة يومياً</strong> لمدة 12 أسبوعاً، مع تصوير وجه عالي الدقة في الأسابيع 0 و4 و8 و12.</p>
    <div class="grid gap-6 sm:grid-cols-2 mt-5">
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p class="text-xl font-bold text-primary-600">التجاعيد والتصبغ</p>
        <p class="text-gray-700 mt-2">تحسّنت مجموعتا باكوتشيول وريتينول بشكل ملحوظ في مساحة سطح التجاعيد وفرط التصبغ — <strong>من دون فرق إحصائي بين المركّبين</strong>.</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p class="text-xl font-bold text-primary-600">التحمّل</p>
        <p class="text-gray-700 mt-2">أبلغت مجموعة الريتينول عن <strong>تقشّر ووخز أكبر بشكل ملحوظ</strong>. قدّم الباكوتشيول نتائج مرئية مماثلة — بتجربة ألطف.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">بحث على مستوى المكوّن (الباكوتشيول مقابل الريتينول) — الدراسة التي وضعت الباكوتشيول على خريطة طب الجلد.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ميزة الثبات الضوئي التي لا يتحدث عنها أحد</h2>
    <p class="text-gray-700 mt-2">الريتينول يتحلّل بالأشعة فوق البنفسجية — ولهذا يعيش الريتينول الكلاسيكي في أنابيب معتمة وطقوس مسائية. أما الباكوتشيول فهو <strong>ثابت ضوئياً</strong>: ضوء النهار لا يُفكّكه. هذه الخاصية وحدها تغيّر الطقوس بالكامل. مكوّن مضاد للتجاعيد يمكن استخدامه <strong>صباحاً ومساءً</strong>، ما يضاعف وقت ملامسته لبشرتك كل يوم.</p>
    <img src="${IMG}/s2.jpeg" alt="قوام وقطّارة سيروم MULTI FUNCTIONAL ANTI-WRINKLE" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">وماذا عن البشرة الحساسة؟ دراسة منفصلة لمدة 4 أسابيع (درايلوس وزملاؤه، 2020) اختبرت الباكوتشيول على 60 امرأة مختارات خصيصاً ببشرة <strong>حساسة أو معرّضة للإكزيما أو الوردية</strong>. النتيجة: تحسّن ملحوظ في النعومة والصفاء والإشراق ومؤشرات مكافحة الشيخوخة الشاملة — على أنواع البشرة ذاتها التي عادة لا تتحمّل الريتينول.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">لذا بنيناها كما يجب: تركيبة MFS</h2>
    <p class="text-gray-700 mt-2">سيروم GENOSYS <strong>MULTI FUNCTIONAL ANTI-WRINKLE</strong> (MFS PROFESSIONAL) لا يكتفي بإضافة الباكوتشيول. بل يبني حوله نظاماً متكاملاً لمكافحة الشيخوخة — أربع ركائز تعمل في آن واحد:</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">① الشدّ والتماسك</p>
        <p class="text-gray-700 text-sm mt-1">باكوتشيول · مركّب الببتيدات الستة · كولاجين متحلّل · إيلاستين متحلّل · أدينوزين</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">② مضاد أكسدة · مهدئ</p>
        <p class="text-gray-700 text-sm mt-1">باكوتشيول · خلاصة البروبوليس</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">③ حاجز البشرة</p>
        <p class="text-gray-700 text-sm mt-1">ليبوزوم دهون الحاجز: سيراميد NP · كوليسترول · فيتوسفينغوزين</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <p class="font-bold text-primary-600">④ الإشراق</p>
        <p class="text-gray-700 text-sm mt-1">نياسيناميد (2%) لتوحيد اللون</p>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-br from-rose-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">داخل الزجاجة — المركّب الدقيق</h3>
    <img src="${IMG}/s4.jpeg" alt="مكوّنات سيروم MULTI FUNCTIONAL ANTI-WRINKLE" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-3 text-gray-700">
      <li><strong>باكوتشيول 0.1%</strong> — البديل النباتي للريتينول: شدّ، تنعيم، دعم مضاد للأكسدة.</li>
      <li><strong>مركّب الببتيدات الستة المضاد للشيخوخة</strong> — ستة ببتيدات موجّهة: Palmitoyl Tripeptide-5 وDipeptide-2 وPalmitoyl Tetrapeptide-7 وPalmitoyl Tripeptide-1 وPalmitoyl Hexapeptide-12 وAcetyl Hexapeptide-8 — لدعم الكولاجين والراحة ومظهر خطوط التعبير.</li>
      <li><strong>ليبوزوم دهون الحاجز</strong> — سيراميد NP وكوليسترول وفيتوسفينغوزين، تحاكي دهون حاجز البشرة الطبيعية للتوصيل والراحة.</li>
      <li><strong>دعم ECM</strong> — كولاجين وإيلاستين متحلّلان، اللبنات الأساسية للمصفوفة خارج الخلوية للبشرة.</li>
      <li><strong>بروبوليس · أدينوزين · نياسيناميد</strong> — عوامل مساعدة مهدئة وشادّة ومشرقة.</li>
    </ul>
  </div>

  <div>
    <h2 class="text-3xl font-bold">مُختبَر على بشرة حقيقية — لا في النظرية فقط</h2>
    <img src="${IMG}/s3.jpeg" alt="الدراسة السريرية لسيروم MULTI FUNCTIONAL ANTI-WRINKLE" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">خضعت التركيبة النهائية للتقييم في <strong>مركز P&amp;K Skin Research Center</strong> في كوريا (22 فبراير – 13 مايو 2024) على <strong>24 امرأة بعمر 30–59 عاماً</strong> مع تتبّع <strong>مؤشر عمر البشرة</strong> — قياس جهازي مركّب لعلامات التقدم المرئية في السن. قيّمت الدراسة الفعالية على <strong>التجاعيد وتوازن لون البشرة</strong>، والسيروم مُختبَر جلدياً.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الباكوتشيول مقابل الريتينول الكلاسيكي — بنظرة سريعة</h2>
    <table class="w-full text-right border-collapse mt-4">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="py-3 pl-4"></th>
          <th class="py-3 pl-4">الباكوتشيول (MFS)</th>
          <th class="py-3">الريتينول الكلاسيكي</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">المصدر</td><td class="py-3 pl-4">بذور البابشي (نباتي)</td><td class="py-3">مشتق من فيتامين A</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الآلية</td><td class="py-3 pl-4">نمط تعبير جيني مشابه للريتينول</td><td class="py-3">ارتباط بمستقبلات حمض الريتينويك</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الثبات الضوئي</td><td class="py-3 pl-4">ثابت في ضوء النهار — صباحاً ومساءً</td><td class="py-3">يتحلّل بالأشعة فوق البنفسجية — مساءً فقط</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">التحمّل</td><td class="py-3 pl-4">تقشّر ووخز أقل في المقارنة المباشرة</td><td class="py-3">فترة تكيّف معروفة: تقشير واحمرار</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">البشرة الحساسة</td><td class="py-3 pl-4">دُرِس على بشرة حساسة / معرّضة للوردية</td><td class="py-3">غالباً لا يُتحمَّل</td></tr>
      </tbody>
    </table>
    <p class="text-sm text-gray-600 mt-3">يبقى الريتينول مكوّناً مُثبتاً — والباكوتشيول هو الطريق لمن تريد النتائج من دون المعاناة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الطقوس: 2–3 قطرات، مرتين يومياً</h2>
    <img src="${IMG}/s5.jpeg" alt="طريقة استخدام سيروم MULTI FUNCTIONAL ANTI-WRINKLE" class="w-full h-auto rounded-2xl my-5" />
    <ul class="space-y-2 text-gray-700">
      <li><strong>①</strong> نظّفي بشرتك وضعي التونر كالمعتاد.</li>
      <li><strong>②</strong> ضعي 2–3 قطرات من السيروم؛ ربّتي بلطف أو دلّكي بحركات تصاعدية.</li>
      <li><strong>③</strong> <strong>صباحاً ومساءً</strong> — الباكوتشيول ثابت ضوئياً، فلا حاجة لقاعدة "المساء فقط". نهاراً، أنهي بعامل حماية شمسية SPF.</li>
      <li><strong>④</strong> ختمي النتيجة بـ<a href="/ar/products/32" class="text-primary-600 underline">كريم MULTI FUNCTIONAL ANTI-WRINKLE</a> — من خط الباكوتشيول نفسه، مصمّم للدمج مع السيروم.</li>
    </ul>
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">نتائج الريتينول. هدوء النبتة.</h3>
    <p class="text-lg mb-6">سيروم MULTI FUNCTIONAL ANTI-WRINKLE — باكوتشيول + الببتيدات الستة + ليبوزوم الحاجز. 30 مل، مُختبَر جلدياً، صنع في كوريا. 330 درهم.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ar/products/22" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">عرض المنتج</a>
      <a href="/ar/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">تواصلي معنا</a>
    </div>
  </div>
</div>`

async function main() {
  const data = {
    title: 'The Seed That Challenged Retinol: Inside the Bakuchiol MULTI FUNCTIONAL ANTI-WRINKLE SERUM',
    slug: SLUG,
    excerpt:
      'A plant used in Ayurveda for centuries went head-to-head with retinol in a double-blind dermatology trial — and matched it on wrinkles, with less irritation. Meet the GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM: Bakuchiol + six peptides + barrier liposome, photostable for AM & PM use.',
    content: contentEn,
    featuredImage: `${IMG}/main.jpeg`,
    titleRu: 'Семя, бросившее вызов ретинолу: бакучиол в сыворотке MULTI FUNCTIONAL ANTI-WRINKLE',
    excerptRu:
      'Растение, веками применявшееся в аюрведе, в двойном слепом дерматологическом исследовании сравнялось с ретинолом по морщинам — с меньшим раздражением. Знакомьтесь: GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE SERUM — бакучиол + шесть пептидов + барьерная липосома, фотостабильная для утра и вечера.',
    contentRu,
    titleAr: 'البذرة التي تحدّت الريتينول: داخل سيروم MULTI FUNCTIONAL ANTI-WRINKLE بالباكوتشيول',
    excerptAr:
      'نبتة استخدمتها الأيورفيدا لقرون تساوت مع الريتينول على التجاعيد في تجربة جلدية مزدوجة التعمية — وبتهيّج أقل. تعرّفي على سيروم GENOSYS MULTI FUNCTIONAL ANTI-WRINKLE: باكوتشيول + ستة ببتيدات + ليبوزوم الحاجز، ثابت ضوئياً للاستخدام صباحاً ومساءً.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'bakuchiol',
      'retinol-alternative',
      'anti-wrinkle',
      'peptides',
      'anti-aging',
      'serum',
      'korean-skincare',
      'clinical-study',
    ]),
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } })
  if (existing) {
    // Preserve the original publish date on content updates so the post
    // keeps its place in the blog timeline (newest-first ordering).
    const { publishedAt: _ignored, ...updateData } = data
    const updated = await prisma.blogPost.update({ where: { slug: SLUG }, data: updateData })
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
