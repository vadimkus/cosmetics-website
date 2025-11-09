'use client'

import { User } from 'lucide-react'
import { User as UserType } from '@/types/user'

interface EditData {
  name: string
  phone: string
  address: string
  birthday: string
}

interface PersonalInfoSectionProps {
  user: UserType
  isEditing: boolean
  editData: EditData
  setEditData: (data: EditData) => void
}

export default function PersonalInfoSection({ 
  user, 
  isEditing, 
  editData, 
  setEditData 
}: PersonalInfoSectionProps) {
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
                onChange={(e) => setEditData({...editData, name: e.target.value})}
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
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.phone || 'Not provided'}</p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            {isEditing ? (
              <textarea
                value={editData.address}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.address || 'Not provided'}</p>
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
                onChange={(e) => setEditData({...editData, birthday: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            ) : (
              <div className="px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                <p className="text-gray-800">{user.birthday || 'Not provided'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
