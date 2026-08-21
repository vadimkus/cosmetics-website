import { prisma } from '../lib/prisma'
import {
  PRODUCT_50_AR_NAME,
  PRODUCT_50_AR_TRANSLATION,
  PRODUCT_50_RU_NAME,
  PRODUCT_50_RU_TRANSLATION,
} from '../data/product50LocalizedCopy'

const description =
  'A complete four-step EyeCell ritual for a fresher, smoother and more even-looking eye contour: Eye Contour Serum 10 ml, the kit-only GENOSYS Eye Roller 0.25 mm with 60 needles, Eye Peptide Gel Patch 101 g / 60 pieces, and Eye Contour Cream 20 g. Cleanse, apply serum and use the roller, wear the patches for 20-40 minutes, then finish with cream. Serum and cream contain arbutin 2% + adenosine 0.04%; patches contain niacinamide 2% + adenosine 0.04%. Dermatologically tested.'

const productDetails = JSON.stringify({
  form: 'Four-piece complete eye-contour care kit',
  contents: 'Eye Contour Serum 10 ml · Eye Roller 0.25 mm · Eye Peptide Gel Patch 101 g / 60 pieces · Eye Contour Cream 20 g',
  careFocus: 'The appearance of wrinkles, dark circles and puffiness, with moisturizing and soothing care',
  functionalActives: 'Serum and cream: arbutin 2% + adenosine 0.04% · patches: niacinamide 2% + adenosine 0.04%',
  roller: 'One-body eye-contour roller · 60 needles · 0.25 mm · carton contraindication names stainless-steel allergy',
  rollerCare: 'Reusable: disinfect for five minutes in chlorhexidine solution before reuse; personal use only',
  protocol: 'Cleanse · serum and roller · patches for 20-40 minutes · cream',
  frequency: 'Individual schedule; the carton sets no universal roller frequency',
  testing: 'The kit and cosmetic components are dermatologically tested',
  origin: 'Made in Korea',
})

const keyFeatures = JSON.stringify([
  {
    title: 'Complete EyeCell ritual',
    description: 'Serum, roller, 60 hydrogel patches and cream form one precise eye-contour sequence.',
  },
  {
    title: 'Arbutin 2% + adenosine 0.04%',
    description: 'The functional pair in both serum and cream for tone and wrinkle care.',
  },
  {
    title: 'Niacinamide 2% + adenosine 0.04%',
    description: 'The functional pair in the moisturizing hydrogel patches.',
  },
  {
    title: 'Exclusive 0.25 mm eye roller',
    description: 'One-body design with 60 needles, available only in this kit and distinct from the 450-needle face roller.',
  },
])

const benefits = JSON.stringify([
  'Combines four sequential eye-contour care steps',
  'Supports a more even-looking tone and less visible dark circles',
  'Cares for visible wrinkles and a smoother-looking eye contour',
  'Moisturizes and soothes during the 20-40 minute hydrogel step',
  'Includes the kit-only GENOSYS EYE ROLLER 0.25 mm with 60 needles',
  'Finishes with a softening cream containing squalane and jojoba oil',
])

const ingredients = JSON.stringify([
  {
    name: 'Eye Contour Serum · 10 ml',
    description: 'Arbutin 2% and adenosine 0.04%. The leave-on serum is applied before the roller.',
  },
  {
    name: 'Eye Peptide Gel Patch · 101 g / 60 pieces',
    description: 'Niacinamide 2% and adenosine 0.04% in a moisturizing hydrogel base. Remove after 20-40 minutes.',
  },
  {
    name: 'Eye Contour Cream · 20 g',
    description: 'Arbutin 2% and adenosine 0.04%, with squalane 2.5% and jojoba oil 2%. Contains peanut oil.',
  },
])

const howToUse = JSON.stringify([
  {
    step: 'Cleanse',
    instruction: 'Remove make-up, cleanse the eye contour gently and pat dry.',
  },
  {
    step: 'Apply serum',
    instruction: 'Apply sufficient Eye Contour Serum under the eyes and brow bones, away from the eyelids and mucous membranes.',
  },
  {
    step: 'Use the roller',
    instruction: 'Roll horizontally and vertically over the serum for several minutes with extra care and no pressure. Stop if uncomfortable.',
  },
  {
    step: 'Apply patches for 20-40 minutes',
    instruction: 'Place under the eyes and/or brow bones, remove after 20-40 minutes and pat in the remaining essence.',
  },
  {
    step: 'Finish with cream',
    instruction: 'Apply a small amount of Eye Contour Cream and massage gently with fingertips until absorbed.',
  },
  {
    step: 'Prepare the roller for reuse',
    instruction: 'Before reuse, disinfect the roller for five minutes in chlorhexidine solution. Never share it.',
  },
])

const directions =
  'For external use only. Do not use the kit during pregnancy or lactation; the carton warning applies to the whole kit. The cream contains peanut oil, so do not use the kit with a peanut allergy. Do not use the roller with keloid tendency, stainless-steel allergy or dermatitis, or on damaged, infected or irritated skin. Keep products and roller away from eyes and mucous membranes; rinse thoroughly with cool water after contact. If you react to plasters or compresses, assess patch tolerance first. Stop use and seek medical advice for redness, swelling, itching or persistent irritation. Store cool and dry, away from direct sun and children. The carton does not set a universal roller frequency.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { productNumber: '50' },
        { id: '50' },
        { name: { contains: 'EYE ZONE CARE KIT', mode: 'insensitive' } },
      ],
    },
  })

  if (!product) throw new Error('Product 50 EyeCell EYE ZONE CARE KIT not found')

  const numberOwner = await prisma.product.findUnique({
    where: { productNumber: '50' },
    select: { id: true, name: true },
  })
  if (numberOwner && numberOwner.id !== product.id) {
    throw new Error(`productNumber 50 already belongs to ${numberOwner.id} (${numberOwner.name})`)
  }

  const expected = {
    productNumber: '50',
    nameRu: PRODUCT_50_RU_NAME,
    nameAr: PRODUCT_50_AR_NAME,
    description,
    descriptionRu: PRODUCT_50_RU_TRANSLATION.description,
    descriptionAr: PRODUCT_50_AR_TRANSLATION.description,
    productDetails,
    keyFeatures,
    benefits,
    ingredients,
    howToUse,
    directions,
    size: '4-piece kit',
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
    throw new Error(`Product 50 parity check failed: ${mismatches.join(', ')}`)
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
