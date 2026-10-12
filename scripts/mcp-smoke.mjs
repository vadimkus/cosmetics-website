// Drives the GENOSYS MCP server with the official client.
// Usage: node scripts/mcp-smoke.mjs [https://genosys.ae/mcp]
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const url = new URL(process.argv[2] || 'http://localhost:3077/mcp')
const client = new Client({ name: 'genosys-smoke', version: '1.0.0' })
await client.connect(new StreamableHTTPClientTransport(url))

const info = client.getServerVersion()
console.log('server:', info?.name, info?.version)
console.log('instructions:', (client.getInstructions() || '').slice(0, 80), '…')

const { tools } = await client.listTools()
console.log('tools:', tools.map((t) => `${t.name}${t.annotations?.readOnlyHint ? ' (read-only)' : ''}`).join(', '))

const call = async (name, args) => {
  const t0 = Date.now()
  const res = await client.callTool({ name, arguments: args })
  const data = res.structuredContent ?? res.content?.[0]?.text
  console.log(`\n# ${name} ${JSON.stringify(args)} ${res.isError ? 'ERROR' : 'ok'} ${Date.now() - t0}ms`)
  return { res, data }
}

let r = await call('search_products', { query: 'serum for dry skin', limit: 4 })
console.log(r.data.products.map((p) => `${p.id} ${p.name} AED ${p.price_aed} ${p.url}`).join('\n'))

r = await call('search_products', { query: 'крем от морщин', locale: 'ru', limit: 3 })
console.log(r.data.products.map((p) => `${p.id} ${p.name} AED ${p.price_aed} ${p.url}`).join('\n'))

r = await call('search_products', { category: 'Sun', max_price_aed: 200 })
console.log(r.data.products.map((p) => `${p.id} ${p.name} AED ${p.price_aed}`).join('\n'))

r = await call('get_product', { product_id: '68' })
const d = r.data
console.log(d.name, '| AED', d.price_aed, 'was', d.original_price_aed, d.discount_percent + '%', '| options:', JSON.stringify(d.options), '\nhow_to_use:', d.how_to_use.slice(0, 2), '\nbag:', d.add_to_bag_url)

r = await call('recommend_routine', { skin_type: 'oily', concerns: ['acne-blemishes', 'pore-care'], limit: 4 })
console.log(r.data.products.map((p) => `${p.id} ${p.name}`).join('\n'), '\n', r.data.bag_link_for_all)

r = await call('list_categories', {})
console.log(r.data.total_products, 'products;', r.data.categories.map((c) => `${c.name}:${c.count}`).join(' '))

r = await call('create_bag_link', { items: [{ product_id: '68', color: '#01 Bright' }, { product_id: '18', quantity: 2 }] })
console.log(r.data)

r = await call('store_info', { locale: 'ru' })
console.log(r.data.delivery, r.data.contact.whatsapp)

r = await call('search', { query: 'glass skin' })
console.log(r.data.results)

r = await call('fetch', { id: r.data.results.find((x) => x.id.startsWith('blog:'))?.id || 'product:18' })
console.log(r.data.title, '|', r.data.text.slice(0, 160).replace(/\n/g, ' '))

r = await call('get_product', { product_id: 'does-not-exist' })
console.log(r.res.content[0].text)

await client.close()
