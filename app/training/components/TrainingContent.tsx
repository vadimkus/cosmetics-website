import TrainingDocuments from './TrainingDocuments'
import TrainingVideos from './TrainingVideos'
import { TrainingDocument, TrainingVideo } from '../types/training'

interface TrainingContentProps {
  documents: TrainingDocument[]
  productDocuments: TrainingDocument[]
  videos: TrainingVideo[]
}

export default function TrainingContent({ documents, productDocuments, videos }: TrainingContentProps) {
  return (
    <div className="space-y-16">
      <TrainingDocuments documents={documents} title="Training Documents" />
      <TrainingDocuments documents={productDocuments} title="Product Documentation" />
      <TrainingVideos videos={videos} />
    </div>
  )
}
