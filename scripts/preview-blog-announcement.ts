/**
 * Renders the announcement email for a post, in all three languages, to
 * /tmp/blog-announce-<locale>.html — so the layout can be checked before a real
 * send goes to real subscribers.
 *
 * Run: npx tsx --env-file=.env.local scripts/preview-blog-announcement.ts <slug>
 */
import { writeFileSync } from 'fs'
import { prisma } from '../lib/prisma'
import { buildAnnouncementHtml, postCopy, LOCALES } from '../lib/blogAnnounceCopy'
import { emailTemplates } from '../lib/email/templates'

async function main() {
  const slug = process.argv[2]
  if (!slug) {
    console.error('Usage: preview-blog-announcement.ts <slug>')
    process.exit(1)
  }

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      titleRu: true,
      titleAr: true,
      excerpt: true,
      excerptRu: true,
      excerptAr: true,
      featuredImage: true,
    },
  })
  if (!post) {
    console.error(`No post with slug "${slug}".`)
    process.exit(1)
  }

  for (const locale of LOCALES) {
    const copy = postCopy(post, locale)
    const template = emailTemplates.newsletterCampaign({
      subject: copy.title,
      bodyHtml: buildAnnouncementHtml(copy, post.featuredImage, locale),
      unsubscribeUrl: 'https://genosys.ae/newsletter/unsubscribe?token=preview',
      locale,
    })
    const path = `/tmp/blog-announce-${locale}.html`
    writeFileSync(path, template.html)
    console.log(`${locale}: ${path}`)
    console.log(`    subject: ${template.subject}`)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
