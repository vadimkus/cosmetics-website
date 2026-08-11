export interface SeoLandingPage {
  slug: string
  title: string
  description: string
  h1: string
  eyebrow: string
  intro: string
  /** Short, practical answers shown near the top for readers and AI search. */
  takeaways?: string[]
  /** Relevant catalog products; images must be local, stable public paths. */
  featuredProducts?: Array<{
    name: string
    href: string
    image: string
    imageAlt: string
    description: string
  }>
  sections: Array<{
    heading: string
    body: string
  }>
  links: Array<{
    label: string
    href: string
    description: string
  }>
  faq: Array<{
    question: string
    answer: string
  }>
  /** Primary evidence sources for health/safety claims. */
  sources?: Array<{
    label: string
    href: string
  }>
  keywords: string[]
}

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: 'korean-skincare-dubai',
    title: 'Best Korean Skincare in Dubai | How to Choose for UAE Skin',
    description: 'A practical guide to choosing authentic Korean skincare in Dubai for UV exposure, air-conditioning, humidity, dehydration, pigmentation, and sensitive skin.',
    h1: 'How to Choose Korean Skincare in Dubai',
    eyebrow: 'Professional Korean Dermacosmetics',
    intro: 'The best Korean skincare routine for Dubai is not the longest one. It is a consistent routine built around gentle cleansing, barrier support, targeted treatment, and daily sun protection—selected for your skin rather than copied from a trend.',
    takeaways: [
      'Start with three essentials: a gentle cleanser, a moisturizer matched to your barrier needs, and daily broad-spectrum sunscreen.',
      'Dubai heat, outdoor UV, indoor air-conditioning, travel, and frequent cleansing can create a mix of oiliness and dehydration.',
      'Introduce one treatment product at a time so irritation or breakouts can be traced to the correct step.',
      'Buy through an accountable UAE supplier so product identity, storage, local support, and expiry information can be checked.',
    ],
    featuredProducts: [
      { name: 'Cerabarrier Biome Gel Cleanser', href: '/products/66', image: '/images/cera/main2.jpeg', imageAlt: 'GENOSYS Cerabarrier Biome Gel Cleanser', description: 'A low-foam cleanser for a barrier-conscious daily routine.' },
      { name: 'Multi Vita Radiance Serum', href: '/products/21', image: '/images/radiance_serum/main.jpeg', imageAlt: 'GENOSYS Multi Vita Radiance Serum', description: 'A targeted brightening step for uneven-looking tone and radiance.' },
      { name: 'Skin Barrier Protecting Cream', href: '/products/27', image: '/images/skin_barr/main.jpeg', imageAlt: 'GENOSYS Skin Barrier Protecting Cream', description: 'Ceramide- and amino-acid-focused moisture support for dry or stressed skin.' },
      { name: 'Ultra Shield Sun Cream SPF 50+', href: '/products/39', image: '/images/ultra/main.jpeg', imageAlt: 'GENOSYS Ultra Shield Sun Cream SPF 50+', description: 'High daily UV protection in a non-greasy cream format.' },
    ],
    sections: [
      {
        heading: 'Read Your Skin, Not the Weather Alone',
        body: 'Hot weather does not automatically mean oily skin, and air-conditioning does not automatically mean dry skin. Tightness after cleansing, stinging, flaking, persistent redness, excess shine, and clogged pores point to different needs. Choose texture and frequency from how your skin behaves, then adjust gradually as seasons, travel, or treatments change.',
      },
      {
        heading: 'Build a Simple Morning Routine',
        body: 'A practical morning sequence is gentle cleansing when needed, one targeted serum, moisturizer if your skin needs it, and sunscreen as the final skincare step. Avoid layering multiple strong actives simply because they are popular. Consistent sun protection usually matters more in the UAE than adding another serum.',
      },
      {
        heading: 'Build a Recovery-Focused Evening Routine',
        body: 'At night, remove sunscreen and makeup without harsh scrubbing, cleanse gently, apply one treatment step, and finish with appropriate moisture support. If your barrier feels irritated, pause exfoliating acids and retinoids and simplify the routine. Persistent symptoms, eczema, acne, or pigment disorders deserve professional assessment.',
      },
      {
        heading: 'Check Authenticity and Suitability',
        body: 'Professional dermacosmetics should have clear product identity, ingredient and usage information, local support, and traceable UAE supply. GENOSYS Middle East FZ-LLC is the official UAE distributor of GENOSYS products from DTS MG Co., Ltd. Product suitability still depends on individual skin, allergies, procedures, and the instructions on each label.',
      },
    ],
    links: [
      { label: 'Shop all GENOSYS products', href: '/products', description: 'Browse serums, creams, masks, SPF, scalp care, and professional devices.' },
      { label: 'Hydration routine', href: '/products/concern/hydration', description: 'Moisture support for dry air-conditioned environments.' },
      { label: 'Sun protection', href: '/products/concern/sun-protection', description: 'Daily SPF products for UAE UV exposure.' },
    ],
    faq: [
      { question: 'Where can I buy authentic Korean skincare in Dubai?', answer: 'GENOSYS products can be purchased from genosys.ae, operated by GENOSYS Middle East FZ-LLC, the official UAE distributor. For any brand, check seller identity, packaging, expiry information, and local accountability.' },
      { question: 'How many products should a beginner use?', answer: 'Begin with cleanser, moisturizer, and sunscreen. Add one targeted serum only after the basic routine feels comfortable and consistent.' },
      { question: 'Can oily skin in Dubai still be dehydrated?', answer: 'Yes. Oil production and water content are different. Skin can look shiny while also feeling tight or irritated, especially with strong cleansing, air-conditioning, or overuse of active ingredients.' },
      { question: 'Should I use the same routine after a professional treatment?', answer: 'Not automatically. Follow the treating professional’s aftercare plan because recently treated skin may react differently to acids, retinoids, fragrance, sunscreen, or makeup.' },
    ],
    sources: [
      { label: 'American Academy of Dermatology — How to select a sunscreen', href: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-select-sunscreen' },
      { label: 'American Academy of Dermatology — How to apply sunscreen', href: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen' },
    ],
    keywords: ['Korean skincare Dubai', 'Korean dermacosmetics UAE', 'GENOSYS Dubai'],
  },
  {
    slug: 'microneedling-devices-uae',
    title: 'Microneedling Devices UAE | GENOSYS Professional Skincare',
    description: 'Professional GENOSYS microneedling devices, ampoules, masks, and protocols for UAE clinics and trained skincare practitioners.',
    h1: 'Microneedling Devices in the UAE',
    eyebrow: 'Clinic-Focused Protocols',
    intro: 'GENOSYS supports UAE professionals with microneedling devices, treatment ampoules, masks, and training resources designed for structured clinic protocols.',
    sections: [
      {
        heading: 'Professional Treatment Ecosystem',
        body: 'Microneedling works best when the device, sterile treatment solution, post-treatment mask, and home-care routine are selected together. GENOSYS protocols connect those steps instead of treating the device as a standalone item.',
      },
      {
        heading: 'Training and Support',
        body: 'UAE practitioners can use GENOSYS training and documents to standardize treatment flow, client selection, post-care, and product pairing.',
      },
    ],
    links: [
      { label: 'Microneedling category', href: '/products/category/microneedling', description: 'Professional devices and related treatment items.' },
      { label: 'Training programs', href: '/training', description: 'Training and protocol support for practitioners.' },
      { label: 'Scars treatment routine', href: '/products/concern/scars-treatment', description: 'Microneedling and repair support for texture and scars.' },
    ],
    faq: [
      { question: 'Does GENOSYS supply microneedling devices in the UAE?', answer: 'Yes. GENOSYS Middle East supplies professional microneedling products and supporting protocols for UAE skincare professionals.' },
      { question: 'Should microneedling devices be used at home?', answer: 'Professional microneedling devices should be used by trained practitioners. Home-care products can support recovery and maintenance between clinic treatments.' },
    ],
    keywords: ['microneedling devices UAE', 'microneedling Dubai', 'professional skincare devices UAE'],
  },
  {
    slug: 'professional-skincare-training-dubai',
    title: 'Professional Skincare Training Dubai | GENOSYS UAE',
    description: 'GENOSYS professional skincare and microneedling training in Dubai for clinics, salons, aestheticians, and dermatology teams.',
    h1: 'Professional Skincare Training in Dubai',
    eyebrow: 'For Clinics and Practitioners',
    intro: 'GENOSYS training helps Dubai skincare professionals connect product knowledge, consultation, protocol selection, and aftercare into repeatable treatment systems.',
    sections: [
      {
        heading: 'Built Around Real Treatment Decisions',
        body: 'Training covers product selection, treatment sequencing, home-care pairing, client education, and when to refer or avoid aggressive procedures.',
      },
      {
        heading: 'Useful for Retail and Treatment Teams',
        body: 'The same product language can be used by clinic owners, aestheticians, front-desk advisors, and sales teams, improving consistency across consultation and follow-up.',
      },
    ],
    links: [
      { label: 'Training page', href: '/training', description: 'Current GENOSYS training and protocol resources.' },
      { label: 'Professional documents', href: '/documents', description: 'Downloadable materials and product documentation.' },
      { label: 'Partner program', href: '/partners', description: 'Opportunities for clinics and salons.' },
    ],
    faq: [
      { question: 'Who is GENOSYS training for?', answer: 'GENOSYS training is for UAE clinics, salons, aestheticians, dermatology teams, and beauty professionals working with professional skincare or microneedling protocols.' },
      { question: 'Can clinics request product training in Dubai?', answer: 'Yes. Clinics can contact GENOSYS Middle East through the website or WhatsApp to discuss training and product knowledge sessions.' },
    ],
    keywords: ['professional skincare training Dubai', 'microneedling training UAE', 'GENOSYS training'],
  },
  {
    slug: 'genosys-distributor-uae',
    title: 'GENOSYS Distributor UAE | Official GENOSYS Middle East',
    description: 'GENOSYS Middle East FZ-LLC is the official UAE distributor for GENOSYS Korean dermacosmetics, serving clinics, salons, and consumers.',
    h1: 'Official GENOSYS Distributor in the UAE',
    eyebrow: 'Authentic UAE Supply',
    intro: 'GENOSYS Middle East FZ-LLC operates the official UAE GENOSYS website and supplies authentic Korean dermacosmetics across Dubai, Abu Dhabi, Sharjah, and all emirates.',
    sections: [
      {
        heading: 'Why Distributor Status Matters',
        body: 'Professional skincare depends on authentic stock, correct storage, product education, local invoices, and accountable after-sales support. Buying through the UAE distributor reduces grey-market risk.',
      },
      {
        heading: 'Certified and Local',
        body: 'GENOSYS products are Dubai Municipality certified through Montaji. Orders are priced in AED with VAT-inclusive display and UAE delivery options.',
      },
    ],
    links: [
      { label: 'About GENOSYS Middle East', href: '/about', description: 'Company information and UAE presence.' },
      { label: 'GENOSYS brand story', href: '/brand', description: 'Brand background and Korean origin.' },
      { label: 'Contact GENOSYS UAE', href: '/contact', description: 'Sales, WhatsApp, and support contact details.' },
    ],
    faq: [
      { question: 'Who is the official GENOSYS distributor in the UAE?', answer: 'GENOSYS Middle East FZ-LLC is the official UAE distributor operating genosys.ae.' },
      { question: 'Are products on genosys.ae authentic?', answer: 'Yes. genosys.ae is operated by the official UAE distributor and supplies authentic GENOSYS products from South Korea.' },
    ],
    keywords: ['GENOSYS distributor UAE', 'official GENOSYS UAE', 'GENOSYS Middle East'],
  },
  {
    slug: 'dermacosmetics-for-clinics-uae',
    title: 'Professional Skincare Products for Clinics in the UAE',
    description: 'A practical framework for UAE clinics choosing professional skincare, treatment support, aftercare, retail home care, training, and reliable local supply.',
    h1: 'Professional Skincare Products for UAE Clinics',
    eyebrow: 'Clinic Retail and Treatment Support',
    intro: 'A strong clinic skincare range is not a shelf full of disconnected products. It is a controlled system linking consultation, treatment-room protocols, documented aftercare, home-care retail, team training, stock continuity, and clear escalation when a client needs medical assessment.',
    takeaways: [
      'Separate professional-use products from home care and restrict devices or intensive protocols to appropriately trained practitioners.',
      'Build short protocols around common goals: cleanse, prepare, treat, calm, protect, and maintain.',
      'Give every client written aftercare with stop rules and a route back to the clinic if recovery is not progressing normally.',
      'Choose a UAE supplier that can support traceability, training, invoices, replenishment, and consistent product information.',
    ],
    featuredProducts: [
      { name: 'GENOSYS Microneedling System', href: '/products/1', image: '/images/genosys-microneedling-devices.jpg', imageAlt: 'GENOSYS professional microneedling system', description: 'Professional equipment that belongs in trained, protocol-led practice.' },
      { name: 'Bio Meso PDRN Ampoule 60000', href: '/products/60', image: '/images/6000/main.jpg', imageAlt: 'GENOSYS Bio Meso PDRN Ampoule 60000', description: 'An intensive professional Bio Meso product clearly marked for clinic use.' },
      { name: 'Soothing Repair Postcream', href: '/products/25', image: '/images/SRC.jpg', imageAlt: 'GENOSYS Soothing Repair Postcream', description: 'A post-treatment support option available in professional and home-care sizes.' },
      { name: 'Skin Reboot PDRN Mask Pack', href: '/products/52', image: '/images/pdrn_mask/main.jpeg', imageAlt: 'GENOSYS Skin Reboot PDRN Mask Pack', description: 'A professional sheet-mask format for structured clinic protocols.' },
    ],
    sections: [
      {
        heading: 'Start With Governance, Not a Shopping List',
        body: 'Define who may perform each service, which products are professional-only, how consent and contraindications are recorded, and when treatment must be postponed or referred. Device instructions, UAE licensing requirements, infection-control procedures, and the clinic medical director’s policies take priority over marketing materials.',
      },
      {
        heading: 'Standardize Treatment and Aftercare',
        body: 'For every protocol, document the preparation steps, single-use items, product sequence, contact time, expected short-term response, home-care restrictions, sun protection, and warning signs. Standardization reduces variation between practitioners and makes client follow-up clearer.',
      },
      {
        heading: 'Turn Home Care Into Continuity of Care',
        body: 'Retail should extend the treatment plan rather than add unrelated products. A short regimen—cleanse, calm or treat, moisturize, protect—is easier to follow and replenish. Recommendations should reflect skin condition, procedure intensity, allergies, current prescriptions, and the client’s ability to use the routine consistently.',
      },
      {
        heading: 'Manage Supply and Team Knowledge',
        body: 'A commercially useful range needs reliable stock, transparent wholesale pricing, expiry control, staff education, and multilingual consultation support. GENOSYS Middle East supplies UAE clinics and supports product education, partner ordering, and treatment-linked home-care planning.',
      },
    ],
    links: [
      { label: 'Partner program', href: '/partners', description: 'Clinic and salon partnership options.' },
      { label: 'All skin concerns', href: '/products', description: 'Browse by category, concern, and product type.' },
      { label: 'Professional training', href: '/training', description: 'Help your team standardize product usage.' },
    ],
    faq: [
      { question: 'Does GENOSYS supply clinics in the UAE?', answer: 'Yes. GENOSYS Middle East supplies professional dermacosmetics and product education for UAE clinics, salons, and practitioners.' },
      { question: 'Can GENOSYS products be sold as clinic home care?', answer: 'Many products are suitable for structured home-care routines, but professional-only products and devices must remain restricted. The clinic should match every recommendation to the client and treatment.' },
      { question: 'What should a clinic aftercare sheet include?', answer: 'Include expected recovery, cleansing and moisturizing instructions, sun precautions, products or activities to pause, when makeup may resume, emergency contact details, and warning signs that require review.' },
      { question: 'Is product training a substitute for medical licensing?', answer: 'No. Brand education explains products and protocols; it does not replace professional qualifications, device training, local licensing, medical oversight, or the manufacturer’s instructions.' },
    ],
    sources: [
      { label: 'U.S. FDA — Microneedling devices: benefits, risks and safety', href: 'https://www.fda.gov/consumers/consumer-updates/microneedling-devices-getting-point-benefits-risks-and-safety' },
      { label: 'American Academy of Dermatology — Microneedling overview and aftercare', href: 'https://www.aad.org/public/cosmetic/scars-stretch-marks/microneedling-fade-scars' },
    ],
    keywords: ['dermacosmetics for clinics UAE', 'clinic skincare UAE', 'professional dermacosmetics Dubai'],
  },
  {
    slug: 'korean-sunscreen-uae',
    title: 'Sunscreen for Dubai Climate | Korean SPF Guide UAE',
    description: 'How to choose and apply sunscreen in Dubai: broad-spectrum SPF, texture, reapplication, pigmentation support, makeup formats, heat, sweat, and UAE routines.',
    h1: 'How to Choose Sunscreen for Dubai’s Climate',
    eyebrow: 'Daily SPF for Dubai and the Emirates',
    intro: 'For Dubai, the most useful sunscreen is one that offers appropriate broad-spectrum protection and that you can apply generously and reapply when outdoors. Format matters because comfort, coverage, makeup, sweat, and daily habits determine whether SPF is actually used.',
    takeaways: [
      'Dermatologists recommend broad-spectrum, water-resistant SPF 30 or higher for exposed skin.',
      'Apply before outdoor exposure and reapply about every two hours outdoors, and after swimming or heavy sweating, following the label.',
      'BB cream or cushion SPF can supplement protection and coverage but should not encourage under-application.',
      'Shade, clothing, hats, and sunglasses remain important because sunscreen is only one part of sun protection.',
    ],
    featuredProducts: [
      { name: 'Ultra Shield Sun Cream SPF 50+', href: '/products/39', image: '/images/ultra/main.jpeg', imageAlt: 'GENOSYS Ultra Shield Sun Cream SPF 50+', description: 'A high-SPF cream for strong daily UV protection.' },
      { name: 'Multi Sun Cream SPF 40', href: '/products/40', image: '/images/sun/main.jpeg', imageAlt: 'GENOSYS Multi Sun Cream SPF 40', description: 'A mild daily sunscreen with a lightweight cream format.' },
      { name: 'Skin Caring BB Cushion SPF 50+', href: '/products/41', image: '/images/cushion_2/main.jpeg', imageAlt: 'GENOSYS Skin Caring BB Cushion SPF 50+', description: 'Portable coverage for touch-ups and visible redness.' },
      { name: 'Intensive Blemish Balm SPF 30', href: '/products/42', image: '/images/BLEM.jpg', imageAlt: 'GENOSYS Intensive Blemish Balm Cream SPF 30', description: 'A coverage product that combines complexion correction with labelled SPF.' },
    ],
    sections: [
      {
        heading: 'Choose the Protection First',
        body: 'Look for broad-spectrum protection covering UVA and UVB and an SPF suited to your exposure. The American Academy of Dermatology recommends SPF 30 or higher and water resistance. If you swim, exercise, or sweat heavily, use the water-resistance time and reapplication directions printed on the product.',
      },
      {
        heading: 'Then Choose a Format You Will Use',
        body: 'Cream sunscreen works as the dependable base layer. Tinted, BB, and cushion formats can make daytime touch-ups and complexion coverage easier, but the applied amount still matters. If a complexion product is used too sparingly to reach its labelled protection, keep a dedicated sunscreen underneath.',
      },
      {
        heading: 'Apply Enough and Reapply',
        body: 'Apply sunscreen to all exposed areas, including ears, neck, and hairline, before going outside. When outdoors, reapply approximately every two hours and after swimming or sweating. For a mostly indoor day, consider windows, commute time, midday errands, and any direct sun exposure rather than relying on a rigid one-size-fits-all schedule.',
      },
      {
        heading: 'Connect SPF to Pigmentation and Procedures',
        body: 'UV and visible light can worsen uneven pigmentation in susceptible skin, and recently treated skin may be more sun-sensitive. Follow your dermatologist or practitioner’s aftercare instructions after procedures. If sunscreen stings recently treated skin, do not improvise with strong products—ask the treating professional what and when to apply.',
      },
    ],
    links: [
      { label: 'Sun protection concern page', href: '/products/concern/sun-protection', description: 'Complete SPF routine for UAE climate.' },
      { label: 'Sun product category', href: '/products/category/sun', description: 'Browse GENOSYS SPF products.' },
      { label: 'Pigmentation routine', href: '/products/concern/pigmentation', description: 'Brightening care that depends on daily SPF.' },
    ],
    faq: [
      { question: 'What SPF should I use in Dubai?', answer: 'Choose broad-spectrum SPF 30 or higher; many people prefer SPF 50+ for strong exposure. Suitability also depends on skin type, activity, water resistance, amount applied, and reapplication.' },
      { question: 'How often should sunscreen be reapplied?', answer: 'When outdoors, dermatologists advise approximately every two hours and after swimming or sweating. Follow the specific water-resistance and reapplication instructions on the label.' },
      { question: 'Can an SPF cushion replace sunscreen?', answer: 'A cushion can help with portable touch-ups, but most people apply complexion products more thinly than a sunscreen test amount. Use a dedicated sunscreen base when reliable full-face protection is needed.' },
      { question: 'Do I need sunscreen while driving or working near windows?', answer: 'UVA can pass through ordinary window glass to varying degrees. Consider your distance from windows, commute, time outdoors, and dermatologist guidance when planning protection.' },
    ],
    sources: [
      { label: 'American Academy of Dermatology — How to select a sunscreen', href: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-select-sunscreen' },
      { label: 'American Academy of Dermatology — How to apply sunscreen', href: 'https://www.aad.org/public/everyday-care/sun-protection/shade-clothing-sunscreen/how-to-apply-sunscreen' },
    ],
    keywords: ['Korean sunscreen UAE', 'sunscreen Dubai', 'SPF UAE'],
  },
  {
    slug: 'microneedling-aftercare-routine',
    title: 'Microneedling Aftercare Routine | Products and SPF Guide UAE',
    description: 'A careful microneedling aftercare guide covering gentle cleansing, moisturizer, sun protection, products to pause, warning signs, and UAE clinic follow-up.',
    h1: 'Microneedling Aftercare: A Simple Recovery Routine',
    eyebrow: 'Post-Treatment Skin Support',
    intro: 'Aftercare should protect healing skin, not overwhelm it. Your treating professional’s written instructions always come first because needle depth, treatment area, combined procedures, medical history, and skin response change what is appropriate.',
    takeaways: [
      'Use only the cleanser, moisturizer, and other products approved by the treating professional during early recovery.',
      'Pause potentially irritating actives—such as retinoids, exfoliating acids, scrubs, and alcohol-heavy products—until the provider clears them.',
      'Protect treated skin from sun and heat; use sunscreen according to the provider’s timing and product advice.',
      'Contact the clinic promptly for worsening pain, spreading redness, pus, blistering, fever, or other symptoms outside the expected recovery plan.',
    ],
    featuredProducts: [
      { name: 'Soothing Repair Postcream', href: '/products/25', image: '/images/SRC.jpg', imageAlt: 'GENOSYS Soothing Repair Postcream', description: 'Post-treatment moisture support in home-care and professional sizes.' },
      { name: 'Intensive Hydro Soothing Cream', href: '/products/28', image: '/images/HSC.jpg', imageAlt: 'GENOSYS Intensive Hydro Soothing Cream', description: 'A soothing gel-cream option for hydration when approved for the protocol.' },
      { name: 'Skin Barrier Protecting Cream', href: '/products/27', image: '/images/skin_barr/main.jpeg', imageAlt: 'GENOSYS Skin Barrier Protecting Cream', description: 'Richer barrier support for the later recovery and maintenance phase.' },
      { name: 'Ultra Shield Sun Cream SPF 50+', href: '/products/39', image: '/images/ultra/main.jpeg', imageAlt: 'GENOSYS Ultra Shield Sun Cream SPF 50+', description: 'High UV protection for use when the treating professional says sunscreen can resume.' },
    ],
    sections: [
      {
        heading: 'Immediately After Treatment',
        body: 'Redness, tightness, warmth, mild swelling, or a sunburn-like sensation can occur. Do not touch the area unnecessarily, pick, scrub, or add unapproved products. The FDA notes that treated skin may be more sensitive to skincare and sun; ask the provider exactly how and when to cleanse, moisturize, use makeup, and restart sunscreen.',
      },
      {
        heading: 'Keep the Routine Deliberately Short',
        body: 'Once cleansing is permitted, use clean hands, lukewarm water, and the gentle product recommended by the clinic. Pat—do not rub—the skin dry. Use only an approved bland moisturizer or post-care product. More layers do not mean faster recovery, and products tolerated before treatment may sting afterward.',
      },
      {
        heading: 'Pause Heat, Friction, and Strong Actives',
        body: 'Follow the clinic’s timeframe for exercise, sauna, steam, swimming, makeup, exfoliation, retinoids, acids, and other active products. Avoid direct sun and deliberate tanning. Do not apply numbing agents, topical medicines, essential oils, or home remedies unless specifically instructed by a qualified professional.',
      },
      {
        heading: 'Know When to Call the Clinic',
        body: 'Expected redness should generally trend toward improvement according to the provider’s plan. Seek prompt review for symptoms that worsen rather than settle, including increasing pain, expanding redness, marked swelling, discharge, blistering, fever, or a suspected allergic reaction. This guide cannot diagnose a complication.',
      },
    ],
    links: [
      { label: 'Scars and texture routine', href: '/products/concern/scars-treatment', description: 'Explore treatment-support and maintenance products.' },
      { label: 'Professional microneedling guide', href: '/guides/microneedling-devices-uae', description: 'Understand devices, professional use, and clinic protocols.' },
      { label: 'Contact GENOSYS UAE', href: '/contact', description: 'Ask about training, professional products, and protocol support.' },
    ],
    faq: [
      { question: 'When can I wash my face after microneedling?', answer: 'Follow the treating professional’s specific timing. Treatment depth and combined procedures vary, so a universal hour-by-hour rule is not appropriate.' },
      { question: 'When can I restart retinol or exfoliating acids?', answer: 'Only after the provider confirms recovery is adequate. Restarting irritating actives too early can increase discomfort and barrier disruption.' },
      { question: 'Can I wear makeup after microneedling?', answer: 'Wait until the treating professional says it is safe. Applying makeup too early can irritate treated skin and may increase contamination risk.' },
      { question: 'Which sunscreen should I use afterward?', answer: 'Use the type and timing recommended by your provider. Recently treated skin can be sensitive, so do not assume your usual sunscreen will feel the same immediately after treatment.' },
    ],
    sources: [
      { label: 'U.S. FDA — Microneedling devices: benefits, risks and safety', href: 'https://www.fda.gov/consumers/consumer-updates/microneedling-devices-getting-point-benefits-risks-and-safety' },
      { label: 'American Academy of Dermatology — Microneedling overview and aftercare', href: 'https://www.aad.org/public/cosmetic/scars-stretch-marks/microneedling-fade-scars' },
      { label: 'American Academy of Dermatology — Skin care after acne-scar treatment', href: 'https://www.aad.org/public/diseases/acne/derm-treat/scars/self-care' },
    ],
    keywords: ['microneedling aftercare products', 'post microneedling skincare routine', 'microneedling aftercare UAE'],
  },
  {
    slug: 'pdrn-skincare-benefits',
    title: 'PDRN Skincare Benefits | Topical vs Professional Guide UAE',
    description: 'An evidence-aware guide to PDRN skincare: what PDRN is, topical versus injectable or professional products, realistic benefits, limitations, and GENOSYS options.',
    h1: 'PDRN Skincare: Benefits, Formats, and Realistic Expectations',
    eyebrow: 'Evidence-Aware Regenerative Skincare',
    intro: 'PDRN is a group of DNA-derived polymers studied in wound healing and regenerative medicine. Interest in cosmetic serums, masks, professional procedures, and injectables is growing, but these formats are not interchangeable and the strength of evidence differs by formulation and delivery method.',
    takeaways: [
      'PDRN and PN refer to related DNA-derived materials, but terminology and molecular size are not standardized consistently across every product or study.',
      'Evidence from injectable or medical PDRN cannot automatically be transferred to a topical cosmetic serum or mask.',
      'Topical products are best framed as supportive hydration, barrier, and appearance-focused care—not as substitutes for medical treatment.',
      'Professional spicule, microneedling, or injectable procedures require appropriate assessment, training, hygiene, and aftercare.',
    ],
    featuredProducts: [
      { name: 'Bio Meso PDRN Ampoule 60000', href: '/products/60', image: '/images/6000/main.jpg', imageAlt: 'GENOSYS Bio Meso PDRN Ampoule 60000', description: 'An intensive professional-only Bio Meso spicule product.' },
      { name: 'Bio-Meso PDRN Homecare Ampoule 5000', href: '/products/65', image: '/images/meso_5000/main.jpg', imageAlt: 'GENOSYS Bio-Meso PDRN Homecare Ampoule 5000', description: 'A lower-intensity home-care Bio Meso format for structured maintenance.' },
      { name: 'Skin Reboot PDRN Mask Pack', href: '/products/52', image: '/images/pdrn_mask/main.jpeg', imageAlt: 'GENOSYS Skin Reboot PDRN Mask Pack', description: 'A professional sheet-mask format pairing PDRN positioning with hydration-focused care.' },
      { name: 'Soothing Repair Postcream', href: '/products/25', image: '/images/SRC.jpg', imageAlt: 'GENOSYS Soothing Repair Postcream', description: 'A complementary recovery-support product rather than a PDRN treatment.' },
    ],
    sections: [
      {
        heading: 'What PDRN Means',
        body: 'Polydeoxyribonucleotide describes purified DNA fragments across a range of molecular sizes. Reviews report biological activity relevant to tissue repair, including adenosine-receptor and nucleotide-salvage pathways, but researchers also note confusion between PDRN and longer-chain polynucleotides. A product name alone does not reveal dose, molecular size, purity, delivery, or clinical effect.',
      },
      {
        heading: 'Topical, Spicule, and Injectable Are Different',
        body: 'A cream or mask sits primarily at the skin surface; a spicule system changes delivery and creates a peeling response; an injectable places material into tissue and is a medical procedure. Safety, evidence, expected effect, and practitioner requirements therefore differ. Never use results from an injectable study as proof that any topical cosmetic will produce the same outcome.',
      },
      {
        heading: 'What Benefits Are Reasonable to Discuss',
        body: 'Research supports continued investigation of PDRN for repair, inflammation modulation, and skin quality. For cosmetics, use conservative expectations: hydration, smoother-looking texture, and support within a consistent routine. Claims about treating wounds, scars, disease, or structural regeneration require product-specific clinical evidence and the correct regulatory category.',
      },
      {
        heading: 'Who Should Ask Before Use',
        body: 'Seek professional advice if skin is inflamed, infected, recently treated, highly reactive, pregnant, breastfeeding, affected by a diagnosed condition, or if there is concern about fish-derived ingredients. Follow professional-only restrictions and stop use if significant irritation occurs.',
      },
    ],
    links: [
      { label: 'Bio Meso category', href: '/products/category/bio-meso', description: 'Compare the current professional and home-care formats.' },
      { label: 'Microneedling aftercare', href: '/guides/microneedling-aftercare-routine', description: 'Plan conservative recovery after professional procedures.' },
      { label: 'Professional training', href: '/training', description: 'Access GENOSYS product and protocol education.' },
    ],
    faq: [
      { question: 'Is PDRN the same as salmon sperm?', answer: 'PDRN used in skincare is a purified DNA-derived material, often sourced from salmonid fish. The casual phrase is imprecise and does not describe purification, molecular size, formulation, or quality.' },
      { question: 'Does topical PDRN work like injections?', answer: 'No assumption should be made that it does. Delivery depth, dose, formulation, regulation, and evidence are different. Topical cosmetics should be evaluated on their own product-specific data.' },
      { question: 'Is Bio Meso PDRN the same as microneedling?', answer: 'No. GENOSYS Bio Meso products use microscopic spicules and are described as a no-classic-needle system. The Expert 60000 product is professional-only and still requires protocol-led use.' },
      { question: 'Can PDRN products replace dermatological treatment?', answer: 'No. Cosmetic products do not replace diagnosis or medical treatment for wounds, dermatitis, acne, pigmentation disorders, or other skin disease.' },
    ],
    sources: [
      { label: 'PubMed — From PDRNs to PNs: molecular definitions and clinical applications', href: 'https://pubmed.ncbi.nlm.nih.gov/39858543/' },
      { label: 'PMC — Comparison of PN and PDRN in dermatology', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12388916/' },
    ],
    keywords: ['PDRN skincare benefits', 'PDRN serum UAE', 'PDRN skincare Dubai', 'topical PDRN'],
  },
  {
    slug: 'ceramide-cleanser-skin-barrier',
    title: 'Ceramide Cleanser for a Damaged Skin Barrier | UAE Guide',
    description: 'A practical guide to ceramides, gentle cleansing, moisturizers, signs of an impaired skin barrier, UAE climate stress, and a simple recovery routine.',
    h1: 'Ceramides and Cleansing for a Damaged Skin Barrier',
    eyebrow: 'Gentle Barrier-Care Routine',
    intro: 'Ceramides are important lipids in the outer skin barrier, but barrier care is a complete routine—not a single hero ingredient. Gentle cleansing, suitable moisturization, fewer irritants, and sun protection work together while the cause of persistent symptoms is assessed.',
    takeaways: [
      'Ceramides help form the lipid structure that limits water loss and helps protect skin from external irritants.',
      'A cleanser should remove soil, makeup, and sunscreen without leaving skin persistently tight, stinging, or over-stripped.',
      'A ceramide cleanser can support a gentle routine, but a leave-on moisturizer usually carries more of the barrier-support workload.',
      'Persistent burning, cracking, itch, rash, or recurrent flares may indicate dermatitis or another condition needing professional diagnosis.',
    ],
    featuredProducts: [
      { name: 'Cerabarrier Biome Gel Cleanser', href: '/products/66', image: '/images/cera/main2.jpeg', imageAlt: 'GENOSYS Cerabarrier Biome Gel Cleanser', description: 'A gel cleanser positioned for microbiome- and barrier-conscious cleansing.' },
      { name: 'Microbiome Energy Infusing Mist', href: '/products/14', image: '/images/mist/main2.jpeg', imageAlt: 'GENOSYS Microbiome Energy Infusing Mist', description: 'A light hydration step that can complement—not replace—moisturizer.' },
      { name: 'All For Sensitive Serum', href: '/products/19', image: '/images/sensitive_serum/main.jpeg', imageAlt: 'GENOSYS All For Sensitive Serum', description: 'A moisture-support serum for sensitive-looking skin.' },
      { name: 'Skin Barrier Protecting Cream', href: '/products/27', image: '/images/skin_barr/main.jpeg', imageAlt: 'GENOSYS Skin Barrier Protecting Cream', description: 'A leave-on cream with ceramide, amino acids, and emollient oils.' },
    ],
    sections: [
      {
        heading: 'What a Skin Barrier Does',
        body: 'The stratum corneum is often compared to bricks and mortar: corneocytes sit within a lipid matrix rich in ceramides, cholesterol, and fatty acids. When this structure is disturbed, transepidermal water loss can rise and skin may feel dry, tight, rough, itchy, or unusually reactive.',
      },
      {
        heading: 'How Cleansing Can Help—or Hurt',
        body: 'Cleansing frequency, water temperature, surfactants, scrubbing, and the number of wash steps all matter. Use lukewarm water, avoid abrasive tools, and cleanse only as much as needed to remove sunscreen, makeup, sweat, and soil. A product that repeatedly causes burning or lasting tightness is not a good match, regardless of its marketing category.',
      },
      {
        heading: 'Build a Short Barrier Routine',
        body: 'Use a gentle cleanser, optional hydrating serum or mist, and a leave-on moisturizer suited to your skin. During irritation, reduce exfoliating acids, retinoids, scrubs, and frequent product changes. Add daytime sun protection once tolerated. Reintroduce active products one at a time after the skin is comfortable.',
      },
      {
        heading: 'Consider the Cause',
        body: 'Dubai air-conditioning, outdoor heat, sweating, frequent washing, procedures, acne treatments, fragrances, and over-exfoliation can all contribute to symptoms. Barrier products may support comfort but cannot diagnose eczema, allergy, infection, rosacea, or perioral dermatitis. Seek assessment when symptoms are persistent or worsening.',
      },
    ],
    links: [
      { label: 'Sensitivity routine', href: '/products/concern/sensitivity', description: 'Browse products grouped for sensitive-skin support.' },
      { label: 'Hydration routine', href: '/products/concern/hydration', description: 'Build a practical moisture-support routine.' },
      { label: 'Korean skincare in Dubai', href: '/guides/korean-skincare-dubai', description: 'Fit barrier care into a simple UAE daily routine.' },
    ],
    faq: [
      { question: 'Can a ceramide cleanser repair the skin barrier by itself?', answer: 'Usually not by itself. Gentle cleansing reduces additional stress, while a suitable leave-on moisturizer and removal of the underlying irritant are generally important parts of recovery.' },
      { question: 'Should damaged-barrier skin be cleansed twice a day?', answer: 'Not always. Frequency should reflect oil, sweat, sunscreen, makeup, and tolerance. Some people need only water or a very gentle morning cleanse and a thorough but mild evening cleanse.' },
      { question: 'How long does barrier recovery take?', answer: 'It varies from days to weeks depending on the cause and severity. Ongoing exposure to an irritant or an untreated skin condition can prevent improvement.' },
      { question: 'Are ceramides suitable for acne-prone skin?', answer: 'Ceramides themselves are normal skin lipids, but suitability depends on the entire formula and individual response. Choose texture and ingredients according to your skin and acne treatment plan.' },
    ],
    sources: [
      { label: 'PubMed — Ceramide-dominant cream and cleanser randomized trial', href: 'https://pubmed.ncbi.nlm.nih.gov/33984185/' },
      { label: 'International Journal of Cosmetic Science — Ceramides in skin barrier function and formulation', href: 'https://onlinelibrary.wiley.com/doi/10.1111/ics.12972' },
      { label: 'PMC — Topical lipids and the epidermal barrier', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9321633/' },
    ],
    keywords: ['ceramide cleanser damaged skin barrier', 'skin barrier repair UAE', 'ceramide skincare Dubai'],
  },
  {
    slug: 'acne-treatment-products-uae',
    title: 'Acne Treatment Products UAE | GENOSYS Problem Control Skincare',
    description: 'GENOSYS acne and blemish skincare products for UAE customers, with routines for oil control, hydration, barrier support, and post-acne marks.',
    h1: 'Acne Treatment Products in the UAE',
    eyebrow: 'Problem Control and Barrier Support',
    intro: 'GENOSYS acne routines focus on clearing blemishes without destroying the skin barrier, which matters in UAE heat, sweat, AC dryness, and frequent sunscreen use.',
    sections: [
      {
        heading: 'A Practical Acne Routine',
        body: 'Good acne care balances cleansing, oil control, calming, hydration, and SPF. Over-stripping can worsen irritation and rebound oiliness, especially in hot climates.',
      },
      {
        heading: 'Post-Acne Marks Need SPF',
        body: 'Dark marks after breakouts are common in the UAE because UV exposure intensifies pigmentation. Acne routines should pair treatment products with consistent daily sun protection.',
      },
    ],
    links: [
      { label: 'Acne treatment concern page', href: '/products/concern/acne-treatment', description: 'Routine guidance and recommended products.' },
      { label: 'Cleanser category', href: '/products/category/cleanser', description: 'Start with gentle cleansing.' },
      { label: 'Pigmentation support', href: '/products/concern/pigmentation', description: 'Support post-acne marks and uneven tone.' },
    ],
    faq: [
      { question: 'What GENOSYS products help acne-prone skin?', answer: 'Start with the GENOSYS acne treatment concern page, which groups products for cleansing, oil control, calming, hydration, and post-acne support.' },
      { question: 'Should acne-prone skin still use moisturizer and sunscreen?', answer: 'Yes. Acne-prone skin still needs barrier support and daily SPF, especially in the UAE where UV can worsen post-acne marks.' },
    ],
    keywords: ['acne treatment products UAE', 'acne skincare Dubai', 'GENOSYS acne'],
  },
  {
    slug: 'pigmentation-serum-dubai',
    title: 'Pigmentation Serum Dubai | GENOSYS Brightening Skincare UAE',
    description: 'GENOSYS pigmentation and brightening skincare routines for Dubai, including vitamin-focused serums, SPF pairing, and home-care guidance.',
    h1: 'Pigmentation Serum and Brightening Care in Dubai',
    eyebrow: 'Brightening Requires Consistency',
    intro: 'Pigmentation care in Dubai needs two things: brightening actives and disciplined UV protection. GENOSYS routines connect both so dark-spot care is not undone by daily sun exposure.',
    sections: [
      {
        heading: 'Treat the Cause and Protect the Result',
        body: 'Brightening serums can support uneven tone, but Dubai UV exposure can keep triggering melanin. SPF and reapplication are part of the pigmentation protocol, not an optional final step.',
      },
      {
        heading: 'Clinic and Home-Care Pairing',
        body: 'For clinics, GENOSYS pigmentation routines can support peels, microneedling, and other brightening treatments with calm, hydrated, SPF-protected home care.',
      },
    ],
    links: [
      { label: 'Pigmentation concern page', href: '/products/concern/pigmentation', description: 'Brightening routine and product recommendations.' },
      { label: 'Serum category', href: '/products/category/serum', description: 'Browse GENOSYS treatment serums.' },
      { label: 'Sun protection', href: '/products/concern/sun-protection', description: 'Protect brightening progress with daily SPF.' },
    ],
    faq: [
      { question: 'What helps pigmentation in Dubai?', answer: 'A consistent routine with brightening products plus daily broad-spectrum SPF is the practical foundation for pigmentation care in Dubai.' },
      { question: 'Can brightening serum work without sunscreen?', answer: 'It is much less effective. Without sunscreen, UAE UV exposure can darken existing pigmentation and trigger new spots.' },
    ],
    keywords: ['pigmentation serum Dubai', 'brightening serum UAE', 'dark spots skincare Dubai'],
  },
]

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  return SEO_LANDING_PAGES.find(page => page.slug === slug)
}
