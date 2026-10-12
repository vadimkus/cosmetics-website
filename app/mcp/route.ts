import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createGenosysMcpServer, MCP_SERVER_VERSION } from '@/lib/mcp/server'
import { rateLimitSimple } from '@/lib/rateLimitSimple'
import { errorLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
  'Access-Control-Max-Age': '86400',
}

const limiter = rateLimitSimple({ name: 'mcp', windowMs: 60_000, max: 120, memoryOnly: true })

function withCors(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v)
  headers.set('Cache-Control', 'no-store')
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function clientId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function jsonRpcError(status: number, message: string): Response {
  return withCors(
    Response.json({ jsonrpc: '2.0', error: { code: -32000, message }, id: null }, { status })
  )
}

// Stateless: a fresh server and transport per request, so it runs on any instance.
async function handle(request: Request): Promise<Response> {
  const limit = await limiter(clientId(request))
  if (!limit.success) return jsonRpcError(429, 'Too many requests, slow down.')

  const server = createGenosysMcpServer()
  const transport = new WebStandardStreamableHTTPServerTransport({ enableJsonResponse: true })
  try {
    await server.connect(transport)
    return withCors(await transport.handleRequest(request))
  } catch (error) {
    errorLog('[MCP] request failed', error)
    return jsonRpcError(500, 'Internal server error')
  } finally {
    void transport.close().catch(() => {})
    void server.close().catch(() => {})
  }
}

export async function POST(request: Request) {
  return handle(request)
}

export async function GET(request: Request) {
  // No server-initiated stream in stateless mode. A browser gets a short pointer instead.
  if ((request.headers.get('accept') || '').includes('text/event-stream')) {
    return withCors(new Response(null, { status: 405, headers: { Allow: 'POST, OPTIONS' } }))
  }
  return withCors(
    Response.json({
      name: 'GENOSYS UAE MCP server',
      version: MCP_SERVER_VERSION,
      transport: 'streamable-http',
      endpoint: 'https://genosys.ae/mcp',
      docs: 'https://genosys.ae/ai',
      tools: ['search_products', 'get_product', 'recommend_routine', 'list_categories', 'create_bag_link', 'store_info', 'search', 'fetch'],
    })
  )
}

export async function DELETE() {
  return withCors(new Response(null, { status: 405, headers: { Allow: 'POST, OPTIONS' } }))
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }))
}
