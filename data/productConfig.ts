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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
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
        url: 'https://genosys.ae/documents/ppt/Overview%20of%20Microneedling_S.pdf',
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
    images: ['/images/SNOW.jpg', '/images/Second/cleanser_big.jpg', '/images/Second/cleanserboth.jpg']
  },
  '12': {
    id: '12',
    images: ['/images/EPI.jpg', '/images/Second/eppi_big.jpg'],
    pricing: {
      basePrice: 250
    },
    documentation: [
      {
        title: 'EPI TURNOVER BOOSTING PEELING GEL Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS_Microneedling_Protocols.pdf',
        type: 'pdf'
      }
    ]
  },
  '14': {
    id: '14',
    pricing: {
      basePrice: 160
    },
    images: ['/images/mist.jpg', '/images/Second/mist2.jpg'],
    documentation: [
      {
        title: 'MICROBIOME ENERGY INFUSING MIST Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf',
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
    images: ['/images/HRS.jpg', '/images/Second/hyalserum1.jpg'],
    pricing: {
      basePrice: 330
    },
    documentation: [
      {
        title: 'MOISTURE REPLENISHING HYALURON SERUM Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf',
        type: 'pdf'
      }
    ]
  },
  '19': {
    id: '19',
    pricing: {
      basePrice: 330
    },
    images: ['/images/ASE.jpg', '/images/Second/allserum_big.jpg']
  },
  '20': {
    id: '20',
    pricing: {
      basePrice: 330
    }
  },
  '21': {
    id: '21',
    images: ['/images/RADS.jpg', '/images/Second/rd_big.jpg'],
    pricing: {
      basePrice: 330
    },
    documentation: [
      {
        title: 'MULTI VITA RADIANCE SERUM Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf',
        type: 'pdf'
      }
    ]
  },
  '22': {
    id: '22',
    images: ['/images/MSSS.jpg', '/images/Second/multiserum1.jpg'],
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
  '26': {
    id: '26',
    pricing: {
      basePrice: 290
    },
    images: ['/images/EGF.jpg', '/images/Second/egf_big.jpg']
  },
  '27': {
    id: '27',
    pricing: {
      basePrice: 450
    },
    images: ['/images/BRR.jpg', '/images/Second/bar_big.jpg'],
    videoUrl: '/videos/barrier.mp4'
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
    images: ['/images/HER.jpg', '/images/Second/hyabig.jpg'],
    videoUrl: '/videos/hyal_cream.mp4',
    documentation: [
      {
        title: 'MOISTURE REPLENISHING HYALURON CREAM Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf',
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
    images: ['/images/PRB.jpg', '/images/Second/problem_duo.jpg'],
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
    images: ['/images/RAA.jpg', '/images/Second/radiance_both.jpg'],
    documentation: [
      {
        title: 'MULTI VITA RADIANCE CREAM Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '32': {
    id: '32',
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
    pricing: {
      basePrice: 380
    },
    documentation: [
      {
        title: 'EyeCell EYE PEPTIDE GEL PATCH Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf',
        type: 'pdf'
      }
    ]
  },
  '34': {
    id: '34',
    images: ['/images/SKIN.jpg', '/images/Second/overnight1.jpg'],
    pricing: {
      basePrice: 340
    }
  },
  '35': {
    id: '35',
    pricing: {
      basePrice: 300
    },
    images: ['/images/HYDR.jpg', '/images/Second/hmask_big.jpg']
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
    images: ['/images/EZE.jpg', '/images/Second/ez.jpg', '/images/Second/ez1.jpg'],
    documentation: [
      {
        title: 'EZ CO₂ MASK KIT Guide',
        url: 'https://genosys.ae/documents/ppt/Genosys%20Ez%20Co2%20Mask.pdf',
        type: 'pdf'
      }
    ]
  },
  '39': {
    id: '39',
    images: ['/images/SPF50.jpg', '/images/Second/50big.jpg'],
    videoUrl: '/videos/spf50.mp4',
    pricing: {
      basePrice: 250
    },
    documentation: [
      {
        title: 'ULTRA SHIELD SUN CREAM Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '40': {
    id: '40',
    images: ['/images/SSUN.jpg', '/images/Second/40big.jpg'],
    videoUrl: '/videos/sun.mp4',
    pricing: {
      basePrice: 210
    }
  },
  '41': {
    id: '41',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf',
        type: 'pdf'
      }
    ]
  },
  '44': {
    id: '44',
    pricing: {
      basePrice: 340
    },
    documentation: [
      {
        title: 'HR³ MATRIX SCALP SHAMPOO α Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf',
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf',
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
    documentation: [
      {
        title: 'Hair-GENTRON Guide',
        url: 'https://genosys.ae/documents/ppt/HAIR%20GENTRON.pdf',
        type: 'pdf'
      }
    ]
  },
  '49': {
    id: '49',
    pricing: {
      basePrice: 5500
    },
    documentation: [
      {
        title: 'GENO-LED IR II Guide',
        url: 'https://genosys.ae/documents/ppt/GENO-LED%20IR%20II_2025.pdf',
        type: 'pdf'
      }
    ]
  },
  '50': {
    id: '50',
    images: ['/images/EYEZ.jpg', '/images/Second/ekit_big.jpg'],
    pricing: {
      basePrice: 980
    },
    documentation: [
      {
        title: 'EyeCell EYE ZONE CARE KIT Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf',
        type: 'pdf'
      }
    ]
  },
  '51': {
    id: '51',
    pricing: {
      basePrice: 250
    },
    images: ['/images/BFAD.png', '/images/Second/ferment_big.jpg', '/images/Third/Ferment_3.jpeg', '/images/Third/ferment_high.jpeg'],
    documentation: [
      {
        title: 'BIO-FERMENT AGE DEFYING POWDER MASK Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf',
        type: 'pdf'
      }
    ]
  },
  '52': {
    id: '52',
    pricing: {
      basePrice: 400
    },
    images: ['/images/PDRN.png', '/images/Second/pdrnnn.jpg', '/images/Second/pdrn_big2.jpg', '/images/Second/pdrn22.jpg'],
    documentation: [
      {
        title: 'SKIN REBOOT PDRN MASK PACK Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf',
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
    images: ['/images/DEF.jpg', '/images/Second/def_big.jpg'],
    pricing: {
      basePrice: 290
    },
    documentation: [
      {
        title: 'SKIN DEFENDER Product Guide',
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf',
        type: 'pdf'
      }
    ]
  },
  '15': {
    id: '15',
    images: ['/images/PRS.jpg', '/images/Second/problem_both.jpg'],
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
        url: 'https://genosys.ae/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf',
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
    pricing: {
      basePrice: 0
    },
    documentation: [
      {
        title: 'BIO MESO PDRN EXPERT AMPOULE 60000 Guide',
        url: '/documents/ppt/GENOSYS_BIO_MESO_PDRN_EXPERT_AMPOULE_60000.pdf',
        type: 'pdf'
      }
    ]
  },
  '63': {
    id: '63',
    pricing: {
      basePrice: 250
    },
    images: ['/images/bright.jpg', '/images/natural.jpg', '/images/vita_color.jpg'],
    colors: [
      { value: 'Bright', label: '#01 Bright', available: true },
      { value: 'Natural', label: '#02 Natural', available: true }
    ],
    documentation: [
      {
        title: 'REVITA GLOW BLEMISH BALM CREAM Guide',
        url: '/documents/ppt/GENOSYS_REVITA_GLOW_BB_CREAM.pdf',
        type: 'pdf'
      }
    ]
  },
  '65': {
    id: '65',
    pricing: {
      basePrice: 300
    },
    documentation: [
      {
        title: 'Bio-Meso PDRN Line Training Manual',
        url: '/documents/ppt/GENOSYS-Training%20manual-Bio-Meso%20PDRN%20line.pdf',
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