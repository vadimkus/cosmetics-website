/**
 * Bespoke copy for HR³ MATRIX HAIR SOLUTION α (product 45), third of the scalp line.
 *
 * SOURCING - signed DTS MG formula, SA EN09_01_01 E3 21 06 00597 Amendment II, COA
 * lot WNL122, both registered artworks, and the DTS MG deck:
 *   Aqua 85.845%, propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated
 *   castor oil 1.000%, carbomer 0.450%, MENTHOL 0.200%, butylene glycol 0.111%,
 *   NIACINAMIDE 0.100%, PANTHENOL 0.100%, triethanolamine 0.100%, glycerin 0.021%,
 *   broccoli extract 0.010%, lecithin 0.010%, phenoxyethanol 0.003%, polysorbate 60
 *   0.003%, dipropylene glycol 0.005%, sodium citrate 0.0015%, saw palmetto 0.001%,
 *   COPPER TRIPEPTIDE-1 0.0005% (5 ppm), sh-Polypeptide-7 0.00005% (0.5 ppm),
 *   sh-Polypeptide-9 0.00005% (0.5 ppm), sh-Oligopeptide-1 0.000015% (0.15 ppm),
 *   sh-Polypeptide-71 0.000005% (0.05 ppm), biosaccharide gum-4 0.000012%,
 *   citric acid 0.0002%, eleven botanicals at 0.0001% each, houttuynia 0.00001%.
 *   GROWTH FACTOR TOTAL: 1.2 ppm.
 *   COA: opaque liquid, pH 6.65 (spec 6.00-7.00), viscosity 800 (spec 800-1,600),
 *   specific gravity 1.0101, under 10 cfu/ml against 100, three-year life.
 *   SA: category "Leave-In Conditioner (Hair Care)". Patch test satisfactory, NON
 *   IRRITANT, by QACS Ltd - the assessor adds that the number of volunteers is not
 *   statistically significant. "Other Tests: None presented." "Literature Data: Not
 *   Applicable." The pregnancy/lactation warning is assessor-recommended because of
 *   the menthol.
 *   ARTWORK, both homecare and professional: function "Nutrition supply and hair
 *   conditioning". 4 ml x 8 vials. "Use immediately after open." Professional adds
 *   "Shake well before using." Precaution: external use only, avoid eyes and mucous
 *   membranes, do not use near eyes, AVOID USE DURING PREGNANCY/LACTATION.
 *   Homecare contents: solution 4 ml x 8, applicator, cleansing brush, disinfecting jar.
 *   DECK: professional technique is comb-part, then roller or stamp 0.25-0.5 mm for
 *   10-15 minutes, half a vial or a whole vial by area, refrigerate the remainder.
 *   Homecare technique is fit the applicator and tap vertically, then rinse,
 *   disinfect in the jar, dry and re-cap. One or two times a week.
 *   RUSSIAN PANEL adds 1-2 cm between partings, which the English one omits.
 *
 * SIZE: 4 ml x 8. The deck says 5 ml; both registered cartons and the Russian panel
 * say 4 ml. A deck does not outrank registered artwork.
 *
 * FRAMING (owner decision, 17 Aug): follow the English panel. No hair-loss claim.
 *
 * MUST NEVER BE ADDED. This product has the worst claim set in the line, and it is
 * the manufacturer's own English deck rather than a translated panel:
 *   - "It helps to inhibit the formation of 5α-reductases, the key enzyme which
 *     converts testosterone to dihydrotestosterone" (deck, concept slide). That is
 *     the mechanism of finasteride, a prescription medicine. Also repeated on the
 *     copper tripeptide slide and the saw palmetto slide.
 *   - "Angiogenesis", "vasculogenesis", "vasodilation", "promotes the formation of
 *     new blood vessels", "induces proliferation of endothelial cells".
 *   - "Increase the number of anagen hair follicles", "stimulates dermal papilla
 *     cells", "thickens hair by growing the size of hair follicles".
 *   - Black Complex "effective for anti-hair loss and hair regrowth".
 *   - Any research-paper citation: the SA records none presented.
 * Counting the hair tonic's Russian panel, this line now asserts the 5α-reductase
 * mechanism in four separate documents.
 *
 * THE HONEST STORY, and what this page is built on: this is the ampoule designed to
 * be needled in, and the vehicle is most of the product. Nearly 10% propylene glycol,
 * a solubiliser and carbomer at 0.450% make something that stays put on treated skin.
 * Menthol 0.200% is what you feel. Copper tripeptide-1 at 5 ppm is the highest in the
 * range. The four growth factors on the front of the box total 1.2 ppm, and the page
 * says so.
 */

import {
  hairSolutionArAudited,
  hairSolutionRuAudited,
} from './hairSolutionLocalizedCopy'

export type Locale = 'en' | 'ar' | 'ru'

export interface HairSolutionCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]

  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  growthFactors: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ name: string; alias: string; dose: string }>
    total: string
    totalLabel: string
    body: string
  }

  vehicle: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  copper: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ product: string; dose: string; note: string; here?: boolean }>
    body: string
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    proTitle: string
    proSteps: string[]
    homeTitle: string
    homeSteps: string[]
    note: string
  }

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
  }

  inci: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }

  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }

  spec: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }

  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }

  backToProducts: string
}

