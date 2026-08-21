import { prisma } from '../lib/prisma'
import {
  PRODUCT_48_AR_NAME,
  PRODUCT_48_AR_TRANSLATION,
  PRODUCT_48_RU_NAME,
  PRODUCT_48_RU_TRANSLATION,
} from '../data/product48LocalizedCopy'

const description =
  'Hair-GENTRON model HGHY01 is a portable LED massage helmet for the scalp with air-pressure massage, optional heat, music and a separate controller. Its four LED modes are red plus infrared, blue, lights off, and red plus blue plus infrared. Set 10, 20 or 30 minutes; the helmet switches off automatically and must not be used for more than 30 minutes at one time. A one-second hold starts the documented 10-minute preset with massage, heat, all three lights and music. The 1.0 kg helmet measures 230 × 240 × 300 mm; the controller measures 158 × 68 × 42 mm. Use the included 5 V 1.5 A adaptor or four AA batteries, which are not included. The product has an EU Declaration of Conformity under EMC 2014/30/EU and LVD 2014/35/EU and was tested to IEC/EN 60335-2-32 as a portable Class III household massage appliance. It is not a medical device, and device-specific clinical efficacy data is not available.'

const productDetails = JSON.stringify({
  form: 'Portable LED massage helmet with heat and separate controller',
  model: 'HGHY01',
  contents: 'Helmet · disassembled stand · controller · USB-C cable · power adaptor',
  ledModes: 'Red + infrared · blue · lights off · red + blue + infrared',
  functions: 'Air-pressure massage · heat · music · adjustable fit',
  timer: '10 / 20 / 30 minutes · automatic shut-off · maximum 30 minutes per session',
  preset: 'Hold On/Time/Off for one second to start the 10-minute massage, heat, all-lights and music preset',
  power: 'Adaptor input AC 100–240 V 50/60 Hz, output DC 5 V 1.5 A · or 4 × 1.5 V AA batteries, not included',
  dimensions: 'Helmet 230 × 240 × 300 mm · controller 158 × 68 × 42 mm',
  weight: 'Net weight 1.0 kg',
  storage: '5–40 °C · relative humidity ≤80%',
  warranty: '24 months from original purchase for normal use in accordance with the manual',
  conformity: 'EU Declaration of Conformity: EMC 2014/30/EU and LVD 2014/35/EU',
  safetyStandard: 'IEC/EN 60335-2-32 · household and similar massage appliances · portable Class III appliance',
  origin: 'DTS MG Co., Ltd. · Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: 'Four LED modes',
    description: 'Red plus infrared, blue, lights off, or red, blue and infrared together.',
  },
  {
    title: 'Air-pressure massage and heat',
    description: 'Control massage and heat independently and use them together or separately.',
  },
  {
    title: 'Timed automatic sessions',
    description: 'Choose 10, 20 or 30 minutes; the helmet switches off automatically at the end.',
  },
  {
    title: 'Adaptor or battery power',
    description: 'Use the included adaptor or four AA batteries for cordless operation. Batteries are not included.',
  },
])

const benefits = JSON.stringify([
  'Hands-free comfort without holding a treatment device',
  'LED modes, air-pressure massage and controllable heat in one helmet',
  'Massage and heat can run with the lights on or off',
  '10, 20 or 30-minute timer with automatic shut-off',
  'Adjustable height and width for a comfortable fit',
  'Adaptor, USB-C cable, controller and stand included',
])

const howToUse = JSON.stringify([
  {
    step: 'Prepare hair and scalp',
    instruction: 'Wash the hair and scalp and dry them fully before wearing the helmet.',
  },
  {
    step: 'Adjust the fit',
    instruction: 'Position the helmet so the front does not cover the eyes, then adjust height and width with the side dials.',
  },
  {
    step: 'Start the preset',
    instruction: 'Hold On/Time/Off for one second to start the 10-minute preset with massage, heat, all three lights and music.',
  },
  {
    step: 'Customise the session',
    instruction: 'Use a short press to select 10, 20 or 30 minutes, then set LED, massage, heat and music with their individual controls.',
  },
  {
    step: 'Finish safely',
    instruction: 'Wait for automatic shut-off or hold the button for two seconds to stop early. Do not use for more than 30 minutes at one time.',
  },
])

const directions =
  'Read the user manual before first use. Keep away from liquids, inflammable objects, hot or damp environments. Do not use with a damaged adaptor or wet hands. Unplug the adaptor after use and remove batteries when the product is not in use or connected to the adaptor. Turn heat off if you are insensitive to heat. Consult a doctor before use if you are under medical treatment, use an implanted electronic medical device, have heart disease or disease of the head, are pregnant, have osteoporosis or a fractured spine, have a circulation disturbance caused by diabetes or another disease, or have a body temperature above 38 °C. Stop immediately and consult a doctor if anything feels abnormal. Do not repair, disassemble or modify the product. Store at 5–40 °C and relative humidity ≤80%, away from children. The manual does not establish compatibility immediately after medical or aesthetic procedures; do not recommend post-procedure use without clearance from the treating clinician.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '48' },
        { id: '48' },
        { name: { contains: 'Hair-GENTRON', mode: 'insensitive' } },
      ],
    },
  })

  if (!product) throw new Error('Product 48 Hair-GENTRON not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '48' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 48 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const expected = {
    productNumber: '48',
    nameRu: PRODUCT_48_RU_NAME,
    nameAr: PRODUCT_48_AR_NAME,
    description,
    descriptionRu: PRODUCT_48_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_48_AR_TRANSLATION.description,
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
    throw new Error(`Product 48 parity check failed: ${mismatches.join(', ')}`)
  }

  console.log(JSON.stringify({
    id: product.id,
    previousProductNumber: product.productNumber,
    changed,
    parity: 'verified',
  }, null, 2))
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
