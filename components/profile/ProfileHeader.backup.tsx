'use client'

import Image from 'next/image'
import { User, Camera, X, Edit3, RefreshCw, Crown, Building, ShoppingBag } from 'lucide-react'
import { User as UserType } from '@/types/user'

interface ProfileHeaderProps {
  user: UserType
  isEditing: boolean
  previewImage: string | null
  customerNumber: number
  isRefreshing: boolean
  onEditToggle: () => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveImage: () => void
  onRefresh: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export default function ProfileHeader({
  user,
  isEditing,
  previewImage,
  customerNumber,
  isRefreshing,
  onEditToggle,
  onImageUpload,
  onRemoveImage,
  onRefresh,
  fileInputRef
}: ProfileHeaderProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 border-4 border-white shadow-2xl flex items-center justify-center">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-16 w-16 text-green-400" />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Customer #</span>
                <span className="font-mono text-lg font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {customerNumber.toString().padStart(6, '0')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              
              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-600 rounded-xl font-medium hover:bg-white/70 transition-all duration-200 disabled:opacity-50"
                title="Refresh profile data"
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-sm sm:text-base">Refresh</span>
              </button>

              {/* Edit Button for larger screens */}
              <div className="hidden sm:block">
                <button
                  onClick={onEditToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isEditing 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  title={isEditing ? 'Cancel editing' : 'Edit profile'}
                >
                  <Edit3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
              
            </div>

            {/* Edit Button for small screens */}
            <div className="relative sm:hidden">
              <button
                onClick={onEditToggle}
                onTouchStart={(e) => {
                  e.preventDefault()
                  onEditToggle()
                }}
                className={`flex items-center justify-center px-3 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 min-h-[44px] min-w-[44px] touch-manipulation ${
                  isEditing 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                title={isEditing ? 'Cancel editing' : 'Edit profile'}
                style={{ touchAction: 'manipulation' }}
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User Type Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full text-sm font-medium">
                <Crown className="h-4 w-4" />
                Admin
              </span>
            )}
            {user.discountType === 'CLINIC' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
                <Building className="h-4 w-4" />
                Clinic Partner
              </span>
            )}
            {user.canSeePrices && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium">
                <ShoppingBag className="h-4 w-4" />
                Price Access
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}