export interface SeoLandingPage {
  slug: string
  title: string
  description: string
  h1: string
  eyebrow: string
  intro: string
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
  keywords: string[]
}

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: 'korean-skincare-dubai',
    title: 'Korean Skincare Dubai | Professional GENOSYS Dermacosmetics UAE',
    description: 'Shop professional Korean skincare in Dubai from GENOSYS Middle East, the official UAE distributor with Montaji-certified dermacosmetics and UAE delivery.',
    h1: 'Korean Skincare in Dubai',
    eyebrow: 'Professional Korean Dermacosmetics',
    intro: 'GENOSYS brings professional Korean skincare to Dubai clinics, salons, and home-care customers who want authentic products with UAE support, VAT-inclusive AED pricing, and fast local delivery.',
    sections: [
      {
        heading: 'Why GENOSYS Fits Dubai Skin Needs',
        body: 'Dubai combines intense UV exposure, dry air conditioning, humidity shifts, hard water, and frequent travel. GENOSYS routines focus on barrier support, hydration, pigmentation control, and daily SPF, which are the practical priorities for UAE skin.',
      },
      {
        heading: 'Official UAE Supply',
        body: 'GENOSYS Middle East FZ-LLC is the official UAE distributor of GENOSYS products from DTS MG Co., Ltd. in South Korea. Products are Dubai Municipality certified through Montaji and supplied with local customer support.',
      },
    ],
    links: [
      { label: 'Shop all GENOSYS products', href: '/products', description: 'Browse serums, creams, masks, SPF, scalp care, and professional devices.' },
      { label: 'Hydration routine', href: '/products/concern/hydration', description: 'Moisture support for dry air-conditioned environments.' },
      { label: 'Sun protection', href: '/products/concern/sun-protection', description: 'Daily SPF products for UAE UV exposure.' },
    ],
    faq: [
      { question: 'Where can I buy authentic Korean skincare in Dubai?', answer: 'You can buy authentic GENOSYS Korean dermacosmetics from genosys.ae, operated by GENOSYS Middle East FZ-LLC, the official UAE distributor.' },
      { question: 'Is GENOSYS suitable for Dubai weather?', answer: 'Yes. GENOSYS routines include hydration, barrier support, pigmentation care, and broad-spectrum SPF, which are especially relevant for Dubai heat, UV, AC, and humidity changes.' },
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
    title: 'Dermacosmetics for Clinics UAE | GENOSYS Professional Products',
    description: 'Professional Korean dermacosmetics for UAE clinics and salons, including serums, masks, microneedling support, and post-treatment home care.',
    h1: 'Dermacosmetics for Clinics in the UAE',
    eyebrow: 'Clinic Retail and Treatment Support',
    intro: 'GENOSYS helps UAE clinics build treatment-linked retail routines with professional Korean dermacosmetics that support hydration, pigmentation, acne, scars, sensitivity, and anti-aging.',
    sections: [
      {
        heading: 'From Treatment Room to Home Care',
        body: 'Clinic results improve when clients leave with a simple home-care plan. GENOSYS products map cleanly to common post-treatment goals: calm, hydrate, protect, repair, and maintain.',
      },
      {
        heading: 'Commercially Practical for Clinics',
        body: 'The catalog supports both treatment protocols and retail recommendations, with local UAE supply and content in English, Arabic, and Russian for multilingual clients.',
      },
    ],
    links: [
      { label: 'Partner program', href: '/partners', description: 'Clinic and salon partnership options.' },
      { label: 'All skin concerns', href: '/products', description: 'Browse by category, concern, and product type.' },
      { label: 'Professional training', href: '/training', description: 'Help your team standardize product usage.' },
    ],
    faq: [
      { question: 'Does GENOSYS supply clinics in the UAE?', answer: 'Yes. GENOSYS Middle East supplies professional dermacosmetics and product education for UAE clinics, salons, and practitioners.' },
      { question: 'Can GENOSYS products be sold as clinic home care?', answer: 'Yes. Many GENOSYS products are suitable for structured home-care routines after consultation or treatment.' },
    ],
    keywords: ['dermacosmetics for clinics UAE', 'clinic skincare UAE', 'professional dermacosmetics Dubai'],
  },
  {
    slug: 'korean-sunscreen-uae',
    title: 'Korean Sunscreen UAE | GENOSYS SPF for Dubai Sun',
    description: 'GENOSYS Korean sunscreen and SPF products for UAE daily sun exposure, pigmentation prevention, and lightweight professional skincare routines.',
    h1: 'Korean Sunscreen for UAE Sun Exposure',
    eyebrow: 'Daily SPF for Dubai and the Emirates',
    intro: 'In the UAE, SPF is not optional. GENOSYS sun-care products support daily UV protection, pigmentation prevention, and comfortable wear in heat and humidity.',
    sections: [
      {
        heading: 'Designed Around Real UAE Use',
        body: 'The best sunscreen is the one clients can wear every day. GENOSYS SPF options include lightweight creams, BB coverage, and cushion formats that fit commute, office, school-run, and outdoor exposure patterns.',
      },
      {
        heading: 'SPF Plus Treatment Logic',
        body: 'Sun protection supports every other skincare goal. It protects pigmentation routines, slows visible aging, reduces post-treatment risk, and helps sensitive skin avoid UV-triggered flare-ups.',
      },
    ],
    links: [
      { label: 'Sun protection concern page', href: '/products/concern/sun-protection', description: 'Complete SPF routine for UAE climate.' },
      { label: 'Sun product category', href: '/products/category/sun', description: 'Browse GENOSYS SPF products.' },
      { label: 'Pigmentation routine', href: '/products/concern/pigmentation', description: 'Brightening care that depends on daily SPF.' },
    ],
    faq: [
      { question: 'What SPF should I use in Dubai?', answer: 'Daily broad-spectrum SPF is recommended in Dubai. GENOSYS offers SPF products suitable for everyday UAE sun exposure and routine layering.' },
      { question: 'Does sunscreen help pigmentation?', answer: 'Yes. Daily sunscreen is essential for pigmentation routines because UV exposure can darken existing spots and trigger new discoloration.' },
    ],
    keywords: ['Korean sunscreen UAE', 'sunscreen Dubai', 'SPF UAE'],
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
