'use client'

import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

export default function TrainingHeader() {
  const { t } = useTranslation()

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <Image 
          src="/images/genosys-logo.png" 
          alt="Genosys Professional Training" 
          width={400} 
          height={200} 
          className="object-contain w-full max-w-xs sm:max-w-sm md:max-w-md"
          priority
        />
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        Professional Training
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
        Master the art of Korean dermacosmetics with our comprehensive training program. 
        Learn from industry experts and elevate your professional practice with GENOSYS products.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-6 py-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">6+</div>
          <div className="text-sm text-primary-700">{t('training.trainingDocuments')}</div>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-6 py-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">3+</div>
          <div className="text-sm text-primary-700">{t('training.videoLessons')}</div>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-6 py-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">8+</div>
          <div className="text-sm text-primary-700">{t('training.categories')}</div>
        </div>
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-6 py-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">✓</div>
          <div className="text-sm text-primary-700">{t('training.certification')}</div>
        </div>
      </div>
    </div>
  )
}
