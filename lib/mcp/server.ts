/**
 * GENOSYS MCP server: lets AI assistants (ChatGPT, Claude, Cursor...) browse the
 * catalog, explain products, suggest a routine and hand the shopper a link that
 * fills their bag on genosys.ae. Read-only: nothing here changes data.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { Product } from '@/types'
import { prisma } from '@/lib/prisma'
import { getProductsListCached, getSkinRecommendations } from '@/lib/productsDb'
import { MOBILE_CHECKOUT_CONFIG } from '@/lib/mobileCheckoutConfig'
import {
  SITE_ORIGIN,
  asLocale,
  buildBagLink,
  categoriesOf,
  concernsOf,
  productDetail,
  productSlug,
  productUrl,
  resolveSelection,
  searchProducts,
  stripHtml,
  summarizeProduct,
  type McpLocale,
} from '@/lib/mcp/catalog'

export const MCP_SERVER_NAME = 'genosys'
export const MCP_SERVER_VERSION = '1.0.0'

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const

const INSTRUCTIONS = `GENOSYS is the official UAE distributor of GENOSYS professional Korean dermacosmetics (genosys.ae, Dubai).
Use these tools to answer skincare and haircare shopping questions with the live catalog.
- Prices are AED and already include 5% UAE VAT. Quote them as given; do not add VAT.
- Always give the product link. When the shopper is ready to buy, call create_bag_link and share that link: it opens genosys.ae with the items in their bag (they sign in or create a free account there to check out).
- Products are cosmetics, not medicines: do not promise medical results. For pregnancy, a skin condition or a reaction, suggest a doctor or dermatologist.
- Delivery is UAE only. Product names stay in English in every language.`

const localeInput = z
  .enum(['en', 'ru', 'ar'])
  .optional()
  .describe('Language of descriptions and links: en (default), ru or ar. Product names stay in English.')

function json(data: unknown) {
  const structured = (Array.isArray(data) ? { results: data } : data) as Record<string, unknown>
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: structured,
  }
}

function errorResult(message: string) {
  return { content: [{ type: 'text' as const, text: message }], isError: true }
}

async function loadProducts(): Promise<Product[]> {
  const products = await getProductsListCached()
  return products.filter((p) => !p.isHidden)
}

function findProduct(products: Product[], id: string): Product | undefined {
  const key = String(id || '').trim().replace(/^product:/, '')
  return products.find((p) => productSlug(p) === key || p.id === key || p.productNumber === key)
}

function storeInfo(locale: McpLocale) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  return {
    company: 'Genosys Middle East FZ-LLC, official UAE distributor of GENOSYS (Korea) since 2019',
    website: `${SITE_ORIGIN}${prefix}`,
    currency: 'AED, prices include 5% VAT',
    delivery: {
      area: 'United Arab Emirates only',
      times: 'Within 1-2 hours in Dubai, 24-36 hours to the other emirates',
      free_delivery_from_aed: MOBILE_CHECKOUT_CONFIG.freeShippingThreshold,
      rates_aed: Object.fromEntries(MOBILE_CHECKOUT_CONFIG.emirates.map((e) => [e.name, e.shippingCost])),
      page: `${SITE_ORIGIN}${prefix}/delivery`,
    },
    payment: ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Cash on delivery'],
    returns:
      'Within 10 days of delivery for unused products in their original packaging. Refunds are processed within 3-5 business days. Contact GENOSYS to start a return.',
    contact: {
      whatsapp: '+971 58 548 76 65',
      whatsapp_link: 'https://wa.me/971585487665',
      email: 'sales@genosys.ae',
      contact_page: `${SITE_ORIGIN}${prefix}/contact`,
    },
    apps: {
      ios: 'https://apps.apple.com/app/id6756648064',
      android: 'https://play.google.com/store/apps/details?id=ae.genosys.app',
    },
    account: 'Checkout needs a free GENOSYS account (email, Google or Apple sign-in). Members earn GENOSYS Rewards points.',
    policies: {
      privacy: `${SITE_ORIGIN}/privacy-policy`,
      terms: `${SITE_ORIGIN}/terms`,
    },
  }
}

export function createGenosysMcpServer(): McpServer {
  const server = new McpServer(
    { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION, title: 'GENOSYS UAE' },
    { instructions: INSTRUCTIONS }
  )

  server.registerTool(
    'search_products',
    {
      title: 'Search GENOSYS products',
      description:
        'Search the live GENOSYS UAE catalog (Korean professional skincare, haircare, devices, beauty boxes). Use for any "what do you have for..." question. Accepts plain language in English, Russian or Arabic, plus optional filters. Returns name, price in AED (VAT included), size, stock, concerns and the product link.',
      inputSchema: {
        query: z.string().max(200).optional().describe('What the shopper wants, e.g. "serum for dry skin", "SPF cushion", "hair loss shampoo".'),
        category: z.string().max(60).optional().describe('Category filter, e.g. Serum, Cream, Mask, Cleanser, Toner/Mist, Sun, Cushion BB, Eye care, Scalp/Hair, Beauty Boxes, Device, Microneedling, PRO Solution. Call list_categories for the full list.'),
        concern: z.string().max(60).optional().describe('Skin concern, e.g. hydration, anti-aging, sensitivity, pore-care, brightening, acne-blemishes, eye-care, hair-loss, sun-protection.'),
        skin_type: z.enum(['dry', 'oily', 'combination', 'normal', 'sensitive', 'mature']).optional(),
        max_price_aed: z.number().positive().optional().describe('Only products at or below this price (AED, VAT included).'),
        in_stock_only: z.boolean().optional(),
        limit: z.number().int().min(1).max(25).optional().describe('Default 8.'),
        locale: localeInput,
      },
      annotations: READ_ONLY,
    },
    async (args) => {
      const locale = asLocale(args.locale)
      const products = await loadProducts()
      const found = searchProducts(products, args)
      return json({
        count: found.length,
        products: found.map((p) => summarizeProduct(p, locale)),
        note: found.length === 0 ? 'No match. Try a broader query, or list_categories.' : undefined,
      })
    }
  )

  server.registerTool(
    'get_product',
    {
      title: 'Get GENOSYS product details',
      description:
        'Full details for one product: description, key features, benefits, key ingredients and actives, step-by-step how to use, sizes or shades with prices, and an add-to-bag link. Use the id from search_products (e.g. "18" or "68").',
      inputSchema: {
        product_id: z.string().min(1).max(64).describe('Product id from search_products, e.g. "18".'),
        locale: localeInput,
      },
      annotations: READ_ONLY,
    },
    async ({ product_id, locale }) => {
      const products = await loadProducts()
      const product = findProduct(products, product_id)
      if (!product) return errorResult(`No GENOSYS product with id "${product_id}". Use search_products to find the id.`)
      return json(productDetail(product, asLocale(locale)))
    }
  )

  server.registerTool(
    'recommend_routine',
    {
      title: 'Recommend a GENOSYS routine',
      description:
        "Ranked product picks for a shopper's skin type and concerns, the same scoring as the skin quiz on genosys.ae. Use when someone describes their skin and asks what to use.",
      inputSchema: {
        skin_type: z.enum(['dry', 'oily', 'combination', 'normal', 'sensitive']).optional(),
        concerns: z
          .array(z.string().max(40))
          .max(6)
          .optional()
          .describe('e.g. ["hydration","anti-aging"]. Tags: hydration, anti-aging, sensitivity, pore-care, brightening, acne-blemishes, eye-care, hair, hair-loss.'),
        age_group: z.enum(['teen', 'young-adult', 'adult', 'mature']).optional(),
        at_home_only: z.boolean().optional().describe('True (default) leaves out professional clinic-only products.'),
        limit: z.number().int().min(1).max(12).optional().describe('Default 6.'),
        locale: localeInput,
      },
      annotations: READ_ONLY,
    },
    async ({ skin_type, concerns, age_group, at_home_only, limit, locale }) => {
      const loc = asLocale(locale)
      const picks = await getSkinRecommendations({
        ...(skin_type && { skinType: skin_type }),
        ...(age_group && { ageGroup: age_group }),
        ...(concerns?.length && { targetConcerns: concerns }),
        usage: at_home_only === false ? '' : 'at-home',
      })
      const top = picks.filter((p) => !p.isHidden).slice(0, limit ?? 6)
      return json({
        count: top.length,
        products: top.map((p) => summarizeProduct(p, loc)),
        bag_link_for_all: top.length ? buildBagLink(top.map((p) => ({ product_id: productSlug(p), quantity: 1 }))) : undefined,
        skin_quiz: `${SITE_ORIGIN}${loc === 'en' ? '' : `/${loc}`}/skin-recommendation`,
      })
    }
  )

  server.registerTool(
    'list_categories',
    {
      title: 'List GENOSYS categories',
      description: 'All product categories and skin concerns in the live catalog, with product counts. Use to orient before searching.',
      inputSchema: {},
      annotations: READ_ONLY,
    },
    async () => {
      const products = await loadProducts()
      const categories = new Map<string, number>()
      const concerns = new Map<string, number>()
      for (const p of products) {
        for (const c of categoriesOf(p)) categories.set(c, (categories.get(c) || 0) + 1)
        for (const c of concernsOf(p)) concerns.set(c, (concerns.get(c) || 0) + 1)
      }
      const sorted = (m: Map<string, number>) =>
        [...m.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
      return json({ total_products: products.length, categories: sorted(categories), concerns: sorted(concerns) })
    }
  )

  server.registerTool(
    'create_bag_link',
    {
      title: 'Create a GENOSYS bag link',
      description:
        'Build one link that opens genosys.ae with these items already in the shopper\'s bag, ready to check out. Use when the shopper decides to buy. Products with sizes or shades (see get_product options) need one picked: pass size, or color as its label or value (e.g. "#01 Bright").',
      inputSchema: {
        items: z
          .array(
            z.object({
              product_id: z.string().min(1).max(64),
              quantity: z.number().int().min(1).max(20).optional(),
              size: z.string().max(40).optional(),
              color: z.string().max(60).optional(),
            })
          )
          .min(1)
          .max(20),
      },
      annotations: READ_ONLY,
    },
    async ({ items }) => {
      const products = await loadProducts()
      const lines = []
      for (const item of items) {
        const product = findProduct(products, item.product_id)
        if (!product) return errorResult(`No GENOSYS product with id "${item.product_id}".`)
        if (!product.inStock) return errorResult(`${product.name} is out of stock right now.`)
        if (product.isPriceOnRequest) return errorResult(`${product.name} is a professional product sold on request: contact GENOSYS on WhatsApp +971 58 548 76 65.`)
        const picked = resolveSelection(product, item.size, item.color)
        if (!picked.ok) return errorResult(picked.error)
        lines.push({ product, qty: item.quantity ?? 1, size: picked.size, color: picked.color, unit: picked.price_aed })
      }
      const subtotal = lines.reduce((sum, l) => sum + (l.unit || 0) * l.qty, 0)
      return json({
        bag_url: buildBagLink(lines.map((l) => ({ product_id: productSlug(l.product), quantity: l.qty, size: l.size, color: l.color }))),
        items: lines.map((l) => ({ id: productSlug(l.product), name: l.product.name, quantity: l.qty, size: l.size, color: l.color, unit_price_aed: l.unit })),
        estimated_subtotal_aed: Math.round(subtotal * 100) / 100,
        delivery:
          subtotal >= MOBILE_CHECKOUT_CONFIG.freeShippingThreshold
            ? 'Free UAE delivery (order over AED 1,000)'
            : `Delivery AED 45 in Dubai, AED 70 other emirates; free from AED ${MOBILE_CHECKOUT_CONFIG.freeShippingThreshold}`,
        note: 'The shopper signs in or creates a free account on genosys.ae, then checks out. Final prices are confirmed at checkout.',
      })
    }
  )

  server.registerTool(
    'store_info',
    {
      title: 'GENOSYS store information',
      description: 'Delivery areas, times and fees, payment methods, returns, contact (WhatsApp, email), apps and policies for GENOSYS UAE.',
      inputSchema: { locale: localeInput },
      annotations: READ_ONLY,
    },
    async ({ locale }) => json(storeInfo(asLocale(locale)))
  )

  server.registerTool(
    'search',
    {
      title: 'Search GENOSYS',
      description:
        'Search GENOSYS products and skincare articles. Returns ids to pass to fetch. ("product:<id>" for products, "blog:<slug>" for articles.)',
      inputSchema: { query: z.string().min(1).max(200) },
      annotations: READ_ONLY,
    },
    async ({ query }) => {
      const [products, posts] = await Promise.all([loadProducts(), searchBlog(query, 5)])
      const results = [
        ...searchProducts(products, { query, limit: 8 }).map((p) => ({
          id: `product:${productSlug(p)}`,
          title: p.name,
          url: productUrl(p, 'en'),
        })),
        ...posts.map((post) => ({ id: `blog:${post.slug}`, title: post.title, url: `${SITE_ORIGIN}/blog/${post.slug}` })),
      ]
      return json({ results })
    }
  )

  server.registerTool(
    'fetch',
    {
      title: 'Fetch a GENOSYS product or article',
      description: 'Full text of a result from search, by id ("product:18" or "blog:<slug>").',
      inputSchema: { id: z.string().min(1).max(200) },
      annotations: READ_ONLY,
    },
    async ({ id }) => {
      if (id.startsWith('blog:')) {
        const slug = id.slice(5)
        const post = await prisma.blogPost.findFirst({ where: { slug, published: true } })
        if (!post) return errorResult(`No article "${slug}".`)
        return json({
          id,
          title: post.title,
          url: `${SITE_ORIGIN}/blog/${post.slug}`,
          text: stripHtml(post.content).slice(0, 20000),
          metadata: { published: post.publishedAt?.toISOString() ?? null, excerpt: post.excerpt ?? null },
        })
      }
      const products = await loadProducts()
      const product = findProduct(products, id)
      if (!product) return errorResult(`No product "${id}".`)
      const detail = productDetail(product, 'en')
      const text = [
        `${detail.name} (${detail.category.join(', ')})${detail.size ? `, ${detail.size}` : ''}`,
        detail.price_aed != null ? `Price: AED ${detail.price_aed} incl. VAT${detail.original_price_aed ? ` (was AED ${detail.original_price_aed})` : ''}` : detail.price_note,
        detail.in_stock ? 'In stock' : 'Out of stock',
        '',
        detail.description,
        detail.key_features.length ? `\nKey features:\n- ${detail.key_features.join('\n- ')}` : '',
        detail.ingredients_and_actives.length ? `\nKey ingredients:\n- ${detail.ingredients_and_actives.join('\n- ')}` : '',
        detail.how_to_use.length ? `\nHow to use:\n- ${detail.how_to_use.join('\n- ')}` : '',
        detail.options.length ? `\nOptions:\n- ${detail.options.map((o) => [o.size, o.color, `AED ${o.price_aed}`].filter(Boolean).join(' / ')).join('\n- ')}` : '',
        `\nAdd to bag: ${detail.add_to_bag_url}`,
      ].join('\n')
      return json({ id: `product:${detail.id}`, title: detail.name, url: detail.url, text, metadata: { price_aed: detail.price_aed, in_stock: detail.in_stock } })
    }
  )

  return server
}

async function searchBlog(query: string, take: number) {
  const words = query.split(/\s+/).filter((w) => w.length > 2).slice(0, 5)
  if (words.length === 0) return []
  return prisma.blogPost.findMany({
    where: {
      published: true,
      OR: words.flatMap((w) => [
        { title: { contains: w, mode: 'insensitive' as const } },
        { excerpt: { contains: w, mode: 'insensitive' as const } },
        { titleRu: { contains: w, mode: 'insensitive' as const } },
      ]),
    },
    select: { slug: true, title: true },
    orderBy: { publishedAt: 'desc' },
    take,
  })
}
