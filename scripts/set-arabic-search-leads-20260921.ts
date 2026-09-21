import { prisma } from '@/lib/prisma'

// Arabic search copy pass 1: prepend a query-matched lead sentence to
// Product.descriptionAr for the five pages Search Console showed at positions
// 8 to 20 for Arabic queries. descriptionAr drives the /ar/ meta description
// (lib/seo.ts getLocalizedProductDescription), the mobile API and search, so
// the TS translation files alone were not enough. Idempotent: skips a product
// whose descriptionAr already starts with the lead.
//
//   npx tsx --env-file=.env.local scripts/set-arabic-search-leads-20260921.ts --apply
const LEADS: Record<string, string> = {
  '39': 'واقي شمس كوري (sun cream) يومي للإمارات بحماية SPF 50+ PA++++، خفيف على البشرة في حر دبي. حماية واسعة الطيف موثقة: ',
  '63': 'كريم ريفيتا جلو (Revita Glow) BB من GENOSYS: تغطية وحماية من الشمس وعناية بالبشرة في خطوة واحدة. ',
  '43': 'تونيك «ماتريكس» للشعر من GENOSYS: يُرش على فروة الرأس مباشرة، وليس حبوباً تُبلع، لتغذية الفروة وتكييف الشعر بإحساس منعش. ',
  '45': 'أمبولات «ماتريكس» للشعر من GENOSYS: محلول يُوضع على فروة الرأس، وليس حبوباً، في ثماني أمبولات للاستخدام المهني أو مع أداة التطبيق المنزلية. ',
  '3': 'هيرجن بوستر (HairGen BOOSTER) من GENOSYS: ',
}
// Product 39's existing text opens with the same clause the lead ends on.
const STRIP_PREFIX: Record<string, string> = { '39': 'كريم واقٍ من الشمس بحماية واسعة الطيف موثقة: ' }

const apply = process.argv.includes('--apply')

async function main() {
  for (const [productNumber, lead] of Object.entries(LEADS)) {
    const product = await prisma.product.findFirst({ where: { productNumber }, select: { id: true, name: true, descriptionAr: true } })
    if (!product) throw new Error(`No product ${productNumber}`)
    const current = (product.descriptionAr || '').trim()
    if (current.startsWith(lead.trim())) { console.log(`${productNumber} already has lead`); continue }
    const body = STRIP_PREFIX[productNumber] && current.startsWith(STRIP_PREFIX[productNumber])
      ? current.slice(STRIP_PREFIX[productNumber].length)
      : current
    const next = lead + body
    console.log(`${productNumber} ${product.name}\n  ${current.slice(0, 70)}...\n  -> ${next.slice(0, 110)}...`)
    if (apply) await prisma.product.update({ where: { id: product.id }, data: { descriptionAr: next } })
  }
  console.log(apply ? 'updated' : 'dry run. Re-run with --apply')
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
