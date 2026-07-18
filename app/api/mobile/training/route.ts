/**
 * Mobile Training API - GET /api/mobile/training
 * Returns training documents, product documentation, and video lessons
 * for the native mobile app.
 *
 * Accepts x-locale header: 'en' | 'ar' | 'ru' (defaults to 'en')
 */

import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://genosys.ae'

// Training documents - manuals, guides, catalogues
const trainingDocuments = [
  {
    id: 'product-catalogue',
    title: 'Product Catalogue 2026',
    description: 'Complete product catalog for 2026 featuring all GENOSYS products and specifications.',
    descriptionAr: 'كتالوج المنتجات الكامل لعام 2026 يضم جميع منتجات ومواصفات GENOSYS.',
    descriptionRu: 'Полный каталог продукции 2026 года со всеми продуктами и характеристиками GENOSYS.',
    downloadUrl: `${BASE_URL}/documents/GENOSYS%20Catalogue_2026.pdf`,
    fileSize: '39.9 MB',
    icon: 'book',
    category: 'training',
  },
  {
    id: 'home-care-guide',
    title: 'Home Care Guide 2026',
    description: 'Comprehensive home care guide for clients using GENOSYS products.',
    descriptionAr: 'دليل العناية المنزلية الشامل للعملاء الذين يستخدمون منتجات GENOSYS.',
    descriptionRu: 'Полное руководство по домашнему уходу для клиентов, использующих средства GENOSYS.',
    downloadUrl: `${BASE_URL}/documents/Genosys-Home-Care-Guide.pdf`,
    fileSize: '9.8 MB',
    icon: 'home',
    category: 'training',
  },
  {
    id: 'professional-manual',
    title: 'Professional Manual 2026',
    description: 'Professional manual for practitioners using GENOSYS products in clinical settings.',
    descriptionAr: 'الدليل المهني للممارسين الذين يستخدمون منتجات GENOSYS في البيئات السريرية.',
    descriptionRu: 'Профессиональное руководство для специалистов, работающих со средствами GENOSYS в клинических условиях.',
    downloadUrl: `${BASE_URL}/documents/Genosys-Professional-Manual.pdf`,
    fileSize: '10.4 MB',
    icon: 'medical',
    category: 'training',
  },
  {
    id: 'facial-treatment-homecare',
    title: 'Facial Treatment Homecare 2026',
    description: 'Detailed guide for facial treatment homecare protocols.',
    descriptionAr: 'دليل تفصيلي لبروتوكولات العناية المنزلية لعلاجات الوجه.',
    descriptionRu: 'Подробное руководство по протоколам домашнего ухода за лицом.',
    downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf`,
    fileSize: '8.2 MB',
    icon: 'sparkles',
    category: 'training',
  },
  {
    id: 'facial-treatment-pro',
    title: 'Facial Treatment Professional 2026',
    description: 'Professional facial treatment protocols and techniques.',
    descriptionAr: 'بروتوكولات وتقنيات علاج الوجه المهنية.',
    descriptionRu: 'Профессиональные протоколы и техники лечения лица.',
    downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf`,
    fileSize: '8.2 MB',
    icon: 'medkit',
    category: 'training',
  },
  {
    id: 'korean-glass-skin',
    title: 'Korean Glass Skin GENOSYS',
    description: 'Achieve the Korean Glass Skin look with the GENOSYS approach.',
    descriptionAr: 'احصل على مظهر البشرة الزجاجية الكورية مع منهج GENOSYS.',
    descriptionRu: 'Достигните эффекта корейской «стеклянной кожи» с подходом GENOSYS.',
    downloadUrl: `${BASE_URL}/documents/ppt/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf`,
    fileSize: '10 MB',
    icon: 'diamond',
    category: 'training',
  },
  {
    id: 'bio-meso-pdrn',
    title: 'Bio-Meso PDRN Expert Guide',
    description: 'Expert guide for Bio-Meso PDRN treatment protocols.',
    descriptionAr: 'دليل الخبراء لبروتوكولات علاج Bio-Meso PDRN.',
    descriptionRu: 'Экспертное руководство по протоколам лечения Bio-Meso PDRN.',
    downloadUrl: `${BASE_URL}/documents/ppt/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf`,
    fileSize: '8.9 MB',
    icon: 'flask',
    category: 'training',
  },
  {
    id: 'microneedling-protocols',
    title: 'Microneedling Protocols (Carboxy + Power Solutions)',
    description: 'Complete microneedling protocols for Clinic 971: Anti-Wrinkle, Anti-Pigmentation, Acne, Rejuvenation, SRS Peeling, Hydration, Neck/Décolleté, and Eye Area.',
    descriptionAr: 'بروتوكولات الميكرونيدلينج الكاملة لعيادة 971: مكافحة التجاعيد، مكافحة التصبغ، حب الشباب، تجديد البشرة، التقشير، الترطيب، الرقبة/الصدر، ومنطقة العين.',
    descriptionRu: 'Полные протоколы микронидлинга для Clinic 971: против морщин, против пигментации, акне, омоложение, SRS пилинг, гидратация, шея/декольте и область глаз.',
    downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS_Microneedling_Protocols.pdf`,
    fileSize: '1.2 MB',
    icon: 'medkit',
    category: 'training',
  },
]

// Product documentation - each linked to a product with image
const productDocuments = [
  { id: 'cerabarrier-cleanser', title: 'CERABARRIER BIOME GEL CLEANSER', fileSize: '1.4 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf`, image: `${BASE_URL}/images/cera/main.jpeg`, productId: '66' },
  { id: 'radiance-cream', title: 'MULTI VITA RADIANCE CREAM', fileSize: '2.1 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf`, image: `${BASE_URL}/images/RAA.jpg`, productId: '31' },
  { id: 'eyecell-zone', title: 'EyeCell EYE ZONE CARE SYSTEM', fileSize: '1.8 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf`, image: `${BASE_URL}/images/EYEZ.jpg`, productId: '50' },
  { id: 'epi-peeling', title: 'EPI TURNOVER BOOSTING PEELING GEL', fileSize: '3.8 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf`, image: `${BASE_URL}/images/epi/main.jpeg`, productId: '12' },
  { id: 'radiance-serum', title: 'MULTI VITA RADIANCE SERUM', fileSize: '1.5 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf`, image: `${BASE_URL}/images/RADS.jpg`, productId: '21' },
  { id: 'skin-defender', title: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', fileSize: '0.7 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf`, image: `${BASE_URL}/images/remover/Main2.jpg`, productId: '11' },
  { id: 'microbiome-mist', title: 'MICROBIOME ENERGY INFUSING MIST', fileSize: '0.8 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf`, image: `${BASE_URL}/images/mist/main2.jpeg`, productId: '14' },
  { id: 'skin-rescue', title: 'SKIN RESCUE OVERNIGHT CREAM MASK', fileSize: '1.3 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf`, image: `${BASE_URL}/images/overnight/main.jpeg`, productId: '34' },
  { id: 'problem-toner', title: 'INTENSIVE PROBLEM CONTROL TONER', fileSize: '1.0 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf`, image: `${BASE_URL}/images/problem/Main.jpg`, productId: '15' },
  { id: 'sun-cream', title: 'ULTRA SHIELD SUN CREAM', fileSize: '0.6 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf`, image: `${BASE_URL}/images/SPF50.jpg`, productId: '39' },
  { id: 'scalp-shampoo', title: 'HR³ MATRIX SCALP SHAMPOO α', fileSize: '2.3 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf`, image: `${BASE_URL}/images/Sham.jpg`, productId: '44' },
  { id: 'hyaluron-serum', title: 'MOISTURE REPLENISHING HYALURON SERUM', fileSize: '1.9 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf`, image: `${BASE_URL}/images/HRS.jpg`, productId: '18' },
  { id: 'hyaluron-cream', title: 'MOISTURE REPLENISHING HYALURON CREAM', fileSize: '2.0 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf`, image: `${BASE_URL}/images/HER.jpg`, productId: '29' },
  { id: 'bb-cushion', title: 'SKIN CARING BLEMISH BALM CUSHION', fileSize: '1.2 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf`, image: `${BASE_URL}/images/BBC.jpg`, productId: '41' },
  { id: 'revita-glow-bb', title: 'REVITA GLOW BLEMISH BALM CREAM', fileSize: '2.0 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS_REVITA_GLOW_BB_CREAM.pdf`, image: `${BASE_URL}/images/revita/main.jpg`, productId: '63' },
  { id: 'eye-patch', title: 'EyeCell EYE PEPTIDE GEL PATCH', fileSize: '1.4 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf`, image: `${BASE_URL}/images/Patch.jpg`, productId: '33' },
  { id: 'bio-ferment', title: 'BIO-FERMENT AGE DEFYING POWDER MASK', fileSize: '2.1 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf`, image: `${BASE_URL}/images/BFAD.png`, productId: '51' },
  { id: 'hair-gentron', title: 'HAIR GENTRON', fileSize: '1.8 MB', downloadUrl: `${BASE_URL}/documents/ppt/HAIR%20GENTRON.pdf`, image: `${BASE_URL}/images/gen.jpg`, productId: '48' },
  { id: 'hair-solution', title: 'HR³ MATRIX HAIR SOLUTION α', fileSize: '2.3 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf`, image: `${BASE_URL}/images/HHR.jpg`, productId: '45' },
  { id: 'hair-tonic', title: 'HR³ MATRIX HAIR TONIC α', fileSize: '1.9 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf`, image: `${BASE_URL}/images/HT.jpg`, productId: '43' },
  { id: 'scalp-peeling', title: 'HR³ MATRIX SCALP PEELING α', fileSize: '2.1 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf`, image: `${BASE_URL}/images/scal.jpg`, productId: '46' },
  { id: 'scalp-brush', title: 'HR³ MATRIX SCALP BRUSH', fileSize: '0.4 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20BRUSH.pdf`, image: `${BASE_URL}/images/Second/brush.jpg`, productId: '61' },
  { id: 'geno-led', title: 'GENO-LED IR II', fileSize: '4.6 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENO-LED%20IR%20II_2025.pdf`, image: `${BASE_URL}/images/LEDD.jpg`, productId: '49' },
  { id: 'pdrn-mask', title: 'SKIN REBOOT PDRN MASK PACK', fileSize: '1.2 MB', downloadUrl: `${BASE_URL}/documents/ppt/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf`, image: `${BASE_URL}/images/PDRN.png`, productId: '52' },
  { id: 'co2-mask', title: 'EZ CO₂ MASK KIT', fileSize: '0.5 MB', downloadUrl: `${BASE_URL}/documents/ppt/Genosys%20Ez%20Co2%20Mask.pdf`, image: `${BASE_URL}/images/EZE.jpg`, productId: '38' },
  { id: 'microneedle', title: 'Microneedle Roller', fileSize: '1.5 MB', downloadUrl: `${BASE_URL}/documents/ppt/Overview%20of%20Microneedling_S.pdf`, image: `${BASE_URL}/images/genosys-microneedling-devices.jpg`, productId: '1' },
]

// Training videos with real YouTube IDs
const trainingVideos = [
  {
    id: 'bodycell-stretch-mark',
    title: 'Genosys Bodycell Stretch Mark Treatment',
    titleAr: 'علاج علامات التمدد بتقنية Bodycell من Genosys',
    titleRu: 'Лечение растяжек Genosys Bodycell',
    youtubeId: 'SvjziVjhb8s',
    duration: '15-20 min',
    level: 'Professional',
    category: 'Body Treatments',
  },
  {
    id: 'ndcell-neck',
    title: 'Genosys NDcell Neck & Decollete Treatment',
    titleAr: 'علاج الرقبة والديكولتيه NDcell من Genosys',
    titleRu: 'Лечение шеи и декольте Genosys NDcell',
    youtubeId: 'm07q2XRt_OM',
    duration: '18-22 min',
    level: 'Advanced Professional',
    category: 'Specialized Treatments',
  },
  {
    id: 'eyecell-treatment',
    title: 'Genosys EyeCell Treatment',
    titleAr: 'علاج العين EyeCell من Genosys',
    titleRu: 'Процедура Genosys EyeCell',
    youtubeId: 'xH58EZtykZE',
    duration: '16-20 min',
    level: 'Advanced Professional',
    category: 'Eye Treatments',
  },
  {
    id: 'hr3-matrix',
    title: 'Genosys HR3 Matrix Treatment',
    titleAr: 'علاج HR3 Matrix من Genosys',
    titleRu: 'Процедура Genosys HR3 Matrix',
    youtubeId: 'qQRcEvd3Ks4',
    duration: '20-25 min',
    level: 'Advanced Professional',
    category: 'Matrix Treatments',
  },
  {
    id: 'facial-treatment',
    title: 'Facial Treatment',
    titleAr: 'علاج الوجه',
    titleRu: 'Уход за лицом',
    youtubeId: 'hMtodh45sME',
    duration: '25-30 min',
    level: 'Professional',
    category: 'Facial Treatments',
  },
  {
    id: 'snow-cleanser',
    title: 'How to use Genosys Snow 02 Cleanser',
    titleAr: 'كيفية استخدام Genosys Snow 02 Cleanser',
    titleRu: 'Как использовать Genosys Snow 02 Cleanser',
    youtubeId: 'SWY0f2gSzl8',
    duration: '12-15 min',
    level: 'Professional',
    category: 'Product Usage',
  },
  {
    id: 'hr3-matrix-advanced',
    title: 'GENOSYS HR3 MATRIX',
    titleAr: 'GENOSYS HR3 MATRIX',
    titleRu: 'GENOSYS HR3 MATRIX',
    youtubeId: 'pM8qIUNdORY',
    duration: '22-28 min',
    level: 'Advanced Professional',
    category: 'Matrix Treatments',
  },
  {
    id: 'hr3-hair-solution',
    title: 'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA',
    titleAr: 'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA',
    titleRu: 'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA',
    youtubeId: 'ZVg5mBVStSw',
    duration: '24-30 min',
    level: 'Advanced Professional',
    category: 'Hair Treatments',
  },
  {
    id: 'eyecell-roller',
    title: 'Eye Cell Treatment - Eye Roller 0.25mm',
    titleAr: 'علاج خلايا العين - بكرة العين 0.25 مم',
    titleRu: 'Eye Cell Treatment - Eye Roller 0.25мм',
    youtubeId: 'zTOnPRnMy8k',
    duration: '14-18 min',
    level: 'Professional',
    category: 'Eye Treatments',
  },
  {
    id: 'hairgen-booster',
    title: 'Genosys HAIRGEN BOOSTER Treatment',
    titleAr: 'علاج HAIRGEN BOOSTER من Genosys',
    titleRu: 'Процедура Genosys HAIRGEN BOOSTER',
    youtubeId: 'dsS-d8HahQA',
    duration: '20-25 min',
    level: 'Advanced Professional',
    category: 'Hair Treatments',
  },
  {
    id: 'hr3-anti-hair-loss',
    title: 'HR3 MATRIX Anti Hair Loss Treatment',
    titleAr: 'علاج تساقط الشعر HR3 MATRIX',
    titleRu: 'HR3 MATRIX лечение выпадения волос',
    youtubeId: 'XwOIRrizmF4',
    duration: '18-22 min',
    level: 'Advanced Professional',
    category: 'Hair Loss Treatments',
  },
]

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = request.headers.get('x-locale') || 'en'

    // Select localized descriptions for training documents
    const localizedTrainingDocs = trainingDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      description: locale === 'ar' ? doc.descriptionAr : locale === 'ru' ? doc.descriptionRu : doc.description,
      downloadUrl: doc.downloadUrl,
      fileSize: doc.fileSize,
      icon: doc.icon,
      category: doc.category,
    }))

    // Product docs (titles are product names — same across locales)
    const localizedProductDocs = productDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      downloadUrl: doc.downloadUrl,
      fileSize: doc.fileSize,
      image: doc.image,
      productId: doc.productId,
      category: 'product',
    }))

    // Select localized titles for videos
    const localizedVideos = trainingVideos.map(video => ({
      id: video.id,
      title: locale === 'ar' ? video.titleAr : locale === 'ru' ? video.titleRu : video.title,
      youtubeId: video.youtubeId,
      thumbnail: `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`,
      duration: video.duration,
      level: video.level,
      category: video.category,
    }))

    return NextResponse.json({
      trainingDocuments: localizedTrainingDocs,
      productDocuments: localizedProductDocs,
      videos: localizedVideos,
      stats: {
        totalDocuments: trainingDocuments.length,
        totalProductDocs: productDocuments.length,
        totalVideos: trainingVideos.length,
      },
      locale,
    })
  } catch (error) {
    console.error('Mobile Training API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
