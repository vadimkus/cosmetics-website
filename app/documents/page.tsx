import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Professional Documents - GENOSYS Middle East FZ-LLC',
  description: 'Download professional product documentation, presentations, and technical data sheets for GENOSYS Korean dermacosmetics.',
  alternates: {
    canonical: 'https://genosys.ae/documents',
  },
}

const documents = [
  { name: 'GENOSYS Business presentation', category: 'Business' },
  { name: 'SKIN REBOOT PDRN MASK PACK', category: 'Mask' },
  { name: 'GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK', category: 'Mask' },
  { name: 'GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK', category: 'Mask' },
  { name: 'GENOSYS EyeCell EYE PEPTIDE GEL PATCH', category: 'Eye Care' },
  { name: 'GENOSYS EyeCell EYE ZONE CARE SYSTEM', category: 'Eye Care' },
  { name: 'GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA', category: 'Hair Care' },
  { name: 'GENOSYS HR3 MATRIX HAIR TONIC ALPHA', category: 'Hair Care' },
  { name: 'GENOSYS HR3 MATRIX SCALP PEELING ALPHA', category: 'Hair Care' },
  { name: 'GENOSYS HR3 MATRIX SCALP SHAMPOO ALPHA', category: 'Hair Care' },
  { name: 'HAIR GENTRON', category: 'Hair Care' },
  { name: 'GENOSYS INTENSIVE PROBLEM CONTROL TONER', category: 'Skincare' },
  { name: 'GENOSYS MICROBIOME ENERGY INFUSING MIST', category: 'Skincare' },
  { name: 'GENOSYS MOISTURE REPLENISHING HYALURON CREAM', category: 'Skincare' },
  { name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM', category: 'Skincare' },
  { name: 'GENOSYS MULTI VITA RADIANCE CREAM', category: 'Skincare' },
  { name: 'GENOSYS MULTI VITA RADIANCE SERUM', category: 'Skincare' },
  { name: 'GENOSYS EPI TURNOVER BOOSTING PEELING GEL', category: 'Peeling' },
  { name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION', category: 'Sun & BB' },
  { name: 'GENOSYS ULTRA SHIELD SUN CREAM', category: 'Sun & BB' },
  { name: 'GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER', category: 'Cleanser' },
]

export default function DocumentsPage() {
  // Group documents by category
  const grouped = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category]!.push(doc)
    return acc
  }, {})

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Professional Documents
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download product documentation, presentations, and technical data sheets for GENOSYS professional Korean dermacosmetics.
            </p>
          </div>

          {Object.entries(grouped).map(([category, docs]) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {category}
              </h2>
              <div className="grid gap-3">
                {docs.map((doc) => (
                  <Link
                    key={doc.name}
                    href={`/documents/PPT/${encodeURIComponent(doc.name + '.pdf')}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                  >
                    <FileText className="h-5 w-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                    <span className="text-gray-700 group-hover:text-primary-700 font-medium">
                      {doc.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