const EN: HairSolutionCopy = {
  eyebrow: 'HR³ MATRIX Hair Solution α · 4 ml × 8 vials',
  headline: 'The one built to be needled in.',
  subheadline:
    'Every other product in this range is smoothed on. This one is rolled or stamped into the scalp, and that changes what matters: the carrier is most of the formula. Propylene glycol at 9.995%, a solubiliser and carbomer at 0.450% make a thin opaque gel that stays where you put it on treated skin instead of running off. Menthol at 0.200% for the cooling, and copper tripeptide-1 at the highest concentration anywhere in the range.',
  heroBullets: [
    'Formulated as a microneedling vehicle, not a leave-on serum',
    'Copper tripeptide-1 at 5 ppm - five times the hair tonic, five hundred times the shampoo',
    'The four growth factors on the box total 1.2 parts per million. That is the real number',
    'Single-use 4 ml vials · avoid during pregnancy and lactation',
  ],
  badges: ['Made in Korea', '4 ml × 8', 'Single-use vials', 'Dermatologically tested'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '5 ppm', label: 'copper tripeptide-1, the most in the range' },
    { value: '1.2 ppm', label: 'all four growth factors, combined' },
    { value: '0.200%', label: 'menthol' },
    { value: '8', label: 'single-use 4 ml vials' },
  ],

  growthFactors: {
    eyebrow: 'The number nobody prints',
    title: 'Four growth factors, and what they add up to',
    intro:
      'Growth factors are why this ampoule costs what it costs, and they are the first thing on the box. They are also genuinely present, genuinely recombinant and genuinely expensive raw materials. Here is how much of each is in the bottle.',
    rows: [
      { name: 'sh-Polypeptide-9', alias: 'VEGF sequence', dose: '0.5 ppm' },
      { name: 'sh-Polypeptide-7', alias: 'somatotropin sequence', dose: '0.5 ppm' },
      { name: 'sh-Oligopeptide-1', alias: 'EGF sequence', dose: '0.15 ppm' },
      { name: 'sh-Polypeptide-71', alias: 'VIP sequence', dose: '0.05 ppm' },
    ],
    total: '1.2 ppm',
    totalLabel: 'combined',
    body:
      'One and a fifth parts per million between the four of them. We could describe what each peptide does in a laboratory and let you assume it happens on your head; the manufacturer\u2019s own literature does exactly that, and goes considerably further. Instead: they are present, the sourcing is real, and the dose is what it is. What this ampoule reliably does is cool a treated scalp, condition it, and carry things into skin that has just been opened by a needle. That is worth buying. A mechanism at 1.2 ppm is not what you are buying.',
  },

  vehicle: {
    eyebrow: 'The working formula',
    title: 'On a microneedling ampoule, the carrier is the product',
    intro:
      'Once you have made microchannels in the scalp, the question is no longer how good a serum feels. It is whether the liquid stays on the treated area long enough to go in rather than running down the parting. That is what this formula is built for.',
    items: [
      {
        name: 'Propylene glycol',
        dose: '9.995%',
        body: 'Nearly a tenth of the vial, and second only to water. A humectant and a solvent that keeps water-soluble ingredients moving rather than sitting on the surface. This is the single biggest difference between this ampoule and a normal scalp serum.',
      },
      {
        name: 'Carbomer',
        dose: '0.450%',
        body: 'The reason it is a thin gel and not water. Just enough body to hold position on a needled scalp for the minutes that matter, without being tacky under a roller.',
      },
      {
        name: 'PEG-40 hydrogenated castor oil',
        dose: '1.000%',
        body: 'The solubiliser. It is what keeps four recombinant peptides and a long list of botanical extracts in a single clear solution instead of separating in the vial.',
      },
      {
        name: 'Menthol',
        dose: '0.200%',
        body: 'The cooling, and deliberately lower than the hair tonic\u2019s 0.300%. A freshly needled scalp does not need the strongest menthol in the range on it, and this is the dose that reads as relief rather than sting.',
      },
      {
        name: 'Niacinamide',
        dose: '0.100%',
        body: 'Vitamin B3 at a modest working dose, for barrier support on scalp skin that has just been treated.',
      },
      {
        name: 'Panthenol',
        dose: '0.100%',
        body: 'Vitamin B5, for moisture retention and hair elasticity. Half the concentration in the hair tonic, which is the product to reach for if panthenol is the point.',
      },
      {
        name: 'Broccoli extract',
        dose: '0.010%',
        body: 'At 100 ppm, the most substantial botanical here by a factor of ten, and the only plant extract in the formula present in an amount worth naming. An antioxidant carrying sulforaphane.',
      },
      {
        name: '1,2-Hexanediol',
        dose: '2.042%',
        body: 'A solvent that also does most of the preserving. It matters here because the phenoxyethanol is only 30 ppm, which is part of why a vial has to be used as soon as it is open.',
      },
    ],
  },

  copper: {
    eyebrow: 'Where the copper peptide is',
    title: 'The one thing this ampoule genuinely leads the range on',
    intro:
      'Copper tripeptide-1 is named on three cartons in this line. The concentrations are nothing like each other, and an ingredient list will never tell you that. If copper peptide is what you came to this range for, it is worth seeing the three together.',
    rows: [
      { product: 'Hair Solution α - this one', dose: '5 ppm', note: '0.0005%', here: true },
      { product: 'Hair Tonic α', dose: '1 ppm', note: '0.0001%' },
      { product: 'Medi Scalp Shampoo α', dose: '0.01 ppm', note: '0.000001%' },
    ],
    body:
      'Five parts per million is still a modest dose in absolute terms, and we are not going to attach a mechanism to it. But it is five times the tonic and five hundred times the shampoo, and it is the honest reason this is the product in the range where the copper peptide is actually doing something rather than appearing on a label.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Two techniques, one or two times a week',
    frequency: 'Once or twice weekly · use a vial immediately once opened',
    proTitle: 'In clinic, with a roller or stamp',
    proSteps: [
      'Shake the vial before opening, which the professional carton asks for and the homecare one does not.',
      'Part the treatment area with a comb. The manufacturer\u2019s Russian panel gives a spacing the English one leaves out: 1 to 2 cm between partings.',
      'Choose a 0.25 to 0.5 mm roller or stamp and work for 10 to 15 minutes.',
      'Half a vial covers a small area, a whole vial a larger one. If you use half, refrigerate the rest until the next session.',
    ],
    homeTitle: 'At home, with the applicator',
    homeSteps: [
      'Push the cap up in the direction of the arrow to remove the cap and the metallic lid.',
      'Fit the applicator to the mouth of the vial.',
      'Tap vertically with steady, even pressure - do not drag it sideways.',
      'Lift one side to detach the applicator, rinse it under running water, then soak the sponge in the disinfecting jar with alcohol and stamp the head into it.',
      'Let it dry, then store it with the cap on.',
    ],
    note:
      'Use a vial immediately once it is open: there is almost no preservative in it, which is the trade-off for a formula this clean going into needled skin. Keep it away from the eyes. And read the precautions before you buy - the carton says to avoid this product during pregnancy and lactation.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea and released against a written specification. Registered not as a treatment but as a leave-in hair conditioner, which is worth knowing before you read anyone\u2019s marketing.',
    rows: [
      { label: 'Appearance', value: 'Opaque liquid' },
      { label: 'pH', value: '6.65 at 25 °C, inside a 6.00-7.00 specification' },
      { label: 'Viscosity', value: '800, at the floor of an 800-1,600 specification' },
      { label: 'Specific gravity', value: '1.0101, inside 0.9900-1.0300' },
      { label: 'Purity', value: 'Under 10 cfu/ml, against a permitted 100' },
      { label: 'Shelf life', value: 'Three years unopened, with the date on the carton' },
      { label: 'After opening', value: 'Use immediately' },
      { label: 'Registered category', value: 'Leave-in hair conditioner' },
      { label: 'Function', value: 'Nutrition supply and hair conditioning' },
    ],
    patch:
      'The test on file is a cutaneous irritancy patch test, carried out by an independent laboratory, and it came back non-irritant, which is what supports the "dermatologically tested" line on the carton. The assessor adds a caveat worth passing on: the number of volunteers was not statistically significant. Beyond that, the assessment records "other tests: none presented" and "literature data: not applicable" - so there is no efficacy study behind this product, and we are not going to imply there is one.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the vial',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Avoid use during pregnancy and lactation. This is printed on the carton, and the assessor attributes it to the menthol.',
      'For external use only, on the scalp.',
      'Avoid contact with the eyes and mucous membranes; rinse thoroughly with cool water on contact. Do not use near the eyes.',
      'Use a vial immediately once opened. Do not keep an opened vial at room temperature.',
      'Do not use on broken, wounded or infected scalp. If you are microneedling, follow your device\u2019s own hygiene instructions.',
      'Stop and see a doctor if redness, swelling or irritation develops.',
      'Keep in a cool, dry place, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, homecare and professional panels together.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '4 ml × 8 single-use vials' },
      { label: 'Texture', value: 'Opaque liquid, lightly gelled' },
      { label: 'Registered category', value: 'Leave-in hair conditioner' },
      { label: 'Function', value: 'Nutrition supply and hair conditioning' },
      { label: 'Vehicle', value: 'Propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated castor oil 1.000%, carbomer 0.450%' },
      { label: 'At dose', value: 'Menthol 0.200%, niacinamide 0.100%, panthenol 0.100%' },
      { label: 'Copper tripeptide-1', value: '0.0005% (5 ppm) - the most in the range' },
      { label: 'Growth factors', value: 'sh-Polypeptide-9 and -7 at 0.5 ppm each, sh-Oligopeptide-1 0.15 ppm, sh-Polypeptide-71 0.05 ppm. Total 1.2 ppm' },
      { label: 'Botanicals', value: 'Broccoli 100 ppm, saw palmetto 10 ppm, nine Black Complex extracts at 1 ppm each' },
      { label: 'pH', value: '6.00-7.00 (6.65 on the batch tested)' },
      { label: 'Testing', value: 'Patch tested, non-irritant. No efficacy study exists' },
      { label: 'Frequency', value: 'Once or twice a week' },
      { label: 'Not for', value: 'Pregnancy and lactation. Not near the eyes' },
      { label: 'Shelf life', value: 'Three years unopened; use a vial immediately once opened' },
      { label: 'Also in', value: 'The HR³ MATRIX Mesopecia Kit' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Will this regrow my hair?',
        a: 'No, and anyone telling you a cosmetic ampoule will is selling you something. Outside Korea this is registered as a leave-in hair conditioner and the carton function line reads "nutrition supply and hair conditioning". What it does well is cool and condition a scalp that has just been microneedled, in a vehicle built to stay on treated skin. If you are losing hair, see a doctor - there are actual medicines for this and they work by a mechanism no cosmetic is allowed to claim.',
      },
      {
        q: 'So why are the growth factors on the front of the box?',
        a: 'Because they are in it, and because they are expensive. All four are genuine recombinant peptides. They come to 1.2 parts per million between them, which we would rather tell you than let you infer. Think of them as part of what you are paying for in a premium ampoule, not as the reason it works.',
      },
      {
        q: 'Do I need a microneedling device to use it?',
        a: 'It is designed for one, and that is where the formula makes sense. The homecare kit includes an applicator you tap vertically into the scalp, plus a cleansing brush and a disinfecting jar for it. In clinic it is a 0.25 to 0.5 mm roller or stamp for 10 to 15 minutes. You could pat it on bare scalp, but then you are paying ampoule prices for a conditioner.',
      },
      {
        q: 'Why does a vial have to be used straight away?',
        a: 'Because there is almost no preservative in it - phenoxyethanol at 30 parts per million, with the 1,2-hexanediol doing most of the work. That is deliberate for something going into needled skin, and the trade-off is that an opened vial does not keep. In clinic you can refrigerate a half-used vial until the next session; at home, finish it.',
      },
      {
        q: 'Can I use it while pregnant?',
        a: 'No. The carton says to avoid this product during pregnancy and lactation, and the safety assessor attributes that to the menthol rather than to anything exotic. It is a conservative call by the assessor rather than evidence of harm, but it is printed on the box and we are not going to talk you past it.',
      },
      {
        q: 'How does it differ from the Hair Tonic?',
        a: 'Different jobs. The tonic is a daily 70 ml leave-on spray with all three of its actives measured on the batch, including salicylic acid at 0.25% - but it carries a real avoid list. This is a weekly ampoule with five times the copper peptide, built to be needled in. Most people who use both do the tonic daily and this once or twice a week. If you can only have one and you are not microneedling, buy the tonic.',
      },
      {
        q: 'Is 4 ml or 5 ml in a vial?',
        a: 'Four. Both registered cartons say 4 ml × 8 vials, in English and in Russian. The manufacturer\u2019s sales deck says 5 ml, which we believe is out of date, and where a deck and a registered carton disagree the carton wins. Eight vials at one or two applications a week is roughly a month to two months of use.',
      },
    ],
  },

  backToProducts: 'Products',
}

