'use client'

import { User, Mail, Phone, MapPin, Calendar, Shield, Star, Award, Heart } from 'lucide-react'

interface ProfileInfoProps {
  user: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    birthday?: string
    isAdmin?: boolean
    canSeePrices?: boolean
    discountType?: string | null
    discountPercentage?: number | null
    createdAt: string
  }
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const getMembershipLevel = () => {
    if (user.isAdmin) return { level: 'Admin', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (user.discountPercentage && user.discountPercentage > 0) return { level: 'VIP', color: 'text-gold-600', bg: 'bg-yellow-100' }
    return { level: 'Standard', color: 'text-blue-600', bg: 'bg-blue-100' }
  }

  const membership = getMembershipLevel()

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">{user.address || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Birthday</p>
                <p className="font-medium text-gray-900">
                  {user.birthday ? new Date(user.birthday).toLocaleDateString('en-AE') : 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Membership Level</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${membership.bg} ${membership.color}`}>
                {membership.level}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Price Visibility</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.canSeePrices ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {user.canSeePrices ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            {user.discountType && user.discountPercentage && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Discount</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                  {user.discountPercentage}% {user.discountType}
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-AE', {
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Features */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Account</p>
              <p className="text-xs text-blue-600">Protected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Star className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Premium Access</p>
              <p className="text-xs text-green-600">VIP Benefits</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Award className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-900">Loyalty Program</p>
              <p className="text-xs text-purple-600">Rewards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
            <Heart className="h-5 w-5 text-pink-600" />
            <div>
              <p className="text-sm font-medium text-pink-900">Favorites</p>
              <p className="text-xs text-pink-600">Saved Items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

