import { prisma } from '../lib/prisma'
import {
  PRODUCT_49_AR_NAME,
  PRODUCT_49_AR_TRANSLATION,
  PRODUCT_49_RU_NAME,
  PRODUCT_49_RU_TRANSLATION,
} from '../data/product49LocalizedCopy'

const description =
  'GENO-LED IR II is a professional dome LED device with 1,710 elements: 380 each at red 640 nm, blue 423 nm, green 532 nm and yellow 583 nm, plus 190 infrared elements at 830 nm. DTS MG publishes irradiance and standard dose for every mode. Any visible colour can run simultaneously with infrared; red paired with blue, green or yellow alternates every three seconds. Rated power is 70 W electrical, not total optical output. The unit measures 520 × 220 × 315 mm and weighs 2.6 kg. The available archive does not contain a current GENO-LED IR II user manual, declaration of conformity or regulatory-classification document. This record therefore does not present IR II as a medical device or make treatment and efficacy claims.'

const productDetails = JSON.stringify({
  form: 'Professional dome LED device',
  leds: '1,710: 380 red · 380 blue · 380 green · 380 yellow · 190 infrared',
  wavelengths: '423 · 532 · 583 · 640 · 830 nm',
  irradiance: 'Red 42 · blue 46 · green 15 · yellow 11 · infrared 15 mW/cm²',
  standardDose: 'Red 28 · blue 28 · green 9 · yellow 7 · infrared 12 J/cm²',
  publishedDoseRanges: 'Red 1–186 · blue 1–152 · green 1–52 · yellow 1–39 · infrared 1–56 J/cm²',
  bandwidth: '20 ±5 nm for every mode',
  publishedExposureRanges: 'Visible modes 5–60 minutes · infrared 1–10 minutes',
  panelTimer: 'Panel setting 5–30 minutes in 5-minute steps; published separately by DTS MG',
  combinations: 'Any visible colour + infrared simultaneously · red + blue/green/yellow alternating every 3 seconds',
  controls: 'Automatic shut-off · voice message 1 minute before completion · English, Korean and Chinese',
  ratedPower: '70 W rated electrical power, not optical output',
  dimensions: '520 × 220 × 315 mm',
  weight: '2.6 kg',
  evidenceBoundary: 'The current source set has no IR II-specific user manual, DoC or regulatory-classification document',
  origin: 'DTS MG Co., Ltd. · Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: '1,710 LED elements',
    description: '380 of every visible colour plus 190 infrared, as published by DTS MG.',
  },
  {
    title: 'Five modes with published dosimetry',
    description: 'Every wavelength has published irradiance, standard dose, dose range and bandwidth.',
  },
  {
    title: 'Two combination behaviours',
    description: 'A colour plus infrared runs together; red plus another colour alternates every three seconds.',
  },
  {
    title: 'Timed control with automatic shut-off',
    description: 'DTS MG publishes a 5–30 minute panel setting in 5-minute steps and a one-minute voice warning.',
  },
])

const benefits = JSON.stringify([
  'Five precisely identified wavelengths in one professional device',
  'Published mode-specific dosimetry instead of undefined intensity levels',
  'Simultaneous operation of any visible colour with infrared',
  'Three-second alternation of red with blue, green or yellow',
  'Five-minute timer steps and automatic completion',
  'Published 520 × 220 × 315 mm dimensions and 2.6 kg weight',
])

const howToUse = JSON.stringify([
  {
    step: 'Connect the adaptor',
    instruction: 'Use either power socket on the side of the device. The power button lights and the unit enters standby.',
  },
  { step: 'Switch the unit on', instruction: 'Touch Power ON/OFF.' },
  {
    step: 'Set the time',
    instruction: 'Use the up and down buttons. The official DTS MG page publishes 5–30 minutes in 5-minute steps.',
  },
  {
    step: 'Select the light',
    instruction: 'Select red, blue, green or yellow. Add IR to run infrared simultaneously.',
  },
  {
    step: 'Use alternation if required',
    instruction: 'After red, select blue, green or yellow; the two colours alternate every three seconds.',
  },
  {
    step: 'Let the timer finish',
    instruction: 'A voice message plays one minute before the end, then the unit switches off automatically.',
  },
])

const directions =
  'For professional operation only under the current GENO-LED IR II manual and trained-operator procedure. The available source set confirms controls and technical specifications but contains no IR II-specific manual defining contraindications, eye protection or photosensitising-medication cautions. Do not replace those instructions with generic guidance for another LED device. Until the current manual is obtained, do not create medical indications or contraindications, set post-injection, thread-lift, microneedling or peel intervals, or calculate individual exposure from the marketing dosimetry table alone. Obtain the current user manual, declaration of conformity and classification document for the unit serial number from the supplier.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '49' },
        { id: '49' },
        { name: { contains: 'GENO-LED IR II', mode: 'insensitive' } },
      ],
    },
  })

  if (!product) throw new Error('Product 49 GENO-LED IR II not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '49' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 49 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const expected = {
    productNumber: '49',
    nameRu: PRODUCT_49_RU_NAME,
    nameAr: PRODUCT_49_AR_NAME,
    description,
    descriptionRu: PRODUCT_49_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_49_AR_TRANSLATION.description,
    productDetails,
    keyFeatures,
    benefits,
    ingredients: null,
    howToUse,
    directions,
    size: '1 device',
    skinType: null,
    targetConcerns: null,
    usage: null,
    ageGroup: null,
  } as const

  const changed = Object.fromEntries(
    Object.entries(expected).map(([key, value]) => [
      key,
      product[key as keyof typeof product] !== value,
    ]),
  )

  await prisma.product.update({
    where: { id: product.id },
    data: expected,
  })

  const verified = await prisma.product.findUniqueOrThrow({
    where: { id: product.id },
    select: {
      id: true,
      productNumber: true,
      nameRu: true,
      nameAr: true,
      description: true,
      descriptionRu: true,
      descriptionAr: true,
      productDetails: true,
      keyFeatures: true,
      benefits: true,
      ingredients: true,
      howToUse: true,
      directions: true,
      size: true,
      skinType: true,
      targetConcerns: true,
      usage: true,
      ageGroup: true,
    },
  })

  const mismatches = Object.entries(expected)
    .filter(([key, value]) => verified[key as keyof typeof verified] !== value)
    .map(([key]) => key)

  if (mismatches.length) {
    throw new Error(`Product 49 parity check failed: ${mismatches.join(', ')}`)
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    id: product.id,
    previousProductNumber: product.productNumber,
    changed,
    parity: 'verified',
  }, null, 2))
}

main()
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
