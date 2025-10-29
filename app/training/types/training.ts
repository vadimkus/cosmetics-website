export interface TrainingDocument {
  id: string
  title: string
  description: string
  downloadUrl: string
  fileSize: string
  category: string
}

export interface TrainingVideo {
  id: string
  title: string
  description: string
  duration: string
  level: string
  category: string
  thumbnail: string
  videoUrl: string
  whatYoullLearn: string[]
  lessonDetails: {
    duration: string
    level: string
    category: string
    certification: string
  }
}

export interface TrainingStats {
  totalDocuments: number
  totalVideos: number
  totalCategories: number
  averageVideoDuration: string
  certificationAvailable: boolean
}

export type TrainingCategory = 
  | 'All Categories'
  | 'Introduction'
  | 'Microneedling'
  | 'Hair Loss Treatments'
  | 'Safety & Protocols'
  | 'Product Knowledge'
  | 'Treatment Protocols'
  | 'Client Care'
  | 'Business Tools'
