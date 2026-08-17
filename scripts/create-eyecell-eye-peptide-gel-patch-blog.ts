/**
 * Creates or updates the multilingual product 33 feature article.
 *
 * Product source of truth (Intertek):
 * - Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE PEPTIDE GEL PATCH .pdf
 * - Registration DOC/Artwork/[GENOSYS]EYECELL EYE PEPTIDE GEL PATCH.pdf
 * - Ingredient lists_old/EyeCell EYE PEPTIDE GEL PATCH.pdf (legacy reference only)
 *
 * Public context:
 * - Mayo Clinic / AAO under-eye bags & dark-circle framing
 * - Thermoresponsive hydrogel delivery reviews
 * - Ingredient-level Acetyl Hexapeptide-8 / multi-peptide eye studies
 *   (context only — not efficacy proof for this formula)
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-eyecell-eye-peptide-gel-patch-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'cooling-hydrogel-eyecell-eye-peptide-gel-patch'
const IMG = '/images/patch'

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Under-eye tiredness is rarely one problem. Puffiness, pigment, thin translucent skin, and shadows from anatomy can all look like “dark circles” in the mirror. That is why cool compresses keep showing up in medical advice — and why a well-built hydrogel patch can feel more useful than another miracle eye cream claim.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Start with what the under-eye area actually is</h2>
    <img src="${IMG}/s1.jpeg" alt="GENOSYS EyeCell EYE PEPTIDE GEL PATCH under-eye hydrogel care" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">The <a href="https://www.mayoclinic.org/diseases-conditions/bags-under-eyes/symptoms-causes/syc-20369927" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Mayo Clinic</a> describes under-eye bags as mild swelling that becomes more common as supporting tissues weaken with age, with fluid retention, sleep, allergies and genetics also in play. The <a href="https://www.aao.org/eye-health/symptoms/bags-under-eyes" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">American Academy of Ophthalmology</a> adds an important distinction: what people call dark circles may be pigment, visible vessels under thin skin, or simply shadows cast by puffiness.</p>
    <p class="text-gray-700 mt-3"><strong>EyeCell EYE PEPTIDE GEL PATCH is cosmetic recovery care, not a diagnosis and not eyelid surgery.</strong> It is made for calming and moisturizing the eye-contour area — especially useful when the skin is fatigued, dehydrated, or recovering after professional treatments.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-sky-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Why hydrogel feels different from a cream</h2>
    <img src="${IMG}/s2.jpeg" alt="Thermo-sensitive hydrogel EyeCell eye peptide gel patches" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Cosmetic hydrogel eye patches are water-rich polymer networks. A <a href="https://www.ijrti.org/papers/IJRTI2208260.pdf" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">2022 review of under-eye hydrogel patches</a> explains the useful physics: occlusion reduces water loss, the gel can feel cooler than ambient skin, and thermoresponsive systems can change structure around skin temperature so actives and moisture move toward the surface rather than evaporating into the air.</p>
    <p class="text-gray-700 mt-3">GENOSYS describes this patch as a <strong>patented thermo-sensitive hydrogel</strong>: body heat softens the gel against the contour, adhesion improves, and residual moisture displaces skin heat so the area feels cooler. That cooling-plus-occlusion package is the product’s real first job — before any peptide story begins.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">What’s inside the formula</h2>
    <img src="${IMG}/s3.jpeg" alt="EyeCell EYE PEPTIDE GEL PATCH formula with niacinamide adenosine peptides" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">The formula is a glycerin-rich hydrogel built around clear functional-cosmetic actives used in the Korean market.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Niacinamide 2%</p>
        <p class="text-gray-700 text-sm mt-1">The major brightening and conditioning active in the formula.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Adenosine 0.04%</p>
        <p class="text-gray-700 text-sm mt-1">A wrinkle-care active commonly used in Korean functional cosmetics.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Acetyl Hexapeptide-8 · 46.5 ppb</p>
        <p class="text-gray-700 text-sm mt-1">Present at a trace cosmetic level. Interesting peptide chemistry — not a Botox substitute.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Hydrogel comfort complex</p>
        <p class="text-gray-700 text-sm mt-1">Glycerin ~10%, Chondrus crispus extract, calcium lactate, madecassoside, panthenol, allantoin, centella and botanical extracts.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">Korean classification: <strong>functional cosmetic for brightening and wrinkle improvement</strong>. Pack size: <strong>101 g / 60 patches / 30 applications</strong>. Dermatologically tested. Made in Korea.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Peptides deserve honesty, not hype</h2>
    <img src="${IMG}/s4.jpeg" alt="Acetyl Hexapeptide-8 eye peptide gel patch close-up" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Acetyl Hexapeptide-8 (Argireline® territory) is designed as a SNAP-25-related expression-line peptide. Multi-peptide eye serums have shown measurable cosmetic improvements in short clinical protocols — for example a <a href="https://doi.org/10.1111/jocd.15849" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">2023 Journal of Cosmetic Dermatology study</a> of a serum containing acetyl hexapeptide-8 among other peptides.</p>
    <p class="text-gray-700 mt-3">That is useful category context. It is <strong>not</strong> proof for this patch. The on-pack formula lists Acetyl Hexapeptide-8 at <strong>46.5 ppb</strong>. We do not invent wrinkle-reduction percentages for EyeCell, and we do not compare the patch to injectable neuromodulators. The honest story here is hydrogel contact time + niacinamide/adenosine functional cosmetics + a trace peptide complex.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The 20–40 minute ritual</h2>
    <img src="${IMG}/s5.jpeg" alt="How to apply EyeCell EYE PEPTIDE GEL PATCH for 20 to 40 minutes" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Cleanse and tone:</strong> start on clean skin after cleansing.</li>
      <li><strong>2. Lift with the spatula:</strong> remove a pair of crescent patches with the enclosed spoon/spatula.</li>
      <li><strong>3. Place under the eyes:</strong> apply under the eyes and/or along the brow bone. Smooth for full contact.</li>
      <li><strong>4. Leave 20–40 minutes:</strong> the recommended wear time. Lie back if you can — gravity helps puffiness look quieter.</li>
      <li><strong>5. Remove and pat:</strong> take the patches off and lightly pat any remaining essence until absorbed. Seal the jar firmly after use.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">External use only. Avoid direct eye and mucous-membrane contact; rinse with cool water if contact occurs. Stop if redness, swelling or irritation appears. Use caution if you react to bandages or compresses. Keep out of children’s reach; store cool and dry.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Where the patch sits in an EyeCell routine</h2>
    <img src="${IMG}/s6.jpeg" alt="EyeCell eye care routine with peptide gel patch serum and cream" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Think of the patch as the intensive step, not the whole system. A practical cadence is <strong>2–3 times a week</strong> for recovery nights or post-procedure comfort (as directed by your professional), then daily seal-in care with <a href="/products/17" class="text-primary-600 font-semibold hover:underline">EyeCell EYE CONTOUR SERUM</a> and <a href="/products/24" class="text-primary-600 font-semibold hover:underline">EyeCell EYE CONTOUR CREAM</a>.</p>
    <p class="text-gray-700 mt-3">Photograph the area in the same light if you want to track cosmetic change. If swelling is sudden, painful, one-sided, or linked to vision changes, see a clinician — patches are for appearance and comfort, not medical red flags.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Cool first. Then deliver.</h3>
    <p class="text-slate-300 mt-3 mb-6">EyeCell EYE PEPTIDE GEL PATCH · 101 g · 60 patches · thermo-sensitive hydrogel · made in Korea</p>
    <a href="/products/33" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">View EyeCell EYE PEPTIDE GEL PATCH</a>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">«Усталость» под глазами редко бывает одной проблемой. Отёчность, пигмент, тонкая просвечивающая кожа и тени от анатомии в зеркале часто выглядят одинаково. Поэтому в медицинских рекомендациях так часто встречаются холодные компрессы — и поэтому грамотный гидрогелевый патч бывает полезнее очередного «чудо-крема».</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Сначала — что такое периорбитальная зона</h2>
    <img src="${IMG}/s1.jpeg" alt="Гидрогелевые патчи GENOSYS EyeCell EYE PEPTIDE GEL PATCH" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700"><a href="https://www.mayoclinic.org/diseases-conditions/bags-under-eyes/symptoms-causes/syc-20369927" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Mayo Clinic</a> описывает мешки под глазами как умеренную отёчность, которая чаще появляется с возрастом на фоне ослабления опорных тканей; роль играют также задержка жидкости, сон, аллергия и генетика. <a href="https://www.aao.org/eye-health/symptoms/bags-under-eyes" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Американская академия офтальмологии</a> отдельно отмечает: «тёмные круги» могут быть пигментом, видимыми сосудами или просто тенью от припухлости.</p>
    <p class="text-gray-700 mt-3"><strong>EyeCell EYE PEPTIDE GEL PATCH — косметический восстановительный уход, не диагноз и не блефаропластика.</strong> Он создан для успокоения и увлажнения контура глаз — особенно когда кожа устала, обезвожена или восстанавливается после процедур.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-sky-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Почему гидрогель ощущается иначе, чем крем</h2>
    <img src="${IMG}/s2.jpeg" alt="Термочувствительный гидрогель EyeCell" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Косметические гидрогелевые патчи — это водонасыщенные полимерные сети. <a href="https://www.ijrti.org/papers/IJRTI2208260.pdf" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Обзор 2022 года</a> объясняет полезную физику: окклюзия снижает потерю влаги, гель может быть прохладнее кожи, а термочувствительные системы меняют структуру около температуры тела, направляя влагу и активы к поверхности, а не в воздух.</p>
    <p class="text-gray-700 mt-3">GENOSYS описывает патч как <strong>запатентованный термочувствительный гидрогель</strong>: тепло тела смягчает гель, улучшает прилегание, а влага смещает тепло кожи — зона ощущается прохладнее. Охлаждение и окклюзия — первая настоящая задача продукта.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Что внутри формулы</h2>
    <img src="${IMG}/s3.jpeg" alt="Формула EyeCell с ниацинамидом аденозином и пептидом" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Формула — глицериновый гидрогель с понятными функциональными активами, характерными для корейского рынка.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Ниацинамид 2%</p>
        <p class="text-gray-700 text-sm mt-1">Основной актив осветления и кондиционирования в формуле.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Аденозин 0,04%</p>
        <p class="text-gray-700 text-sm mt-1">Актив ухода за морщинами, часто используемый в корейской функциональной косметике.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Acetyl Hexapeptide-8 · 46,5 ppb</p>
        <p class="text-gray-700 text-sm mt-1">Следовой косметический уровень. Интересная пептидная химия — не замена ботулотоксину.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Комплекс комфорта гидрогеля</p>
        <p class="text-gray-700 text-sm mt-1">Глицерин ~10%, экстракт Chondrus crispus, лактат кальция, мадекассосид, пантенол, аллантоин, центелла и ботанические экстракты.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">Корейская классификация: <strong>функциональная косметика для осветления и улучшения морщин</strong>. Фасовка: <strong>101 г / 60 патчей / 30 применений</strong>. Дерматологически протестировано. Сделано в Корее.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Пептидам нужна честность, а не хайп</h2>
    <img src="${IMG}/s4.jpeg" alt="Патч с Acetyl Hexapeptide-8 крупным планом" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Acetyl Hexapeptide-8 относится к пептидам линии Argireline® и связан с путём SNAP-25. Мультипептидные сыворотки для глаз показывали косметическое улучшение в коротких протоколах — например, в <a href="https://doi.org/10.1111/jocd.15849" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">исследовании Journal of Cosmetic Dermatology 2023</a>.</p>
    <p class="text-gray-700 mt-3">Это контекст категории, <strong>не</strong> доказательство для этого патча. В составе на упаковке указано <strong>46,5 ppb</strong> Acetyl Hexapeptide-8. Мы не придумываем проценты разглаживания и не сравниваем патч с инъекциями. Честная история: контактное время гидрогеля + ниацинамид/аденозин + следовой пептидный комплекс.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Ритуал на 20–40 минут</h2>
    <img src="${IMG}/s5.jpeg" alt="Как наносить EyeCell EYE PEPTIDE GEL PATCH" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Очищение и тоник:</strong> начинайте с чистой кожи.</li>
      <li><strong>2. Лопатка в комплекте:</strong> достаньте пару патчей прилагаемой ложкой/шпателем.</li>
      <li><strong>3. Под глаза:</strong> разместите под глазами и/или по кости брови, пригладьте для контакта.</li>
      <li><strong>4. 20–40 минут:</strong> рекомендуемое время ношения. Лучше лечь — гравитация помогает отёчности выглядеть спокойнее.</li>
      <li><strong>5. Снять и вбить:</strong> снимите патчи и слегка вобейте остатки эссенции. Плотно закройте банку.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">Только наружно. Избегайте прямого контакта с глазами и слизистыми; при контакте промойте прохладной водой. При покраснении, отёке или раздражении прекратите использование. Будьте осторожны при аллергии на пластыри/компрессы. Храните в недоступном для детей месте, в прохладе и сухости.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Место патча в рутине EyeCell</h2>
    <img src="${IMG}/s6.jpeg" alt="Рутина EyeCell: патч, сыворотка и крем" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Патч — интенсивный шаг, а не вся система. Практичный ритм: <strong>2–3 раза в неделю</strong> для восстановительных вечеров или постпроцедурного комфорта (по рекомендации специалиста), затем ежедневное закрепление с <a href="/products/17" class="text-primary-600 font-semibold hover:underline">EyeCell EYE CONTOUR SERUM</a> и <a href="/products/24" class="text-primary-600 font-semibold hover:underline">EyeCell EYE CONTOUR CREAM</a>.</p>
    <p class="text-gray-700 mt-3">Если хотите отслеживать косметический эффект — фотографируйте при одном свете. При внезапном, болезненном, одностороннем отёке или изменениях зрения обратитесь к врачу.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Сначала прохлада. Потом доставка.</h3>
    <p class="text-slate-300 mt-3 mb-6">EyeCell EYE PEPTIDE GEL PATCH · 101 г · 60 патчей · термочувствительный гидрогель · сделано в Корее</p>
    <a href="/products/33" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">Смотреть EyeCell EYE PEPTIDE GEL PATCH</a>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
  <div>
    <p class="text-lg text-gray-700">تعب تحت العين نادراً ما يكون مشكلة واحدة. التورّم، والتصبّغ، والجلد الرقيق الشفاف، والظلال التشريحية قد تبدو كلها «هالات» في المرآة. لهذا يتكرر ذكر الكمادات الباردة في النصائح الطبية — ولهذا يمكن أن يكون لصق الهيدروجيل المصمَّم جيداً أكثر فائدة من وعد كريمي مبالغ فيه.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ابدأ بماهية منطقة محيط العين</h2>
    <img src="${IMG}/s1.jpeg" alt="لصقات GENOSYS EyeCell EYE PEPTIDE GEL PATCH لمحيط العين" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">تصف <a href="https://www.mayoclinic.org/diseases-conditions/bags-under-eyes/symptoms-causes/syc-20369927" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Mayo Clinic</a> أكياس تحت العين بأنها تورّم خفيف يزداد شيوعاً مع ضعف الأنسجة الداعمة، مع أدوار لاحتباس السوائل والنوم والحساسية والوراثة. وتوضح <a href="https://www.aao.org/eye-health/symptoms/bags-under-eyes" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">الأكاديمية الأمريكية لطب العيون</a> فرقاً مهماً: ما يُسمّى هالات قد يكون تصبغاً أو أوعية ظاهرة أو مجرد ظل ناتج عن الانتفاخ.</p>
    <p class="text-gray-700 mt-3"><strong>EyeCell EYE PEPTIDE GEL PATCH عناية تجميلية للتعافي، وليست تشخيصاً ولا جراحة جفن.</strong> صُمم لتهدئة وترطيب محيط العين — خاصة عند الإرهاق أو الجفاف أو بعد الإجراءات المهنية.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-sky-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">لماذا يختلف الإحساس بالهيدروجيل عن الكريم</h2>
    <img src="${IMG}/s2.jpeg" alt="هيدروجيل حسّاس للحرارة من EyeCell" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">لصقات الهيدروجيل التجميلية شبكات بوليمر غنية بالماء. يوضح <a href="https://www.ijrti.org/papers/IJRTI2208260.pdf" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">مراجعة 2022</a> الفيزياء المفيدة: الإغلاق يقلل فقدان الماء، والجل قد يكون أبرد من الجلد، والأنظمة الحساسة للحرارة تغيّر بنيتها قرب حرارة الجسم فتتجه الرطوبة والمواد الفعالة نحو السطح بدل التبخر.</p>
    <p class="text-gray-700 mt-3">تصف GENOSYS هذا اللصق بأنه <strong>هيدروجيل حاصل على براءة حسّاس للحرارة</strong>: حرارة الجسم تليّن الجل، وتتحسّن الالتصاقية، والرطوبة تزيح حرارة الجلد فيشعر المحيط بالبرودة. التبريد مع الإغلاق هو المهمة الأولى الحقيقية للمنتج.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ماذا تحتوي التركيبة</h2>
    <img src="${IMG}/s3.jpeg" alt="تركيبة EyeCell مع النياسيناميد والأدينوزين والببتيد" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">التركيبة هيدروجيل غني بالغليسرين مبني حول مواد وظيفية واضحة شائعة في مستحضرات كوريا.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">نياسيناميد 2%</p>
        <p class="text-gray-700 text-sm mt-1">المادة الرئيسية للتفتيح والتكييف في التركيبة.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">أدينوزين 0.04%</p>
        <p class="text-gray-700 text-sm mt-1">مادة شائعة للعناية بالتجاعيد في مستحضرات كوريا الوظيفية.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">Acetyl Hexapeptide-8 · 46.5 ppb</p>
        <p class="text-gray-700 text-sm mt-1">مستوى تجميلي ضئيل. كيمياء ببتيدية مثيرة — وليست بديلاً عن البوتوكس.</p>
      </div>
      <div class="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-sky-900">مجمّع راحة الهيدروجيل</p>
        <p class="text-gray-700 text-sm mt-1">غليسرين ~10%، مستخلص Chondrus crispus، لاكتات الكالسيوم، ماديكاسوسيد، بانثينول، آلانتوين، سنتيللا ومستخلصات نباتية.</p>
      </div>
    </div>
    <p class="text-sm text-gray-600 mt-4">التصنيف الكوري: <strong>مستحضر وظيفي للتفتيح وتحسين التجاعيد</strong>. الحجم: <strong>101 غ / 60 لصقة / 30 استخداماً</strong>. مختبَر جلدياً. مصنوع في كوريا.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الببتيدات تستحق الصدق لا المبالغة</h2>
    <img src="${IMG}/s4.jpeg" alt="لصقة العين بببتيد Acetyl Hexapeptide-8" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">يرتبط Acetyl Hexapeptide-8 بمسار SNAP-25 ضمن عائلة Argireline®. أظهرت سيرومات محيط العين متعددة الببتيدات تحسناً تجميلياً في بروتوكولات قصيرة — مثل <a href="https://doi.org/10.1111/jocd.15849" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">دراسة Journal of Cosmetic Dermatology عام 2023</a>.</p>
    <p class="text-gray-700 mt-3">هذا سياق الفئة، <strong>وليس</strong> إثباتاً لهذا اللصق. يذكر التركيب على العبوة <strong>46.5 ppb</strong> من Acetyl Hexapeptide-8. لا نخترع نسب تجاعيد ولا نقارن اللصق بالحقن. القصة الصادقة: زمن تلامس الهيدروجيل + نياسيناميد/أدينوزين + مجمّع ببتيد ضئيل.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">طقوس 20–40 دقيقة</h2>
    <img src="${IMG}/s5.jpeg" alt="طريقة وضع EyeCell EYE PEPTIDE GEL PATCH" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. نظّف وهيّئ:</strong> ابدأ ببشرة نظيفة بعد الغسل.</li>
      <li><strong>2. استخدم الملعقة المرفقة:</strong> أخرج زوجاً من اللصقات بالملعقة/السباتيولا.</li>
      <li><strong>3. ضع تحت العينين:</strong> تحت العينين و/أو على عظم الحاجب، وملّس للالتصاق الكامل.</li>
      <li><strong>4. اترك 20–40 دقيقة:</strong> وقت الاستخدام الموصى به. الاستلقاء يساعد مظهر التورّم.</li>
      <li><strong>5. أزل وربّت:</strong> انزع اللصقات وربّت أي جوهر متبقٍ حتى الامتصاص، ثم أغلق العبوة جيداً.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">للاستخدام الخارجي فقط. تجنّب ملامسة العين والأغشية المخاطية؛ اشطف بماء بارد عند التلامس. توقّف عند الاحمرار أو التورّم أو التهيّج. استخدم بحذر إذا كنت تتفاعل مع الضمادات. احفظ بعيداً عن الأطفال في مكان بارد جاف.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">مكان اللصقة في روتين EyeCell</h2>
    <img src="${IMG}/s6.jpeg" alt="روتين EyeCell مع اللصقة والسيروم والكريم" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">اللصقة خطوة مكثفة لا النظام كله. إيقاع عملي: <strong>2–3 مرات أسبوعياً</strong> لليالي التعافي أو الراحة بعد الإجراءات (حسب توجيه المختص)، ثم عناية يومية بـ <a href="/products/17" class="text-primary-600 font-semibold hover:underline">EyeCell EYE CONTOUR SERUM</a> و <a href="/products/24" class="text-primary-600 font-semibold hover:underline">EyeCell EYE CONTOUR CREAM</a>.</p>
    <p class="text-gray-700 mt-3">صوّر المنطقة بنفس الإضاءة إن أردت تتبّع التغيّر التجميلي. عند تورّم مفاجئ أو مؤلم أو أحادي الجانب أو مع تغيّر في الرؤية، راجع طبيباً.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">برّد أولاً. ثم أوصل.</h3>
    <p class="text-slate-300 mt-3 mb-6">EyeCell EYE PEPTIDE GEL PATCH · 101 غ · 60 لصقة · هيدروجيل حسّاس للحرارة · مصنوع في كوريا</p>
    <a href="/products/33" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">عرض EyeCell EYE PEPTIDE GEL PATCH</a>
  </div>
</div>`

async function main() {
  const data = {
    slug: SLUG,
    title: 'Cooling hydrogel, honest peptides: inside EyeCell EYE PEPTIDE GEL PATCH',
    excerpt:
      'Why under-eye fatigue is more than one problem, how thermo-sensitive hydrogel actually works, and what is inside GENOSYS EyeCell EYE PEPTIDE GEL PATCH — including niacinamide 2%, adenosine 0.04%, and a trace peptide dose told without hype.',
    content: contentEn,
    featuredImage: `${IMG}/main.jpeg`,
    titleRu: 'Охлаждающий гидрогель и честные пептиды: EyeCell EYE PEPTIDE GEL PATCH',
    excerptRu:
      'Почему «усталость» под глазами — не одна проблема, как работает термочувствительный гидрогель и что внутри EyeCell EYE PEPTIDE GEL PATCH: ниацинамид 2%, аденозин 0,04% и следовой пептид без хайпа.',
    contentRu,
    titleAr: 'هيدروجيل مبرّد وببتيدات صادقة: داخل EyeCell EYE PEPTIDE GEL PATCH',
    excerptAr:
      'لماذا إرهاق تحت العين أكثر من مشكلة واحدة، وكيف يعمل الهيدروجيل الحسّاس للحرارة، وما تحتويه تركيبة EyeCell EYE PEPTIDE GEL PATCH — بما في ذلك نياسيناميد 2% وأدينوزين 0.04% وببتيد بمستوى ضئيل من دون مبالغة.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'eyecell',
      'eye-peptide-gel-patch',
      'hydrogel',
      'under-eye',
      'niacinamide',
      'adenosine',
      'acetyl-hexapeptide-8',
      'dark-circles',
      'korean-eye-care',
      'thermo-sensitive',
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
