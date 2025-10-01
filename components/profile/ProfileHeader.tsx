'use client'

import { useRef, useEffect } from 'react'
import { Camera, X, RefreshCw, Crown, Building, Settings, MoreHorizontal } from 'lucide-react'
import { User } from '@/types/user'
import Image from 'next/image'

interface ProfileState {
  isEditing: boolean
  editData: {
    name: string
    phone: string
    address: string
    birthday: string
  }
  profilePicture: string | null
  previewImage: string | null
  customerNumber: number
  isRefreshing: boolean
  showMoreMenu: boolean
}

interface ProfileActions {
  setIsEditing: (editing: boolean) => void
  setEditData: (data: any) => void
  setProfilePicture: (picture: string | null) => void
  setPreviewImage: (image: string | null) => void
  setCustomerNumber: (number: number) => void
  setShowMoreMenu: (show: boolean) => void
}

interface ProfileHeaderProps {
  user: User | null
  state: ProfileState
  actions: ProfileActions
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  onRefresh: () => void
  onProfilePictureChange: (file: File) => void
  onRemoveProfilePicture: () => void
}

export default function ProfileHeader({
  user,
  state,
  actions,
  onSave,
  onCancel,
  onRefresh,
  onProfilePictureChange,
  onRemoveProfilePicture
}: ProfileHeaderProps) {
  const { isEditing, editData, profilePicture, previewImage, customerNumber, isRefreshing, showMoreMenu } = state
  const { setEditData, setShowMoreMenu } = actions
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setShowMoreMenu])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onProfilePictureChange(file)
    }
  }

  if (!user) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-white border-2 border-primary-500 rounded-full p-1.5 hover:bg-gray-50 transition-colors"
            >
              <Camera className="h-4 w-4 text-primary-600" />
            </button>
            {previewImage && (
              <button
                onClick={onRemoveProfilePicture}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-1 text-2xl font-bold"
                />
              ) : (
                user.name
              )}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Customer #{customerNumber}</span>
              {user.isAdmin && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </span>
              )}
              {user.canSeePrices && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Building className="h-3 w-3 mr-1" />
                  Professional
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            title="Refresh profile"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false)
                      // Add more menu actions here
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setEditData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                birthday: user.birthday || ''
              })
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}