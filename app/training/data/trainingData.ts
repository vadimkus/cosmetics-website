export interface TrainingDocument {
  id: string
  title: string
  description: string
  downloadUrl: string
  fileSize: string
  category: string
}

export interface TrainingVideo {
  id: string
  title: string
  description: string
  duration: string
  level: string
  category: string
  thumbnail: string
  videoUrl: string
  whatYoullLearn: string[]
  lessonDetails: {
    duration: string
    level: string
    category: string
    certification: string
  }
}

export const trainingDocuments: TrainingDocument[] = [
  {
    id: '1',
    title: 'Product Catalogue 2026',
    description: 'Complete product catalog for 2026 featuring all GENOSYS products and specifications.',
    downloadUrl: '/documents/product-catalogue-2026.pdf',
    fileSize: '235.5 MB',
    category: 'Training Documents'
  },
  {
    id: '2',
    title: 'Home Care Guide 2026',
    description: 'Comprehensive home care guide for clients using GENOSYS products.',
    downloadUrl: '/documents/home-care-guide-2026.pdf',
    fileSize: '9.8 MB',
    category: 'Training Documents'
  },
  {
    id: '3',
    title: 'Professional Manual 2026',
    description: 'Professional manual for practitioners using GENOSYS products in clinical settings.',
    downloadUrl: '/documents/professional-manual-2026.pdf',
    fileSize: '10.4 MB',
    category: 'Training Documents'
  },
  {
    id: '4',
    title: 'Facial Treatment Homecare 2026',
    description: 'Detailed guide for facial treatment homecare protocols.',
    downloadUrl: '/documents/facial-treatment-homecare-2026.pdf',
    fileSize: '8.2 MB',
    category: 'Training Documents'
  },
  {
    id: '5',
    title: 'Facial Treatment Professional 2026',
    description: 'Professional facial treatment protocols and techniques.',
    downloadUrl: '/documents/facial-treatment-professional-2026.pdf',
    fileSize: '8.2 MB',
    category: 'Training Documents'
  }
]

