'use client'

import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Edit3, Camera, X, MoreHorizontal, RefreshCw, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileState, ProfileActions } from '@/types/profile'

interface ProfileHeaderProps {
  state: ProfileState
  actions: ProfileActions
  onSave: () => Promise<void>
  onCancel: () => void
  onDelete: () => void
  onRefresh: () => Promise<void>
}

export default function ProfileHeader({ 
  state, 
  actions, 
  onSave, 
  onCancel, 
  onDelete, 
  onRefresh 
}: ProfileHeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    actions.setEditData({
      ...state.editData,
      [name]: value
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        actions.setPreviewImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    actions.setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        actions.setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [actions])

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={state.isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${state.isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => actions.setShowMoreMenu(!state.showMoreMenu)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {state.showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <button
                  onClick={onDelete}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {state.previewImage ? (
                <img
                  src={state.previewImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-gray-400" />
              )}
            </div>
            
            {state.isEditing && (
              <div className="absolute -bottom-1 -right-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}
            
            {state.previewImage && (
              <button
                onClick={removeImage}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {state.isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={state.editData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Full Name"
                  />
                ) : (
                  user.name || 'User'
                )}
              </h1>
              <p className="text-gray-600">Customer #{state.customerNumber}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {state.isEditing ? (
                <>
                  <button
                    onClick={onSave}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => actions.setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              {state.isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={state.editData.phone}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Phone Number"
                />
              ) : (
                <span className="text-gray-600">{user.phone || 'Not provided'}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              {state.isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={state.editData.address}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Address"
                />
              ) : (
                <span className="text-gray-600">{user.address || 'Not provided'}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              {state.isEditing ? (
                <input
                  type="date"
                  name="birthday"
                  value={state.editData.birthday}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <span className="text-gray-600">
                  {user.birthday ? new Date(user.birthday).toLocaleDateString('en-AE') : 'Not provided'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

