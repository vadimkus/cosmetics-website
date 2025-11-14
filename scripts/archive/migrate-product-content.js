const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// This script extracts hardcoded product content from ProductPageClient.tsx
// and migrates it to the database

// Product content data extracted from ProductPageClient.tsx
const productContents = {
  '1': {
    productDetails: JSON.stringify({
      type: 'Professional microneedle roller device',
      needleCount: '450 ultra-thin needles',
      needleThickness: '25% thinner than competitors',
      technology: 'Patented Diskneedle Therapy System (DTS)',
      target: 'Skin rejuvenation and product absorption enhancement',
      keyBenefits: 'Enhanced product absorption, reduced skin trauma, professional-grade results',
      usage: 'Professional treatments by licensed practitioners',
      treatmentAreas: 'Face, body, scalp applications',
      professionalUse: 'Licensed practitioners only',
      safety: 'Medical-grade stainless steel needles',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Medical-Grade Quality',
        description: 'FDA-approved microneedling device designed for professional use with surgical steel needles.'
      },
      {
        title: 'Ultra-Thin Needles',
        description: '450 needles per unit, 25% thinner than other brands for enhanced comfort and effectiveness.'
      },
      {
        title: 'Professional Grade',
        description: 'Manufactured in South Korea with precision engineering for professional use.'
      }
    ]),
    benefits: JSON.stringify([
      'Enhanced Product Absorption - Creates microchannels for 300% better product penetration',
      'Natural Collagen Induction - Stimulates skin\'s healing response for firmer, younger-looking skin',
      'Reduced Fine Lines & Wrinkles - Promotes elastin production for improved skin texture',
      'Scar Reduction - Effective for treating acne scars, surgical scars, and stretch marks',
      'Pore Minimization - Helps reduce pore size and improve skin smoothness',
      'Hyperpigmentation Treatment - Aids in reducing dark spots and uneven skin tone',
      'Minimal Downtime - Less invasive than traditional treatments with faster recovery'
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and sanitize the roller' },
      { step: 'Application', instruction: 'Roll gently in vertical, horizontal, and diagonal directions' },
      { step: 'Coverage', instruction: 'Treat each area for 2-3 minutes with light pressure' },
      { step: 'Post-Treatment', instruction: 'Apply soothing serum or hyaluronic acid' },
      { step: 'Frequency', instruction: 'Use once every 4-6 weeks for optimal results' },
      { step: 'Maintenance', instruction: 'Clean and sanitize after each use' }
    ]),
    directions: 'This device is intended for professional use by licensed practitioners. Consult with a qualified professional to determine the appropriate treatment protocol based on your individual skin needs and concerns.'
  },
  '11': {
    productDetails: JSON.stringify({
      form: 'Biphasic makeup remover',
      size: '200ml',
      target: 'Lip and eye area makeup removal',
      technology: 'Dual-layer formula with vitamin complex and firming peptides',
      keyBenefits: 'Gentle cleansing, effective makeup removal, skin nourishment, no irritation',
      usage: 'Daily makeup removal, morning and evening',
      skinType: 'All skin types, including sensitive eye and lip areas',
      application: 'Shake well, apply to cotton pad, gently wipe lip and eye areas',
      testing: 'Dermatologically tested and ophthalmologically tested',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Biphasic Technology',
        description: 'Dual-layer formula with essence layer containing vitamins and firming peptides, plus oil layer for powerful cleansing.'
      },
      {
        title: 'Gentle Formula',
        description: 'Specifically designed for delicate lip and eye areas with non-greasy, non-irritating properties.'
      },
      {
        title: 'Vitamin Complex',
        description: '10 Vitamin Complex provides nourishment while cleansing, promoting healthy skin around the eyes and lips.'
      },
      {
        title: 'Firming Peptides',
        description: 'Palmitoyl Tripeptide-5 and Acetyl Tetrapeptide-5 help maintain skin firmness and elasticity.'
      }
    ]),
    benefits: JSON.stringify([
      'Effective Makeup Removal - Removes even waterproof makeup from delicate areas',
      'Gentle Cleansing - Non-irritating formula suitable for sensitive skin',
      'Nourishing Properties - Vitamin complex provides skin nourishment',
      'Firming Action - Peptides help maintain skin firmness and elasticity',
      'Easy Application - Shake well before use for optimal results',
      'Professional Quality - Dermatologically tested for safety and efficacy'
    ]),
    ingredients: JSON.stringify([
      {
        name: '10 Vitamin Complex',
        description: 'Comprehensive vitamin blend that provides nourishment and antioxidant protection while cleansing.'
      },
      {
        name: 'Firming Peptides',
        description: 'Palmitoyl Tripeptide-5 and Acetyl Tetrapeptide-5 help maintain skin firmness and reduce signs of aging.'
      },
      {
        name: 'Botanical Extracts',
        description: 'Rosa Damascena Flower Water, Carrot Root Extract, and Broccoli Extract provide natural nourishment.'
      },
      {
        name: 'Nourishing Oils',
        description: 'Carrot Seed Oil and Sea Buckthorn Oil provide essential fatty acids and vitamins for skin health.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Shake Well', instruction: 'Shake the bottle well before use to mix the biphasic layers' },
      { step: 'Application', instruction: 'Apply a small amount to cotton pad or fingertips' },
      { step: 'Gentle Removal', instruction: 'Gently wipe away makeup from lips and eye area' },
      { step: 'Rinse', instruction: 'Rinse with lukewarm water if desired' },
      { step: 'Follow-up', instruction: 'Continue with your regular skincare routine' },
      { step: 'Storage', instruction: 'Store in a cool, dry place away from direct sunlight' }
    ]),
    directions: 'This product is dermatologically tested and specifically formulated for delicate lip and eye areas. For best results, shake well before use and store in a cool, dry place away from direct sunlight.'
  },
  '15': {
    productDetails: JSON.stringify({
      form: 'Intensive problem control toner',
      size: '200ml (Homecare) / 500ml (Professional)',
      target: 'Acne-prone, sensitive, and problematic skin',
      technology: 'Advanced active ingredient complex',
      keyBenefits: 'Problem control, pore minimizing, skin soothing',
      usage: 'Professional and home care',
      skinType: 'Problematic, acne-prone, sensitive skin',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Intensive Problem Control - Targets acne, blemishes, and skin irritations effectively',
      'Pore Minimizing - Helps reduce pore size and tighten skin texture',
      'Skin Soothing - Calms irritated and sensitive skin with anti-inflammatory properties',
      'Dead Skin Cell Removal - Gently exfoliates and removes impurities for clearer skin',
      'pH Balancing - Restores optimal skin pH levels for healthy skin barrier',
      'Professional Results - Delivers clinical-grade benefits for problem skin management'
    ]),
    howToUse: JSON.stringify([
      { step: 'Method 1 - Daily Cleansing', instruction: 'Soak a cotton pad with toner and gently wipe along the skin texture to remove dead skin cells and residues after washing the face.' },
      { step: 'Method 2 - Intensive Treatment', instruction: 'Soak cotton pads with toner and apply them to the face. Leave them on for 5-10 minutes to enhance pore contraction effect and soothe the skin.' }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. Particularly effective for problematic and acne-prone skin. For best results, use as part of your daily skincare routine and follow with appropriate moisturizer.',
    ingredients: JSON.stringify([
      {
        name: 'Salicylic Acid',
        description: 'Beta-hydroxy acid that penetrates pores to dissolve dead skin cells and excess oil, helping to prevent acne breakouts and improve skin texture.'
      },
      {
        name: 'Witch Hazel Extract',
        description: 'Natural astringent that tightens pores, reduces inflammation, and provides soothing relief for irritated and sensitive skin.'
      },
      {
        name: 'Tea Tree Extract',
        description: 'Powerful antimicrobial and anti-inflammatory agent that helps combat acne-causing bacteria while soothing irritated skin.'
      },
      {
        name: 'Aloe Vera Extract',
        description: 'Soothing and healing ingredient that calms inflammation, reduces redness, and promotes skin healing for problem areas.'
      },
      {
        name: 'Niacinamide',
        description: 'Vitamin B3 derivative that helps regulate sebum production, minimize pores, and improve skin barrier function for healthier skin.'
      }
    ])
  },
  '16': {
    productDetails: JSON.stringify({
      form: 'Daily moisturizing and skin refining toner',
      size: '200ml (Homecare) / 1000ml (Professional)',
      target: 'Hydration and skin refinement',
      technology: 'Botanical extract complex with pH balancing system',
      keyBenefits: 'Deep moisturization, skin soothing, texture refinement, pH balancing',
      usage: 'Morning and evening after cleansing',
      skinType: 'All skin types',
      application: 'Apply with cotton pad or pat gently with hands',
      formulation: 'Lightweight, fast-absorbing formula',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Daily Moisturizing',
        description: 'Provides essential hydration and moisture replenishment for all skin types, maintaining optimal skin barrier function.'
      },
      {
        title: 'Skin Refining',
        description: 'Helps refine skin texture and improve overall skin quality through gentle exfoliation and pH balancing.'
      },
      {
        title: 'pH Balancing',
        description: 'Restores optimal skin pH levels after cleansing, promoting healthy skin function and barrier protection.'
      },
      {
        title: 'Botanical Extracts',
        description: 'Enriched with natural botanical extracts that provide soothing, anti-inflammatory, and antioxidant benefits.'
      }
    ]),
    benefits: JSON.stringify([
      'Deep Hydration - Provides immediate and long-lasting moisture to all skin types',
      'Skin Refinement - Gently exfoliates and refines skin texture for smoother appearance',
      'pH Restoration - Balances skin pH levels after cleansing for optimal skin health',
      'Soothing Properties - Calms and soothes irritated or sensitive skin',
      'Antioxidant Protection - Protects against environmental damage and free radicals',
      'Versatile Usage - Suitable for daily use in both homecare and professional settings'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Phytolex SC',
        description: 'Advanced botanical complex that provides deep hydration and skin-soothing properties while supporting natural skin barrier function.'
      },
      {
        name: 'Nelumbo Nucifera Flower Extract',
        description: 'Sacred lotus extract known for its antioxidant properties, skin brightening effects, and ability to promote skin radiance.'
      },
      {
        name: 'Lactobacillus/Pumpkin Ferment Extract',
        description: 'Innovative fermentation technology that enhances ingredient absorption and provides probiotic benefits for skin microbiome health.'
      },
      {
        name: 'Betaine',
        description: 'Natural moisturizing agent that helps maintain skin hydration and provides gentle cleansing properties without stripping natural oils.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Method 1: Skin Cleansing & Exfoliation', instruction: 'Soak a cotton pad with toner and gently wipe along the skin texture to remove dead skin cells and residues after cleansing.' },
      { step: 'Method 2: Immediate Moisture Replenishment', instruction: 'Spray the product (200ml homecare version) generously with eyes closed and tap gently. Can be used even over makeup for instant hydration.' },
      { step: 'Method 3: Intensive Moisturizing Treatment', instruction: 'Soak cotton pads with toner and apply to face as a hydrating mask. Leave on for 5-10 minutes for intensive moisturizing and soothing effects.' }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use as part of your daily skincare routine. The 200ml size is perfect for homecare, while the 1000ml size is ideal for professional use in clinics and spas.'
  },
  '2': {
    productDetails: JSON.stringify({
      form: 'Professional automatic microneedling device',
      size: '1 Device',
      target: 'Collagen production and transdermal nutrient delivery',
      technology: 'Automatic microneedling with adjustable depth and speed',
      keyBenefits: 'Collagen production, enhanced absorption, skin rejuvenation, micro-channel creation',
      usage: 'Professional and home use, controlled micro-injuries',
      skinType: 'All skin types, especially aging and textured skin',
      application: 'Creates micro-channels for enhanced ingredient absorption',
      safety: 'Professional-grade device with controlled penetration',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Automatic Microneedling',
        description: 'Advanced automatic technology for precise, controlled microneedling therapy with consistent results.'
      },
      {
        title: 'Collagen Production',
        description: 'Stimulates natural collagen and elastin production through controlled micro-injuries for skin rejuvenation.'
      },
      {
        title: 'Enhanced Absorption',
        description: 'Creates physical pathways through skin to dramatically increase absorption of active skincare ingredients.'
      },
      {
        title: 'Professional Grade',
        description: 'Medical-grade device manufactured in South Korea with precision engineering for optimal results.'
      }
    ]),
    benefits: JSON.stringify([
      'Enhanced Product Absorption - Increases absorption rate of active skincare ingredients by up to 300%',
      'Collagen Stimulation - Promotes natural collagen and elastin production for firmer, younger-looking skin',
      'Skin Rejuvenation - Accelerates natural wound healing process for improved skin texture and tone',
      'Precise Control - Automatic technology ensures consistent, controlled microneedling depth and speed',
      'Professional Results - Medical-grade device delivers clinical-quality results at home',
      'Versatile Treatment - Suitable for face, neck, and body for comprehensive skin improvement'
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and ensure device is properly sterilized' },
      { step: 'Settings', instruction: 'Adjust needle depth and speed according to treatment area and skin sensitivity' },
      { step: 'Application', instruction: 'Move device in gentle, overlapping motions across treatment area' },
      { step: 'Post-Treatment', instruction: 'Apply recommended serums or treatments for enhanced absorption' },
      { step: 'Recovery', instruction: 'Follow post-treatment care instructions for optimal healing' },
      { step: 'Frequency', instruction: 'Use as directed by skincare professional or device instructions' }
    ]),
    directions: 'This is a professional medical device. For best results and safety, use as directed by a skincare professional. Ensure proper sterilization and follow all safety guidelines. Not recommended for use on active acne or inflamed skin.'
  },
  '3': {
    productDetails: JSON.stringify({
      type: 'Auto-microneedling LED device for scalp treatment',
      size: '1 Device',
      technology: 'Microneedling + LED light therapy',
      keyComponents: 'HR³ MATRIX HAIR SOLUTION α + HR³ MATRIX HAIR STAMP',
      benefits: 'Hair growth stimulation, scalp health improvement, nutrient delivery',
      usage: 'Professional and home care',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Auto-Microneedling Technology',
        description: 'Automated microneedling system that creates micro-channels in the scalp to enhance nutrient absorption and stimulate natural healing processes.'
      },
      {
        title: 'LED Light Therapy',
        description: 'Advanced LED light system that stimulates hair follicles, improves scalp circulation, and promotes cellular regeneration for enhanced hair growth.'
      },
      {
        title: 'HR³ MATRIX HAIR SOLUTION α',
        description: 'Premium anti-hair loss solution that supplies essential nutrients to combat factors causing hair loss and promote healthy hair growth.'
      },
      {
        title: 'HR³ MATRIX HAIR STAMP',
        description: 'Patented delivery enhancer with microneedles that leads to scalp regeneration and collagen production through natural wound healing processes.'
      }
    ]),
    benefits: JSON.stringify([
      'Enhanced Hair Growth - Stimulates hair follicles and promotes natural hair regrowth',
      'Improved Scalp Health - Increases blood circulation and nutrient delivery to hair roots',
      'Collagen Production - Promotes scalp regeneration and strengthens hair structure',
      'Nutrient Absorption - Creates pathways for better penetration of hair care products',
      'Professional Results - Advanced technology for both professional and home use',
      'Non-Invasive Treatment - Safe and effective without side effects'
    ]),
    howToUse: JSON.stringify([
      { step: 'Microneedling', instruction: 'Creates micro-channels in the scalp to enhance product absorption' },
      { step: 'LED Therapy', instruction: 'Light therapy stimulates hair follicles and improves scalp circulation' },
      { step: 'Nutrient Delivery', instruction: 'HR³ MATRIX HAIR SOLUTION α provides essential nutrients for hair growth' },
      { step: 'Regeneration', instruction: 'Natural wound healing process promotes collagen production and scalp health' }
    ]),
    directions: 'This device is designed for professional and home use. For best results, use consistently as part of your hair care routine. Consult with a hair care professional for personalized treatment protocols.'
  },
  '10': {
    productDetails: JSON.stringify({
      form: 'Oxygen bubble cleanser',
      size: '180ml (Homecare) / 500ml (Professional)',
      target: 'Deep cleansing and skin nourishment',
      technology: 'Oxygen therapy mechanism with natural bubble generation',
      keyBenefits: 'Gentle cleansing, oxygen therapy, makeup removal, skin nourishment',
      usage: 'Morning and evening cleansing',
      skinType: 'All skin types, especially sensitive skin',
      application: 'Apply to wet skin, massage gently, rinse thoroughly',
      formulation: 'Oxygen bubble technology with gentle surfactants',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Oxygen Therapy Mechanism',
        description: 'Advanced oxygen therapy technology that provides deep cleansing and skin nourishment through natural oxygen bubbles.'
      },
      {
        title: 'Gentle Cleansing',
        description: 'Effective removal of makeup and impurities without excessive cleansing movement or skin irritation.'
      },
      {
        title: 'Natural Oxygen Bubbles',
        description: 'Naturally generated oxygen bubbles provide a luxurious treatment sensation while cleansing the skin.'
      },
      {
        title: 'All-in-One Formula',
        description: 'Comprehensive cleanser that removes makeup, dirt, and impurities while nourishing the skin.'
      }
    ]),
    benefits: JSON.stringify([
      'Deep Cleansing - Effectively removes makeup, dirt, and skin impurities without irritation',
      'Oxygen Therapy - Provides skin with oxygen for improved circulation and nourishment',
      'Gentle Formula - Suitable for all skin types, including sensitive skin',
      'Luxurious Experience - Creates a spa-like treatment sensation with oxygen bubbles',
      'No Irritation - Gentle cleansing without excessive movement or skin damage',
      'Skin Nourishment - Provides essential nutrients while cleansing for healthy skin'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Phytolex SC',
        description: 'Advanced botanical complex that provides gentle cleansing and skin nourishment.'
      },
      {
        name: 'MultiEx Phytrogen',
        description: 'Multi-functional plant extract that enhances oxygen delivery and skin health.'
      },
      {
        name: 'Methyl Perfluoroisobutyl Ether',
        description: 'Specialized ingredient that creates the oxygen bubble effect for enhanced cleansing and treatment sensation.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Application', instruction: 'Apply product to dry face, avoiding the eye area' },
      { step: 'Wait', instruction: 'Allow oxygen bubbles to form naturally on the skin surface' },
      { step: 'Activation', instruction: 'Wet your fingers and gently spread the product across the face' },
      { step: 'Bubble Formation', instruction: 'Let the oxygen bubbles develop fully for maximum effect' },
      { step: 'Massage', instruction: 'Gently massage with wet hands in circular motions' },
      { step: 'Rinse', instruction: 'Rinse thoroughly with lukewarm water to remove all product and bubbles' }
    ]),
    directions: 'This product is dermatologically tested and suitable for all skin types. For best results, use as part of your daily cleansing routine. Store in a cool, dry place away from direct sunlight.'
  },
  '12': {
    productDetails: JSON.stringify({
      form: 'Enzyme-based peeling gel',
      size: '100g',
      skinType: 'All skin types, including sensitive skin',
      technology: 'Natural enzyme exfoliation',
      keyBenefits: 'Gentle exfoliation, radiance enhancement, pore purification',
      usage: '1-2 times per week',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Gentle Exfoliation - Effectively removes dead skin cells, promoting smoother skin texture',
      'Radiance Enhancement - Helps correct skin tone, resulting in a brighter complexion',
      'Deep Moisturization - Provides hydration to the skin, preventing dryness',
      'Pore Purification - Cleanses and purifies pores, reducing the likelihood of breakouts',
      'Enzyme Technology - Natural enzyme-based exfoliation for gentle skin renewal',
      'All Skin Types - Suitable for sensitive and all skin types',
      'Professional Results - Delivers salon-quality exfoliation at home'
    ]),
    howToUse: 'Apply the gel to clean, dry skin and gently massage in a circular motion for up to one minute. Rinse off the clumped dead skin cells with lukewarm water. Use 1-2 times per week for optimal results.',
    ingredients: JSON.stringify([
      {
        name: 'Natural Enzymes',
        description: 'Facilitate gentle exfoliation by breaking down dead skin cells naturally, providing effective yet non-irritating skin renewal.'
      },
      {
        name: 'Retinol (Vitamin A)',
        description: 'Promotes skin renewal and improves texture while supporting cellular turnover for a more youthful appearance.'
      },
      {
        name: 'Provitamin A',
        description: 'Supports skin health and regeneration, providing essential nutrients for optimal skin function and recovery.'
      },
      {
        name: 'Vitamin E',
        description: 'Provides antioxidant protection and moisturization, helping to protect the skin from environmental damage while maintaining hydration.'
      },
      {
        name: 'Vitamin C (Ascorbic Acid)',
        description: 'Brightens the skin and boosts collagen production, helping to reduce signs of aging and improve skin radiance.'
      },
      {
        name: 'Allantoin',
        description: 'Soothes and calms the skin, reducing irritation and providing gentle care for sensitive skin during exfoliation.'
      }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use as part of your weekly skincare routine to achieve smoother, more radiant skin.'
  },
  '13': {
    productDetails: JSON.stringify({
      form: 'Professional chemical peeling system',
      size: '2ml x 10ea',
      target: 'Skin renewal and exfoliation',
      technology: 'Multi-AHA complex with naturally occurring acids',
      keyBenefits: 'Dead cell removal, cell turnover, skin brightening, tone evening',
      usage: 'Professional treatments only',
      skinType: 'All skin types, especially dull and textured skin',
      application: 'Apply evenly to face by licensed practitioner',
      testing: 'Dermatologically tested',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Naturally Occurring AHA Complex',
        description: 'Multi-acid formula with glycolic, lactic, mandelic, and phytic acids derived from natural sources for gentle yet effective exfoliation.'
      },
      {
        title: 'Cell Turnover Enhancement',
        description: 'Encourages natural skin renewal by removing dead surface cells and promoting new healthy cell growth.'
      },
      {
        title: 'Professional Grade Formula',
        description: 'Specifically formulated for professional use to deliver controlled and effective peeling results.'
      },
      {
        title: 'Peptide Support',
        description: 'Enhanced with sh-Polypeptide-7 for skin regeneration and healing support during the renewal process.'
      }
    ]),
    benefits: JSON.stringify([
      'Skin Renewal - Removes dead skin cells and promotes natural cell turnover',
      'Brightening - Reveals fresh, radiant skin for a brighter complexion',
      'Even Tone - Helps achieve smoother, more even skin tone and texture',
      'Professional Results - Clinical-grade peeling for advanced skincare treatments',
      'Natural Acids - Uses naturally occurring AHA acids from fruits and foods',
      'Safe & Tested - Dermatologically tested for professional use'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Glycolic Acid',
        description: 'The smallest AHA molecule that penetrates deeply to exfoliate and stimulate collagen production for smoother, younger-looking skin.'
      },
      {
        name: 'Lactic Acid',
        description: 'Gentle AHA that exfoliates while providing hydration, improving skin texture and tone without excessive irritation.'
      },
      {
        name: 'Mandelic Acid',
        description: 'Larger molecule AHA that works more gently on the skin surface, ideal for sensitive skin and reducing post-inflammatory hyperpigmentation.'
      },
      {
        name: 'Phytic Acid',
        description: 'Natural chelating agent with antioxidant properties that helps brighten skin and enhance the effectiveness of other AHA acids.'
      },
      {
        name: 'sh-Polypeptide-7',
        description: 'Advanced peptide that supports skin regeneration and healing during the peeling process for optimal recovery.'
      },
      {
        name: 'Scutellaria Baicalensis Root Extract',
        description: 'Powerful antioxidant botanical extract that soothes skin and provides anti-inflammatory benefits during treatment.'
      },
      {
        name: 'Houttuynia Cordata Extract',
        description: 'Natural extract with anti-inflammatory and antibacterial properties that helps soothe and protect skin during peeling.'
      },
      {
        name: 'Chamaecyparis Obtusa Water',
        description: 'Purified cypress water that provides gentle hydration and soothing properties to calm skin during the renewal process.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and ensure it\'s completely dry' },
      { step: 'Application', instruction: 'Apply evenly to the treatment area avoiding eye and lip areas' },
      { step: 'Wait Time', instruction: 'Leave on for prescribed time as determined by skin professional' },
      { step: 'Neutralization', instruction: 'Neutralize according to professional protocol' },
      { step: 'Rinse', instruction: 'Rinse thoroughly with cool water' },
      { step: 'Post-Treatment', instruction: 'Apply soothing and protective products as recommended' }
    ]),
    directions: 'This is a professional-grade chemical peeling system and should only be administered by licensed skincare professionals. Post-treatment sun protection is essential. May cause temporary redness and sensitivity. Not recommended for pregnant or nursing women. Always perform a patch test before use.'
  },
  '14': {
    productDetails: JSON.stringify({
      type: 'Microbiome energy infusing mist',
      size: '80ml',
      keyBenefits: 'Microbiome balance, hydration, radiance, barrier protection',
      skinType: 'All skin types',
      usage: 'Daily skincare routine, on-the-go hydration',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Microbiome Technology',
        description: 'Advanced probiotic and prebiotic blend that corrects and maintains the natural balance of skin microbiome.'
      },
      {
        title: 'Instant Hydration',
        description: 'Powerful hyaluronic acid complex that provides immediate and long-lasting moisture to the skin.'
      },
      {
        title: 'Natural Radiance',
        description: 'Unique formula that revitalizes skin and enhances natural glow and radiance for a healthy complexion.'
      },
      {
        title: 'Barrier Protection',
        description: 'Strengthens skin\'s natural moisture barrier and enhances skin\'s natural defense mechanisms.'
      }
    ]),
    benefits: JSON.stringify([
      'Microbiome Balance - Restores and maintains healthy skin microbiome',
      'Instant Hydration - Provides immediate moisture and long-lasting hydration',
      'Natural Radiance - Enhances skin\'s natural glow and radiance',
      'Barrier Strengthening - Improves skin\'s natural moisture barrier function',
      'Skin Revitalization - Energizes and revitalizes tired, stressed skin',
      'Gentle Care - Suitable for all skin types, including sensitive skin'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'CUREBIOME (Probiotics & Prebiotics)',
        description: 'Advanced microbiome technology that corrects skin microbiome balance and promotes healthy skin flora.'
      },
      {
        name: 'FENSEBIOME™ (Acetyl Heptapeptide-4)',
        description: 'Innovative peptide that enhances skin\'s natural defense mechanisms and microbiome health.'
      },
      {
        name: 'Hyaluronan 10 Multi-Complex',
        description: 'Multi-molecular hyaluronic acid complex that provides deep hydration and plumping effects.'
      },
      {
        name: 'Butyrospermum Parkii (Shea) Butter',
        description: 'Natural emollient that provides additional moisture and helps maintain skin\'s natural barrier.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse your skin thoroughly before application' },
      { step: 'Application', instruction: 'Hold the bottle 15-20cm away from your face and mist evenly' },
      { step: 'Absorption', instruction: 'Gently pat the mist into your skin with your fingertips' },
      { step: 'Frequency', instruction: 'Use morning and evening, or as needed throughout the day' },
      { step: 'Layering', instruction: 'Can be used before or after other skincare products' }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. Perfect for daily use and can be reapplied throughout the day for instant hydration. Store in a cool, dry place and shake well before use for best results.'
  },
  '17': {
    productDetails: JSON.stringify({
      form: 'Eye contour serum',
      size: '10ml',
      skinType: 'All skin types, especially mature and aging skin',
      technology: 'Advanced peptide and botanical callus culture technology',
      keyBenefits: 'Wrinkle reduction, dark circle diminishment, puffiness relief',
      usage: 'Morning and evening',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Wrinkle Reduction - Stimulates collagen production and relaxes facial muscles for smoother skin',
      'Dark Circle Diminishment - Anti-dark circle complex strengthens skin and visibly reduces dark circles',
      'Puffiness Relief - Alleviates under-eye puffiness and swelling',
      'Hydration and Firmness - Deeply moisturizes and plumps skin, enhancing elasticity',
      'Antioxidant Protection - Botanical stem cell extracts provide soothing and whitening effects',
      'Skin Regeneration - Promotes cellular renewal and skin repair',
      'Professional Results - Delivers clinical-grade results for comprehensive eye care'
    ]),
    howToUse: 'Apply a small amount around the eye area in the morning and evening. Gently massage until fully absorbed using your ring finger for optimal absorption. For best results, use in conjunction with the Genosys EyeCell Eye Contour Cream as part of your daily eye care routine.',
    ingredients: JSON.stringify([
      {
        name: 'Palmitoyl Hexapeptide-12',
        description: 'Stimulates fibroblast growth for firming effects and improved skin elasticity around the delicate eye area.'
      },
      {
        name: 'Copper Tripeptide-1',
        description: 'Promotes collagen synthesis and skin regeneration, reducing fine lines and wrinkles for a more youthful appearance.'
      },
      {
        name: 'Acetyl Hexapeptide-8',
        description: 'Acts as muscle relaxant, reducing wrinkle appearance and expression lines for smoother skin.'
      },
      {
        name: 'Anti-Dark Circle Complex (Haloxyl™)',
        description: 'Specialized complex for dark circle reduction and skin strengthening, targeting under-eye discoloration.'
      },
      {
        name: 'Vitis Vinifera (Grape) Callus Culture Extract',
        description: 'Provides antioxidant and skin-renewing properties with anti-aging benefits for enhanced skin health.'
      },
      {
        name: 'Rosa Damascena Callus Culture Extract',
        description: 'Offers moisturizing, soothing, and whitening effects with anti-aging benefits, helping to brighten the eye area.'
      },
      {
        name: 'Adenosine',
        description: 'Provides anti-aging and skin-soothing properties with wrinkle-reducing effects for improved skin texture.'
      },
      {
        name: 'Arbutin',
        description: 'Natural skin brightening agent that helps even skin tone and reduce the appearance of dark spots.'
      }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For optimal results, use in conjunction with other Genosys EyeCell products as part of your daily eye care routine.'
  },
  '18': {
    productDetails: JSON.stringify({
      form: 'Hydrating serum with coconut water base',
      size: '30ml',
      target: 'Deep hydration and moisture replenishment',
      technology: '4-step hydration system with multi-molecular hyaluronic acid',
      keyBenefits: 'Deep hydration, moisture retention, anti-inflammatory protection',
      usage: 'Daily morning and evening application',
      skinType: 'All skin types, especially dry and dehydrated skin',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: '4-Step Hydration System',
        description: 'Advanced hydration technology that works in layers for comprehensive moisture delivery and retention.'
      },
      {
        title: 'Coconut Water Base',
        description: 'Natural coconut water provides electrolytes and natural hydration for optimal skin balance.'
      },
      {
        title: 'Hyaluronic Acid Complex',
        description: 'Multi-molecular weight hyaluronic acids for layer-by-layer moisture replenishment and barrier formation.'
      },
      {
        title: 'Mushroom Extracts',
        description: 'Powerful mushroom extracts provide anti-inflammatory and antioxidant protection for healthy skin.'
      }
    ]),
    benefits: JSON.stringify([
      'Deep Hydration - Multi-layer moisture delivery for comprehensive skin hydration',
      'Moisture Retention - Prevents moisture evaporation with barrier-forming technology',
      'Natural Hydration - Coconut water provides electrolytes for optimal skin balance',
      'Anti-Inflammatory - Mushroom extracts soothe and protect skin from environmental damage',
      'Enhanced Penetration - Aquaporin stimulation improves moisture transport into skin',
      'Long-Lasting Results - Sustained hydration that lasts throughout the day'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Coconut Water Complex (78%)',
        description: 'Natural coconut water provides electrolytes, vitamins, and minerals for optimal skin hydration and balance.'
      },
      {
        name: 'Hyaluronan 11 Multi-Complex',
        description: 'Advanced hyaluronic acid complex with multiple molecular weights for comprehensive hydration at all skin levels.'
      },
      {
        name: 'Glyceryl Glucoside',
        description: 'Aquaporin-stimulating ingredient that enhances moisture transport and improves skin\'s natural hydration mechanisms.'
      },
      {
        name: 'Mushroom Extracts',
        description: 'Tremella Fuciformis and other mushroom extracts provide anti-inflammatory and antioxidant protection while retaining moisture.'
      },
      {
        name: 'Sodium Hyaluronate Crosspolymer',
        description: 'Forms a protective moisture film on skin surface to prevent water loss and maintain hydration.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse and tone your skin' },
      { step: 'Application', instruction: 'Apply 2-3 drops to face and neck' },
      { step: 'Massage', instruction: 'Gently pat and massage until fully absorbed' },
      { step: 'Frequency', instruction: 'Use morning and evening for best results' },
      { step: 'Layering', instruction: 'Follow with moisturizer to seal in hydration' }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use as part of your daily skincare routine. The coconut water base provides natural hydration while the multi-molecular hyaluronic acid complex delivers deep, lasting moisture.'
  },
  '19': {
    productDetails: JSON.stringify({
      size: '30ml',
      skinType: 'Sensitive, reactive, and easily irritated skin',
      formulation: 'Gentle, non-irritating serum',
      keyBenefits: 'Barrier repair, anti-inflammatory, soothing',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Skin Barrier Repair - Strengthens and rebuilds the skin\'s natural protective barrier',
      'Anti-Inflammatory - Reduces redness and calms irritated, sensitive skin',
      'Soothing Relief - Provides immediate comfort for sensitized skin',
      'Moisture Barrier - Creates a protective layer to prevent moisture loss',
      'Gentle Formula - Specifically designed for sensitive and reactive skin',
      'Skin Repair - Helps repair damaged skin and restore healthy function'
    ]),
    howToUse: 'Apply the serum to clean skin in the morning and evening. Gently pat with fingers until fully absorbed. Use as part of your daily skincare routine for sensitive skin care.',
    ingredients: JSON.stringify([
      {
        name: 'MultiEx BSASM® Plus',
        description: 'A patented complex that helps strengthen the skin barrier and provides long-lasting hydration while protecting sensitive skin from environmental stressors.'
      },
      {
        name: 'Phytolex SC',
        description: 'A plant-derived ingredient that provides natural anti-inflammatory benefits and helps soothe irritated skin while supporting the skin\'s natural healing process.'
      },
      {
        name: 'Hyaluronic Acid',
        description: 'A powerful humectant that attracts and retains moisture, providing deep hydration without causing irritation or clogging pores.'
      },
      {
        name: 'Phytosphingosine',
        description: 'A natural lipid that helps restore the skin\'s barrier function and provides gentle antimicrobial protection while being suitable for sensitive skin.'
      },
      {
        name: 'Aloe Barbadensis Leaf Extract',
        description: 'Known for its soothing and healing properties, aloe vera helps calm irritated skin, reduce inflammation, and provide natural moisture to sensitive skin.'
      },
      {
        name: 'Hamamelis Virginiana (Witch Hazel) Extract',
        description: 'A natural astringent that helps tighten pores, reduce inflammation, and provide gentle cleansing properties while being gentle on sensitive skin.'
      },
      {
        name: 'Beta-Glucan',
        description: 'A natural immune-boosting ingredient that helps strengthen the skin\'s defense mechanisms, reduce inflammation, and promote healing in sensitive skin.'
      }
    ]),
    directions: 'This product is dermatologically tested and specifically formulated for sensitive skin. For best results, use as part of your daily sensitive skin care routine.'
  },
  '20': {
    productDetails: JSON.stringify({
      form: 'Anti-blemish serum',
      size: '30ml',
      target: 'Combination and oily acne-prone skin',
      technology: 'Advanced sebum-regulating formula',
      keyBenefits: 'Sebum control, breakout prevention, texture refinement, oil regulation',
      usage: 'Daily anti-blemish treatment, morning and evening',
      skinType: 'Combination and oily acne-prone skin',
      application: 'Apply to clean skin, focus on problem areas',
      testing: 'Dermatologically tested and clinically proven',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Sebum Regulation',
        description: 'Advanced sebum-regulating technology that controls excessive oil production for balanced, healthy skin.'
      },
      {
        title: 'Anti-Blemish Formula',
        description: 'Specifically designed to target and prevent skin breakouts while promoting clear, healthy skin.'
      },
      {
        title: 'Texture Refinement',
        description: 'Helps refine and smooth skin texture for a healthier-looking, clearer complexion.'
      },
      {
        title: 'Natural Ingredients',
        description: 'Formulated with zinc PCA and willow bark extract for gentle yet effective blemish control.'
      }
    ]),
    benefits: JSON.stringify([
      'Breakout Prevention - Helps prevent and control skin breakouts for clearer skin',
      'Sebum Control - Regulates excessive oil production for balanced, healthy skin',
      'Texture Improvement - Refines skin texture for smoother, healthier-looking skin',
      'Oil Balance - Restores natural oil balance for optimal skin health',
      'Gentle Formula - Suitable for combination and oily skin types',
      'Clear Complexion - Promotes a healthier, clearer skin appearance'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Zinc PCA',
        description: 'Powerful sebum-regulating ingredient that controls oil production and helps prevent breakouts.'
      },
      {
        name: 'Willow Bark Extract',
        description: 'Natural salicylic acid source that gently exfoliates and helps clear clogged pores.'
      },
      {
        name: 'Trehalose',
        description: 'Natural sugar that provides hydration and helps maintain skin barrier function.'
      },
      {
        name: 'Panthenol',
        description: 'Soothing and hydrating ingredient that helps calm irritated skin and promote healing.'
      },
      {
        name: 'Allantoin',
        description: 'Gentle healing ingredient that soothes irritated skin and promotes skin regeneration.'
      },
      {
        name: 'Beta-Glucan',
        description: 'Natural immune-boosting ingredient that helps strengthen skin\'s natural defense mechanisms.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and apply toner if desired' },
      { step: 'Application', instruction: 'Apply 2-3 drops to face and neck, focusing on problem areas' },
      { step: 'Massage', instruction: 'Gently massage in upward motions until fully absorbed' },
      { step: 'Follow-up', instruction: 'Apply moisturizer to lock in hydration' },
      { step: 'Frequency', instruction: 'Use morning and evening for optimal results' },
      { step: 'Results', instruction: 'Visible improvements typically seen within 2-4 weeks of consistent use' }
    ]),
    directions: 'This product is dermatologically tested and specifically formulated for combination and oily skin types. For best results, use consistently as part of your daily skincare routine. Store in a cool, dry place away from direct sunlight.'
  },
  '21': {
    productDetails: JSON.stringify({
      form: 'Advanced skin brightening serum',
      size: '30ml',
      target: 'Skin brightening and melanin control',
      technology: 'MELAZERO® melanin care complex with multi-vitamin formula',
      keyBenefits: 'Skin brightening, even skin tone, natural radiance, melanin control',
      usage: 'Daily brightening treatment, morning and evening',
      skinType: 'All skin types, especially dull and uneven skin',
      application: 'Apply to clean skin before moisturizer',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'MELAZERO® Technology',
        description: 'Patented melanin care complex that targets skin surface melanin for effective brightening and even skin tone.'
      },
      {
        title: 'Multi Vitamin Complex',
        description: 'Advanced VITA 12 Complex with multiple vitamins for comprehensive skin nourishment and radiance.'
      },
      {
        title: 'Vitamin C Derivative',
        description: 'Stable 3-O-Ethyl Ascorbic Acid provides powerful antioxidant protection and skin brightening benefits.'
      },
      {
        title: 'Moisturizing Barrier',
        description: 'Panthenol-rich formula creates a protective barrier while providing deep hydration and skin comfort.'
      }
    ]),
    benefits: JSON.stringify([
      'Skin Brightening - Targets melanin production for even skin tone and natural radiance',
      'Even Skin Tone - Helps reduce dark spots and hyperpigmentation for uniform complexion',
      'Natural Glow - Revives skin\'s natural brightness for healthy, radiant appearance',
      'Antioxidant Protection - Vitamin C derivative provides powerful antioxidant benefits',
      'Moisturizing - Creates protective barrier while providing deep hydration',
      'Gentle Formula - Suitable for all skin types with anti-inflammatory properties'
    ]),
    ingredients: JSON.stringify([
      {
        name: '3-O-Ethyl Ascorbic Acid',
        description: 'Stable vitamin C derivative that provides powerful antioxidant protection and skin brightening benefits.'
      },
      {
        name: 'MELAZERO®',
        description: 'Patented melanin care complex that targets skin surface melanin for effective brightening and even skin tone.'
      },
      {
        name: 'VITA 12 Complex',
        description: 'Multi-vitamin complex that provides comprehensive skin nourishment and radiance enhancement.'
      },
      {
        name: 'Niacinamide',
        description: 'Vitamin B3 that helps improve skin texture, reduce pore size, and enhance skin barrier function.'
      },
      {
        name: 'Glutathione',
        description: 'Powerful antioxidant that helps protect skin from environmental damage and promotes skin health.'
      },
      {
        name: 'Gluconolactone (PHA)',
        description: 'Gentle exfoliating acid that helps improve skin texture and enhance product penetration.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and apply toner if desired' },
      { step: 'Application', instruction: 'Apply 2-3 drops to face and neck, avoiding eye area' },
      { step: 'Massage', instruction: 'Gently massage in upward motions until fully absorbed' },
      { step: 'Follow-up', instruction: 'Apply moisturizer and sunscreen during daytime' },
      { step: 'Frequency', instruction: 'Use morning and evening for optimal results' },
      { step: 'Results', instruction: 'Visible improvements typically seen within 4-6 weeks of consistent use' }
    ]),
    directions: 'This product is dermatologically tested and suitable for all skin types. For best results, use consistently as part of your daily skincare routine. Always use sunscreen during the day when using this product.'
  },
  '22': {
    productDetails: JSON.stringify({
      type: 'Multi-functional anti-wrinkle serum',
      size: '30ml',
      keyBenefits: 'Wrinkle reduction, skin firmness, anti-aging',
      skinType: 'All skin types, especially aging and mature skin',
      usage: 'Daily anti-aging treatment',
      clinicalTesting: 'Clinically tested for efficacy and safety',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Natural Retinol Alternative',
        description: 'Features bakuchiol, a plant-derived alternative to retinol that provides anti-aging benefits without irritation.'
      },
      {
        title: 'Advanced Peptide Complex',
        description: 'Contains Anti-aging Peptide 6 and other peptides that target specific signs of aging for comprehensive results.'
      },
      {
        title: 'Lipid Barrier Technology',
        description: 'Innovative liposome delivery system with ceramides, cholesterol, and phytosphingosine for enhanced penetration.'
      },
      {
        title: 'Clinical Validation',
        description: 'Clinically tested with proven results in improving skin age index and overall skin quality.'
      }
    ]),
    benefits: JSON.stringify([
      'Wrinkle Reduction - Visibly smooths fine lines and deep wrinkles for younger-looking skin',
      'Skin Firmness - Reinforces skin elasticity and firmness for a more lifted appearance',
      'Gentle Formula - Natural bakuchiol provides retinol-like benefits without irritation or sensitivity',
      'Enhanced Penetration - Lipid barrier technology ensures optimal ingredient delivery',
      'Skin Tone Balance - Improves overall skin tone and texture for radiant complexion',
      'Anti-Aging Protection - Comprehensive approach to preventing and reversing signs of aging'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Bakuchiol',
        description: 'Natural plant-derived alternative to retinol that provides anti-aging benefits without irritation or photosensitivity.'
      },
      {
        name: 'Anti-aging Peptide 6',
        description: 'Advanced peptide that targets specific aging mechanisms for comprehensive anti-wrinkle benefits.'
      },
      {
        name: 'Lipid Barrier Liposome',
        description: 'Ceramide NP, cholesterol, and phytosphingosine create a protective barrier while enhancing ingredient penetration.'
      },
      {
        name: 'Collagen & Elastin',
        description: 'Essential proteins that support skin structure and elasticity for firm, youthful skin.'
      },
      {
        name: 'Propolis Extract',
        description: 'Natural bee-derived ingredient that provides antioxidant protection and skin healing benefits.'
      },
      {
        name: 'Adenosine & Niacinamide',
        description: 'Powerful combination that improves skin texture, reduces fine lines, and enhances skin barrier function.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and apply toner if desired' },
      { step: 'Application', instruction: 'Apply 2-3 drops to face and neck, avoiding eye area' },
      { step: 'Massage', instruction: 'Gently massage in upward motions until fully absorbed' },
      { step: 'Follow-up', instruction: 'Apply moisturizer and sunscreen during daytime' },
      { step: 'Frequency', instruction: 'Use once daily, preferably in the evening' },
      { step: 'Results', instruction: 'Visible improvements typically seen within 4-6 weeks of consistent use' }
    ]),
    directions: 'This product is dermatologically tested and clinically proven. For best results, use consistently as part of your daily skincare routine. Suitable for all skin types, including sensitive skin. Store in a cool, dry place away from direct sunlight.'
  },
  '23': {
    productDetails: JSON.stringify({
      form: 'Specialized anti-aging cream',
      size: '50g',
      target: 'Neck and décolleté area anti-aging',
      technology: 'Advanced peptide complex with vitamin blend',
      keyBenefits: 'Lifting, firming, depigmentation, texture refinement',
      usage: 'Daily anti-aging treatment, morning and evening',
      skinType: 'All skin types, especially aging neck and décolleté',
      application: 'Apply to clean neck and décolleté area',
      testing: 'Dermatologically tested and clinically proven',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Advanced Peptide Complex',
        description: 'Copper Tripeptide-1 and multiple peptides work synergistically to stimulate collagen production and skin renewal.'
      },
      {
        title: 'Lifting & Firming',
        description: 'Specialized formula that lifts and firms delicate skin around neck and décolleté area.'
      },
      {
        title: 'Depigmentation Effect',
        description: 'Excellent depigmentation properties help reduce age spots and uneven skin tone.'
      },
      {
        title: 'Vitamin Complex',
        description: 'Comprehensive vitamin blend (A, B5, C, E) provides antioxidant protection and skin nourishment.'
      }
    ]),
    benefits: JSON.stringify([
      'Anti-Aging - Targets fine lines and wrinkles in delicate neck and décolleté area',
      'Lifting Effect - Helps lift and firm sagging skin for more youthful appearance',
      'Texture Refinement - Refines skin texture for smoother, younger-looking skin',
      'Depigmentation - Reduces age spots and uneven skin tone',
      'Collagen Stimulation - Peptides help stimulate natural collagen production',
      'Hydration - Deep moisturizing for delicate skin areas'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Copper Tripeptide-1',
        description: 'Powerful peptide that stimulates collagen synthesis and promotes skin healing and renewal.'
      },
      {
        name: 'Acetyl Hexapeptide-8',
        description: '"Botox-like" peptide that helps relax facial muscles and reduce expression lines.'
      },
      {
        name: 'Palmitoyl Hexapeptide-12',
        description: 'Advanced peptide that helps improve skin firmness and elasticity.'
      },
      {
        name: 'Hyaluronic Acid',
        description: 'Deep hydrating ingredient that plumps skin and reduces the appearance of fine lines.'
      },
      {
        name: 'Ceramide',
        description: 'Essential lipid that helps strengthen skin barrier and maintain moisture balance.'
      },
      {
        name: 'Squalane',
        description: 'Natural emollient that provides deep hydration and helps improve skin texture.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse neck and décolleté area thoroughly' },
      { step: 'Application', instruction: 'Apply a small amount to neck and décolleté area' },
      { step: 'Massage', instruction: 'Gently massage in upward motions from chest to neck' },
      { step: 'Technique', instruction: 'Use upward strokes to help lift and firm the skin' },
      { step: 'Frequency', instruction: 'Use morning and evening for optimal results' },
      { step: 'Results', instruction: 'Visible improvements typically seen within 4-8 weeks of consistent use' }
    ]),
    directions: 'This product is dermatologically tested and specifically formulated for the delicate neck and décolleté area. For best results, use consistently as part of your daily skincare routine. Always use sunscreen during daytime to protect treated areas from UV damage.'
  },
  '24': {
    productDetails: JSON.stringify({
      form: 'Eye contour cream',
      size: '20g',
      skinType: 'All skin types, especially mature and aging skin',
      technology: 'Advanced peptide and botanical callus culture technology',
      keyBenefits: 'Wrinkle reduction, dark circle diminishment, puffiness relief',
      usage: 'Morning and evening',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Fine Wrinkle Reduction - Targets and reduces fine lines around the eye area',
      'Crow\'s Feet Diminishing - Helps diminish the appearance of crow\'s feet',
      'Dark Circle Lightening - Lightens dark circles and under-eye discoloration',
      'Puffiness Relief - Alleviates under-eye puffiness and swelling',
      'Microcirculation Enhancement - Promotes blood circulation for healthier skin',
      'Firming Effects - Provides firming and lifting benefits',
      'Daily Care - Suitable for daily use in morning and evening routines'
    ]),
    howToUse: 'Apply the cream to pre-cleansed skin around the eyes in the morning and evening. Gently pat the product around the eye contour area using your ring finger for optimal absorption. For best results, use in conjunction with other Genosys EyeCell products.',
    ingredients: JSON.stringify([
      {
        name: 'Palmitoyl Hexapeptide-12',
        description: 'Stimulates fibroblast cell growth, imparting firming effects and helping to improve skin elasticity around the delicate eye area.'
      },
      {
        name: 'Copper Tripeptide-1',
        description: 'Promotes collagen synthesis in skin fibroblasts, aiding in skin regeneration and helping to reduce the appearance of fine lines and wrinkles.'
      },
      {
        name: 'Rosa Damascena Callus Culture Extract',
        description: 'Offers moisturizing, soothing, and whitening effects with anti-aging benefits, helping to brighten the eye area and reduce signs of aging.'
      },
      {
        name: 'Scutellaria Baicalensis Root Extract',
        description: 'Provides anti-inflammatory, antioxidant, antimicrobial, antifungal, antiviral, and free radical scavenging properties for comprehensive skin protection.'
      },
      {
        name: 'Sodium Hyaluronate',
        description: 'Hydrates the skin, reduces water loss, minimizes the appearance of wrinkles and fine lines, and improves skin elasticity for a more youthful appearance.'
      }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For optimal results, use in conjunction with other Genosys EyeCell products as part of your daily eye care routine.'
  },
  '25': {
    productDetails: JSON.stringify({
      form: 'Post-treatment regenerating cream',
      size: '20g (Homecare) / 100g (Professional)',
      target: 'Post-treatment skin recovery and healing',
      technology: 'Centella complex with peptide technology',
      keyBenefits: 'Rapid recovery, redness reduction, erythema relief, edema reduction, skin regeneration',
      usage: 'As needed after professional treatments',
      skinType: 'All skin types, especially post-treatment sensitive skin',
      application: 'Apply thin layer to affected areas, massage gently',
      formulation: 'Centella asiatica complex with sh-Polypeptide-7',
      testing: 'Dermatologically tested and clinically proven',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Post-Treatment Recovery',
        description: 'Specifically formulated for skin recovery after professional dermatological operations and treatments.'
      },
      {
        title: 'Centella Complex',
        description: 'Powerful centella asiatica complex with asiaticoside, madecassic acid, and asiatic acid for healing.'
      },
      {
        title: 'Rapid Recovery',
        description: 'Helps skin rapidly recover from redness, erythema, and edema after professional treatments.'
      },
      {
        title: 'Peptide Technology',
        description: 'Advanced sh-Polypeptide-7 helps promote skin regeneration and healing processes.'
      }
    ]),
    benefits: JSON.stringify([
      'Rapid Recovery - Helps skin quickly recover from professional treatment side effects',
      'Redness Reduction - Soothes and reduces redness and inflammation',
      'Erythema Relief - Helps alleviate erythema and skin irritation',
      'Edema Reduction - Helps reduce swelling and edema after treatments',
      'Skin Regeneration - Promotes healthy skin cell regeneration and renewal',
      'Gentle Healing - Suitable for sensitive, post-treatment skin'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Centella Asiatica Complex',
        description: 'Powerful healing complex with asiaticoside, madecassic acid, and asiatic acid for skin recovery.'
      },
      {
        name: 'sh-Polypeptide-7',
        description: 'Advanced peptide that helps promote skin regeneration and healing processes.'
      },
      {
        name: 'Dipotassium Glycyrrhizate',
        description: 'Licorice root extract that provides anti-inflammatory and soothing benefits.'
      },
      {
        name: 'Panthenol',
        description: 'Vitamin B5 that helps soothe irritated skin and promote healing.'
      },
      {
        name: 'Plant Callus Extracts',
        description: 'Vitis Vinifera and Rosa Damascena callus culture extracts for enhanced healing properties.'
      },
      {
        name: 'Scutellaria Baicalensis',
        description: 'Chinese skullcap root extract with anti-inflammatory and antioxidant properties.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin gently after professional treatment' },
      { step: 'Application', instruction: 'Apply a thin layer to affected areas' },
      { step: 'Massage', instruction: 'Gently massage in circular motions until absorbed' },
      { step: 'Frequency', instruction: 'Use as needed for post-treatment recovery' },
      { step: 'Duration', instruction: 'Continue until skin fully recovers from treatment' },
      { step: 'Results', instruction: 'Visible improvement in redness and irritation within 24-48 hours' }
    ]),
    directions: 'This product is dermatologically tested and specifically formulated for post-treatment skin recovery. Use as directed by your skincare professional. Store in a cool, dry place away from direct sunlight.'
  },
  '26': {
    productDetails: JSON.stringify({
      form: 'Oxygen bubbling mask cream',
      size: '50g',
      skinType: 'All skin types, especially damaged and stressed skin',
      technology: 'EGF and oxygen therapy',
      keyBenefits: 'Skin regeneration, oxygen therapy, anti-inflammatory',
      usage: 'Morning and evening',
      specialFeature: 'Unique oxygen bubbling effect',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Oxygen Therapy - Supplies oxygen to the skin, improving cellular metabolism',
      'Skin Regeneration - Accelerates healing process and reduces skin irritations',
      'Anti-Inflammatory - Provides soothing effects for sensitive and damaged skin',
      'Deep Hydration - Promotes intense moisture retention and skin plumping',
      'Collagen Stimulation - Enhances skin elasticity and firmness',
      'EGF Technology - Advanced epidermal growth factor for cellular renewal',
      'Bubbling Action - Unique oxygen bubbling effect for enhanced penetration'
    ]),
    howToUse: 'Apply a thin layer of the cream mask evenly on dry skin. Do not rub; wait for the oxygen bubbles to form and cover the face. Once the bubbles start popping (after 1-2 minutes), gently massage and tap for better absorption. Do not rinse off. Use in the morning and evening.',
    ingredients: JSON.stringify([
      {
        name: 'sh-Oligopeptide-1 (EGF)',
        description: 'Epidermal Growth Factor stimulates cell proliferation and aids in wound healing, promoting faster skin recovery and regeneration.'
      },
      {
        name: 'Madecassoside',
        description: 'Derived from Centella Asiatica, it combats redness, reduces itching, and soothes sensitive skin while providing anti-inflammatory benefits.'
      },
      {
        name: 'Copper Tripeptide-1',
        description: 'Promotes collagen synthesis and has wound-healing properties, helping to improve skin texture and reduce signs of aging.'
      },
      {
        name: 'SEPITONIC M3 (Mineral Complex)',
        description: 'Enhances cellular metabolism and revitalizes the skin, providing essential minerals for optimal skin function and health.'
      },
      {
        name: 'Salmon Oil',
        description: 'Rich in unsaturated fatty acids, it offers anti-inflammatory and wound-healing effects while providing deep nourishment to the skin.'
      },
      {
        name: 'Adenosine',
        description: 'Provides anti-aging benefits by reducing the appearance of wrinkles and fine lines, promoting smoother, more youthful-looking skin.'
      }
    ]),
    directions: 'This product is dermatologically tested and suitable for all skin types. For optimal bubbling, avoid rubbing the product during application. For best results, incorporate it into your daily skincare routine.'
  },
  '27': {
    productDetails: JSON.stringify({
      form: 'Skin barrier strengthening cream',
      size: '100g',
      target: 'Barrier protection and repair',
      technology: 'MultiEx BSASM® Plus with ceramide and amino acid complex',
      keyBenefits: 'Barrier protection, moisture retention, skin softening, water retention promotion',
      usage: 'Daily barrier protection and repair, morning and evening',
      skinType: 'All skin types, especially compromised and sensitive skin',
      application: 'Apply to clean skin, focus on dry or damaged areas',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'MultiEx BSASM® Plus',
        description: 'Advanced technology that helps strengthen and protect the skin barrier for optimal skin health.'
      },
      {
        title: 'Enriched Ceramide Complex',
        description: 'High concentration of ceramides that help restore and maintain skin barrier function.'
      },
      {
        title: 'Amino Acid Complex',
        description: 'Essential amino acids that help support skin barrier integrity and moisture retention.'
      },
      {
        title: 'Water Retention',
        description: 'Promotes optimal water retention for healthy, hydrated, and soft skin.'
      }
    ]),
    benefits: JSON.stringify([
      'Barrier Protection - Strengthens and protects the skin barrier from environmental damage',
      'Moisture Retention - Promotes optimal water retention for healthy, hydrated skin',
      'Skin Softening - Helps achieve soft, smooth, and supple skin texture',
      'Barrier Repair - Helps repair and restore compromised skin barrier function',
      'Long-lasting Hydration - Provides sustained moisture for all-day comfort',
      'Gentle Formula - Suitable for sensitive and compromised skin'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Ceramide Complex',
        description: 'Essential lipids that help strengthen and maintain skin barrier function and integrity.'
      },
      {
        name: 'MultiEx BSASM® Plus',
        description: 'Advanced technology that enhances skin barrier protection and moisture retention.'
      },
      {
        name: 'Amino Acid Complex',
        description: 'Essential amino acids that support skin barrier integrity and natural repair processes.'
      },
      {
        name: 'Shea Butter',
        description: 'Rich emollient that provides deep hydration and helps protect skin from environmental stress.'
      },
      {
        name: 'Macadamia Oil',
        description: 'Nourishing oil that helps restore skin barrier function and provides antioxidant protection.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse skin thoroughly and apply toner if desired' },
      { step: 'Application', instruction: 'Apply a generous amount to face and neck' },
      { step: 'Massage', instruction: 'Gently massage in upward motions until fully absorbed' },
      { step: 'Frequency', instruction: 'Use morning and evening for optimal results' },
      { step: 'Target Areas', instruction: 'Focus on areas with compromised skin barrier' },
      { step: 'Results', instruction: 'Visible improvement in skin barrier function within 2-4 weeks' }
    ]),
    directions: 'This product is dermatologically tested and clinically proven to improve skin restorative force. For best results, use consistently as part of your daily skincare routine. Store in a cool, dry place away from direct sunlight.'
  },
  '28': {
    productDetails: JSON.stringify({
      type: 'Intensive hydro soothing cream',
      sizeOptions: '50g (Homecare) / 250g (Professional)',
      keyBenefits: 'Hydration, soothing, skin repair, barrier protection',
      skinType: 'All skin types, especially sensitive and irritated skin',
      usage: 'Professional and home care',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Intensive Hydration',
        description: 'Advanced hydrating formula that provides long-lasting moisture and helps maintain optimal skin hydration levels.'
      },
      {
        title: 'Soothing Properties',
        description: 'Calms down skin irritation and provides relief for sensitive, stressed, or damaged skin.'
      },
      {
        title: 'Natural Ingredients',
        description: 'Formulated with premium natural ingredients including aloe vera and snail secretion filtrate for gentle, effective care.'
      },
      {
        title: 'Professional & Home Use',
        description: 'Available in both homecare (50g) and professional (250g) sizes for versatile application.'
      }
    ]),
    benefits: JSON.stringify([
      'Intensive Hydration - Provides long-lasting moisture for all skin types',
      'Skin Soothing - Calms irritation and reduces redness and inflammation',
      'Skin Repair - Promotes natural healing and skin regeneration',
      'Barrier Protection - Strengthens skin\'s natural protective barrier',
      'Gentle Care - Suitable for sensitive and irritated skin',
      'Versatile Use - Perfect for both professional treatments and daily home care'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Aloe Barbadensis Leaf Extract',
        description: 'Natural soothing and healing ingredient that calms irritated skin and provides gentle hydration.'
      },
      {
        name: 'Snail Secretion Filtrate',
        description: 'Premium ingredient rich in glycoproteins and growth factors that promote skin regeneration and healing.'
      },
      {
        name: 'Hyaluronic Acid',
        description: 'Powerful humectant that attracts and retains moisture, providing intense hydration and plumping effects.'
      },
      {
        name: 'Lactobacillus/Pumpkin Ferment Extract',
        description: 'Fermented ingredient that provides probiotics and nutrients for improved skin health and texture.'
      },
      {
        name: 'Beta-Glucan',
        description: 'Natural immune-boosting ingredient that enhances skin\'s defense mechanisms and promotes healing.'
      },
      {
        name: 'Phytolex SC',
        description: 'Advanced botanical complex that provides additional skin protection and soothing benefits.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse your skin thoroughly before application' },
      { step: 'Application', instruction: 'Apply a generous amount to the face and neck area' },
      { step: 'Massage', instruction: 'Gently massage in circular motions until fully absorbed' },
      { step: 'Frequency', instruction: 'Use morning and evening for optimal results' },
      { step: 'Professional Use', instruction: 'Can be used as a treatment mask for enhanced benefits' }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. Perfect for daily use and post-treatment care. For best results, use as part of your daily skincare routine and reapply as needed for additional hydration.'
  },
  '29': {
    productDetails: JSON.stringify({
      type: 'Advanced moisturizing cream',
      size: '50g (Homecare) / 250g (Professional)',
      keyBenefits: 'Deep hydration, 72-hour persistence, skin barrier protection',
      skinType: 'All skin types, especially dry and dehydrated skin',
      usage: 'Daily morning and evening application',
      technology: '4-step hydration system with multi-molecular hyaluronic acid',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: '4-Step Hydration System',
        description: 'Advanced multi-layered hydration that cools, attracts, replenishes, and locks in moisture for comprehensive skin hydration.'
      },
      {
        title: '72-Hour Hydration Persistence',
        description: 'Clinically proven to maintain skin hydration for up to 72 hours, providing long-lasting moisture benefits.'
      },
      {
        title: 'Hyaluronan 11 Multi-Complex',
        description: 'Advanced hyaluronic acid complex with multiple molecular weights for deep penetration and surface protection.'
      },
      {
        title: 'Mushroom Extract Complex',
        description: 'Powerful anti-inflammatory and antioxidant properties from various mushroom extracts for skin nourishment and protection.'
      }
    ]),
    benefits: JSON.stringify([
      'Deep Hydration - Multi-layered moisture delivery for comprehensive skin hydration',
      'Long-Lasting Results - 72-hour hydration persistence for sustained moisture',
      'Skin Barrier Protection - Strengthens moisture barrier to prevent water loss',
      'Cooling Sensation - Natural cooling agents provide instant skin refreshment',
      'Anti-Aging Benefits - Reduces fine lines and improves skin elasticity',
      'All Skin Types - Suitable for all skin types, including sensitive skin',
      'Professional Results - Salon-quality hydration at home'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Hyaluronan 11 Multi-Complex',
        description: 'Advanced hyaluronic acid complex with low, middle, and high molecular weights for comprehensive skin hydration and protection.'
      },
      {
        name: 'Mushroom Extracts',
        description: 'Various mushroom extracts provide powerful anti-inflammatory and antioxidant properties for skin nourishment and protection.'
      },
      {
        name: 'Moisture Magnet Technology',
        description: 'Special ingredients that attract and retain moisture, creating a moisture reservoir in the skin for sustained hydration.'
      },
      {
        name: 'Natural Cooling Agents',
        description: 'Natural-origin cooling agents provide instant skin refreshment and help lower skin temperature for a refreshing sensation.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Cleanse', instruction: 'Start with clean, dry skin' },
      { step: 'Apply', instruction: 'Take a small amount and gently massage onto face and neck' },
      { step: 'Massage', instruction: 'Use upward circular motions until fully absorbed' },
      { step: 'Frequency', instruction: 'Use morning and evening for best results' },
      { step: 'Follow-up', instruction: 'Apply sunscreen during the day' }
    ]),
    directions: 'This product is dermatologically tested and clinically proven for 72-hour hydration persistence. For best results, use consistently as part of your daily skincare routine. Store in a cool, dry place away from direct sunlight.'
  },
  '30': {
    productDetails: JSON.stringify({
      form: 'Specialized problem control cream',
      size: '50g (Homecare) 250g (Professional)',
      target: 'Problematic and acne-prone skin',
      technology: 'Advanced anti-microbial and anti-inflammatory formula',
      keyBenefits: 'Sebum control, anti-microbial, anti-inflammatory, soothing relief',
      usage: 'Morning and evening skincare routine',
      skinType: 'All skin types, especially problematic and acne-prone skin',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Anti-microbial - Helps combat bacteria and prevent breakouts',
      'Anti-inflammatory - Reduces redness and calms irritated skin',
      'Sebum Control - Regulates oil production for balanced skin',
      'Soothing Relief - Provides comfort for problematic skin',
      'Skin Barrier Support - Strengthens the skin\'s natural defenses',
      'Moisture Retention - Keeps skin hydrated without clogging pores'
    ]),
    howToUse: 'Apply a small amount to cleansed skin twice daily. Gently massage into the skin until fully absorbed. Use as part of your morning and evening skincare routine for best results.',
    ingredients: JSON.stringify([
      {
        name: 'Zinc PCA',
        description: 'A powerful sebum-regulating ingredient that helps control oil production and has antimicrobial properties to prevent breakouts and maintain clear skin.'
      },
      {
        name: 'Panthenol (Vitamin B5)',
        description: 'Provides deep hydration and has anti-inflammatory properties that help soothe irritated skin while promoting healing and skin barrier function.'
      },
      {
        name: 'Beta-Glucan',
        description: 'A natural immune-boosting ingredient that helps strengthen the skin\'s defense mechanisms, reduce inflammation, and promote healing.'
      },
      {
        name: 'Allantoin',
        description: 'A gentle, soothing ingredient that helps calm irritated skin, reduce redness, and promote skin healing while being suitable for sensitive skin.'
      },
      {
        name: 'Lactobacillus/Pumpkin Ferment Extract',
        description: 'A probiotic ingredient that helps balance the skin\'s microbiome, providing natural antimicrobial benefits and supporting healthy skin flora.'
      },
      {
        name: 'Trehalose',
        description: 'A natural sugar that acts as a humectant, helping to retain moisture and protect the skin from environmental stressors while maintaining skin hydration.'
      }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use as part of your daily skincare routine.'
  },
  '31': {
    productDetails: JSON.stringify({
      form: 'Multi-vitamin radiance cream',
      size: '50g (Homecare) / 230g (Professional)',
      target: 'Anti-aging and skin brightening',
      technology: 'VITA 12 Complex with Astaxanthin',
      keyBenefits: 'Brightening, deep moisturizing, antioxidant protection',
      usage: 'Morning and evening application',
      skinType: 'All skin types, especially aging and dull skin',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Brightening - Helps lighten pigmentation spots and improve overall skin tone',
      'Deep Moisturizing - Provides intense hydration, leaving the skin soft and supple',
      'Antioxidant Protection - Protects against free radicals, reducing signs of aging',
      'Skin Nourishment - Supplies essential nutrients to enhance skin health and appearance',
      'Collagen Activation - Stimulates collagen production for firmer, more youthful skin',
      'UV Protection - Shields skin from harmful UV radiation and environmental stressors'
    ]),
    howToUse: 'Apply the cream to the face and gently massage in both morning and evening for optimal results.',
    ingredients: JSON.stringify([
      {name: 'Astaxanthin', description: 'A powerful antioxidant that is 6,000 times stronger than Vitamin C. It helps reduce skin pigmentation caused by free radicals and sun exposure.'},
      {name: 'VITA 12 Complex', description: 'Provides nutrients to the skin, helps increase collagen production, and prevents skin water loss.'},
      {name: 'Gluconolactone', description: 'A Poly-Hydroxy Acid (PHA) that improves skin tone by exfoliating dead skin cells and hydrates the skin.'},
      {name: 'Glycyrrhiza Uralensis (Licorice) Root Extract', description: 'Inhibits pigmentation by preventing tyrosinase activation, brightens the skin.'},
      {name: 'Macadamia Ternifolia Seed Oil', description: 'Contains linoleic acid, which prevents trans-epidermal water loss and creates a natural protective barrier.'},
      {name: 'Ascorbic Acid (Vitamin C)', description: 'A natural antioxidant that protects the skin against UV-induced damage caused by free radicals.'},
      {name: 'Ceramide NP', description: 'Reinforces the skin\'s natural protective lipid barrier and improves long-term moisturization.'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use as part of your daily skincare routine.'
  },
  '32': {
    productDetails: JSON.stringify({
      form: 'Multi-functional anti-wrinkle cream',
      size: '50g (Homecare) / 250g (Professional)',
      target: 'Anti-aging and wrinkle reduction',
      technology: 'Advanced anti-aging formula',
      keyBenefits: 'Wrinkle reduction, firming, collagen synthesis, antioxidant protection',
      usage: 'Morning and/or evening application',
      skinType: 'All skin types, especially mature skin',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Wrinkle Reduction - Smooths fine lines and wrinkles, improving skin texture',
      'Firming - Enhances skin firmness and elasticity for a more youthful appearance',
      'Collagen Synthesis - Promotes the production of collagen for skin rejuvenation',
      'Antioxidant Protection - Shields the skin from oxidative stress and environmental damage',
      'Brightening - Evens out skin tone and adds natural radiance',
      'Deep Hydration - Provides intense moisture for plump, healthy-looking skin'
    ]),
    howToUse: 'Apply a thin layer of the cream to the face, neck, and décolleté with gentle patting motions. Use in the morning and/or evening for optimal results.',
    ingredients: JSON.stringify([
      {name: 'Bakuchiol', description: 'A natural alternative to retinol, known for its powerful anti-aging properties.'},
      {name: 'Collagen & Elastin', description: 'Essential proteins that support skin structure and elasticity.'},
      {name: 'Adenosine', description: 'A powerful anti-aging ingredient that aids in reducing wrinkles.'},
      {name: 'Propolis Extract', description: 'Offers exceptional anti-inflammatory and antioxidant benefits.'},
      {name: 'Mango Seed Butter', description: 'Provides deep hydration and nourishment.'},
      {name: 'Niacinamide', description: 'Brightens the skin and improves tone.'},
      {name: 'Ceramide NP, Phytosphingosine, Cholesterol', description: 'These essential lipids strengthen the skin barrier.'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use as part of your daily skincare routine.'
  },
  '33': {
    productDetails: JSON.stringify({
      form: 'Thermo-sensitive hydrogel patches',
      size: '101g (60 patches)',
      skinType: 'All skin types, especially mature and aging skin',
      technology: 'Patented thermo-sensitive hydrogel technology',
      keyBenefits: 'Puffiness reduction, dark circle lightening, fine line smoothing',
      usage: '20-40 minutes per application',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Reduces Puffiness and Dark Circles - Effectively combats under-eye bags and dark circles for a refreshed appearance',
      'Smooths Fine Lines and Wrinkles - Peptide complex works to diminish the appearance of fine lines, promoting smoother skin',
      'Hydrates and Soothes - Deep hydration and soothing effect, reducing signs of fatigue and stress',
      'Improves Skin Elasticity - Advanced peptide technology enhances skin firmness and elasticity',
      'Anti-Aging Properties - Targets multiple signs of aging around the delicate eye area',
      'Professional Results - Delivers clinical-grade results for comprehensive eye care'
    ]),
    howToUse: 'Cleanse the face thoroughly. Apply the gel patches under the eyes, ensuring good contact with the skin. Leave on for 20-40 minutes, then remove and discard the patches. For optimal results, use regularly as part of your skincare routine.',
    ingredients: JSON.stringify([
      {
        name: 'Peptide Complex',
        description: 'Includes Copper Tripeptide-1, Acetyl Hexapeptide-8, Palmitoyl Hexapeptide-12, Palmitoyl Oligopeptide, and Palmitoyl Tetrapeptide-7 to reduce fine lines and improve skin elasticity.'
      },
      {
        name: 'Hyaluronic Acid',
        description: 'Increases skin moisture levels, plumping the eye area and providing deep hydration for a refreshed appearance.'
      },
      {
        name: 'Arbutin',
        description: 'Natural skin brightening agent that helps reduce the appearance of dark circles and evens skin tone.'
      },
      {
        name: 'Retinyl Palmitate',
        description: 'Vitamin A derivative that supports skin renewal and combats signs of aging around the eye area.'
      },
      {
        name: 'Botanical Extracts',
        description: 'Chamomile, Lavender, Peppermint, and Rosemary extracts that soothe and revitalize the delicate eye area.'
      }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use in conjunction with other Genosys EyeCell products as part of your daily eye care regimen.'
  },
  '34': {
    productDetails: JSON.stringify({
      form: 'Overnight cream mask',
      size: '100g',
      target: 'Fatigued and stressed skin recovery',
      technology: 'Dual formula with oxygen capsules and pink ceramide complex',
      keyBenefits: 'Skin revitalization, oxygen therapy, overnight recovery, erythema improvement',
      usage: 'Overnight treatment 2-3 times per week',
      skinType: 'All skin types, especially fatigued skin',
      application: 'Apply generously, massage until capsules burst, leave overnight',
      results: 'Clinically proven to improve erythema and transepidermal water loss',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Dual Formula Technology',
        description: 'Oxygen capsules burst smoothly when touching skin and melt with pink ceramide cream for maximum efficacy.'
      },
      {
        title: 'Oxygen Therapy',
        description: 'Italian oxygenated water capsules provide instant oxygen therapy for skin revitalization.'
      },
      {
        title: 'Pink Ceramide Complex',
        description: 'Unique pink ceramide complex provides intensive skin protection and recovery benefits.'
      },
      {
        title: 'Growth Factor Complex',
        description: 'Advanced growth factor complex (EGF, aFGF, bFGF, PIGF, IGF) promotes skin renewal and healing.'
      }
    ]),
    benefits: JSON.stringify([
      'Skin Revitalization - Provides intensive care to fatigued and stressed skin',
      'Oxygen Therapy - Delivers instant oxygen therapy for skin renewal and energy',
      'Overnight Recovery - Works while you sleep to repair and rejuvenate skin',
      'Erythema Improvement - Helps reduce redness and skin irritation',
      'Moisture Retention - Improves transepidermal water loss for better hydration',
      'Growth Factor Benefits - Stimulates natural skin renewal and healing processes'
    ]),
    ingredients: JSON.stringify([
      {
        name: 'Pink Ceramide Complex',
        description: 'Unique ceramide complex that provides intensive skin protection and recovery benefits.'
      },
      {
        name: 'Oxygen Capsules',
        description: 'Italian oxygenated water capsules that burst on contact for instant oxygen therapy.'
      },
      {
        name: 'Growth Factor Complex',
        description: 'EGF, aFGF, bFGF, PIGF, IGF work together to promote skin renewal and healing.'
      },
      {
        name: 'Pumpkin Extract',
        description: 'Cucurbita Pepo fruit extract provides antioxidant protection and skin nourishment.'
      },
      {
        name: 'Phytosphingosine',
        description: 'Natural lipid that helps strengthen skin barrier and improve moisture retention.'
      }
    ]),
    howToUse: JSON.stringify([
      { step: 'Preparation', instruction: 'Cleanse your face thoroughly before application' },
      { step: 'Application', instruction: 'Apply a generous amount to face and neck' },
      { step: 'Massage', instruction: 'Gently massage until oxygen capsules burst and blend with cream' },
      { step: 'Overnight', instruction: 'Leave on overnight for maximum absorption' },
      { step: 'Frequency', instruction: 'Use 2-3 times per week for best results' },
      { step: 'Morning Care', instruction: 'Rinse off in the morning and continue with regular skincare' }
    ]),
    directions: 'This product is dermatologically tested and clinically proven to improve erythema and TEWL. For best results, use 2-3 times per week as an overnight treatment. Store in a cool, dry place.'
  },
  '35': {
    productDetails: JSON.stringify({
      form: 'Professional modeling mask',
      size: '1kg',
      target: 'Post-treatment skin soothing and hydration',
      technology: 'Advanced cooling and hydrating formula',
      keyBenefits: 'Cooling effect, hydration, pore minimizing, skin soothing',
      usage: 'Professional and home care',
      skinType: 'All skin types',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Immediate Cooling Effect - Provides instant cooling and refreshing sensation',
      'Post-Treatment Soothing - Calms and soothes skin after professional treatments',
      'Enhanced Hydration - Delivers deep moisture and improves skin hydration',
      'Pore Minimizing - Helps reduce pore size for smoother skin texture',
      'Skin Barrier Support - Strengthens and enhances skin barrier function',
      'Collagen Synthesis - Stimulates collagen production for firmer skin'
    ]),
    howToUse: JSON.stringify([
      { step: 'Cleanse', instruction: 'Begin with thoroughly cleansed facial skin' },
      { step: 'Application', instruction: 'Apply the modeling mask evenly to the face' },
      { step: 'Processing Time', instruction: 'Leave the mask on for 15-20 minutes' },
      { step: 'Removal', instruction: 'Gently rub the residue into the skin for additional benefits' },
      { step: 'Rinse', instruction: 'Rinse off any remaining residue with lukewarm water' },
      { step: 'Follow-up', instruction: 'Continue with your regular skincare routine' }
    ]),
    ingredients: JSON.stringify([
      {name: 'Centella Asiatica Extract', description: 'Powerful botanical extract that increases collagen synthesis, enhances skin barrier function, and provides anti-inflammatory benefits.'},
      {name: 'Hyaluronic Acid', description: 'Deep hydrating ingredient that attracts and retains moisture, providing intense hydration and plumping effects.'},
      {name: 'Ceramide', description: 'Essential lipid that strengthens the skin barrier, locks in moisture, and protects against environmental damage.'},
      {name: 'Allantoin', description: 'Soothing and healing ingredient that calms irritated skin, promotes cell regeneration, and provides gentle exfoliation.'},
      {name: 'Mentha Piperita (Peppermint) Extract', description: 'Natural cooling agent that provides refreshing sensation, soothes inflammation, and helps reduce skin redness.'},
      {name: 'Chamaecyparis Obtusa Water', description: 'Purified water extract that provides gentle hydration and soothing properties, helping to calm and refresh the skin naturally.'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. Particularly beneficial after professional skin treatments. For best results, use as part of your regular skincare routine.'
  },
  '36': {
    productDetails: JSON.stringify({
      form: 'Eucalace® sheet mask',
      size: '1 sheet (23g)',
      target: 'Stressed and irritated skin relief',
      technology: 'Eucalace® sheet mask technology with sea algae complex',
      keyBenefits: 'Intensive relief, deep hydration, soothing effect, skin healing',
      usage: '2-3 times per week for optimal results',
      skinType: 'All skin types, especially stressed and irritated skin',
      application: 'Apply to clean skin, leave for 15-20 minutes',
      formulation: 'Sea algae complex with centella asiatica extract',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {
        title: 'Eucalace® Technology',
        description: 'Advanced sheet mask technology that provides optimal skin contact and ingredient delivery.'
      },
      {
        title: 'Sea Algae Complex',
        description: 'Powerful sea algae extracts provide intensive relief and healing benefits for stressed skin.'
      },
      {
        title: 'Ocean Healing Power',
        description: 'Inspired by the healing power of the ocean for natural skin recovery and rejuvenation.'
      },
      {
        title: 'Centella Asiatica',
        description: 'Traditional healing herb that provides soothing and anti-inflammatory benefits.'
      }
    ]),
    benefits: JSON.stringify([
      'Intensive Relief - Provides immediate relief to stressed and irritated skin',
      'Deep Hydration - Sea algae complex delivers intense moisture for skin hydration',
      'Soothing Effect - Centella asiatica provides calming and anti-inflammatory benefits',
      'Skin Healing - Promotes natural skin healing and recovery processes',
      'Ocean Therapy - Harnesses the healing power of marine ingredients',
      'Convenient Use - Easy-to-use sheet mask format for quick application'
    ]),
    ingredients: JSON.stringify([
      {name: 'Jania Rubens Extract', description: 'Red algae extract that provides antioxidant protection and skin nourishment.'},
      {name: 'Undaria Pinnatifida Extract', description: 'Wakame seaweed extract that provides hydration and skin conditioning benefits.'},
      {name: 'Bambusa Vulgaris Extract', description: 'Bamboo extract that provides natural silica and skin strengthening benefits.'},
      {name: 'Centella Asiatica Extract', description: 'Traditional healing herb that provides soothing and anti-inflammatory benefits.'},
      {name: 'Witch Hazel Extract', description: 'Natural astringent that helps tone and soothe irritated skin.'}
    ]),
    howToUse: JSON.stringify([
      { step: 'Cleanse', instruction: 'Thoroughly cleanse your face before application' },
      { step: 'Application', instruction: 'Apply the sheet mask evenly to your face' },
      { step: 'Relax', instruction: 'Leave on for 15-20 minutes while relaxing' },
      { step: 'Remove', instruction: 'Remove the mask and discard' },
      { step: 'Pat', instruction: 'Gently pat remaining essence into skin for maximum absorption' },
      { step: 'Frequency', instruction: 'Use 2-3 times per week for optimal results' }
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, use regularly as part of your skincare routine. Store in a cool, dry place.'
  },
  '37': {
    productDetails: JSON.stringify({
      form: 'Professional thermo-sensitive hydrogel mask',
      size: '38g x 5ea',
      target: 'Post-treatment care and cooling therapy',
      technology: 'Patented thermo-sensitive hydrogel technology',
      keyBenefits: 'Instant cooling relief, deep hydration, enhanced penetration',
      usage: 'Professional treatments, post-procedure care',
      skinType: 'All skin types, especially post-treatment skin',
      application: 'Apply evenly to treatment area, avoid eye area',
      duration: '15-20 minutes for optimal results',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {title: 'Thermo-Sensitive Technology', description: 'Patented hydrogel that transforms from gel to fluid at body temperature for enhanced skin adhesion and ingredient penetration.'},
      {title: 'Instant Cooling Effect', description: 'Provides immediate cooling relief by displacing skin heat with moisture, perfect for post-treatment care.'},
      {title: 'Advanced Peptide Formula', description: 'Contains Acetyl Hexapeptide-8 and other peptides for enhanced skin regeneration and healing.'},
      {title: 'Post-Treatment Care', description: 'Specifically recommended after dermatological procedures like laser treatments and microneedling.'}
    ]),
    benefits: JSON.stringify([
      'Instant Cooling Relief - Provides immediate cooling sensation to soothe irritated skin',
      'Deep Hydration - Delivers intense moisture for optimal skin recovery',
      'Enhanced Penetration - Thermo-sensitive technology ensures maximum ingredient absorption',
      'Post-Treatment Healing - Accelerates recovery after dermatological procedures',
      'Skin Comfort - Reduces inflammation and irritation from treatments',
      'Professional Results - Clinical-grade formula for advanced skincare treatments'
    ]),
    ingredients: JSON.stringify([
      {name: 'Acetyl Hexapeptide-8', description: 'Advanced peptide that helps relax facial muscles and reduce expression lines for smoother skin.'},
      {name: 'Hyaluronic Acid', description: 'Powerful humectant that attracts and retains moisture for deep hydration and plumping effects.'},
      {name: 'Hydrolyzed Collagen', description: 'Bioactive collagen peptides that support skin structure and promote elasticity.'},
      {name: 'Chondrus Crispus Extract', description: 'Natural carrageenan extract that provides soothing and anti-inflammatory benefits.'},
      {name: 'Dipotassium Glycyrrhizate', description: 'Licorice root derivative that provides anti-inflammatory and soothing properties.'}
    ]),
    howToUse: JSON.stringify([
      {step: 'Cleanse', instruction: 'Thoroughly cleanse your face and pat dry'},
      {step: 'Application', instruction: 'Apply hydrogel mask evenly to face, avoiding eye area'},
      {step: 'Relax', instruction: 'Leave on for 15-20 minutes while relaxing'},
      {step: 'Remove', instruction: 'Gently peel off the mask from edges'},
      {step: 'Pat', instruction: 'Gently pat remaining essence into skin'},
      {step: 'Frequency', instruction: 'Use after professional treatments for optimal recovery'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. Particularly recommended after professional treatments. Store in a cool, dry place.'
  },
  '38': {
    productDetails: JSON.stringify({
      form: 'Professional carboxy therapy kit (Gel + Sheet Mask)',
      size: '1 kit',
      skinType: 'All skin types, especially dull and stressed skin',
      technology: 'CO₂ therapy with Bohr Effect mechanism',
      keyBenefits: 'Oxygen therapy, skin firming, brightening, anti-blemish',
      usage: '1-2 times per week',
      kitContents: 'Gel 20g x 5ea, Mask 12g x 5ea, 1 Peptide Mask',
      specialFeature: 'Catalytic mask for enhanced treatment absorption',
      origin: 'South Korea'
    }),
    benefits: JSON.stringify([
      'Oxygen Therapy - Accelerates oxygen delivery to skin tissues through CO₂ therapy',
      'Skin Firming - Provides firming effects through improved cellular metabolism',
      'Brightening - Helps correct skin tone and reduce hyperpigmentation',
      'Anti-Blemish - Reduces blemishes and improves overall skin clarity',
      'Catalytic Effect - Prepares skin for optimal absorption of active ingredients',
      'Professional Results - Delivers salon-quality carboxy therapy at home',
      'Microneedling Enhancement - Acts as a catalytic mask for better treatment results'
    ]),
    howToUse: 'Apply the CO₂ gel evenly to clean skin, then place the sheet mask over the treated area. Leave on for 15-20 minutes to allow the CO₂ therapy to work. The fine particles of CO₂ generated by the contact between gel and mask will accelerate oxygen delivery to skin tissues. Remove mask and gently massage any remaining product into the skin.',
    ingredients: JSON.stringify([
      {name: 'Lactic Acid', description: 'Gentle exfoliation and skin renewal'},
      {name: 'Portulaca Oleracea Extract', description: 'Antioxidant and anti-inflammatory properties'},
      {name: 'Rosemary Leaf Extract', description: 'Antimicrobial and circulation-boosting effects'},
      {name: 'Chamomile Flower Extract', description: 'Soothing and anti-inflammatory benefits'},
      {name: 'Licorice Root Extract', description: 'Skin brightening and anti-inflammatory properties'},
      {name: 'Scutellaria Baicalensis Root Extract', description: 'Antioxidant and anti-aging benefits'},
      {name: 'Centella Asiatica Extract', description: 'Wound healing and anti-inflammatory effects'},
      {name: 'Green Tea Leaf Extract', description: 'Antioxidant protection and skin renewal'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. The CO₂ therapy mechanism accelerates oxygen delivery to skin tissues, providing professional-grade results. For best results, use as part of your weekly skincare routine.'
  },
  '39': {
    productDetails: JSON.stringify({
      form: 'Daily sunscreen with sunburn care',
      size: '50g',
      protection: 'SPF 50+ PA++++',
      target: 'UV protection and sunburn care',
      technology: 'MicroHA™ and ProbioMETA™ technology',
      keyBenefits: 'UV protection, sunburn care, skin recovery, reef-safe protection',
      usage: 'Daily sun protection, reapply every 2 hours',
      skinType: 'All skin types',
      application: 'Apply generously to all exposed skin areas',
      formulation: 'Non-greasy, silky texture with tropical antioxidant complex',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {title: 'Ultra-High Protection', description: 'SPF 50+ PA++++ provides maximum protection against both UVA and UVB rays.'},
      {title: 'Non-Greasy Formula', description: 'Silky, lightweight texture that absorbs quickly without leaving a greasy residue.'},
      {title: 'Sunburn Care Complex', description: 'Specialized complex that helps promote skin recovery from sun damage and exposure.'},
      {title: 'Reef-Safe Formula', description: 'Environmentally friendly formula that is safe for coral reefs and marine life.'}
    ]),
    benefits: JSON.stringify([
      'Maximum UV Protection - SPF 50+ PA++++ provides superior sun protection',
      'Sunburn Recovery - Helps promote skin recovery from sun damage and exposure',
      'Non-Greasy Feel - Silky, lightweight texture for comfortable daily wear',
      'Skin Recovery - MicroHA™ and ProbioMETA™ technology promote skin healing',
      'Antioxidant Protection - Tropical antioxidant complex fights free radical damage',
      'Reef-Safe - Environmentally conscious formula safe for marine ecosystems'
    ]),
    ingredients: JSON.stringify([
      {name: 'Sunburn Care Complex', description: 'Specialized complex that helps promote skin recovery from sun damage and exposure.'},
      {name: 'MicroHA™', description: 'Ultra-low molecular weight hyaluronic acid for deep hydration and skin recovery.'},
      {name: 'ProbioMETA™', description: 'Lactobacillus ferment that helps strengthen skin barrier and promote healing.'},
      {name: 'Tropical Antioxidant Complex', description: 'Powerful antioxidant blend that helps protect skin from environmental damage.'}
    ]),
    howToUse: JSON.stringify([
      {step: 'Timing', instruction: 'Apply 15-30 minutes before sun exposure'},
      {step: 'Application', instruction: 'Apply generously and evenly to all exposed skin areas'},
      {step: 'Massage', instruction: 'Gently massage until fully absorbed'},
      {step: 'Reapply', instruction: 'Reapply every 2 hours or after swimming/sweating'},
      {step: 'Daily Use', instruction: 'Use daily as the last step in your morning skincare routine'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. Reef-safe formula. For maximum protection, apply generously and reapply frequently. Store in a cool, dry place.'
  },
  '40': {
    productDetails: JSON.stringify({
      type: 'Daily sunscreen with SPF 40 PA++',
      size: '40g',
      protection: 'UVA/UVB protection, SPF 40, PA++',
      skinType: 'All skin types, including sensitive skin',
      usage: 'Daily sun protection, outdoor activities',
      origin: 'South Korea'
    }),
    keyFeatures: JSON.stringify([
      {title: 'High SPF Protection', description: 'SPF 40 PA++ provides strong protection against both UVA and UVB rays for comprehensive sun defense.'},
      {title: 'Non-Greasy Formula', description: 'Lightweight, non-greasy texture that absorbs quickly without leaving a white cast or sticky residue.'},
      {title: 'Skin Glowing Effect', description: 'Advanced formula that enhances natural skin radiance while providing sun protection.'},
      {title: 'Daily Use Formula', description: 'Gentle enough for daily use while providing robust protection for all skin types.'}
    ]),
    benefits: JSON.stringify([
      'UV Protection - Comprehensive protection against UVA and UVB rays',
      'Skin Soothing - Calms and soothes skin irritated by sun exposure',
      'Natural Glow - Enhances skin\'s natural radiance and luminosity',
      'Moisture Lock - Helps maintain skin hydration while protecting from sun damage',
      'Anti-Aging - Prevents premature aging caused by UV exposure',
      'Gentle Care - Suitable for sensitive skin and daily use'
    ]),
    ingredients: JSON.stringify([
      {name: 'Palmitoyl Pentapeptide-4', description: 'Advanced peptide that helps repair and protect skin from environmental damage while promoting healing.'},
      {name: 'Sodium Hyaluronate', description: 'Deep hydrating ingredient that attracts and retains moisture for plump, hydrated skin.'},
      {name: 'Botanical Callus Culture Extracts', description: 'Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and skin nourishment.'},
      {name: 'Centella Asiatica Extract', description: 'Soothing and healing ingredient that calms irritated skin and promotes skin repair.'},
      {name: 'Scutellaria Baicalensis Root Extract', description: 'Powerful antioxidant that protects skin from free radical damage and environmental stress.'},
      {name: 'Lactobacillus/Soymilk Ferment Filtrate', description: 'Probiotic ingredient that helps strengthen skin barrier and maintain healthy skin microbiome.'}
    ]),
    howToUse: JSON.stringify([
      {step: 'Timing', instruction: 'Apply as the last step in your morning skincare routine'},
      {step: 'Application', instruction: 'Apply evenly to face, neck, and exposed areas'},
      {step: 'Massage', instruction: 'Gently massage until fully absorbed'},
      {step: 'Reapply', instruction: 'Reapply every 2-3 hours when exposed to sun'},
      {step: 'Daily Protection', instruction: 'Use daily for consistent sun protection'}
    ]),
    directions: 'This product is dermatologically tested and safe for all skin types. For best results, apply before sun exposure and reapply regularly. Store in a cool, dry place.'
  },
  '41': {
    productDetails: JSON.stringify({form: 'Blemish balm cushion', size: '15g', spfRating: 'SPF 50 / PA++++', availableColors: 'Beige, Ivory, Camel', origin: 'South Korea'}),
    benefits: JSON.stringify(['Post-treatment coverage', 'Natural healthy glow', 'Sun protection SPF 50', 'Peptide complex 40%']),
    howToUse: 'Press the puff lightly onto cushion and pat evenly onto skin.',
    ingredients: JSON.stringify([{name: 'Repairing Pep9 Complex', description: 'Nine peptides for collagen induction and skin regeneration.'}, {name: 'Volufiline™', description: 'Volume-enhancing with anti-inflammatory features.'}, {name: 'Glutathione', description: 'Powerful antioxidant for skin brightening.'}]),
    directions: 'Dermatologically tested for all skin types. Use as daily makeup base.'
  },
  '42': {
    productDetails: JSON.stringify({type: 'Natural coverage cream', size: '50g', spfRating: 'SPF 30 PA++', coverage: 'Natural to medium', origin: 'South Korea'}),
    keyFeatures: JSON.stringify([{title: 'Natural Coverage', description: 'Natural-looking coverage.'}, {title: 'SPF 30 PA++', description: 'Sun protection.'}, {title: 'Blemish Coverage', description: 'Covers redness and blemishes.'}, {title: 'Post-Treatment', description: 'Safe after treatments.'}]),
    benefits: JSON.stringify(['Natural Coverage', 'Sun Protection SPF 30', 'Blemish Concealing', 'Post-Treatment Care', 'Environmental Protection', 'Skin Tone Enhancement']),
    ingredients: JSON.stringify([{name: 'Adenosine', description: 'Anti-aging.'}, {name: 'Allantoin', description: 'Soothing.'}, {name: 'Origanum Vulgare', description: 'Antioxidant.'}, {name: 'Phytolex SC', description: 'Botanical complex.'}]),
    howToUse: JSON.stringify([{step: 'Prepare', instruction: 'Cleanse and moisturize'}, {step: 'Apply', instruction: 'Apply to areas needing coverage'}, {step: 'Blend', instruction: 'Blend naturally'}, {step: 'Build', instruction: 'Layer if needed'}, {step: 'Set', instruction: 'Set with powder'}]),
    directions: 'Dermatologically tested. Apply after skincare routine.'
  }
};

async function migrateProductContent() {
  console.log('🚀 Starting product content migration...\n');

  try {
    const products = await prisma.product.findMany();
    console.log(`📦 Found ${products.length} products in database\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      const content = productContents[product.id];
      
      if (content) {
        console.log(`✏️  Updating product ${product.id}: ${product.name}`);
        
        await prisma.product.update({
          where: { id: product.id },
          data: {
            productDetails: content.productDetails || null,
            keyFeatures: content.keyFeatures || null,
            benefits: content.benefits || null,
            ingredients: content.ingredients || null,
            howToUse: content.howToUse || null,
            directions: content.directions || null
          }
        });
        
        updatedCount++;
        console.log(`   ✅ Updated successfully`);
      } else {
        console.log(`⏭️  Skipping product ${product.id}: ${product.name} (no content found)`);
        skippedCount++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} products`);
    console.log(`   ⏭️  Skipped: ${skippedCount} products`);
    console.log(`\n✨ Migration completed successfully!`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateProductContent()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
