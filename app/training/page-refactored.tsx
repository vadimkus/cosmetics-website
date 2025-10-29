import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import TrainingNavigation from './components/TrainingNavigation'
import TrainingHeader from './components/TrainingHeader'
import TrainingContent from './components/TrainingContent'
import { trainingDocuments, productDocuments, trainingVideos } from './data/trainingData'
import { trainingMetadata } from './data/trainingMetadata'

export const metadata = trainingMetadata

export default function TrainingPageRefactored() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Training', url: '/training' }
        ]}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <TrainingNavigation />
          <TrainingHeader />
          <TrainingContent 
            documents={trainingDocuments}
            productDocuments={productDocuments}
            videos={trainingVideos}
          />
        </div>
      </div>
    </div>
  )
}