export const productDocuments: TrainingDocument[] = [
  {
    id: '6',
    title: 'MULTI VITA RADIANCE CREAM',
    description: 'Product documentation for Multi Vita Radiance Cream.',
    downloadUrl: '/documents/multi-vita-radiance-cream.pdf',
    fileSize: '2.1 MB',
    category: 'Product Documentation'
  },
  {
    id: '7',
    title: 'EyeCell EYE ZONE CARE SYSTEM',
    description: 'Product documentation for EyeCell Eye Zone Care System.',
    downloadUrl: '/documents/eyecell-eye-zone-care-system.pdf',
    fileSize: '1.8 MB',
    category: 'Product Documentation'
  },
  {
    id: '8',
    title: 'EPI TURNOVER BOOSTING PEELING GEL',
    description: 'Product documentation for Epi Turnover Boosting Peeling Gel.',
    downloadUrl: '/documents/epi-turnover-boosting-peeling-gel.pdf',
    fileSize: '3.8 MB',
    category: 'Product Documentation'
  },
  {
    id: '9',
    title: 'MULTI VITA RADIANCE SERUM',
    description: 'Product documentation for Multi Vita Radiance Serum.',
    downloadUrl: '/documents/multi-vita-radiance-serum.pdf',
    fileSize: '1.5 MB',
    category: 'Product Documentation'
  },
  {
    id: '10',
    title: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER',
    description: 'Product documentation for Skin Defender Lip & Eye Makeup Remover.',
    downloadUrl: '/documents/skin-defender-lip-eye-makeup-remover.pdf',
    fileSize: '0.7 MB',
    category: 'Product Documentation'
  },
  {
    id: '11',
    title: 'MICROBIOME ENERGY INFUSING MIST',
    description: 'Product documentation for Microbiome Energy Infusing Mist.',
    downloadUrl: '/documents/microbiome-energy-infusing-mist.pdf',
    fileSize: '0.8 MB',
    category: 'Product Documentation'
  },
  {
    id: '12',
    title: 'SKIN RESCUE OVERNIGHT CREAM MASK',
    description: 'Product documentation for Skin Rescue Overnight Cream Mask.',
    downloadUrl: '/documents/skin-rescue-overnight-cream-mask.pdf',
    fileSize: '1.3 MB',
    category: 'Product Documentation'
  },
  {
    id: '13',
    title: 'INTENSIVE PROBLEM CONTROL TONER',
    description: 'Product documentation for Intensive Problem Control Toner.',
    downloadUrl: '/documents/intensive-problem-control-toner.pdf',
    fileSize: '1.0 MB',
    category: 'Product Documentation'
  },
  {
    id: '14',
    title: 'ULTRA SHIELD SUN CREAM',
    description: 'Product documentation for Ultra Shield Sun Cream.',
    downloadUrl: '/documents/ultra-shield-sun-cream.pdf',
    fileSize: '0.6 MB',
    category: 'Product Documentation'
  },
  {
    id: '15',
    title: 'HR³ MATRIX SCALP SHAMPOO α',
    description: 'Product documentation for HR³ Matrix Scalp Shampoo α.',
    downloadUrl: '/documents/hr3-matrix-scalp-shampoo-alpha.pdf',
    fileSize: '2.3 MB',
    category: 'Product Documentation'
  },
  {
    id: '16',
    title: 'MOISTURE REPLENISHING HYALURON SERUM',
    description: 'Product documentation for Moisture Replenishing Hyaluron Serum.',
    downloadUrl: '/documents/moisture-replenishing-hyaluron-serum.pdf',
    fileSize: '1.9 MB',
    category: 'Product Documentation'
  },
  {
    id: '17',
    title: 'MOISTURE REPLENISHING HYALURON CREAM',
    description: 'Product documentation for Moisture Replenishing Hyaluron Cream.',
    downloadUrl: '/documents/moisture-replenishing-hyaluron-cream.pdf',
    fileSize: '2.0 MB',
    category: 'Product Documentation'
  },
  {
    id: '18',
    title: 'SKIN CARING BLEMISH BALM CUSHION',
    description: 'Product documentation for Skin Caring Blemish Balm Cushion.',
    downloadUrl: '/documents/skin-caring-blemish-balm-cushion.pdf',
    fileSize: '1.2 MB',
    category: 'Product Documentation'
  },
  {
    id: '19',
    title: 'EyeCell EYE PEPTIDE GEL PATCH',
    description: 'Product documentation for EyeCell Eye Peptide Gel Patch.',
    downloadUrl: '/documents/eyecell-eye-peptide-gel-patch.pdf',
    fileSize: '1.4 MB',
    category: 'Product Documentation'
  },
  {
    id: '20',
    title: 'BIO-FERMENT AGE DEFYING POWDER MASK',
    description: 'Product documentation for Bio-Ferment Age Defying Powder Mask.',
    downloadUrl: '/documents/bio-ferment-age-defying-powder-mask.pdf',
    fileSize: '2.1 MB',
    category: 'Product Documentation'
  },
  {
    id: '21',
    title: 'HAIR GENTRON',
    description: 'Product documentation for Hair Gentron.',
    downloadUrl: '/documents/hair-gentron.pdf',
    fileSize: '1.8 MB',
    category: 'Product Documentation'
  },
  {
    id: '22',
    title: 'HR³ MATRIX HAIR SOLUTION α',
    description: 'Product documentation for HR³ Matrix Hair Solution α.',
    downloadUrl: '/documents/hr3-matrix-hair-solution-alpha.pdf',
    fileSize: '2.3 MB',
    category: 'Product Documentation'
  },
  {
    id: '23',
    title: 'HR³ MATRIX HAIR TONIC α',
    description: 'Product documentation for HR³ Matrix Hair Tonic α.',
    downloadUrl: '/documents/hr3-matrix-hair-tonic-alpha.pdf',
    fileSize: '1.9 MB',
    category: 'Product Documentation'
  },
  {
    id: '24',
    title: 'HR³ MATRIX SCALP PEELING α',
    description: 'Product documentation for HR³ Matrix Scalp Peeling α.',
    downloadUrl: '/documents/hr3-matrix-scalp-peeling-alpha.pdf',
    fileSize: '2.1 MB',
    category: 'Product Documentation'
  },
  {
    id: '25',
    title: 'GENO-LED IR II',
    description: 'Product documentation for Geno-Led IR II.',
    downloadUrl: '/documents/geno-led-ir-ii.pdf',
    fileSize: '4.6 MB',
    category: 'Product Documentation'
  },
  {
    id: '26',
    title: 'SKIN REBOOT PDRN MASK PACK',
    description: 'Product documentation for Skin Reboot PDRN Mask Pack.',
    downloadUrl: '/documents/skin-reboot-pdrn-mask-pack.pdf',
    fileSize: '1.2 MB',
    category: 'Product Documentation'
  },
  {
    id: '27',
    title: 'EZ CO₂ MASK KIT',
    description: 'Product documentation for EZ CO₂ Mask Kit.',
    downloadUrl: '/documents/ez-co2-mask-kit.pdf',
    fileSize: '0.5 MB',
    category: 'Product Documentation'
  },
  {
    id: '28',
    title: 'Microneedle Roller',
    description: 'Product documentation for Microneedle Roller.',
    downloadUrl: '/documents/microneedle-roller.pdf',
    fileSize: '1.5 MB',
    category: 'Product Documentation'
  }
]

