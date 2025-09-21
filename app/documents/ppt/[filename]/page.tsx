import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'

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
    'GENOSYS SKIN REBOOT PDRN MASK PACK.pdf',
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
    <div className="bg-white min-h-screen">
      {/* Header with navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {decodedFilename.replace('.pdf', '')}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </a>
              <a
                href={pdfUrl}
                download={decodedFilename}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            title={decodedFilename}
          />
        </div>
        
        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>If the PDF doesn't load properly, try opening it in a new tab or downloading it.</p>
        </div>
      </div>
    </div>
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
