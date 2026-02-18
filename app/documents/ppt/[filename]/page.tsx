import { notFound } from 'next/navigation'
import PDFViewerClient from '@/components/PDFViewerClient'

interface PageProps {
  params: Promise<{ filename: string }>
}

export default async function PDFViewerPage({ params }: PageProps) {
  const { filename } = await params
  
  // Decode the filename from URL encoding
  const decodedFilename = decodeURIComponent(filename)
  
  // List of valid PDF files
  const validPDFs = [
    'GENOSYS Business presentation.pdf',
    'SKIN REBOOT PDRN MASK PACK.pdf',
    'GENOSYS HR3 MATRIX SCALP PEELING ALPHA.pdf',
    'GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf',
    'GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf',
    'GENOSYS EyeCell EYE PEPTIDE GEL PATCH.pdf',
    'GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf',
    'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA.pdf',
    'GENOSYS HR3 MATRIX HAIR TONIC ALPHA.pdf',
    'GENOSYS HR3 MATRIX SCALP PEELING ALPHA.pdf',
    'GENOSYS HR3 MATRIX SCALP SHAMPOO ALPHA.pdf',
    'GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf',
    'GENOSYS MICROBIOME ENERGY INFUSING MIST.pdf',
    'GENOSYS MOISTURE REPLENISHING HYALURON CREAM.pdf',
    'GENOSYS MOISTURE REPLENISHING HYALURON SERUM.pdf',
    'GENOSYS MULTI VITA RADIANCE CREAM.pdf',
    'GENOSYS MULTI VITA RADIANCE SERUM.pdf',
    'GENOSYS SKIN CARING BLEMISH BALM CUSHION.pdf',
    'GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf',
    'GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pdf',
    'GENOSYS ULTRA SHIELD SUN CREAM.pdf',
    'HAIR GENTRON.pdf'
  ]
  
  // Check if the requested PDF is valid
  if (!validPDFs.includes(decodedFilename)) {
    notFound()
  }
  
  const pdfUrl = `/documents/ppt/${encodeURIComponent(decodedFilename)}`
  
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
