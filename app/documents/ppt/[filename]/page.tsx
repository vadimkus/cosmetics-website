import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import PDFViewerClient from '@/components/PDFViewerClient'

interface PageProps {
  params: Promise<{ filename: string }>
}

async function resolvePdf(filename: string) {
  const decodedFilename = decodeURIComponent(filename)
  const isSafeName =
    !decodedFilename.includes('..') &&
    !decodedFilename.includes('/') &&
    decodedFilename.toLowerCase().endsWith('.pdf')
  if (!isSafeName) return null

  const filePath = path.join(process.cwd(), 'public', 'documents', 'PPT', decodedFilename)
  try {
    await fs.access(filePath)
    return decodedFilename
  } catch {
    return null
  }
}

export default async function PDFViewerPage({ params }: PageProps) {
  const { filename } = await params
  const decodedFilename = await resolvePdf(filename)

  if (!decodedFilename) {
    notFound()
  }

  const pdfUrl = `/documents/PPT/${encodeURIComponent(decodedFilename)}`

  return (
    <PDFViewerClient
      filename={decodedFilename}
      pdfUrl={pdfUrl}
    />
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { filename } = await params
  const decodedFilename = decodeURIComponent(filename)

  return {
    title: `${decodedFilename.replace('.pdf', '')} - Genosys Middle East FZ-LLC`,
    description: `View ${decodedFilename} from Genosys Middle East FZ-LLC`,
  }
}