export const trainingVideos: TrainingVideo[] = [
  {
    id: '1',
    title: 'Genosys Bodycell Stretch Mark Treatment',
    description: 'Learn the professional techniques for treating stretch marks using Genosys Bodycell technology. This comprehensive training covers proper application methods, safety protocols, and expected results.',
    duration: '15-20 minutes',
    level: 'Professional',
    category: 'Body Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video1',
    whatYoullLearn: [
      'Proper product application techniques',
      'Safety protocols and precautions',
      'Treatment duration and frequency',
      'Expected results and timeline',
      'Client consultation best practices'
    ],
    lessonDetails: {
      duration: '15-20 minutes',
      level: 'Professional',
      category: 'Body Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '2',
    title: 'Genosys NDcell Neck & Decollete Treatment',
    description: 'Master the specialized techniques for treating the delicate neck and décolletage area using Genosys NDcell technology. This advanced training covers proper application methods, safety considerations, and achieving optimal results for this sensitive area.',
    duration: '18-22 minutes',
    level: 'Advanced Professional',
    category: 'Specialized Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video2',
    whatYoullLearn: [
      'Specialized neck and décolletage techniques',
      'Proper handling of sensitive skin areas',
      'Treatment protocols and timing',
      'Client positioning and comfort',
      'Post-treatment care instructions'
    ],
    lessonDetails: {
      duration: '18-22 minutes',
      level: 'Advanced Professional',
      category: 'Specialized Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '3',
    title: 'Genosys EyeCell Treatment',
    description: 'Learn the precise techniques for treating the delicate eye area using Genosys EyeCell technology. This specialized training covers safe application methods, client comfort protocols, and achieving optimal results for the sensitive periocular region.',
    duration: '16-20 minutes',
    level: 'Advanced Professional',
    category: 'Specialized Eye Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video3',
    whatYoullLearn: [
      'Precise eye area treatment techniques',
      'Safety protocols for sensitive eye region',
      'Client positioning and eye protection',
      'Treatment intensity and duration',
      'Post-treatment care and recommendations'
    ],
    lessonDetails: {
      duration: '16-20 minutes',
      level: 'Advanced Professional',
      category: 'Specialized Eye Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '4',
    title: 'Genosys HR3 Matrix Treatment',
    description: 'Master the advanced HR3 Matrix treatment techniques using Genosys technology. This comprehensive training covers matrix application methods, treatment protocols, and achieving optimal results for skin rejuvenation and matrix enhancement.',
    duration: '20-25 minutes',
    level: 'Advanced Professional',
    category: 'Matrix Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video4',
    whatYoullLearn: [
      'HR3 Matrix application techniques',
      'Treatment protocols and timing',
      'Skin preparation and assessment',
      'Client consultation and expectations',
      'Post-treatment care and follow-up'
    ],
    lessonDetails: {
      duration: '20-25 minutes',
      level: 'Advanced Professional',
      category: 'Matrix Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '5',
    title: 'Facial Treatment',
    description: 'Learn comprehensive facial treatment techniques using Genosys products and protocols. This essential training covers complete facial procedures, product application sequences, and achieving optimal results for various skin types and concerns.',
    duration: '25-30 minutes',
    level: 'Professional',
    category: 'Facial Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video5',
    whatYoullLearn: [
      'Complete facial treatment protocols',
      'Product application sequences',
      'Skin analysis and assessment',
      'Client consultation techniques',
      'Treatment customization methods'
    ],
    lessonDetails: {
      duration: '25-30 minutes',
      level: 'Professional',
      category: 'Facial Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '6',
    title: 'How to use Genosys Snow 02 Cleanser',
    description: 'Master the proper techniques for using Genosys Snow 02 Cleanser effectively. This detailed training covers correct application methods, timing, and achieving optimal cleansing results for different skin types and conditions.',
    duration: '12-15 minutes',
    level: 'Professional',
    category: 'Product Usage',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video6',
    whatYoullLearn: [
      'Proper Snow 02 Cleanser application',
      'Correct timing and duration',
      'Skin type considerations',
      'Product benefits and results',
      'Integration with other treatments'
    ],
    lessonDetails: {
      duration: '12-15 minutes',
      level: 'Professional',
      category: 'Product Usage',
      certification: 'Available upon completion'
    }
  },
  {
    id: '7',
    title: 'GENOSYS HR3 MATRIX',
    description: 'Advanced training on GENOSYS HR3 MATRIX technology and application techniques. This comprehensive lesson covers matrix treatment protocols, advanced application methods, and achieving optimal results for skin rejuvenation and matrix enhancement.',
    duration: '22-28 minutes',
    level: 'Advanced Professional',
    category: 'Matrix Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video7',
    whatYoullLearn: [
      'Advanced HR3 MATRIX techniques',
      'Matrix treatment protocols',
      'Skin assessment and preparation',
      'Treatment customization methods',
      'Results optimization strategies'
    ],
    lessonDetails: {
      duration: '22-28 minutes',
      level: 'Advanced Professional',
      category: 'Matrix Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '8',
    title: 'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA',
    description: 'Specialized training on GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA for advanced hair treatment protocols. This comprehensive lesson covers hair matrix treatment techniques, scalp preparation, and achieving optimal results for hair restoration and enhancement.',
    duration: '24-30 minutes',
    level: 'Advanced Professional',
    category: 'Hair Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video8',
    whatYoullLearn: [
      'Hair matrix treatment protocols',
      'Scalp preparation techniques',
      'ALPHA solution application methods',
      'Hair restoration procedures',
      'Treatment customization for hair types'
    ],
    lessonDetails: {
      duration: '24-30 minutes',
      level: 'Advanced Professional',
      category: 'Hair Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '9',
    title: 'Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm',
    description: 'Specialized training on Eye Cell Treatment using the Eye Roller 0.25mm for precise eye zone treatments. This detailed lesson covers proper roller techniques, eye area safety protocols, and achieving optimal results for the delicate periocular region.',
    duration: '14-18 minutes',
    level: 'Professional',
    category: 'Eye Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video9',
    whatYoullLearn: [
      'Eye Roller 0.25mm application techniques',
      'Eye zone treatment protocols',
      'Safety measures for delicate eye area',
      'Proper roller pressure and movement',
      'Post-treatment care for eye zone'
    ],
    lessonDetails: {
      duration: '14-18 minutes',
      level: 'Professional',
      category: 'Eye Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '10',
    title: 'Genosys HAIRGEN BOOSTER Treatment',
    description: 'Master the advanced hair treatment techniques using Genosys HAIRGEN BOOSTER technology. This comprehensive training covers hair restoration protocols, scalp preparation methods, and achieving optimal results for hair growth and enhancement.',
    duration: '20-25 minutes',
    level: 'Advanced Professional',
    category: 'Hair Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video10',
    whatYoullLearn: [
      'Advanced hair treatment protocols',
      'Scalp preparation and assessment techniques',
      'HAIRGEN BOOSTER application methods',
      'Hair growth stimulation procedures',
      'Treatment customization for different hair types'
    ],
    lessonDetails: {
      duration: '20-25 minutes',
      level: 'Advanced Professional',
      category: 'Hair Treatments',
      certification: 'Available upon completion'
    }
  },
  {
    id: '11',
    title: 'HR3 MATRIX Anti Hair Loss Treatment',
    description: 'Learn the specialized techniques for treating hair loss using HR3 MATRIX technology. This advanced training covers anti-hair loss protocols, scalp treatment methods, and achieving optimal results for hair restoration and prevention of further hair loss.',
    duration: '18-22 minutes',
    level: 'Advanced Professional',
    category: 'Hair Loss Treatments',
    thumbnail: '/images/genosys-logo.png',
    videoUrl: 'https://example.com/video11',
    whatYoullLearn: [
      'Anti-hair loss treatment protocols',
      'HR3 MATRIX application techniques',
      'Scalp assessment and preparation methods',
      'Hair loss prevention strategies',
      'Treatment customization for different hair loss types'
    ],
    lessonDetails: {
      duration: '18-22 minutes',
      level: 'Advanced Professional',
      category: 'Hair Loss Treatments',
      certification: 'Available upon completion'
    }
  }
]

export const trainingCategories = [
  'All Categories',
  'Body Treatments',
  'Specialized Treatments',
  'Specialized Eye Treatments',
  'Matrix Treatments',
  'Facial Treatments',
  'Product Usage',
  'Hair Treatments',
  'Hair Loss Treatments',
  'Eye Treatments'
]

export const trainingStats = {
  totalDocuments: trainingDocuments.length + productDocuments.length,
  totalVideos: trainingVideos.length,
  totalCategories: trainingCategories.length - 1, // Exclude 'All Categories'
  averageVideoDuration: '18-22 minutes',
  certificationAvailable: true
}
