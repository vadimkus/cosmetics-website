'use client'

import { User, Shield, Eye, Lock, CheckCircle, X } from 'lucide-react'
import { User as UserType } from '@/types/user'

interface ProfileFormProps {
  user: UserType
  isEditing: boolean
  editData: {
    name: string
    phone: string
    address: string
    birthday: string
  }
  onEditDataChange: (data: { name: string; phone: string; address: string; birthday: string }) => void
  onSave: () => void
  onCancel: () => void
}

export default function ProfileForm({
  user,
  isEditing,
  editData,
  onEditDataChange,
  onSave,
  onCancel
}: ProfileFormProps) {
  const handleInputChange = (field: keyof typeof editData, value: string) => {
    onEditDataChange({
      ...editData,
      [field]: value
    })
  }

  return (
    <div className="space-y-8">
      
      {/* Personal Information */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <User className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.name}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
              <p className="text-gray-800 break-all">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.phone || 'Not provided'}</p>
              </div>
            )}
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Birthday</label>
            {isEditing ? (
              <input
                type="date"
                value={editData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">
                  {user.birthday ? new Date(user.birthday).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not provided'}
                </p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            {isEditing ? (
              <textarea
                value={editData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Enter your address"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.address || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="h-5 w-5" />
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Account Status */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Account Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Price Access */}
          <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-200 rounded-lg">
                <Eye className="h-5 w-5 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-gray-800">Price Access</h3>
            </div>
            <div className="flex items-center gap-2">
              {user.canSeePrices ? (
                <>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Allowed
                  </span>
                  <p className="text-emerald-700 text-sm font-medium">You can view product prices</p>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                    <Lock className="h-4 w-4" />
                    Restricted
                  </span>
                  <p className="text-red-700 text-sm font-medium">Price access required</p>
                </>
              )}
            </div>
          </div>

          {/* Discount Level */}
          {user.discountType && (
            <div className={`p-6 rounded-xl border ${
              user.discountType === 'CLINIC' 
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  user.discountType === 'CLINIC' ? 'bg-green-200' : 'bg-red-200'
                }`}>
                  <CheckCircle className={`h-5 w-5 ${
                    user.discountType === 'CLINIC' ? 'text-green-700' : 'text-red-700'
                  }`} />
                </div>
                <h3 className="font-semibold text-gray-800">Discount Level</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  user.discountType === 'CLINIC' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {user.discountType === 'CLINIC' ? 'Clinic Partner' : 'Standard'}
                </span>
                <p className={`text-sm font-medium ${
                  user.discountType === 'CLINIC' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {user.discountPercentage ? `${user.discountPercentage}% discount` : 'No discount'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
