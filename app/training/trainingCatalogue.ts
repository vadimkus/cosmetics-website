/**
 * The single source of truth for everything on /training.
 *
 * Until this file existed the English, Arabic and Russian training pages each
 * carried their own hand-unrolled copy of the library, which is how they came
 * to disagree: English listed 6 video lessons, Russian 7 and Arabic 11, and
 * the document lists had drifted apart too. All three routes now render the
 * same component from the data below, so a document added here appears in
 * every language at once.
 *
 * Nothing in this file is language-specific. Titles are product names, file
 * names and YouTube lesson titles, which stay as published in all three
 * locales. The surrounding labels live in trainingCopy.ts.
 */

export interface TrainingGuide {
  id: string
  title: string
  size: string
  href: string
}

export interface ProductSheet extends TrainingGuide {
  /** Thumbnail, linked through to the product page. */
  image: string
  productId: string
}

export type TrainingLevel = 'professional' | 'advanced'

export interface TrainingVideo {
  id: string
  title: string
  youtubeId: string
  /** Runtime as a range, in minutes. */
  duration: string
  level: TrainingLevel
}

export const TRAINING_GUIDES: TrainingGuide[] = [
  {
    id: 'product-catalogue',
    title: 'Product Catalogue 2026',
    size: '39.9 MB',
    href: '/documents/GENOSYS%20Catalogue_2026.pdf'
  },
  {
    id: 'home-care-guide',
    title: 'Home Care Guide 2026',
    size: '9.8 MB',
    href: '/documents/Genosys-Home-Care-Guide.pdf'
  },
  {
    id: 'professional-manual',
    title: 'Professional Manual 2026',
    size: '10.4 MB',
    href: '/documents/Genosys-Professional-Manual.pdf'
  },
  {
    id: 'facial-treatment-homecare',
    title: 'Facial Treatment Homecare 2026',
    size: '8.2 MB',
    href: '/documents/PPT/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf'
  },
  {
    id: 'facial-treatment-pro',
    title: 'Facial Treatment Professional 2026',
    size: '8.2 MB',
    href: '/documents/PPT/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf'
  },
  {
    id: 'korean-glass-skin',
    title: 'Korean Glass Skin GENOSYS',
    size: '10 MB',
    href: '/documents/PPT/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf'
  },
  {
    id: 'bio-meso-pdrn',
    title: 'Bio-Meso PDRN Expert Guide',
    size: '8.9 MB',
    href: '/documents/PPT/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf'
  },
  {
    id: 'microneedling-protocols',
    title: 'Microneedling Protocols (Carboxy + Power Solutions)',
    size: '1.2 MB',
    href: '/documents/PPT/GENOSYS_Microneedling_Protocols.pdf'
  }
]
export const PRODUCT_SHEETS: ProductSheet[] = [
  { id: 'cerabarrier-cleanser', title: 'CERABARRIER BIOME GEL CLEANSER', size: '1.4 MB', href: '/documents/PPT/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf', image: '/images/cera/main.jpeg', productId: '66' },
  { id: 'radiance-cream', title: 'MULTI VITA RADIANCE CREAM', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf', image: '/images/radiance/main.jpeg', productId: '31' },
  { id: 'eyecell-zone', title: 'EyeCell EYE ZONE CARE SYSTEM', size: '1.8 MB', href: '/documents/PPT/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf', image: '/images/eye_kit/main.jpeg', productId: '50' },
  { id: 'epi-peeling', title: 'EPI TURNOVER BOOSTING PEELING GEL', size: '3.8 MB', href: '/documents/PPT/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf', image: '/images/epi/main.jpeg', productId: '12' },
  { id: 'radiance-serum', title: 'MULTI VITA RADIANCE SERUM', size: '1.5 MB', href: '/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf', image: '/images/radiance_serum/main.jpeg', productId: '21' },
  { id: 'skin-defender', title: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', size: '0.7 MB', href: '/documents/PPT/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf', image: '/images/defender_0/Main.jpeg', productId: '11' },
  { id: 'microbiome-mist', title: 'MICROBIOME ENERGY INFUSING MIST', size: '0.8 MB', href: '/documents/PPT/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf', image: '/images/mist_0/Main.jpeg', productId: '14' },
  { id: 'skin-rescue', title: 'SKIN RESCUE OVERNIGHT CREAM MASK', size: '1.3 MB', href: '/documents/PPT/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf', image: '/images/overnight/main.jpeg', productId: '34' },
  { id: 'problem-toner', title: 'INTENSIVE PROBLEM CONTROL TONER', size: '1.0 MB', href: '/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf', image: '/images/problem/Main.jpg', productId: '15' },
  { id: 'problem-serum', title: 'PROBLEM CONTROL SERUM', size: '2.2 MB', href: '/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20SERUM.pdf', image: '/images/problems_serum/main.jpeg', productId: '20' },
  { id: 'sun-cream', title: 'ULTRA SHIELD SUN CREAM', size: '0.6 MB', href: '/documents/PPT/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf', image: '/images/ultra/main.jpeg', productId: '39' },
  { id: 'scalp-shampoo', title: 'HR³ MATRIX SCALP SHAMPOO α', size: '2.3 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf', image: '/images/Sham.jpg', productId: '44' },
  { id: 'hyaluron-serum', title: 'MOISTURE REPLENISHING HYALURON SERUM', size: '1.9 MB', href: '/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf', image: '/images/hyaluron_serum/main.jpeg', productId: '18' },
  { id: 'hyaluron-cream', title: 'MOISTURE REPLENISHING HYALURON CREAM', size: '2.0 MB', href: '/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf', image: '/images/hyaluron/main.jpeg', productId: '29' },
  { id: 'bb-cushion', title: 'SKIN CARING BLEMISH BALM CUSHION', size: '1.2 MB', href: '/documents/PPT/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf', image: '/images/cushion_2/main.jpeg', productId: '41' },
  { id: 'revita-glow-bb', title: 'REVITA GLOW BLEMISH BALM CREAM', size: '2.0 MB', href: '/documents/PPT/GENOSYS_REVITA_GLOW_BB_CREAM.pdf', image: '/images/revita/main.jpg', productId: '63' },
  { id: 'eye-patch', title: 'EyeCell EYE PEPTIDE GEL PATCH', size: '1.4 MB', href: '/documents/PPT/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf', image: '/images/patch/main.jpeg', productId: '33' },
  { id: 'bio-ferment', title: 'BIO-FERMENT AGE DEFYING POWDER MASK', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf', image: '/images/BFAD.png', productId: '51' },
  { id: 'hair-gentron', title: 'HAIR GENTRON', size: '1.8 MB', href: '/documents/PPT/HAIR%20GENTRON.pdf', image: '/images/gen.jpg', productId: '48' },
  { id: 'hair-solution', title: 'HR³ MATRIX HAIR SOLUTION α', size: '2.3 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf', image: '/images/HHR.jpg', productId: '45' },
  { id: 'hair-tonic', title: 'HR³ MATRIX HAIR TONIC α', size: '1.9 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf', image: '/images/hair_tonic/main-v2.jpeg', productId: '43' },
  { id: 'scalp-peeling', title: 'HR³ MATRIX SCALP PEELING α', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf', image: '/images/scal.jpg', productId: '46' },
  { id: 'scalp-brush', title: 'HR³ MATRIX SCALP BRUSH', size: '0.4 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20BRUSH.pdf', image: '/images/Second/brush.jpg', productId: '61' },
  { id: 'geno-led', title: 'GENO-LED IR II', size: '4.6 MB', href: '/documents/PPT/GENO-LED%20IR%20II_2025.pdf', image: '/images/LEDD.jpg', productId: '49' },
  { id: 'pdrn-mask', title: 'SKIN REBOOT PDRN MASK PACK', size: '1.2 MB', href: '/documents/PPT/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf', image: '/images/PDRN.png', productId: '52' },
  { id: 'co2-mask', title: 'EZ CO₂ MASK KIT', size: '0.5 MB', href: '/documents/PPT/Genosys%20Ez%20Co2%20Mask.pdf', image: '/images/ez_mask/main.jpeg', productId: '38' },
  { id: 'microneedle', title: 'Microneedle Roller', size: '1.5 MB', href: '/documents/PPT/Overview%20of%20Microneedling_S.pdf', image: '/images/genosys-microneedling-devices.jpg', productId: '1' },
]

/**
 * The union of every lesson that was published on any one language. Five of
 * these were Arabic-only and one English-only before the merge, so partners
 * reading in the other languages could not see them at all.
 */
export const TRAINING_VIDEOS: TrainingVideo[] = [
  { id: 'bodycell-stretch-mark', title: 'Genosys Bodycell Stretch Mark Treatment', youtubeId: 'SvjziVjhb8s', duration: '15-20', level: 'professional' },
  { id: 'ndcell-neck', title: 'Genosys NDcell Neck & Decollete Treatment', youtubeId: 'm07q2XRt_OM', duration: '18-22', level: 'advanced' },
  { id: 'eyecell', title: 'Genosys EyeCell Treatment', youtubeId: 'xH58EZtykZE', duration: '16-20', level: 'advanced' },
  { id: 'hr3-matrix', title: 'Genosys HR3 Matrix Treatment', youtubeId: 'qQRcEvd3Ks4', duration: '20-25', level: 'advanced' },
  { id: 'facial-treatment', title: 'Facial Treatment', youtubeId: 'hMtodh45sME', duration: '25-30', level: 'professional' },
  { id: 'snow-o2-cleanser', title: 'How to Use Genosys Snow O\u2082 Cleanser', youtubeId: 'SWY0f2gSzl8', duration: '12-15', level: 'professional' },
  { id: 'hr3-matrix-overview', title: 'GENOSYS HR3 MATRIX', youtubeId: 'pM8qIUNdORY', duration: '22-28', level: 'advanced' },
  { id: 'hr3-hair-solution', title: 'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA', youtubeId: 'ZVg5mBVStSw', duration: '24-30', level: 'advanced' },
  { id: 'eyecell-roller', title: 'EyeCell Treatment with the 0.25 mm Eye Roller', youtubeId: 'zTOnPRnMy8k', duration: '14-18', level: 'professional' },
  { id: 'hairgen-booster', title: 'Genosys HAIRGEN BOOSTER Treatment', youtubeId: 'dsS-d8HahQA', duration: '20-25', level: 'advanced' },
  { id: 'hr3-anti-hair-loss', title: 'HR3 MATRIX Anti Hair Loss Treatment', youtubeId: 'XwOIRrizmF4', duration: '18-22', level: 'advanced' },
  { id: 'ez-co2-mask', title: 'How to Use GENOSYS EZ CO\u2082 Mask Kit', youtubeId: 'ZOYtKGNrWJM', duration: '1-2', level: 'professional' },
]
