'use client'

import TrainingDocuments from './TrainingDocuments'
import TrainingVideos from './TrainingVideos'
import { TrainingDocument, TrainingVideo } from '../types/training'
import { useTranslation } from '@/hooks/useTranslation'

interface TrainingContentProps {
  documents: TrainingDocument[]
  productDocuments: TrainingDocument[]
  videos: TrainingVideo[]
}

export default function TrainingContent({ documents, productDocuments, videos }: TrainingContentProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-16">
      <TrainingDocuments documents={documents} title={t('training.trainingDocuments')} />
      <TrainingDocuments documents={productDocuments} title={t('training.productDocumentation')} />
      <TrainingVideos videos={videos} />
    </div>
  )
}