const LEGACY_HAIR_SOLUTION_AR: HairSolutionCopy = {
  eyebrow: 'محلول الشعر إتش آر³ ماتريكس α · 4 مل × 8 أمبولات',
  headline: 'المنتج المصمَّم ليُدخَل بالإبر الدقيقة.',
  subheadline:
    'كل منتج آخر في هذه المجموعة يُوزَّع على البشرة. أما هذا فيُدحرج أو يُختم في فروة الرأس، وذلك يغيّر ما يهمّ: فالحامل هو معظم التركيبة. بروبيلين جليكول بنسبة 9.995%، ومُذيب، وكاربومر بنسبة 0.450% تصنع جِلّاً شفّافاً رقيقاً يبقى حيث تضعينه على بشرة معالَجة بدل أن يسيل. ومنثول بنسبة 0.200% للتبريد، وكوبر ترايببتايد-1 بأعلى تركيز في المجموعة كلها.',
  heroBullets: [
    'مصوغ كحامل للإبر الدقيقة، لا كسيروم يُترك',
    'كوبر ترايببتايد-1 بـ 5 أجزاء من المليون - خمسة أضعاف التونيك، وخمسمئة ضعف الشامبو',
    'عوامل النموّ الأربعة على العلبة مجموعها 1.2 جزء من المليون. وهذا هو الرقم الحقيقي',
    'أمبولات 4 مل للاستخدام مرة واحدة · يُتجنّب أثناء الحمل والإرضاع',
  ],
  badges: ['صُنع في كوريا', '4 مل × 8', 'أمبولات لمرة واحدة', 'مختبر جلدياً'],

  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '5 ppm', label: 'كوبر ترايببتايد-1، الأعلى في المجموعة' },
    { value: '1.2 ppm', label: 'عوامل النموّ الأربعة مجتمعة' },
    { value: '0.200%', label: 'منثول' },
    { value: '8', label: 'أمبولات 4 مل لمرة واحدة' },
  ],

  growthFactors: {
    eyebrow: 'الرقم الذي لا يطبعه أحد',
    title: 'أربعة عوامل نموّ، وما تبلغه مجتمعة',
    intro:
      'عوامل النموّ هي سبب سعر هذه الأمبولة، وهي أول ما يُذكر على العلبة. وهي أيضاً موجودة فعلاً، ومؤتلفة فعلاً، ومواد خام غالية فعلاً. وهذا مقدار كل منها في العبوة.',
    rows: [
      { name: 'sh-Polypeptide-9', alias: 'تسلسل VEGF', dose: '0.5 ppm' },
      { name: 'sh-Polypeptide-7', alias: 'تسلسل السوماتوتروبين', dose: '0.5 ppm' },
      { name: 'sh-Oligopeptide-1', alias: 'تسلسل EGF', dose: '0.15 ppm' },
      { name: 'sh-Polypeptide-71', alias: 'تسلسل VIP', dose: '0.05 ppm' },
    ],
    total: '1.2 ppm',
    totalLabel: 'مجتمعة',
    body:
      'جزء وخُمس من المليون بين الأربعة. كان يمكننا وصف ما يفعله كل ببتيد في المختبر وترككِ تفترضين أنه يحدث على رأسك؛ وأدبيات الشركة نفسها تفعل ذلك تماماً وتذهب أبعد بكثير. أما نحن: فهي موجودة، والتوريد حقيقي، والجرعة هي ما هي. وما تفعله هذه الأمبولة بموثوقية هو تبريد فروة معالَجة وتكييفها وحمل أشياء إلى بشرة فُتحت للتوّ بإبرة. وذلك يستحق الشراء. أما آليةٌ عند 1.2 جزء من المليون فليست ما تشترينه.',
  },

  vehicle: {
    eyebrow: 'التركيبة العاملة',
    title: 'في أمبولة للإبر الدقيقة، الحامل هو المنتج',
    intro:
      'بعد أن تصنعي قنوات دقيقة في فروة الرأس، لم يبق السؤال عن جودة إحساس السيروم. بل عمّا إذا كان السائل يبقى على المنطقة المعالَجة مدة تكفي لدخوله بدل أن ينزل مع الفرق. ولهذا صُنعت هذه التركيبة.',
    items: [
      {
        name: 'Propylene Glycol',
        dose: '9.995%',
        body: 'نحو عُشر الأمبولة، والثاني بعد الماء. مرطّب جاذب ومُذيب يُبقي المكوّنات الذوّابة في الماء متحرّكة بدل أن تجلس على السطح. وهذا هو أكبر فرق منفرد بين هذه الأمبولة وسيروم فروة عادي.',
      },
      {
        name: 'Carbomer',
        dose: '0.450%',
        body: 'سبب كونه جِلّاً رقيقاً لا ماءً. قوام يكفي بالضبط للبقاء في موضعه على فروة مُبرّة للدقائق التي تهمّ، بلا لزوجة تحت الرولر.',
      },
      {
        name: 'PEG-40 Hydrogenated Castor Oil',
        dose: '1.000%',
        body: 'المُذيب. وهو ما يُبقي أربعة ببتيدات مؤتلفة وقائمة طويلة من المستخلصات النباتية في محلول واحد بدل أن تنفصل في الأمبولة.',
      },
      {
        name: 'Menthol',
        dose: '0.200%',
        body: 'التبريد، وهو أقل عن قصد من 0.300% في تونيك الشعر. ففروة مُبرّة حديثاً لا تحتاج أقوى منثول في المجموعة عليها، وهذه هي الجرعة التي تُقرأ راحةً لا لسعاً.',
      },
      {
        name: 'Niacinamide',
        dose: '0.100%',
        body: 'فيتامين B3 بجرعة عاملة متواضعة، لدعم الحاجز على جلد فروة عُولج للتوّ.',
      },
      {
        name: 'Panthenol',
        dose: '0.100%',
        body: 'فيتامين B5، لحفظ الرطوبة ومرونة الشعر. نصف التركيز في تونيك الشعر، وهو المنتج الذي تلجأين إليه إن كان البانثينول هو المقصود.',
      },
      {
        name: 'مستخلص البروكلي',
        dose: '0.010%',
        body: 'عند 100 جزء من المليون، أكثر النباتات مادةً هنا بعشرة أضعاف، والمستخلص النباتي الوحيد في التركيبة الموجود بكمّية تستحق التسمية. مضاد أكسدة يحمل السلفورافان.',
      },
      {
        name: '1,2-Hexanediol',
        dose: '2.042%',
        body: 'مُذيب يقوم أيضاً بمعظم الحفظ. ويهمّ هنا لأن الفينوكسي إيثانول 30 جزءاً من المليون فقط، وهذا جزء من سبب وجوب استخدام الأمبولة فور فتحها.',
      },
    ],
  },

  copper: {
    eyebrow: 'موضع الببتيد النحاسي',
    title: 'الشيء الوحيد الذي تتصدّر به هذه الأمبولة المجموعة فعلاً',
    intro:
      'الكوبر ترايببتايد-1 مذكور على ثلاث علب في هذه المجموعة. والتراكيز لا تشبه بعضها إطلاقاً، ولن تخبرك قائمة مكوّنات بذلك أبداً. فإن كان الببتيد النحاسي هو ما جاء بك إلى هذه المجموعة، فيستحق أن ترى الثلاثة معاً.',
    rows: [
      { product: 'محلول الشعر α - هذا', dose: '5 ppm', note: '0.0005%', here: true },
      { product: 'تونيك الشعر α', dose: '1 ppm', note: '0.0001%' },
      { product: 'شامبو ميدي للفروة α', dose: '0.01 ppm', note: '0.000001%' },
    ],
    body:
      'خمسة أجزاء من المليون لا تزال جرعة متواضعة بالمطلق، ولن نُلحق بها آلية. لكنها خمسة أضعاف التونيك وخمسمئة ضعف الشامبو، وهي السبب الصريح لكون هذا هو المنتج في المجموعة الذي يفعل فيه الببتيد النحاسي شيئاً بدل أن يظهر على ملصق.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'تقنيتان، مرة أو مرتين أسبوعياً',
    frequency: 'مرة أو مرتين أسبوعياً · تُستخدم الأمبولة فوراً عند فتحها',
    proTitle: 'في العيادة، برولر أو ستامب',
    proSteps: [
      'رجّي الأمبولة قبل الفتح، وهو ما تطلبه العلبة الاحترافية ولا تطلبه علبة المنزل.',
      'افرقي منطقة المعالجة بمشط. وتعطي اللوحة الروسية للشركة تباعداً تتركه الإنجليزية: 1 إلى 2 سم بين الفروق.',
      'اختاري رولر أو ستامب 0.25 إلى 0.5 مم واعملي 10 إلى 15 دقيقة.',
      'نصف أمبولة يغطّي منطقة صغيرة، وأمبولة كاملة منطقة أكبر. وإن استخدمتِ نصفاً، فبرّدي الباقي حتى الجلسة القادمة.',
    ],
    homeTitle: 'في المنزل، بالمُطبّق',
    homeSteps: [
      'ادفعي الغطاء للأعلى باتجاه السهم لإزالة الغطاء والغلاف المعدني.',
      'ثبّتي المُطبّق على فم الأمبولة.',
      'اطبعي عمودياً بضغط ثابت متساوٍ - ولا تجرّيه جانبياً.',
      'ارفعي جانباً واحداً لفصل المُطبّق، واشطفيه تحت ماء جارٍ، ثم اغمسي الإسفنجة في وعاء التطهير بالكحول واطبعي الرأس فيها.',
      'اتركيه يجفّ ثم احفظيه بالغطاء.',
    ],
    note:
      'استخدمي الأمبولة فوراً عند فتحها: فلا حافظ فيها تقريباً، وذلك مقابل تركيبة بهذه النقاء تدخل بشرة مُبرّة. وأبعديها عن العينين. واقرئي الاحتياطات قبل الشراء - فالعلبة تقول بتجنّب هذا المنتج أثناء الحمل والإرضاع.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة. ومسجّل ليس كعلاج بل كمكيّف شعر يُترك، وهذا يستحق المعرفة قبل قراءة تسويق أي أحد.',
    rows: [
      { label: 'المظهر', value: 'سائل غير شفّاف' },
      { label: 'الحموضة', value: '6.65 عند 25 درجة، ضمن مواصفة 6.00-7.00' },
      { label: 'اللزوجة', value: '800، عند حدّ مواصفة 800-1,600 الأدنى' },
      { label: 'الكثافة النوعية', value: '1.0101، ضمن 0.9900-1.0300' },
      { label: 'النقاء', value: 'أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات غير مفتوح، والتاريخ على العلبة' },
      { label: 'بعد الفتح', value: 'يُستخدم فوراً' },
      { label: 'الفئة المسجّلة', value: 'مكيّف شعر يُترك' },
      { label: 'الوظيفة', value: 'إمداد بالتغذية وتكييف الشعر' },
    ],
    patch:
      'الاختبار المتوفّر هو اختبار لصقة لتهيّج الجلد، أجراه مختبر مستقل، وعاد غير مهيّج، وهو ما يدعم سطر «مختبر جلدياً» على العلبة. ويضيف المُقيّم تحفّظاً يستحق النقل: عدد المتطوّعين لم يكن ذا دلالة إحصائية. وفيما عدا ذلك يسجّل التقييم «اختبارات أخرى: لا شيء مقدّم» و«بيانات المراجع: غير منطبقة» - فلا دراسة فعالية خلف هذا المنتج، ولن نوحي بوجود واحدة.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الأمبولة',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يُتجنّب أثناء الحمل والإرضاع. وهذا مطبوع على العلبة، ويعزوه المُقيّم إلى المنثول.',
      'للاستعمال الخارجي فقط، على فروة الرأس.',
      'يُتجنّب ملامسة العينين والأغشية المخاطية؛ ويُشطف جيداً بماء بارد عند الملامسة. لا يُستخدم قرب العينين.',
      'تُستخدم الأمبولة فوراً عند فتحها. ولا تُحفظ أمبولة مفتوحة في حرارة الغرفة.',
      'لا يُستخدم على فروة مجروحة أو مصابة. وإن كنتِ تستخدمين الإبر الدقيقة، فاتّبعي تعليمات نظافة جهازك.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'يُحفظ في مكان بارد جافّ بعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بلوحتَي المنزل والاحتراف معاً.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '4 مل × 8 أمبولات لمرة واحدة' },
      { label: 'الملمس', value: 'سائل غير شفّاف، مُجَلّ قليلاً' },
      { label: 'الفئة المسجّلة', value: 'مكيّف شعر يُترك' },
      { label: 'الوظيفة', value: 'إمداد بالتغذية وتكييف الشعر' },
      { label: 'الحامل', value: 'بروبيلين جليكول 9.995%، 1,2-هكسانديول 2.042%، PEG-40 زيت خروع مهدرج 1.000%، كاربومر 0.450%' },
      { label: 'بجرعة', value: 'منثول 0.200%، نياسيناميد 0.100%، بانثينول 0.100%' },
      { label: 'كوبر ترايببتايد-1', value: '0.0005% (5 ppm) - الأعلى في المجموعة' },
      { label: 'عوامل النموّ', value: 'sh-Polypeptide-9 و-7 بـ 0.5 ppm لكل، sh-Oligopeptide-1 0.15 ppm، sh-Polypeptide-71 0.05 ppm. المجموع 1.2 ppm' },
      { label: 'النباتات', value: 'بروكلي 100 ppm، نخيل المنشار 10 ppm، تسعة مستخلصات Black Complex بـ 1 ppm لكل' },
      { label: 'الحموضة', value: '6.00-7.00 (6.65 على الدفعة المختبرة)' },
      { label: 'الاختبار', value: 'اختبار لصقة، غير مهيّج. ولا توجد دراسة فعالية' },
      { label: 'التكرار', value: 'مرة أو مرتين أسبوعياً' },
      { label: 'ليس لأجل', value: 'الحمل والإرضاع. ولا قرب العينين' },
      { label: 'الصلاحية', value: 'ثلاث سنوات غير مفتوح؛ وتُستخدم الأمبولة فوراً عند فتحها' },
      { label: 'موجود أيضاً في', value: 'طقم إتش آر³ ماتريكس ميزوبيشيا' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل سيُعيد هذا نموّ شعري؟',
        a: 'لا، ومن يقول لك إن أمبولة تجميلية ستفعل ذلك فهو يبيعك شيئاً. فخارج كوريا هذا مسجّل كمكيّف شعر يُترك، وسطر الوظيفة على العلبة يقول «إمداد بالتغذية وتكييف الشعر». وما يُحسنه هو تبريد وتكييف فروة عُولجت للتوّ بالإبر الدقيقة، في حامل مبني للبقاء على بشرة معالَجة. وإن كنتِ تفقدين شعراً فراجعي طبيباً - فهناك أدوية فعلية لهذا وتعمل بآلية لا يُسمح لأي مستحضر تجميلي بادّعائها.',
      },
      {
        q: 'فلماذا عوامل النموّ على مقدّمة العلبة؟',
        a: 'لأنها فيه، ولأنها غالية. فالأربعة كلها ببتيدات مؤتلفة حقيقية. ومجموعها 1.2 جزء من المليون، وهو ما نفضّل إخبارك به على أن نتركك تستنتجين. اعتبريها جزءاً ممّا تدفعين مقابله في أمبولة متميّزة، لا سبب عملها.',
      },
      {
        q: 'أحتاج جهاز إبر دقيقة لاستخدامه؟',
        a: 'مصمَّم لواحد، وهناك تكون التركيبة منطقية. وطقم المنزل يشمل مُطبّقاً تطبعينه عمودياً في الفروة، مع فرشاة تنظيف ووعاء تطهير له. وفي العيادة رولر أو ستامب 0.25 إلى 0.5 مم لعشر إلى خمس عشرة دقيقة. ويمكنك طبطبته على فروة عارية، لكنك حينها تدفعين ثمن أمبولة مقابل مكيّف.',
      },
      {
        q: 'لماذا يجب استخدام الأمبولة فوراً؟',
        a: 'لأن الحافظ فيها يكاد لا يوجد - فينوكسي إيثانول 30 جزءاً من المليون، والـ 1,2-هكسانديول يقوم بمعظم العمل. وذلك مقصود لشيء يدخل بشرة مُبرّة، ومقابله أن الأمبولة المفتوحة لا تُحفظ. وفي العيادة يمكن تبريد أمبولة نصف مستخدمة حتى الجلسة القادمة؛ وفي المنزل، أكملها.',
      },
      {
        q: 'أيمكن استخدامه أثناء الحمل؟',
        a: 'لا. فالعلبة تقول بتجنّب هذا المنتج أثناء الحمل والإرضاع، ويعزو مُقيّم السلامة ذلك إلى المنثول لا إلى شيء غريب. وهو قرار متحفّظ من المُقيّم لا دليل ضرر، لكنه مطبوع على العلبة ولن نتجاوزه معك بالكلام.',
      },
      {
        q: 'كيف يختلف عن تونيك الشعر؟',
        a: 'وظيفتان مختلفتان. فالتونيك بخّاخ يومي 70 مل يُترك، وفعّالاته الثلاثة كلها مقيسة على الدفعة، ومنها حمض ساليسيليك 0.25% - لكنه يحمل قائمة تجنّب حقيقية. وهذا أمبولة أسبوعية بخمسة أضعاف الببتيد النحاسي، مبنية لتُدخَل بالإبر. ومعظم من يستخدم الاثنين يجعل التونيك يومياً وهذا مرة أو مرتين أسبوعياً. وإن كان لك واحد فقط ولستِ تستخدمين الإبر الدقيقة، فاشتري التونيك.',
      },
      {
        q: '4 مل أم 5 مل في الأمبولة؟',
        a: 'أربعة. فكلتا العلبتين المسجّلتين تقولان 4 مل × 8 أمبولات، بالإنجليزية وبالروسية. وعرض الشركة التسويقي يقول 5 مل، ونعتقد أنه قديم، وحين يختلف عرض تسويقي وعلبة مسجّلة تفوز العلبة. وثماني أمبولات بمعدّل مرة أو مرتين أسبوعياً تعني شهراً إلى شهرين من الاستخدام.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const LEGACY_HAIR_SOLUTION_RU: HairSolutionCopy = {
  eyebrow: 'HR³ MATRIX Hair Solution α · 4 мл × 8 ампул',
  headline: 'Тот, что создан вводиться иглами.',
  subheadline:
    'Всё остальное в этой линии наносится и распределяется. Это - прокатывается роллером или вбивается штампом в кожу головы, и это меняет то, что важно: носитель и есть большая часть формулы. Пропиленгликоль 9,995%, солюбилизатор и карбомер 0,450% дают тонкий непрозрачный гель, который остаётся там, куда его нанесли на обработанную кожу, а не стекает. Ментол 0,200% для охлаждения и медный трипептид-1 в самой высокой концентрации во всей линейке.',
  heroBullets: [
    'Составлен как носитель для микронидлинга, а не как несмываемая сыворотка',
    'Медный трипептид-1 при 5 ppm - в пять раз больше тоника, в пятьсот раз больше шампуня',
    'Четыре фактора роста с коробки в сумме дают 1,2 части на миллион. Это реальная цифра',
    'Одноразовые ампулы 4 мл · избегать при беременности и кормлении',
  ],
  badges: ['Сделано в Корее', '4 мл × 8', 'Одноразовые ампулы', 'Дерматологически протестировано'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '5 ppm', label: 'медного трипептида-1, больше всех в линейке' },
    { value: '1,2 ppm', label: 'все четыре фактора роста вместе' },
    { value: '0,200%', label: 'ментола' },
    { value: '8', label: 'одноразовых ампул по 4 мл' },
  ],

  growthFactors: {
    eyebrow: 'Цифра, которую никто не печатает',
    title: 'Четыре фактора роста и их сумма',
    intro:
      'Факторы роста - причина цены этой ампулы и первое, что написано на коробке. Они действительно присутствуют, действительно рекомбинантные и действительно дорогое сырьё. Вот сколько каждого во флаконе.',
    rows: [
      { name: 'sh-Polypeptide-9', alias: 'последовательность VEGF', dose: '0,5 ppm' },
      { name: 'sh-Polypeptide-7', alias: 'последовательность соматотропина', dose: '0,5 ppm' },
      { name: 'sh-Oligopeptide-1', alias: 'последовательность EGF', dose: '0,15 ppm' },
      { name: 'sh-Polypeptide-71', alias: 'последовательность VIP', dose: '0,05 ppm' },
    ],
    total: '1,2 ppm',
    totalLabel: 'суммарно',
    body:
      'Одна и одна пятая части на миллион на все четыре. Мы могли бы описать, что каждый пептид делает в лаборатории, и позволить вам предположить, что это происходит на вашей голове; литература самого производителя именно так и делает, причём заходит значительно дальше. Вместо этого: они есть, сырьё настоящее, а доза такая, какая есть. Что эта ампула надёжно делает - охлаждает обработанную кожу головы, кондиционирует её и доставляет вещества в кожу, только что открытую иглой. Это стоит покупать. Механизм при 1,2 ppm - не то, что вы покупаете.',
  },

  vehicle: {
    eyebrow: 'Работающая формула',
    title: 'В ампуле для микронидлинга носитель и есть продукт',
    intro:
      'Когда в коже головы уже сделаны микроканалы, вопрос больше не в том, насколько приятна сыворотка. Вопрос в том, останется ли жидкость на обработанном участке достаточно долго, чтобы войти, а не стечь по пробору. Именно для этого сделана эта формула.',
    items: [
      {
        name: 'Propylene Glycol',
        dose: '9.995%',
        body: 'Почти десятая часть ампулы и второй компонент после воды. Увлажнитель и растворитель, который держит водорастворимые ингредиенты в движении, а не оставляет их на поверхности. Это главное отличие этой ампулы от обычной сыворотки для кожи головы.',
      },
      {
        name: 'Carbomer',
        dose: '0.450%',
        body: 'Причина того, что это тонкий гель, а не вода. Ровно столько плотности, чтобы удержать позицию на обработанной иглами коже в те минуты, которые важны, и без липкости под роллером.',
      },
      {
        name: 'PEG-40 Hydrogenated Castor Oil',
        dose: '1.000%',
        body: 'Солюбилизатор. Именно он держит четыре рекомбинантных пептида и длинный список растительных экстрактов в одном растворе, не давая им расслоиться в ампуле.',
      },
      {
        name: 'Menthol',
        dose: '0.200%',
        body: 'Охлаждение, и намеренно ниже, чем 0,300% в тонике. Только что обработанной иглами коже головы не нужен самый сильный ментол линейки, и это доза, которая читается как облегчение, а не как жжение.',
      },
      {
        name: 'Niacinamide',
        dose: '0.100%',
        body: 'Витамин B3 в скромной, но реальной дозе - поддержка барьера кожи головы сразу после процедуры.',
      },
      {
        name: 'Panthenol',
        dose: '0.100%',
        body: 'Витамин B5, для удержания влаги и эластичности волоса. Половина концентрации тоника - если пантенол и есть цель, то это другой продукт.',
      },
      {
        name: 'Экстракт брокколи',
        dose: '0.010%',
        body: 'При 100 ppm - самый весомый растительный экстракт здесь, в десять раз, и единственный, присутствующий в количестве, которое стоит называть. Антиоксидант с сульфорафаном.',
      },
      {
        name: '1,2-Hexanediol',
        dose: '2.042%',
        body: 'Растворитель, который выполняет и большую часть консервации. Здесь это важно, потому что феноксиэтанола всего 30 ppm - отчасти поэтому ампулу нужно использовать сразу после открытия.',
      },
    ],
  },

  copper: {
    eyebrow: 'Где медный пептид',
    title: 'Единственное, в чём эта ампула действительно первая в линейке',
    intro:
      'Медный трипептид-1 назван на трёх коробках этой линии. Концентрации не имеют между собой ничего общего, и список ингредиентов вам этого никогда не скажет. Если вы пришли в эту линию за медным пептидом, стоит увидеть все три рядом.',
    rows: [
      { product: 'Hair Solution α - этот', dose: '5 ppm', note: '0,0005%', here: true },
      { product: 'Тоник для кожи головы α', dose: '1 ppm', note: '0,0001%' },
      { product: 'MEDI шампунь α', dose: '0,01 ppm', note: '0,000001%' },
    ],
    body:
      'Пять частей на миллион - по-прежнему скромная доза в абсолютном выражении, и мы не станем приписывать ей механизм. Но это в пять раз больше тоника и в пятьсот раз больше шампуня, и это честная причина считать именно этот продукт тем, где медный пептид что-то делает, а не просто присутствует на этикетке.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Две техники, раз или два в неделю',
    frequency: 'Раз или два в неделю · ампулу использовать сразу после открытия',
    proTitle: 'В клинике, роллером или штампом',
    proSteps: [
      'Встряхните ампулу перед открытием - этого требует профессиональная коробка и не требует домашняя.',
      'Разделите зону обработки расчёской. Русская панель производителя даёт интервал, который английская опускает: 1-2 см между проборами.',
      'Выберите роллер или штамп 0,25-0,5 мм и работайте 10-15 минут.',
      'Половина ампулы покрывает небольшую зону, целая - большую. Если использовали половину, охладите остаток до следующего сеанса.',
    ],
    homeTitle: 'Дома, аппликатором',
    homeSteps: [
      'Сдвиньте колпачок вверх по направлению стрелки, чтобы снять колпачок и металлическую крышку.',
      'Установите аппликатор на горлышко ампулы.',
      'Вбивайте вертикально с ровным постоянным нажимом - не ведите его в сторону.',
      'Приподнимите один край, чтобы снять аппликатор, промойте его под струёй воды, затем смочите спонж в дезинфицирующей баночке со спиртом и прижмите к нему рабочую часть.',
      'Дайте высохнуть и храните с надетым колпачком.',
    ],
    note:
      'Используйте ампулу сразу после открытия: консерванта в ней почти нет, и это плата за настолько чистую формулу, входящую в обработанную иглами кожу. Держите подальше от глаз. И прочтите предостережения до покупки - на коробке указано избегать этого продукта при беременности и кормлении.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее и выпущено против письменной спецификации. Зарегистрировано не как средство лечения, а как несмываемый кондиционер для волос - это стоит знать, прежде чем читать чей-либо маркетинг.',
    rows: [
      { label: 'Внешний вид', value: 'Непрозрачная жидкость' },
      { label: 'pH', value: '6,65 при 25 °C, в пределах спецификации 6,00-7,00' },
      { label: 'Вязкость', value: '800, по нижней границе спецификации 800-1 600' },
      { label: 'Удельный вес', value: '1,0101, в пределах 0,9900-1,0300' },
      { label: 'Чистота', value: 'Менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Срок годности', value: 'Три года невскрытым, дата на коробке' },
      { label: 'После открытия', value: 'Использовать сразу' },
      { label: 'Зарегистрированная категория', value: 'Несмываемый кондиционер для волос' },
      { label: 'Функция', value: 'Питание и кондиционирование волос' },
    ],
    patch:
      'Тест в деле - патч-тест на кожное раздражение, проведённый независимой лабораторией, и он вернулся как «не раздражающий», что и подкрепляет строку «дерматологически протестировано» на коробке. Оценщик добавляет оговорку, которую стоит передать: число добровольцев не было статистически значимым. В остальном оценка фиксирует «другие тесты: не представлены» и «литературные данные: не применимо» - то есть исследования эффективности за этим продуктом нет, и мы не будем намекать на обратное.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что в ампуле',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Избегать при беременности и кормлении. Это напечатано на коробке, и оценщик связывает это с ментолом.',
      'Только для наружного применения, на кожу головы.',
      'Избегайте контакта с глазами и слизистыми; при попадании тщательно промойте прохладной водой. Не применять рядом с глазами.',
      'Ампулу использовать сразу после открытия. Не храните открытую ампулу при комнатной температуре.',
      'Не наносить на повреждённую или инфицированную кожу головы. При микронидлинге соблюдайте инструкции по гигиене своего устройства.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Хранить в прохладном сухом месте, вне доступа детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, по домашней и профессиональной панелям вместе.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '4 мл × 8 одноразовых ампул' },
      { label: 'Текстура', value: 'Непрозрачная жидкость, слегка гелевая' },
      { label: 'Зарегистрированная категория', value: 'Несмываемый кондиционер для волос' },
      { label: 'Функция', value: 'Питание и кондиционирование волос' },
      { label: 'Носитель', value: 'Пропиленгликоль 9,995%, 1,2-гександиол 2,042%, PEG-40 гидрогенизированное касторовое масло 1,000%, карбомер 0,450%' },
      { label: 'В дозе', value: 'Ментол 0,200%, ниацинамид 0,100%, пантенол 0,100%' },
      { label: 'Медный трипептид-1', value: '0,0005% (5 ppm) - больше всех в линейке' },
      { label: 'Факторы роста', value: 'sh-Polypeptide-9 и -7 по 0,5 ppm, sh-Oligopeptide-1 0,15 ppm, sh-Polypeptide-71 0,05 ppm. Всего 1,2 ppm' },
      { label: 'Растительные', value: 'Брокколи 100 ppm, сереноа 10 ppm, девять экстрактов Black Complex по 1 ppm' },
      { label: 'pH', value: '6,00-7,00 (6,65 в измеренной партии)' },
      { label: 'Тестирование', value: 'Патч-тест, не раздражающий. Исследования эффективности нет' },
      { label: 'Частота', value: 'Раз или два в неделю' },
      { label: 'Не для', value: 'Беременности и кормления. Не рядом с глазами' },
      { label: 'Срок', value: 'Три года невскрытым; ампулу использовать сразу после открытия' },
      { label: 'Также входит в', value: 'Набор HR³ MATRIX Mesopecia' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Это вернёт мне волосы?',
        a: 'Нет, и тот, кто говорит, что косметическая ампула это сделает, вам что-то продаёт. За пределами Кореи это зарегистрировано как несмываемый кондиционер для волос, а строка функции на коробке гласит «питание и кондиционирование волос». Что он делает хорошо - охлаждает и кондиционирует кожу головы сразу после микронидлинга, в носителе, созданном держаться на обработанной коже. Если вы теряете волосы, обратитесь к врачу: для этого есть настоящие лекарства, и они работают по механизму, заявлять который косметике не позволено.',
      },
      {
        q: 'Тогда почему факторы роста на лицевой стороне коробки?',
        a: 'Потому что они в ней и потому что они дорогие. Все четыре - настоящие рекомбинантные пептиды. В сумме они дают 1,2 части на миллион, и мы предпочтём сказать это, а не позволить вам додумать. Считайте их частью того, за что вы платите в премиальной ампуле, а не причиной, по которой она работает.',
      },
      {
        q: 'Нужен ли прибор для микронидлинга?',
        a: 'Он для этого и создан, и именно там формула обретает смысл. Домашний набор включает аппликатор, которым вбивают вертикально в кожу головы, плюс щётку для очистки и дезинфицирующую баночку. В клинике это роллер или штамп 0,25-0,5 мм на 10-15 минут. Можно вбить и на нетронутую кожу, но тогда вы платите цену ампулы за кондиционер.',
      },
      {
        q: 'Почему ампулу нужно использовать сразу?',
        a: 'Потому что консерванта в ней почти нет - феноксиэтанол 30 частей на миллион, а основную работу делает 1,2-гександиол. Это осознанно для того, что вводится в обработанную иглами кожу, и плата за это - открытая ампула не хранится. В клинике наполовину использованную ампулу можно охладить до следующего сеанса; дома - доиспользуйте.',
      },
      {
        q: 'Можно при беременности?',
        a: 'Нет. На коробке указано избегать этого продукта при беременности и кормлении, и оценщик безопасности связывает это с ментолом, а не с чем-то экзотическим. Это консервативное решение оценщика, а не доказательство вреда, но оно напечатано на коробке, и мы не станем вас через него уговаривать.',
      },
      {
        q: 'Чем он отличается от тоника?',
        a: 'Разные задачи. Тоник - ежедневный несмываемый спрей 70 мл, у которого все три актива измерены в партии, включая салициловую кислоту 0,25%, - но он несёт реальный список ограничений. Это недельная ампула с пятикратным медным пептидом, созданная вводиться иглами. Большинство, кто использует оба, делает тоник ежедневно, а это раз или два в неделю. Если можно только одно и вы не занимаетесь микронидлингом, берите тоник.',
      },
      {
        q: '4 мл или 5 мл в ампуле?',
        a: 'Четыре. Обе зарегистрированные коробки говорят 4 мл × 8 ампул, по-английски и по-русски. Маркетинговая презентация производителя говорит 5 мл, и мы считаем её устаревшей: когда презентация и зарегистрированная коробка расходятся, побеждает коробка. Восемь ампул при одном-двух применениях в неделю - это примерно от месяца до двух.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const HAIR_SOLUTION_COPY: Record<Locale, HairSolutionCopy> = {
  en: EN,
  ar: hairSolutionArAudited,
  ru: hairSolutionRuAudited,
}

// Retained temporarily for source-history comparison; neither object is served.
void LEGACY_HAIR_SOLUTION_AR
void LEGACY_HAIR_SOLUTION_RU

export function getHairSolutionCopy(locale: string | undefined): HairSolutionCopy {
  return HAIR_SOLUTION_COPY[(locale as Locale) ?? 'en'] ?? HAIR_SOLUTION_COPY.en
}

/** The kit it ships inside, the tonic, the peeling that precedes it, then the shampoo. */
export const COMPANION_PRODUCT_IDS = ['47', '43', '46', '44'] as const
