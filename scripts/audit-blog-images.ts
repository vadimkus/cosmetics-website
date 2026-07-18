/**
 * Read-only audit for all published blog hero and inline images.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/audit-blog-images.ts
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { prisma } from '../lib/prisma'

type Locale = 'EN' | 'AR' | 'RU'
type ImageRef = {
  slug: string
  locale: Locale | 'HERO'
  src: string
  kind: 'hero' | 'inline'
}

const IMAGE_RE = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi

function inlineImages(html: string | null): string[] {
  if (!html) return []
  const refs: string[] = []
  let match: RegExpExecArray | null
  while ((match = IMAGE_RE.exec(html))) refs.push(match[1])
  IMAGE_RE.lastIndex = 0
  return refs
}

function localFile(src: string): string | null {
  const clean = src.split('?')[0]
  if (!clean.startsWith('/')) return null
  if (clean.startsWith('/_next/')) return null
  return join(process.cwd(), 'public', clean)
}

async function dimensions(path: string): Promise<string> {
  const meta = await sharp(path).metadata()
  return meta.width && meta.height
    ? `${meta.width}×${meta.height} (${(meta.width / meta.height).toFixed(3)})`
    : 'unknown'
}

async function main() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      slug: true,
      featuredImage: true,
      content: true,
      contentAr: true,
      contentRu: true,
    },
    orderBy: { publishedAt: 'desc' },
  })

  const refs: ImageRef[] = []
  for (const post of posts) {
    if (post.featuredImage) {
      refs.push({
        slug: post.slug,
        locale: 'HERO',
        src: post.featuredImage,
        kind: 'hero',
      })
    }
    for (const [locale, html] of [
      ['EN', post.content],
      ['AR', post.contentAr],
      ['RU', post.contentRu],
    ] as const) {
      for (const src of inlineImages(html)) {
        refs.push({ slug: post.slug, locale, src, kind: 'inline' })
      }
    }
  }

  let broken = 0
  let remote = 0
  console.log(`Published posts: ${posts.length}`)
  console.log(`Image references: ${refs.length}\n`)

  for (const ref of refs) {
    const path = localFile(ref.src)
    if (!path) {
      remote += 1
      console.log(`REMOTE  ${ref.locale.padEnd(4)} ${ref.slug} → ${ref.src}`)
      continue
    }
    if (!existsSync(path)) {
      broken += 1
      console.log(`BROKEN  ${ref.locale.padEnd(4)} ${ref.slug} → ${ref.src}`)
      continue
    }
    if (ref.kind === 'hero') {
      console.log(
        `HERO    ${ref.slug} → ${ref.src} → ${await dimensions(path)}`
      )
    }
  }

  const unique = new Set(refs.map((ref) => ref.src))
  console.log('\nSummary')
  console.log(`- Unique image paths: ${unique.size}`)
  console.log(`- Broken local paths: ${broken}`)
  console.log(`- Remote paths (manual check): ${remote}`)

  if (broken > 0) process.exitCode = 1
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
