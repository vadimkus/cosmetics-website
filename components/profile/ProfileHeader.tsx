'use client'

import Image from 'next/image'
import { User, Camera, X, Crown, Building, Eye, Calendar, Sparkles } from 'lucide-react'
import { User as UserType } from '@/types/user'

interface ProfileHeaderProps {
  user: UserType
  isEditing: boolean
  previewImage: string | null
  customerNumber: number
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export default function ProfileHeader({
  user,
  isEditing,
  previewImage,
  customerNumber,
  onImageUpload,
  onRemoveImage,
  fileInputRef
}: ProfileHeaderProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
        
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 border-2 sm:border-4 border-white shadow-2xl flex items-center justify-center">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-green-400" />
            )}
          </div>

          {isEditing && (
            <div className="absolute -bottom-2 -right-2 flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Upload Photo"
              >
                <Camera className="h-4 w-4" />
              </button>
              {previewImage && (
                <button
                  onClick={onRemoveImage}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Remove Photo"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg break-words px-2 sm:px-0">{user.email}</p>
              {customerNumber > 0 && (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-lg mt-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Family Member #{customerNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Type Badges */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {user.canSeePrices && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                <Eye className="h-4 w-4" />
                Price Access
              </div>
            )}
            
            {user.discountType && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                user.discountType === 'CLINIC' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.discountType === 'CLINIC' ? (
                  <Building className="h-4 w-4" />
                ) : (
                  <Crown className="h-4 w-4" />
                )}
                {user.discountType} {user.discountPercentage}% OFF
              </div>
            )}
            
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Member since {new Date(user.createdAt).getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}