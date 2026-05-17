import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const imagePath = path.join(process.cwd(), 'public', 'images', 'blog', 'kbeauty-delivery-tech-2026.jpg')
  const image = await readFile(imagePath)

  return new NextResponse(new Uint8Array(image), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
