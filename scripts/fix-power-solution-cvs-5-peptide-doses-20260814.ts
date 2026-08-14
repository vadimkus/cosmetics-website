/**
 * Second pass on product 5, after reading the aggregated percentage table in
 * the January 2021 safety assessment rather than the raw-material table above
 * it.
 *
 * The raw-material table lists a peptide premix, CTD-NANO CLAIRE-GY-II, at
 * 0.1% of the formula. That is the premix, not the peptide. The aggregated
 * table on page 21 gives the finished concentrations:
 *
 *   sh-Polypeptide-7        0.0001%    =  1 ppm
 *   Palmitoyl Tripeptide-1  0.00005%   =  0.5 ppm
 *
 * Both are normal for a cosmetic peptide - the CIR panel puts typical use of
 * the palmitoyl tripeptide family under 10 ppm - but the cards have to carry
 * the figure, because every other ingredient on this page carries one and a
 * card without a number next to eight cards with numbers reads as a hidden one.
 *
 * The dossier also describes sh-Polypeptide-7 properly, and it is a better
 * claim than the COSING classification the first pass used: "a single chain
 * recombinant human peptide, produced by fermentation in E. coli. The starting
 * gene is a synthesized copy of the human gene which codes for Somatotropin...
 * It contains a maximum of 217 amino acids." The carton says the same thing in
 * marketing language. That is the identity claim, and it is worth printing.
 *
 * Also removes the main image from the `images` gallery array: the gallery
 * prepends product.image, so listing it again is a duplicate the layout has to
 * dedupe. See the product-gallery-images rule.
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as any)

const APPLY = process.argv.includes('--apply')

const SH_POLYPEPTIDE_7 = {
  en: {
    name: 'sh-Polypeptide-7 (1 ppm)',
    description:
      'The signature peptide of the Power Solution range. A single-chain recombinant human peptide grown by fermentation, from a synthesised copy of the human gene that codes for somatotropin, so every batch arrives with the same 217-amino-acid sequence instead of varying the way a plant extract does. Peptides are dosed in parts per million, and this one is at 1 ppm.',
  },
  ru: {
    name: 'sh-Polypeptide-7 (1 ppm)',
    description:
      'Фирменный пептид линии Power Solution. Одноцепочечный рекомбинантный человеческий пептид, полученный ферментацией по синтезированной копии человеческого гена соматотропина, поэтому каждая партия приходит с одной и той же последовательностью из 217 аминокислот, а не меняется от сбора к сбору, как растительный экстракт. Пептиды дозируются в частях на миллион, и здесь это 1 ppm.',
  },
  ar: {
    name: 'sh-Polypeptide-7 (جزء واحد في المليون)',
    description:
      'الببتيد المميّز لمجموعة Power Solution. ببتيد بشري مُعاد تركيبه أحادي السلسلة، يُنتَج بالتخمير انطلاقاً من نسخة مُصنَّعة من الجين البشري المسؤول عن السوماتوتروبين، فتأتي كل دفعة بالتسلسل نفسه المكوَّن من 217 حمضاً أمينياً بدل أن تتغيّر كما يتغيّر المستخلص النباتي. تُجرَّع الببتيدات بأجزاء من المليون، وهنا جزء واحد في المليون.',
  },
}

const PALMITOYL_TRIPEPTIDE_1 = {
  en: {
    name: 'Palmitoyl Tripeptide-1 (0.5 ppm)',
    description:
      'A three-amino-acid peptide anchored to a fatty acid so it stays where it is put, and one of the most studied peptides in cosmetic use. The CIR expert panel puts typical use across this family under 10 ppm.',
  },
  ru: {
    name: 'Palmitoyl Tripeptide-1 (0,5 ppm)',
    description:
      'Пептид из трёх аминокислот, закреплённый на жирной кислоте, чтобы оставаться там, куда нанесён, и один из самых изученных пептидов в косметике. Экспертная панель CIR указывает типичное применение этого семейства ниже 10 ppm.',
  },
  ar: {
    name: 'Palmitoyl Tripeptide-1 (0.5 جزء في المليون)',
    description:
      'ببتيد من ثلاثة أحماض أمينية مرتبط بحمض دهني ليبقى في موضعه، وهو من أكثر الببتيدات دراسةً في مستحضرات التجميل. تضع لجنة خبراء CIR الاستخدام المعتاد لهذه العائلة دون 10 أجزاء في المليون.',
  },
}

interface Card {
  name: string
  description: string
}

/** Replaces the first two cards, which are the two peptides in every locale. */
function patchCards(raw: string, locale: 'en' | 'ru' | 'ar'): string {
  const cards = JSON.parse(raw) as Card[]
  if (!/olypeptide-7/.test(cards[0]?.name ?? '')) {
    throw new Error(`${locale}: card 0 is "${cards[0]?.name}", expected sh-Polypeptide-7`)
  }
  if (!/ripeptide-1/.test(cards[1]?.name ?? '')) {
    throw new Error(`${locale}: card 1 is "${cards[1]?.name}", expected Palmitoyl Tripeptide-1`)
  }
  cards[0] = SH_POLYPEPTIDE_7[locale]
  cards[1] = PALMITOYL_TRIPEPTIDE_1[locale]
  return JSON.stringify(cards)
}

async function main() {
  const product =
    (await prisma.product.findFirst({ where: { productNumber: '5' } })) ||
    (await prisma.product.findUnique({ where: { id: '5' } }))
  if (!product) throw new Error('product 5 not found')

  const gallery: string[] = JSON.parse(product.images || '[]')
  const images = JSON.stringify(gallery.filter(src => src !== product.image))

  const data = {
    ingredients: patchCards(product.ingredients || '[]', 'en'),
    images,
  }

  if (!APPLY) {
    console.log('DRY RUN - pass --apply to write\n')
    for (const [k, v] of Object.entries(data)) console.log(`--- ${k} ---\n${v}\n`)
    return
  }

  await prisma.product.update({ where: { id: product.id }, data })
  console.log(`updated product ${product.id} (${product.name})`)
}

main()
  .catch(e => {
    console.error(e.message ?? e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
