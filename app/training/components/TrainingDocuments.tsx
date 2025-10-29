import { Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import { TrainingDocument } from '../types/training'

interface TrainingDocumentsProps {
  documents: TrainingDocument[]
  title: string
}

export default function TrainingDocuments({ documents, title }: TrainingDocumentsProps) {
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {title}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <div 
            key={document.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {document.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{document.fileSize}</span>
              </div>
            </div>
            
            <PDFDownloadButton
              href={document.downloadUrl}
              filename={document.title}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              View PDF
            </PDFDownloadButton>
          </div>
        ))}
      </div>
    </div>
  )
}
