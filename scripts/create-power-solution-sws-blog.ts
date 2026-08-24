/**
 * Creates (or updates) the POWER SOLUTION SWS blog post.
 *
 * Every figure here is taken from the same four documents the product page is
 * sourced from, listed in the header of components/product/powersolution/swsCopy.ts:
 * the DTS MG Formula_up sheet, the carton artwork, the safety assessment and the
 * COA. The 2011 Quali-quanti sheet is superseded and is not used.
 *
 * The deliberate omissions in that header apply here too. In particular the
 * sh-Polypeptide-7 mechanism wording (tissue repair, cell production,
 * regeneration) is drug-register language and stays out of the body copy, even
 * though the slide carries it.
 *
 * Run: npx tsx --env-file=.env.local scripts/create-power-solution-sws-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'power-solution-sws-arbutin-2-percent'

const IMG_HERO = '/images/sws_0/Main.jpeg'
const IMG_CONCERN = '/images/sws_0/S4.jpeg'
const IMG_VIAL = '/images/sws_0/S2.jpeg'
const IMG_ARBUTIN = '/images/sws_0/S5.jpeg'
const IMG_PEPTIDE = '/images/sws_0/S9.jpeg'
const IMG_BASE = '/images/sws_0/S6.jpeg'
const IMG_FORMAT = '/images/sws_0/S3.jpeg'
const IMG_BOX = '/images/sws_0/S1.jpeg'
const IMG_FREE = '/images/sws_0/S7.jpeg'
const IMG_HOW = '/images/sws_0/S8.jpeg'
const IMG_CLOSING = '/images/sws_0/Closing.jpeg'

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Every vial in the GENOSYS <strong>Power Solution</strong> range wears a three-letter code, and each code is a registered product name with a single job printed beside it. <strong>SWS is Skin Depigmenting &amp; Whitening Solution</strong> — the one you reach for when the face in front of you is uneven. Arbutin at a full <strong>2%</strong>, in a sealed 2 ml glass vial, ten to a box.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The concern</h2>
    <img src="${IMG_CONCERN}" alt="POWER SOLUTION SWS — pigmentation and uneven tone" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Pigmentation rarely arrives on its own. It comes with a tone that has stopped being even, a surface that has stopped catching light the way it used to, and patches that make-up covers rather than fixes. That is the complaint SWS is built for, and it is the only one it claims.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The vial for pigment</h2>
    <img src="${IMG_VIAL}" alt="POWER SOLUTION SWS — the vial for pigment" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Korea licenses SWS as a <strong>whitening functional cosmetic</strong> and names arbutin as its principal ingredient. The carton says the result in one line: helps improve pigmentation, even skin tone and brighten the skin surface. That is the whole brief.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Arbutin at 2%</h2>
    <img src="${IMG_ARBUTIN}" alt="POWER SOLUTION SWS — 2% arbutin" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Two percent is a full working dose, not a sprinkle for the ingredient list, and every batch is tested against that declaration before it leaves Korea. Kojic acid is in there too, at 0.05%, and licorice root extract at 0.001%. Both are named because they are on the carton. Neither is the engine. <strong>Arbutin at 2% is why this vial exists.</strong></p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">sh-Polypeptide-7, the signature of the range</h2>
    <img src="${IMG_PEPTIDE}" alt="POWER SOLUTION SWS — sh-Polypeptide-7" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Every Power Solution vial carries it, and here it sits at <strong>6.6 ppm</strong>. It is a single-chain recombinant human peptide grown by fermentation from a synthesised copy of the human gene that codes for somatotropin, which is what makes every batch arrive with the same 217-amino-acid sequence rather than something that varies with the harvest. Palmitoyl tripeptide-1 sits alongside it at 0.5 ppm.</p>
  </div>

  <div class="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">17.71% humectant base</h3>
    <img src="${IMG_BASE}" alt="POWER SOLUTION SWS — 17.71% humectant base" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Butylene glycol at <strong>10.224%</strong> and glycerin at <strong>7.486%</strong>, which is <strong>17.71%</strong> of the vial holding water where you put it. Sodium hyaluronate adds another 0.2002%, safflower flower extract 0.15%, allantoin 0.05% and adenosine 0.04%. None of that is the reason to buy it. It is the reason a full 2 ml stays comfortable on skin that has just been treated.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">One vial. One treatment.</h2>
    <div class="grid gap-6 md:grid-cols-2 mt-5">
      <img src="${IMG_FORMAT}" alt="POWER SOLUTION SWS — 2 ml sealed in glass, ten vials per box" class="w-full h-auto rounded-2xl" />
      <img src="${IMG_BOX}" alt="POWER SOLUTION SWS — ten sealed vials in the box" class="w-full h-auto rounded-2xl" />
    </div>
    <p class="text-gray-700 mt-5">Two millilitres, sealed in glass under a crimped cap and opened at the chair. Nothing is decanted, nothing is kept, and nothing oxidises between one face and the next. Ten vials are ten full doses. Unopened the box holds three years, with the expiry date printed on it.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">5-Free</h2>
    <img src="${IMG_FREE}" alt="POWER SOLUTION SWS — 5-Free formulation" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Formulated without parabens, ethanol, artificial pigment, artificial fragrance or artificial surfactant. The five exclusions are named on the box rather than implied, and they matter more here than in a cream: this is a leave-on solution going onto skin that has just been worked on.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">How to use it</h2>
    <img src="${IMG_HOW}" alt="POWER SOLUTION SWS — cleanse, open, apply, absorb" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">The carton gives four steps and no more: <strong>cleanse</strong> the face, <strong>open</strong> one vial, <strong>apply</strong> the solution, let it <strong>absorb</strong>. It is a leave-on solution, so it is not rinsed off. Keep it away from the eyes. If a practitioner has set you a protocol, follow theirs rather than ours.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Specification</h2>
    <table class="w-full text-left border-collapse mt-4">
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Format</td><td class="py-3">Leave-on solution in a sealed 2 ml glass vial</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Pack</td><td class="py-3">2 ml × 10 vials</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Function</td><td class="py-3">Skin depigmenting and whitening, the function registered in Korea</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Principal ingredient</td><td class="py-3">Arbutin 2%</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Base</td><td class="py-3">Butylene glycol 10.224% and glycerin 7.486%, 17.71% together</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">pH</td><td class="py-3">7.72, inside an 8.00 ± 1.00 specification</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Appearance</td><td class="py-3">Light yellow viscous liquid</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Free from</td><td class="py-3">Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Shelf life</td><td class="py-3">Three years unopened, with the expiry date on the box</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Made by</td><td class="py-3">DTS MG Co., Ltd., South Korea</td></tr>
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Which of the six?</h2>
    <p class="text-gray-700 mt-3">Match the vial to the complaint rather than to the marketing:</p>
    <ul class="space-y-2 text-gray-700 mt-3">
      <li><strong>SWS</strong> — pigmentation and uneven tone.</li>
      <li><strong>CVS</strong> — tired, dull skin that needs reviving.</li>
      <li><strong>HES</strong> — dehydrated and flat, wanting volume back.</li>
      <li><strong>AWS</strong> — lines and loss of firmness.</li>
      <li><strong>CTS</strong> — rough or slack texture.</li>
      <li><strong>PCS</strong> — oil and breakouts.</li>
    </ul>
  </div>

  <div class="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
    <h3 class="text-xl font-semibold mb-3">Before you buy</h3>
    <p class="text-gray-700">For external use only, and away from the eyes and mucous membranes. The carton asks you to avoid it during pregnancy and lactation, so we pass that on rather than talk you out of it. It is not fragrance-free: hinoki cypress water is in the formula, listed as a fragrance ingredient. Stop and speak to a doctor if redness, swelling, small bumps or irritation occurs.</p>
  </div>

  <div>
    <img src="${IMG_CLOSING}" alt="POWER SOLUTION SWS — 2 ml per vial, 10 vials per box, dermatologically tested, made in Korea" class="w-full h-auto rounded-2xl my-5" />
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Ten treatments, sealed one at a time</h3>
    <p class="text-lg mb-6">POWER SOLUTION SWS — 2 ml × 10 vials, 580 AED. Official GENOSYS distributor in the UAE.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/products/8" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">View product</a>
      <a href="/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">Contact us</a>
    </div>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">У каждого флакона линии GENOSYS <strong>Power Solution</strong> есть код из трёх букв, и каждый код — это зарегистрированное название с одной задачей, напечатанной рядом. <strong>SWS — это Skin Depigmenting &amp; Whitening Solution</strong>, тот самый флакон, за которым тянешься, когда тон лица перестал быть ровным. Арбутин в полных <strong>2%</strong>, в запаянной стеклянной ампуле 2 мл, по десять в коробке.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Проблема</h2>
    <img src="${IMG_CONCERN}" alt="POWER SOLUTION SWS — пигментация и неровный тон" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Пигментация редко приходит одна. Вместе с ней тон перестаёт быть ровным, кожа иначе отражает свет, а пятна тональный крем скорее прячет, чем убирает. Именно для этого сделан SWS — и больше он ничего не обещает.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Флакон для пигмента</h2>
    <img src="${IMG_VIAL}" alt="POWER SOLUTION SWS — флакон для пигмента" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Корея регистрирует SWS как <strong>функциональное отбеливающее косметическое средство</strong> и называет арбутин его главным компонентом. На коробке результат сформулирован одной строкой: помогает уменьшить пигментацию, выровнять тон и придать коже сияние. Это всё техническое задание целиком.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Арбутин 2%</h2>
    <img src="${IMG_ARBUTIN}" alt="POWER SOLUTION SWS — арбутин 2%" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Два процента — полная рабочая доза, а не щепотка ради списка ингредиентов, и каждая партия проверяется на соответствие этой цифре перед отправкой из Кореи. Койевая кислота здесь тоже есть — 0,05%, экстракт корня солодки — 0,001%. Оба названы, потому что они на коробке. Но двигатель не они. <strong>Флакон существует ради арбутина в 2%.</strong></p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">sh-Polypeptide-7 — подпись всей линии</h2>
    <img src="${IMG_PEPTIDE}" alt="POWER SOLUTION SWS — sh-Polypeptide-7" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Он есть в каждом флаконе Power Solution, здесь — <strong>6,6 ppm</strong>. Это одноцепочечный рекомбинантный человеческий пептид, полученный ферментацией из синтезированной копии человеческого гена соматотропина: поэтому каждая партия приходит с одной и той же последовательностью из 217 аминокислот, а не с той, что зависит от урожая. Рядом с ним — пальмитоил трипептид-1 в дозе 0,5 ppm.</p>
  </div>

  <div class="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">Увлажняющая база 17,71%</h3>
    <img src="${IMG_BASE}" alt="POWER SOLUTION SWS — увлажняющая база 17,71%" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Бутиленгликоль <strong>10,224%</strong> и глицерин <strong>7,486%</strong> — вместе <strong>17,71%</strong> флакона, которые удерживают влагу там, куда вы её нанесли. Гиалуронат натрия добавляет ещё 0,2002%, экстракт цветков сафлора — 0,15%, аллантоин — 0,05%, аденозин — 0,04%. Покупают средство не ради этого. Но именно поэтому полные 2 мл комфортно ложатся на кожу сразу после процедуры.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Один флакон — одна процедура</h2>
    <div class="grid gap-6 md:grid-cols-2 mt-5">
      <img src="${IMG_FORMAT}" alt="POWER SOLUTION SWS — 2 мл в запаянном стекле, десять ампул в коробке" class="w-full h-auto rounded-2xl" />
      <img src="${IMG_BOX}" alt="POWER SOLUTION SWS — десять запаянных ампул в коробке" class="w-full h-auto rounded-2xl" />
    </div>
    <p class="text-gray-700 mt-5">Два миллилитра, запаянные в стекле под обжимной крышкой и вскрываемые прямо в кабинете. Ничего не переливается, ничего не хранится, ничего не окисляется между одним лицом и следующим. Десять ампул — это десять полных доз. Нераспечатанная коробка хранится три года, срок годности напечатан на ней.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">5-Free</h2>
    <img src="${IMG_FREE}" alt="POWER SOLUTION SWS — формула 5-Free" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Без парабенов, этанола, искусственных красителей, искусственных отдушек и искусственных ПАВ. Пять исключений названы на коробке, а не подразумеваются, и здесь они важнее, чем в креме: это несмываемый концентрат, который наносится на кожу сразу после работы с ней.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Как применять</h2>
    <img src="${IMG_HOW}" alt="POWER SOLUTION SWS — очистить, вскрыть, нанести, дать впитаться" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">Коробка даёт четыре шага и ни одного лишнего: <strong>очистить</strong> лицо, <strong>вскрыть</strong> одну ампулу, <strong>нанести</strong> раствор и дать ему <strong>впитаться</strong>. Средство несмываемое. Избегайте попадания в глаза. Если специалист составил вам протокол, следуйте его протоколу, а не нашему.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Характеристики</h2>
    <table class="w-full text-left border-collapse mt-4">
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Формат</td><td class="py-3">Несмываемый раствор в запаянной стеклянной ампуле 2 мл</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Упаковка</td><td class="py-3">2 мл × 10 ампул</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Назначение</td><td class="py-3">Уменьшение пигментации и осветление — функция, зарегистрированная в Корее</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Главный компонент</td><td class="py-3">Арбутин 2%</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">База</td><td class="py-3">Бутиленгликоль 10,224% и глицерин 7,486%, вместе 17,71%</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">pH</td><td class="py-3">7,72, в пределах спецификации 8,00 ± 1,00</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Внешний вид</td><td class="py-3">Светло-жёлтая вязкая жидкость</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Без</td><td class="py-3">Парабенов, этанола, искусственных красителей, отдушек и ПАВ</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Срок хранения</td><td class="py-3">Три года в закрытой упаковке, дата окончания на коробке</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pr-4 font-medium">Производитель</td><td class="py-3">DTS MG Co., Ltd., Южная Корея</td></tr>
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Какой из шести выбрать?</h2>
    <p class="text-gray-700 mt-3">Подбирайте флакон под жалобу, а не под маркетинг:</p>
    <ul class="space-y-2 text-gray-700 mt-3">
      <li><strong>SWS</strong> — пигментация и неровный тон.</li>
      <li><strong>CVS</strong> — уставшая, тусклая кожа.</li>
      <li><strong>HES</strong> — обезвоженность и потеря объёма.</li>
      <li><strong>AWS</strong> — морщины и потеря упругости.</li>
      <li><strong>CTS</strong> — неровная текстура и дряблость.</li>
      <li><strong>PCS</strong> — жирность и высыпания.</li>
    </ul>
  </div>

  <div class="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
    <h3 class="text-xl font-semibold mb-3">Перед покупкой</h3>
    <p class="text-gray-700">Только для наружного применения, избегая глаз и слизистых. Коробка просит не использовать средство при беременности и грудном вскармливании — мы передаём это как есть, а не отговариваем. Средство не является безотдушечным: в формуле есть вода хиноки, указанная как ароматический компонент. При покраснении, отёке, мелких высыпаниях или раздражении прекратите использование и обратитесь к врачу.</p>
  </div>

  <div>
    <img src="${IMG_CLOSING}" alt="POWER SOLUTION SWS — 2 мл в ампуле, 10 ампул в коробке, дерматологически протестировано, сделано в Корее" class="w-full h-auto rounded-2xl my-5" />
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">Десять процедур, каждая запаяна отдельно</h3>
    <p class="text-lg mb-6">POWER SOLUTION SWS — 2 мл × 10 ампул, 580 AED. Официальный дистрибьютор GENOSYS в ОАЭ.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ru/products/8" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">К товару</a>
      <a href="/ru/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">Связаться с нами</a>
    </div>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">كل قارورة في مجموعة <strong>Power Solution</strong> من GENOSYS تحمل رمزاً من ثلاثة أحرف، وكل رمز اسم منتج مسجّل بمهمة واحدة مطبوعة بجانبه. <strong>SWS هي Skin Depigmenting &amp; Whitening Solution</strong> — القارورة التي تمتدّ إليها يدك حين يكون التفاوت هو المشكلة. أربوتين بنسبة <strong>2%</strong> كاملة، في قارورة زجاجية مُحكمة سعة 2 مل، عشر قوارير في العلبة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">المشكلة</h2>
    <img src="${IMG_CONCERN}" alt="POWER SOLUTION SWS — التصبّغ وتفاوت اللون" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">نادراً ما يأتي التصبّغ وحده. يأتي معه لون فقد تجانسه، وسطح لم يعد يعكس الضوء كما كان، وبقع يغطّيها المكياج ولا يعالجها. هذه هي الحالة التي صُنعت لها SWS، وهي كل ما تدّعيه.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">قارورة التصبّغ</h2>
    <img src="${IMG_VIAL}" alt="POWER SOLUTION SWS — قارورة التصبّغ" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">تُرخّص كوريا SWS بوصفها <strong>مستحضر تجميل وظيفياً للتفتيح</strong> وتسمّي الأربوتين مكوّنها الرئيسي. تقول العلبة النتيجة في سطر واحد: يساعد على تحسين التصبّغ وتوحيد اللون وإضاءة سطح البشرة. هذا هو المطلوب كاملاً.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">أربوتين 2%</h2>
    <img src="${IMG_ARBUTIN}" alt="POWER SOLUTION SWS — أربوتين 2%" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">اثنان بالمئة جرعة عمل كاملة، لا رشّة من أجل قائمة المكوّنات، وكل دفعة تُختبر مقابل هذا الإعلان قبل مغادرتها كوريا. حمض الكوجيك موجود أيضاً بنسبة 0.05%، وخلاصة جذر عرق السوس بنسبة 0.001%. كلاهما مذكور لأنه على العلبة، ولا أحد منهما هو المحرّك. <strong>الأربوتين بنسبة 2% هو سبب وجود هذه القارورة.</strong></p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">sh-Polypeptide-7، توقيع المجموعة</h2>
    <img src="${IMG_PEPTIDE}" alt="POWER SOLUTION SWS — sh-Polypeptide-7" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">يوجد في كل قارورة من Power Solution، وهنا بنسبة <strong>6.6 جزء في المليون</strong>. وهو ببتيد بشري مُأشِب أحادي السلسلة يُنتَج بالتخمير من نسخة مُصنَّعة من الجين البشري المسؤول عن السوماتوتروبين، ولهذا تصل كل دفعة بالتسلسل نفسه المكوّن من 217 حمضاً أمينياً بدل تسلسل يتغيّر مع الموسم. ويرافقه بالميتويل ثلاثي الببتيد-1 بنسبة 0.5 جزء في المليون.</p>
  </div>

  <div class="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl">
    <h3 class="text-2xl font-semibold mb-3">قاعدة مرطِّبة 17.71%</h3>
    <img src="${IMG_BASE}" alt="POWER SOLUTION SWS — قاعدة مرطِّبة 17.71%" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">بيوتيلين جلايكول <strong>10.224%</strong> وجليسرين <strong>7.486%</strong>، أي <strong>17.71%</strong> من القارورة تحتفظ بالماء حيث وضعتِه. ويضيف هيالورونات الصوديوم 0.2002%، وخلاصة زهرة القرطم 0.15%، والألانتوين 0.05%، والأدينوزين 0.04%. لا شيء من هذا سبب الشراء، لكنه سبب بقاء 2 مل كاملة مريحة على بشرة خرجت لتوّها من جلسة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">قارورة واحدة. جلسة واحدة.</h2>
    <div class="grid gap-6 md:grid-cols-2 mt-5">
      <img src="${IMG_FORMAT}" alt="POWER SOLUTION SWS — 2 مل في زجاج مُحكم، عشر قوارير في العلبة" class="w-full h-auto rounded-2xl" />
      <img src="${IMG_BOX}" alt="POWER SOLUTION SWS — عشر قوارير مُحكمة داخل العلبة" class="w-full h-auto rounded-2xl" />
    </div>
    <p class="text-gray-700 mt-5">ملّيلتران، مُحكمان في زجاج تحت غطاء مكبوس، يُفتحان عند الكرسي. لا شيء يُنقَل، ولا شيء يُحفَظ، ولا شيء يتأكسد بين وجه وآخر. عشر قوارير هي عشر جرعات كاملة. تبقى العلبة غير المفتوحة ثلاث سنوات، وتاريخ انتهاء الصلاحية مطبوع عليها.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">تركيبة 5-Free</h2>
    <img src="${IMG_FREE}" alt="POWER SOLUTION SWS — تركيبة 5-Free" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">بلا بارابين، بلا إيثانول، بلا أصباغ صناعية، بلا عطور صناعية، وبلا مواد خافضة للتوتر السطحي صناعية. الاستثناءات الخمسة مسمّاة على العلبة لا مُلمَّح إليها، وهي هنا أهم منها في كريم: هذا محلول يبقى على بشرة عُمل عليها للتوّ.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">طريقة الاستخدام</h2>
    <img src="${IMG_HOW}" alt="POWER SOLUTION SWS — نظّفي، افتحي، وزّعي، اتركيه يُمتَص" class="w-full h-auto rounded-2xl my-5" />
    <p class="text-gray-700">تعطي العلبة أربع خطوات لا أكثر: <strong>نظّفي</strong> الوجه، <strong>افتحي</strong> قارورة واحدة، <strong>وزّعي</strong> المحلول، واتركيه <strong>يُمتَص</strong>. المحلول يبقى على البشرة ولا يُغسل. أبعديه عن العينين. وإذا وضع لك الممارس بروتوكولاً، فاتّبعي بروتوكوله لا بروتوكولنا.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">المواصفات</h2>
    <table class="w-full text-right border-collapse mt-4">
      <tbody>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الشكل</td><td class="py-3">محلول يبقى على البشرة في قارورة زجاجية مُحكمة سعة 2 مل</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">العبوة</td><td class="py-3">2 مل × 10 قوارير</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الوظيفة</td><td class="py-3">تفتيح البشرة وتقليل التصبّغ، الوظيفة المسجّلة في كوريا</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">المكوّن الرئيسي</td><td class="py-3">أربوتين 2%</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">القاعدة</td><td class="py-3">بيوتيلين جلايكول 10.224% وجليسرين 7.486%، أي 17.71% معاً</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الأس الهيدروجيني</td><td class="py-3">7.72، داخل مواصفة 8.00 ± 1.00</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">المظهر</td><td class="py-3">سائل لزج أصفر فاتح</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">خالٍ من</td><td class="py-3">البارابين، الإيثانول، الأصباغ والعطور والمواد الخافضة للتوتر السطحي الصناعية</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">مدة الصلاحية</td><td class="py-3">ثلاث سنوات قبل الفتح، وتاريخ الانتهاء على العلبة</td></tr>
        <tr class="border-b border-gray-100"><td class="py-3 pl-4 font-medium">الصانع</td><td class="py-3">DTS MG Co., Ltd.، كوريا الجنوبية</td></tr>
      </tbody>
    </table>
  </div>

  <div>
    <h2 class="text-3xl font-bold">أيّ واحدة من الست؟</h2>
    <p class="text-gray-700 mt-3">اختاري القارورة بحسب الحالة لا بحسب الدعاية:</p>
    <ul class="space-y-2 text-gray-700 mt-3">
      <li><strong>SWS</strong> — التصبّغ وتفاوت اللون.</li>
      <li><strong>CVS</strong> — بشرة متعبة وباهتة.</li>
      <li><strong>HES</strong> — جفاف وفقدان امتلاء.</li>
      <li><strong>AWS</strong> — الخطوط وفقدان الشدّ.</li>
      <li><strong>CTS</strong> — خشونة الملمس أو ترهّله.</li>
      <li><strong>PCS</strong> — الدهون والحبوب.</li>
    </ul>
  </div>

  <div class="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
    <h3 class="text-xl font-semibold mb-3">قبل الشراء</h3>
    <p class="text-gray-700">للاستعمال الخارجي فقط، وبعيداً عن العينين والأغشية المخاطية. تطلب العلبة تجنّبه أثناء الحمل والرضاعة، وننقل ذلك كما هو. وهو ليس خالياً من العطر: ماء السرو الهينوكي في التركيبة، مُدرَجاً كمكوّن عطري. أوقفي الاستعمال وراجعي الطبيب عند حدوث احمرار أو تورّم أو حبيبات صغيرة أو تهيّج.</p>
  </div>

  <div>
    <img src="${IMG_CLOSING}" alt="POWER SOLUTION SWS — 2 مل لكل قارورة، 10 قوارير في العلبة، مُختبر جلدياً، صُنع في كوريا" class="w-full h-auto rounded-2xl my-5" />
  </div>

  <div class="text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl">
    <h3 class="text-2xl font-bold mb-3">عشر جلسات، كل واحدة مُحكمة على حدة</h3>
    <p class="text-lg mb-6">POWER SOLUTION SWS — 2 مل × 10 قوارير، 580 درهماً. الموزّع الرسمي لـ GENOSYS في الإمارات.</p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a href="/ar/products/8" class="inline-block bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">عرض المنتج</a>
      <a href="/ar/contact" class="inline-block bg-primary-800/40 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-800/60 transition-colors">تواصلي معنا</a>
    </div>
  </div>
</div>`

async function main() {
  const data = {
    title: 'POWER SOLUTION SWS: The Pigment Vial, With Arbutin at a Full 2%',
    slug: SLUG,
    excerpt:
      'SWS is Skin Depigmenting & Whitening Solution — the pigment vial of the GENOSYS Power Solution range. Korea licenses it as a whitening functional cosmetic with arbutin as the principal ingredient, at a full 2%, over a 17.71% humectant base. 2 ml × 10 sealed glass vials, 5-Free, made in Korea.',
    content: contentEn,
    featuredImage: IMG_HERO,
    titleRu: 'POWER SOLUTION SWS: флакон для пигмента с арбутином в полных 2%',
    excerptRu:
      'SWS — это Skin Depigmenting & Whitening Solution, флакон линии GENOSYS Power Solution для пигментации. Корея регистрирует его как функциональное отбеливающее средство с арбутином в качестве главного компонента, в полных 2%, на увлажняющей базе 17,71%. 2 мл × 10 запаянных стеклянных ампул, 5-Free, сделано в Корее.',
    contentRu,
    titleAr: 'POWER SOLUTION SWS: قارورة التصبّغ بأربوتين 2% كاملة',
    excerptAr:
      'SWS هي Skin Depigmenting & Whitening Solution، قارورة التصبّغ في مجموعة GENOSYS Power Solution. ترخّصها كوريا مستحضراً وظيفياً للتفتيح بالأربوتين مكوّناً رئيسياً بنسبة 2% كاملة، فوق قاعدة مرطِّبة 17.71%. 2 مل × 10 قوارير زجاجية مُحكمة، تركيبة 5-Free، صُنع في كوريا.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'power-solution',
      'sws',
      'arbutin',
      'pigmentation',
      'brightening',
      'ampoule',
      'professional',
      'korean-skincare',
    ]),
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } })
  if (existing) {
    // Preserve the original publish date on content updates so the post keeps
    // its place in the blog timeline (newest-first ordering).
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
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
