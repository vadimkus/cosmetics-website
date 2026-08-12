/**
 * Rebuilds the Arabic `ingredients` lists that were authored as arrays of plain
 * strings. The PDP renderer reads `ingredient.name` / `ingredient.description`,
 * so a string item rendered as an empty heading and empty paragraph — eight
 * Arabic pages showed a Key Ingredients section full of blank rows.
 *
 * Each list below is rebuilt from the English product record (the audited source
 * of truth) so the item set, order and descriptions match the other locales.
 * Products 24, 33 and 50 additionally held another product's ingredient names.
 *
 * Full INCI is intentionally absent: `lib/localizedIngredients.ts` appends the
 * English declaration at render time.
 *
 * Usage: npx tsx scripts/fix-arabic-ingredient-shapes.ts [--apply]
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const APPLY = process.argv.includes('--apply')
const FILE = join(process.cwd(), 'data', 'productTranslations.ts')

type Item = { name: string; description?: string }

const REBUILT: Record<string, Item[]> = {
  '12': [
    { name: 'مستخلص فاكهة البابايا (Carica Papaya)', description: 'مصدر لإنزيم الباباين، وهو إنزيم حلّال للبروتين يفتّت خلايا الجلد الميتة بلطف لتقشير ناعم غير مهيّج.' },
    { name: 'مستخلص بذور المورينجا (Moringa Oleifera)', description: 'شجرة المعجزات — تنقّي البشرة وتغذّيها بمكوّنات نباتية مضادة للالتهاب.' },
    { name: 'مركب الصحراء (Desert Complex)', description: 'خمسة نباتات صحراوية عالية التحمّل (التين، نخيل التمر، الأوبونتيا، التين الشوكي، الباوباب) ترطّب البشرة وتهدّئها أثناء التقشير.' },
    { name: 'زيت الجوجوبا (Jojoba Oil)', description: 'مطرٍّ متوافق مع البشرة يحافظ على راحة جل التقشير دون أن يجرّد البشرة من زيوتها.' },
    { name: 'مستخلص فاكهة الخوخ الياباني (Prunus Mume)', description: 'مستخلص الخوخ الياباني بخصائص مضادة للأكسدة ومُوحِّدة لإشراق لون البشرة.' },
    { name: 'الألانتوين (Allantoin)', description: 'يهدّئ البشرة ويلطّفها، فيقلّل التهيّج ويمنح عناية لطيفة أثناء التقشير.' },
  ],
  '17': [
    { name: 'Palmitoyl Hexapeptide-12', description: 'يحفّز نمو الخلايا الليفية لشدّ البشرة وتحسين مرونتها حول منطقة العين الرقيقة.' },
    { name: 'Copper Tripeptide-1', description: 'يعزّز تخليق الكولاجين وتجديد البشرة، فيقلّل الخطوط الدقيقة والتجاعيد لمظهر أكثر شباباً.' },
    { name: 'Acetyl Hexapeptide-8', description: 'يعمل على إرخاء العضلات، فيقلّل مظهر التجاعيد وخطوط التعبير لبشرة أكثر نعومة.' },
    { name: 'مجمع مضاد للهالات السوداء (Haloxyl™)', description: 'مركب متخصص لتقليل الهالات السوداء وتقوية البشرة، يستهدف تصبّغ منطقة تحت العين.' },
    { name: 'مستخلص زراعة كالوس العنب (Vitis Vinifera)', description: 'يوفّر خصائص مضادة للأكسدة ومجدّدة للبشرة مع فوائد مقاومة الشيخوخة لتعزيز صحة البشرة.' },
    { name: 'مستخلص زراعة كالوس الورد الدمشقي (Rosa Damascena)', description: 'يمنح ترطيباً وتهدئة وتفتيحاً مع فوائد مقاومة الشيخوخة، ويساعد في إشراق منطقة العين.' },
    { name: 'أدينوسين (Adenosine)', description: 'يوفّر خصائص مقاومة للشيخوخة ومهدّئة للبشرة مع تأثير مقلّل للتجاعيد لتحسين ملمس البشرة.' },
    { name: 'أربوتين (Arbutin)', description: 'عامل تفتيح طبيعي للبشرة يساعد في توحيد لون البشرة وتقليل مظهر البقع الداكنة.' },
  ],
  '19': [
    { name: 'مستخلص السنتيلا الآسيوية (Centella Asiatica)', description: 'مكوّن مهدّئ مثبت (سيكا) يلطّف البشرة المتفاعلة، ويقلّل الاحمرار الظاهر ويدعم إصلاح البشرة.' },
    { name: 'مستخلص زهرة البابونج (Chamomilla Recutita)', description: 'مكوّن نباتي كلاسيكي مضاد للالتهاب يمنح الراحة للبشرة الحساسة وسريعة التهيّج.' },
    { name: 'بيتا-جلوكان (Beta-Glucan)', description: 'مكوّن طبيعي داعم للمناعة يساعد في تقوية دفاعات البشرة وتقليل الالتهاب وتعزيز الشفاء في البشرة الحساسة.' },
    { name: 'ألانتوين (Allantoin)', description: 'عامل مهدّئ وحامٍ للبشرة يلطّف التهيّج ويدعم تجديد البشرة.' },
    { name: 'حمض الهيالورونيك (Hyaluronic Acid)', description: 'مادة مرطبة قوية تجذب الرطوبة وتحتفظ بها، فتمنح ترطيباً عميقاً دون تهيّج أو انسداد المسام.' },
    { name: 'فيتوسفينغوزين (Phytosphingosine)', description: 'دهن طبيعي يساعد في استعادة وظيفة حاجز البشرة ويمنح حماية لطيفة مضادة للميكروبات، ومناسب للبشرة الحساسة.' },
    { name: 'مستخلص أوراق الصبار (Aloe Barbadensis)', description: 'معروف بخصائصه المهدّئة والمساعدة على الشفاء، يلطّف البشرة المتهيّجة ويقلّل الالتهاب ويمنح ترطيباً طبيعياً للبشرة الحساسة.' },
    { name: 'ماء بندق الساحرة (Hamamelis Virginiana)', description: 'ماء بندق الساحرة المقطّر يساعد في تقليل الاحمرار الظاهر وتهدئة البشرة المتهيّجة، ولطيف بما يكفي للبشرة المتفاعلة.' },
    { name: 'مستخلص خميرة اللاكتوباسيلوس/القرع (Lactobacillus/Pumpkin Ferment Extract)', description: 'مكوّن مُخمّر يدعم ميكروبيوم البشرة ويساعد في تهدئة البشرة الحساسة وتحسين حالتها.' },
  ],
  '24': [
    { name: 'أربوتين 2% (Arbutin 2%)', description: 'مكوّن تفتيح عالي التركيز يستهدف مباشرة مظهر الهالات السوداء والتصبّغ.' },
    { name: 'Palmitoyl Hexapeptide-12', description: 'يحفّز نمو الخلايا الليفية، فيمنح تأثيراً مشدّاً ويساعد في تحسين مرونة البشرة حول منطقة العين الرقيقة.' },
    { name: 'Copper Tripeptide-1', description: 'يعزّز تخليق الكولاجين في الخلايا الليفية، فيساعد في تجديد البشرة وتقليل مظهر الخطوط الدقيقة والتجاعيد.' },
    { name: 'مستخلص زراعة كالوس الورد الدمشقي (Rosa Damascena)', description: 'يمنح ترطيباً وتهدئة وتفتيحاً مع فوائد مقاومة الشيخوخة، ويساعد في إشراق منطقة العين وتقليل علامات التقدّم في العمر.' },
    { name: 'مستخلص جذور الشلمون البيكالي (Scutellaria Baicalensis)', description: 'يوفّر خصائص مضادة للالتهاب والأكسدة والميكروبات والفطريات والفيروسات، ويكافح الجذور الحرة لحماية شاملة للبشرة.' },
    { name: 'هيالورونات الصوديوم (Sodium Hyaluronate)', description: 'يرطّب البشرة ويقلّل فقدان الماء ويخفّف مظهر التجاعيد والخطوط الدقيقة ويحسّن مرونة البشرة لمظهر أكثر شباباً.' },
  ],
  '26': [
    { name: 'تقنية حمل الأكسجين (Methyl Perfluoroisobutyl Ether)', description: 'مركب فلوروكربوني يذوّب الأكسجين ويحرّره على البشرة، فيشغّل تأثير العلاج بالأكسجين الفوّار في كريم القناع هذا.' },
    { name: 'Copper Tripeptide-1', description: 'يعزّز تخليق الكولاجين وله خصائص مساعدة على شفاء الجروح، فيساعد في تحسين ملمس البشرة وتقليل علامات التقدّم في العمر.' },
    { name: 'SEPITONIC M3 (مجمع المعادن)', description: 'يعزّز أيض الخلايا وينشّط البشرة، ويمنحها المعادن الأساسية اللازمة لوظائف البشرة المثالية وصحتها.' },
    { name: 'زيت السلمون (Salmon Oil)', description: 'غني بالأحماض الدهنية غير المشبعة، يمنح تأثيراً مضاداً للالتهاب ومساعداً على شفاء الجروح مع تغذية عميقة للبشرة.' },
    { name: 'أدينوسين (Adenosine)', description: 'يمنح فوائد مقاومة الشيخوخة عبر تقليل مظهر التجاعيد والخطوط الدقيقة، لبشرة أكثر نعومة وشباباً.' },
    { name: 'sh-Oligopeptide-1 (EGF) + ماديكاسوسيد', description: 'ببتيد EGF داعم مع الماديكاسوسيد المستخلص من السنتيلا في مركب إصلاح البشرة.' },
    { name: 'زيت أوراق الأوكالبتوس (Eucalyptus Globulus)', description: 'يمنح التركيبة إحساساً منعشاً بالبرودة.' },
  ],
  '33': [
    { name: 'نياسيناميد 2% (Niacinamide 2%)', description: 'فيتامين B3 يفتّح مظهر الهالات السوداء ويدعم حاجز منطقة العين الرقيقة.' },
    { name: 'Acetyl Hexapeptide-8', description: 'ببتيد للعناية بخطوط التعبير يساعد في تنعيم مظهر الخطوط الدقيقة حول العينين.' },
    { name: 'ماديكاسوسيد + السنتيلا الآسيوية', description: 'ثنائي مهدّئ ومُصلح يلطّف منطقة العين الرقيقة.' },
    { name: 'كولاجين متحلل (Hydrolyzed Collagen)', description: 'بروتين ممتلئ يدعم تماسك البشرة وترطيبها.' },
    { name: 'أدينوسين (Adenosine)', description: 'مكوّن وظيفي مضاد للتجاعيد ينعّم منطقة العين وينشّطها.' },
    { name: 'مستخلصات نباتية', description: 'البابونج وإكليل الجبل والشلمون البيكالي والبانثينول تهدّئ منطقة العين الرقيقة وتحسّن حالتها وتنشّطها.' },
  ],
  '38': [
    { name: 'حمض اللاكتيك (Lactic Acid)', description: 'تقشير لطيف وتجديد للبشرة' },
    { name: 'مستخلص الرجلة (Portulaca Oleracea)', description: 'خصائص مضادة للأكسدة ومضادة للالتهاب' },
    { name: 'مستخلص أوراق إكليل الجبل (Rosmarinus Officinalis)', description: 'تأثير مضاد للميكروبات ومعزّز للدورة الدموية' },
    { name: 'مستخلص زهور البابونج (Chamomilla Recutita)', description: 'فوائد مهدّئة ومضادة للالتهاب' },
    { name: 'مستخلص جذور عرق السوس (Glycyrrhiza Glabra)', description: 'خصائص مفتّحة للبشرة ومضادة للالتهاب' },
    { name: 'مستخلص جذور الشلمون البيكالي (Scutellaria Baicalensis)', description: 'فوائد مضادة للأكسدة ومقاومة للشيخوخة' },
    { name: 'مستخلص السنتيلا الآسيوية (Centella Asiatica)', description: 'تأثير مساعد على شفاء الجروح ومضاد للالتهاب' },
    { name: 'مستخلص أوراق الشاي الأخضر (Camellia Sinensis)', description: 'حماية مضادة للأكسدة وتجديد للبشرة' },
  ],
  // Kit: the English record carries no ingredient list, so only the actives are
  // named. No descriptions are invented for them.
  '50': [
    { name: 'مجمع الببتيد (Palmitoyl Hexapeptide-12، Copper Tripeptide-1، Acetyl Hexapeptide-8)' },
    { name: 'مجمع مضاد للهالات السوداء (Haloxyl™)' },
    { name: 'مستخلص زراعة كالوس العنب (Vitis Vinifera)' },
    { name: 'مستخلص زراعة كالوس الورد الدمشقي (Rosa Damascena)' },
    { name: 'أدينوسين (Adenosine)' },
    { name: 'أربوتين (Arbutin)' },
    { name: 'كولاجين متحلل (Hydrolyzed Collagen)' },
    { name: 'نياسيناميد (Niacinamide)' },
  ],
}

function replaceIngredientsForKey(source: string, key: string, items: Item[]): string {
  const blockStart = source.indexOf(`\n  '${key}': {`)
  if (blockStart === -1) throw new Error(`entry '${key}' not found`)
  const blockEnd = source.indexOf('\n  },', blockStart)
  if (blockEnd === -1) throw new Error(`end of entry '${key}' not found`)

  const block = source.slice(blockStart, blockEnd)
  const line = /\n    ingredients: .*,/.exec(block)
  if (!line) throw new Error(`ingredients line not found in '${key}'`)

  const payload = JSON.stringify(items)
  if (payload.includes("'")) throw new Error(`payload for '${key}' contains a single quote`)
  const replacement = `\n    ingredients: '${payload}',`
  return source.slice(0, blockStart) + block.replace(line[0], replacement) + source.slice(blockEnd)
}

function main() {
  let text = readFileSync(FILE, 'utf8')
  const before = text

  for (const [key, items] of Object.entries(REBUILT)) {
    text = replaceIngredientsForKey(text, key, items)
    console.log(`${key}: ${items.length} items (${items.filter((i) => i.description).length} with descriptions)`)
  }

  if (text === before) {
    console.log('\nno change produced')
    return
  }

  if (!APPLY) {
    console.log('\nDRY RUN — pass --apply to write. Byte delta:', text.length - before.length)
    return
  }

  writeFileSync(FILE, text, 'utf8')
  console.log('\nwritten to', FILE)
}

main()
