'use client'

import Image from 'next/image'
import { Play, Clock, Award } from 'lucide-react'
import { TrainingVideo } from '../types/training'
import { useTranslation } from '@/hooks/useTranslation'

interface TrainingVideosProps {
  videos: TrainingVideo[]
}

export default function TrainingVideos({ videos }: TrainingVideosProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Video Training Lessons
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Watch expert-led video lessons covering advanced techniques, safety protocols, and professional best practices.
        </p>
      </div>

      <div className="space-y-8">
        {videos.map((video) => (
          <div 
            key={video.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="md:flex">
              {/* Video Thumbnail */}
              <div className="md:w-1/3 relative">
                <div className="aspect-video bg-gray-100 relative">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all cursor-pointer">
                      <Play className="h-8 w-8 text-primary-600 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {video.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {video.level}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* Video Stats */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{t('training.certificationAvailable')}</span>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">What You&apos;ll Learn:</h4>
                  <ul className="text-gray-600 space-y-1">
                    {video.whatYoullLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                    <ul className="text-gray-600 space-y-1 text-sm">
                      <li>• Duration: {video.lessonDetails.duration}</li>
                      <li>• Level: {video.lessonDetails.level}</li>
                      <li>• Category: {video.lessonDetails.category}</li>
                      <li>• Certification: {video.lessonDetails.certification}</li>
                    </ul>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                      <Play className="h-4 w-4" />
                      Watch Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Placeholder for future lessons */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            More Training Lessons Coming Soon
          </h3>
          <p className="text-gray-500">
            We&apos;re continuously adding new training content. Check back regularly for updates.
          </p>
        </div>
      </div>
    </div>
  )
}
