export interface ProductConfig {
  id: string
  pricing: {
    basePrice: number
    sizeVariants?: Record<string, number>
    colorVariants?: Record<string, number>
  }
  sizes?: Array<{ value: string; label: string; available: boolean }>
  colors?: Array<{ value: string; label: string; available: boolean }>
  images?: string[]
  videoUrl?: string
  documentation?: Array<{
    title: string
    url: string
    type: 'pdf' | 'video' | 'link'
  }>
}

export const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  '4': {
    id: '4',
    pricing: {
      basePrice: 580
    },
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '5': {
    id: '5',
    pricing: {
      basePrice: 580
    },
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '6': {
    id: '6',
    images: ['/images/CTS.jpg', '/images/Second/cts_big.jpg', '/images/Second/cts_big2.jpg'],
    pricing: {
      basePrice: 580
    },
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '7': {
    id: '7',
    images: ['/images/PCS.jpg', '/images/Second/pcs_big1.jpg', '/images/Second/pcs_big2.jpg'],
    pricing: {
      basePrice: 580
    },
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '8': {
    id: '8',
    images: ['/images/SWS.jpg', '/images/Second/sws_big1.jpg', '/images/Second/sws_big2.jpg'],
    pricing: {
      basePrice: 580
    },
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '9': {
    id: '9',
    pricing: {
      basePrice: 580
    },
    images: ['/images/AWS.jpg', '/images/Second/aws1.jpg', '/images/Second/aws2.jpg'],
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '1': {
    id: '1',
    images: ['/images/genosys-microneedling-devices.jpg', '/images/Second/roller1.jpg', '/images/Second/roller_stamp2.jpg'],
    pricing: {
      basePrice: 230,
      sizeVariants: {
        '0.25mm': 230,
        '0.5mm': 230,
        '0.1mm': 230,
        '0.15mm': 230,
        '0.2mm': 230
      }
    },
    sizes: [
      { value: '0.25mm', label: '0.25mm', available: true },
      { value: '0.5mm', label: '0.5mm', available: true },
      { value: '0.1mm', label: '0.1mm', available: true },
      { value: '0.15mm', label: '0.15mm', available: true },
      { value: '0.2mm', label: '0.2mm', available: true }
    ],
    documentation: [
      {
        title: 'Overview of Microneedling',
        url: 'https://genosys.ae/documents/PPT/Overview%20of%20Microneedling_S.pdf',
        type: 'pdf'
      }
    ]
  },
  '2': {
    id: '2',
    pricing: {
      basePrice: 1450
    }
  },
  '3': {
    id: '3',
    pricing: {
      basePrice: 1800
    },
    videoUrl: 'https://www.youtube.com/embed/7VTkWKkYKwA'
  },
  '10': {
    id: '10',
    videoUrl: '/videos/cleanser.mp4',
    pricing: {
      basePrice: 330,
      sizeVariants: {
        '180ml': 330,
        '500ml': 510
      }
    },
    sizes: [
      { value: '180ml', label: '180ml', available: true },
      { value: '500ml', label: '500ml', available: true }
    ],
  },
  '12': {
    id: '12',
    images: [
      '/images/epi/main.jpeg',
      '/images/epi/s1.jpeg',
      '/images/epi/s2.jpeg',
      '/images/epi/s3.jpeg',
      '/images/epi/s4.jpeg',
      '/images/epi/s5.jpeg',
      '/images/epi/s6.jpeg',
    ],
    pricing: {
      basePrice: 250
    },
    documentation: [
      {
        title: 'EPI TURNOVER BOOSTING PEELING GEL Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf',
        type: 'pdf'
      }
    ]
  },
  '13': {
    id: '13',
    pricing: {
      basePrice: 810
    },
    images: ['/images/SRS.jpg', '/images/Second/sss1.jpg', '/images/Second/sss2.jpg'],
    documentation: [
      {
        title: 'Microneedling Protocols (Carboxy + Power Solutions)',
        url: 'https://genosys.ae/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '14': {
    id: '14',
    pricing: {
      basePrice: 160
    },
    documentation: [
      {
        title: 'MICROBIOME ENERGY INFUSING MIST Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf',
        type: 'pdf'
      }
    ]
  },
  '17': {
    id: '17',
    pricing: {
      basePrice: 370
    }
  },
  '18': {
    id: '18',
    images: [
      '/images/hyaluron_serum/main.jpeg',
      '/images/hyaluron_serum/s1.jpeg',
      '/images/hyaluron_serum/s2.jpeg',
      '/images/hyaluron_serum/s3.jpeg',
      '/images/hyaluron_serum/s4.jpeg',
      '/images/hyaluron_serum/s5.jpeg',
      '/images/hyaluron_serum/s6.jpeg',
    ],
    videoUrl: '/videos/hs_cream_serum.mp4',
    pricing: {
      basePrice: 330
    },
    documentation: [
      {
        title: 'MOISTURE REPLENISHING HYALURON SERUM Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf',
        type: 'pdf'
      }
    ]
  },
  '19': {
    id: '19',
    pricing: {
      basePrice: 330
    },
    images: [
      '/images/sensitive_serum/main.jpeg',
      '/images/sensitive_serum/s1.jpeg',
      '/images/sensitive_serum/s2.jpeg',
      '/images/sensitive_serum/s3.jpeg',
      '/images/sensitive_serum/s4.jpeg',
      '/images/sensitive_serum/s5.jpeg',
      '/images/sensitive_serum/s6.jpeg',
    ],
    videoUrl: '/videos/all_serum.mp4',
  },
  '20': {
    id: '20',
    images: [
      '/images/problems_serum/main.jpeg',
      '/images/problems_serum/s1.jpeg',
      '/images/problems_serum/s2.jpeg',
      '/images/problems_serum/s3.jpeg',
      '/images/problems_serum/s4.jpeg',
      '/images/problems_serum/s5.jpeg',
      '/images/problems_serum/s6.jpeg',
    ],
    videoUrl: '/videos/problem_serum.mp4',
    pricing: {
      basePrice: 330
    },
    documentation: [
      {
        title: 'INTENSIVE PROBLEM CONTROL SERUM Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20SERUM.pdf',
        type: 'pdf'
      }
    ]
  },
  '21': {
    id: '21',
    images: [
      '/images/radiance_serum/main.jpeg',
      '/images/radiance_serum/s1.jpeg',
      '/images/radiance_serum/s2.jpeg',
      '/images/radiance_serum/s3.jpeg',
      '/images/radiance_serum/s4.jpeg',
      '/images/radiance_serum/s5.jpeg',
    ],
    videoUrl: '/videos/radiance_serum.mp4',
    pricing: {
      basePrice: 330
    },
    documentation: [
      {
        title: 'MULTI VITA RADIANCE SERUM Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf',
        type: 'pdf'
      }
    ]
  },
  '22': {
    id: '22',
    images: [
      '/images/multif_serum/main.jpeg',
      '/images/multif_serum/s1.jpeg',
      '/images/multif_serum/s2.jpeg',
      '/images/multif_serum/s3.jpeg',
      '/images/multif_serum/s4.jpeg',
      '/images/multif_serum/s5.jpeg',
      '/images/multif_serum/s6.jpeg',
    ],
    videoUrl: '/videos/multif_serum.mp4',
    pricing: {
      basePrice: 330
    }
  },
  '23': {
    id: '23',
    images: ['/images/ND.jpg', '/images/Second/nd_big1.jpg'],
    pricing: {
      basePrice: 370
    }
  },
  '24': {
    id: '24',
    pricing: {
      basePrice: 370
    }
  },
  '25': {
    id: '25',
    videoUrl: '/videos/soothing-repair-postcream-20260806.mp4',
    pricing: {
      basePrice: 204,
      sizeVariants: {
        '20g': 204,
        '100g': 440
      }
    },
    sizes: [
      { value: '20g', label: '20g', available: true },
      { value: '100g', label: '100g', available: true }
    ],
    images: ['/images/SRC.jpg', '/images/Second/soothrep.png']
  },
  '27': {
    id: '27',
    pricing: {
      basePrice: 450
    },
    videoUrl: '/videos/barrier2.mp4'
  },
  '28': {
    id: '28',
    pricing: {
      basePrice: 290,
      sizeVariants: {
        '50g': 290,
        '250g': 420
      }
    },
    sizes: [
      { value: '50g', label: '50g', available: true },
      { value: '250g', label: '250g', available: true }
    ],
    images: ['/images/HSC.jpg', '/images/Second/hydro_second.jpg'],
    videoUrl: '/videos/hydrocream.mp4'
  },
  '29': {
    id: '29',
    pricing: {
      basePrice: 290,
      sizeVariants: {
        '50g': 290,
        '250g': 420
      }
    },
    sizes: [
      { value: '50g', label: '50g', available: true },
      { value: '250g', label: '250g', available: true }
    ],
    images: [
      '/images/hyaluron/main.jpeg',
      '/images/hyaluron/s1.jpeg',
      '/images/hyaluron/s2.jpeg',
      '/images/hyaluron/s3.jpeg',
      '/images/hyaluron/s4.jpeg',
      '/images/hyaluron/s5.jpeg',
      '/images/hyaluron/s6.jpeg',
    ],
    videoUrl: '/videos/hyaluron.mp4',
    documentation: [
      {
        title: 'MOISTURE REPLENISHING HYALURON CREAM Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '30': {
    id: '30',
    pricing: {
      basePrice: 290,
      sizeVariants: {
        '50g': 290,
        '250g': 420
      }
    },
    videoUrl: '/videos/problem_cream.mp4',
    sizes: [
      { value: '50g', label: '50g', available: true },
      { value: '250g', label: '250g', available: true }
    ]
  },
  '31': {
    id: '31',
    pricing: {
      basePrice: 290,
      sizeVariants: {
        '50g': 290,
        '230g': 420
      }
    },
    sizes: [
      { value: '50g', label: '50g', available: true },
      { value: '230g', label: '230g', available: true }
    ],
    images: [
      '/images/radiance/main.jpeg',
      '/images/radiance/s1.jpeg',
      '/images/radiance/s2.jpeg',
      '/images/radiance/s3.jpeg',
      '/images/radiance/s4.jpeg',
      '/images/radiance/s5.jpeg',
      '/images/radiance/s6.jpeg',
    ],
    videoUrl: '/videos/radiance.mp4',
    documentation: [
      {
        title: 'MULTI VITA RADIANCE CREAM Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '32': {
    id: '32',
    videoUrl: '/videos/multif_cream.mp4',
    pricing: {
      basePrice: 290,
      sizeVariants: {
        '50g': 290,
        '250g': 420
      }
    },
    sizes: [
      { value: '50g', label: '50g', available: true },
      { value: '250g', label: '250g', available: true }
    ]
  },
  '33': {
    id: '33',
    videoUrl: '/videos/eyecell-eye-peptide-gel-patch-20260806.mp4',
    pricing: {
      basePrice: 380
    },
    documentation: [
      {
        title: 'EyeCell EYE PEPTIDE GEL PATCH Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf',
        type: 'pdf'
      }
    ]
  },
  '34': {
    id: '34',
    // Gallery migrated to DB `images` (2026-07-12) — do not re-add here.
    pricing: {
      basePrice: 340
    }
  },
  '35': {
    id: '35',
    pricing: {
      basePrice: 300
    },
    images: ['/images/HYDR.jpg', '/images/Second/hmask_big.jpg'],
    videoUrl: '/videos/hydro.mp4',
  },
  '36': {
    id: '36',
    pricing: {
      basePrice: 36
    }
  },
  '37': {
    id: '37',
    pricing: {
      basePrice: 380
    }
  },
  '38': {
    id: '38',
    pricing: {
      basePrice: 460
    },
    documentation: [
      {
        title: 'EZ CO₂ MASK KIT Guide',
        url: 'https://genosys.ae/documents/PPT/Genosys%20Ez%20Co2%20Mask.pdf',
        type: 'pdf'
      }
    ]
  },
  '39': {
    id: '39',
    images: [
      '/images/ultra/main.jpeg',
      '/images/ultra/s1.jpeg',
      '/images/ultra/s2.jpeg',
      '/images/ultra/s3.jpeg',
      '/images/ultra/s4.jpeg',
      '/images/ultra/s5.jpeg',
      '/images/ultra/s6.jpeg',
    ],
    videoUrl: '/videos/ultra.mp4',
    pricing: {
      basePrice: 250
    },
    documentation: [
      {
        title: 'ULTRA SHIELD SUN CREAM Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '40': {
    id: '40',
    images: [
      '/images/sun/main.jpeg',
      '/images/sun/s1.jpeg',
      '/images/sun/s2.jpeg',
      '/images/sun/s3.jpeg',
      '/images/sun/s4.jpeg',
      '/images/sun/s5.jpeg',
      '/images/sun/s6.jpeg',
    ],
    videoUrl: '/videos/sun2.mp4',
    pricing: {
      basePrice: 210
    }
  },
  '41': {
    id: '41',
    videoUrl: '/videos/cushion.mp4',
    pricing: {
      basePrice: 300
    },
    colors: [
      { value: 'Beige', label: 'Beige', available: true },
      { value: 'Ivory', label: 'Ivory', available: true },
      { value: 'Camel', label: 'Camel', available: true }
    ],
    documentation: [
      {
        title: 'SKIN CARING BLEMISH BALM CUSHION Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf',
        type: 'pdf'
      }
    ]
  },
  '42': {
    id: '42',
    images: ['/images/BLEM.jpg', '/images/Second/bbbig.jpg'],
    pricing: {
      basePrice: 250
    }
  },
  '43': {
    id: '43',
    pricing: {
      basePrice: 290
    },
    documentation: [
      {
        title: 'HR³ MATRIX HAIR TONIC α Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf',
        type: 'pdf'
      }
    ]
  },
  '44': {
    id: '44',
    videoUrl: '/videos/shamp.mp4',
    pricing: {
      basePrice: 340
    },
    documentation: [
      {
        title: 'HR³ MATRIX SCALP SHAMPOO α Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf',
        type: 'pdf'
      }
    ]
  },
  '45': {
    id: '45',
    pricing: {
      basePrice: 740
    },
    images: ['/images/HHR.jpg', '/images/Second/hair_alpha.jpg'],
    documentation: [
      {
        title: 'HR³ MATRIX HAIR SOLUTION α Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf',
        type: 'pdf'
      }
    ]
  },
  '46': {
    id: '46',
    pricing: {
      basePrice: 290
    },
    documentation: [
      {
        title: 'HR³ MATRIX SCALP PEELING α Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf',
        type: 'pdf'
      }
    ]
  },
  '47': {
    id: '47',
    pricing: {
      basePrice: 1100
    }
  },
  '48': {
    id: '48',
    pricing: {
      basePrice: 3300
    },
    videoUrl: '/videos/gentron.mp4',
    documentation: [
      {
        title: 'Hair-GENTRON Guide',
        url: 'https://genosys.ae/documents/PPT/HAIR%20GENTRON.pdf',
        type: 'pdf'
      }
    ]
  },
  '49': {
    id: '49',
    pricing: {
      basePrice: 5500
    },
    videoUrl: '/videos/led.mp4',
    documentation: [
      {
        title: 'GENO-LED IR II Guide',
        url: 'https://genosys.ae/documents/PPT/GENO-LED%20IR%20II_2025.pdf',
        type: 'pdf'
      }
    ]
  },
  '50': {
    id: '50',
    // Gallery is DB-only so the current DB main image is prepended automatically.
    videoUrl: '/videos/kit.mp4',
    pricing: {
      basePrice: 980
    },
    documentation: [
      {
        title: 'EyeCell EYE ZONE CARE KIT Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf',
        type: 'pdf'
      }
    ]
  },
  '51': {
    id: '51',
    pricing: {
      basePrice: 250
    },
    // Gallery migrated to the DB `images` field (single source of truth)
    documentation: [
      {
        title: 'BIO-FERMENT AGE DEFYING POWDER MASK Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf',
        type: 'pdf'
      }
    ]
  },
  '52': {
    id: '52',
    pricing: {
      basePrice: 400
    },
    // Gallery migrated to the DB `images` field (single source of truth)
    documentation: [
      {
        title: 'SKIN REBOOT PDRN MASK PACK Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf',
        type: 'pdf'
      }
    ]
  },
  'cmgj9ifoi00008o07p4eqmfb7': {
    id: 'cmgj9ifoi00008o07p4eqmfb7',
    pricing: {
      basePrice: 45
    }
  },
  '11': {
    id: '11',
    pricing: {
      basePrice: 290
    },
    documentation: [
      {
        title: 'SKIN DEFENDER Product Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf',
        type: 'pdf'
      }
    ]
  },
  '15': {
    id: '15',
    pricing: {
      basePrice: 260,
      sizeVariants: {
        '200ml': 260,
        '500ml': 490
      }
    },
    sizes: [
      { value: '200ml', label: '200ml', available: true },
      { value: '500ml', label: '500ml', available: true }
    ],
    documentation: [
      {
        title: 'INTENSIVE PROBLEM CONTROL TONER',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf',
        type: 'pdf'
      }
    ]
  },
  '16': {
    id: '16',
    images: ['/images/Second/main_booster.jpg', '/images/Second/main_booster2.png'],
    pricing: {
      basePrice: 260,
      sizeVariants: {
        '200ml': 260,
        '1000ml': 490
      }
    },
    sizes: [
      { value: '200ml', label: '200ml', available: true },
      { value: '1000ml', label: '1000ml', available: true }
    ]
  },
  '60': {
    id: '60',
    // Gallery migrated to DB-only (product.image /images/6000/main.jpg + images
    // S1-S6). Config gallery removed 2026-07-10 — it still pointed at the
    // deleted /images/Second/Prof_Meso.jpg and config wins over DB.
    videoUrl: '/videos/60000.mp4',
    pricing: {
      basePrice: 0
    },
    documentation: [
      {
        title: 'BIO MESO PDRN EXPERT AMPOULE 60000 Guide',
        url: '/documents/PPT/GENOSYS_BIO_MESO_PDRN_EXPERT_AMPOULE_60000.pdf',
        type: 'pdf'
      }
    ]
  },
  '61': {
    id: '61',
    pricing: {
      basePrice: 50
    },
    documentation: [
      {
        title: 'HR³ MATRIX SCALP BRUSH Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20BRUSH.pdf',
        type: 'pdf'
      }
    ]
  },
  '63': {
    id: '63',
    pricing: {
      basePrice: 250
    },
    images: ['/images/revita/main.jpg', '/images/revita/s1.jpg', '/images/revita/s2.jpg', '/images/revita/s3.jpg', '/images/revita/s4.jpg'],
    videoUrl: '/videos/revita.mp4',
    colors: [
      { value: 'Bright', label: '#01 Bright', available: true },
      { value: 'Natural', label: '#02 Natural', available: true }
    ],
    documentation: [
      {
        title: 'REVITA GLOW BLEMISH BALM CREAM Guide',
        url: '/documents/PPT/GENOSYS_REVITA_GLOW_BB_CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '65': {
    id: '65',
    videoUrl: '/videos/5000.mp4',
    pricing: {
      basePrice: 300
    },
    documentation: [
      {
        title: 'Bio-Meso PDRN Line Training Manual',
        url: '/documents/PPT/GENOSYS-Training%20manual-Bio-Meso%20PDRN%20line.pdf',
        type: 'pdf'
      }
    ]
  },
  '66': {
    id: '66',
    pricing: {
      basePrice: 380,
      sizeVariants: {
        '200ml': 380,
        '600ml': 620
      }
    },
    documentation: [
      {
        title: 'CERABARRIER BIOME GEL CLEANSER Guide',
        url: 'https://genosys.ae/documents/PPT/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf',
        type: 'pdf'
      }
    ]
  }
}

export const getProductConfig = (productId: string): ProductConfig | null => {
  return PRODUCT_CONFIG[productId] || null
}

export const getProductPrice = (productId: string, size?: string, _color?: string): number => {
  const config = getProductConfig(productId)
  if (!config) return 0

  if (size && config.pricing.sizeVariants) {
    return config.pricing.sizeVariants[size] || config.pricing.basePrice
  }
  return config?.pricing.basePrice || 0
}

export const getProductSizes = (productId: string): Array<{ value: string; label: string; available: boolean }> => {
  const config = getProductConfig(productId)
  return config?.sizes || []
}

export const getProductColors = (productId: string): Array<{ value: string; label: string; available: boolean }> => {
  const config = getProductConfig(productId)
  return config?.colors || []
}

export const getProductImages = (productId: string): string[] => {
  const config = getProductConfig(productId)
  return config?.images || []
}

export const hasProductVariants = (productId: string): boolean => {
  const config = getProductConfig(productId)
  return !!(config?.sizes?.length || config?.colors?.length)
}

export const getProductVideoUrl = (productId: string): string | undefined => {
  const config = getProductConfig(productId)
  return config?.videoUrl
}

// Russian translations for documentation titles
const documentationTitleTranslations: Record<string, string> = {
  'Overview of Microneedling': 'Обзор микронидлинга',
  'EPI TURNOVER BOOSTING PEELING GEL Guide': 'Руководство по EPI TURNOVER BOOSTING PEELING GEL',
  'MICROBIOME ENERGY INFUSING MIST Guide': 'Руководство по MICROBIOME ENERGY INFUSING MIST',
  'MOISTURE REPLENISHING HYALURON SERUM Guide': 'Руководство по MOISTURE REPLENISHING HYALURON SERUM',
  'MULTI VITA RADIANCE SERUM Guide': 'Руководство по MULTI VITA RADIANCE SERUM',
  'MOISTURE REPLENISHING HYALURON CREAM Guide': 'Руководство по MOISTURE REPLENISHING HYALURON CREAM',
  'MULTI VITA RADIANCE CREAM Guide': 'Руководство по MULTI VITA RADIANCE CREAM',
  'EyeCell EYE PEPTIDE GEL PATCH Guide': 'Руководство по EyeCell EYE PEPTIDE GEL PATCH',
  'EZ CO₂ MASK KIT Guide': 'Руководство по EZ CO₂ MASK KIT',
  'ULTRA SHIELD SUN CREAM Guide': 'Руководство по ULTRA SHIELD SUN CREAM',
  'SKIN CARING BLEMISH BALM CUSHION Guide': 'Руководство по SKIN CARING BLEMISH BALM CUSHION',
  'HR³ MATRIX HAIR TONIC α Guide': 'Руководство по HR³ MATRIX HAIR TONIC α',
  'HR³ MATRIX SCALP SHAMPOO α Guide': 'Руководство по HR³ MATRIX SCALP SHAMPOO α',
  'HR³ MATRIX HAIR SOLUTION α Guide': 'Руководство по HR³ MATRIX HAIR SOLUTION α',
  'HR³ MATRIX SCALP PEELING α Guide': 'Руководство по HR³ MATRIX SCALP PEELING α',
  'HR³ MATRIX SCALP BRUSH Guide': 'Руководство по HR³ MATRIX SCALP BRUSH',
  'CERABARRIER BIOME GEL CLEANSER Guide': 'Руководство по CERABARRIER BIOME GEL CLEANSER',
  'Hair-GENTRON Guide': 'Руководство по Hair-GENTRON',
  'GENO-LED IR II Guide': 'Руководство по GENO-LED IR II',
  'EyeCell EYE ZONE CARE KIT Guide': 'Руководство по EyeCell EYE ZONE CARE KIT',
  'BIO-FERMENT AGE DEFYING POWDER MASK Guide': 'Руководство по BIO-FERMENT AGE DEFYING POWDER MASK',
  'SKIN REBOOT PDRN MASK PACK Guide': 'Руководство по SKIN REBOOT PDRN MASK PACK',
  'SKIN DEFENDER Product Guide': 'Руководство по продукту SKIN DEFENDER',
  'INTENSIVE PROBLEM CONTROL TONER': 'Руководство по INTENSIVE PROBLEM CONTROL TONER',
  'BIO MESO PDRN EXPERT AMPOULE 60000 Guide': 'Руководство по BIO MESO PDRN EXPERT AMPOULE 60000',
  'REVITA GLOW BLEMISH BALM CREAM Guide': 'Руководство по REVITA GLOW BLEMISH BALM CREAM',
  'Bio-Meso PDRN Line Training Manual': 'Учебное руководство по линии Bio-Meso PDRN',
  'Microneedling Protocols (Carboxy + Power Solutions)': 'Протоколы микронидлинга (Карбокси + Power Solutions)'
}

export const getProductDocumentation = (productId: string, locale: string = 'en'): Array<{
  title: string
  url: string
  type: 'pdf' | 'video' | 'link'
}> => {
  const config = getProductConfig(productId)
  const docs = config?.documentation || []
  
  // Translate titles if locale is Russian
  if (locale === 'ru') {
    return docs.map(doc => ({
      ...doc,
      title: documentationTitleTranslations[doc.title] || doc.title
    }))
  }
  
  return docs
}