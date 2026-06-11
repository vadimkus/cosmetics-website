'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Image as ImageIcon, DollarSign, Tag, FileText, Ruler, Plus } from 'lucide-react'
import type { Product } from '@/types'

interface ProductFormProps {
  product?: Product | null
  onSave: (productData: Partial<Product>) => Promise<boolean>
  onCancel: () => void
}

const defaultCategories = [
  'Microneedling', 'Device', 'Serum', 'Peeling', 'Eye care', 'Mask',
  'PRO Solution', 'Scalp/Hair', 'Cushion BB', 'Sun', 'Cream', 'Toner/Mist', 'Cleanser'
]

// Skin recommendation options
const SKIN_TYPES = [
  { value: '', label: 'Not specified' },
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'normal', label: 'Normal' },
  { value: 'sensitive', label: 'Sensitive' },
  { value: 'all', label: 'All Skin Types' }
]

const TARGET_CONCERNS = [
  { value: 'anti-aging', label: 'Anti-Aging' },
  { value: 'acne-blemishes', label: 'Acne & Blemishes' },
  { value: 'hydration', label: 'Hydration' },
  { value: 'brightening', label: 'Brightening' },
  { value: 'sensitivity', label: 'Sensitivity' },
  { value: 'pore-care', label: 'Pore Care' },
  { value: 'eye-care', label: 'Eye Care' },
  { value: 'hair', label: 'Hair Care' }
]

const AGE_GROUPS = [
  { value: '', label: 'Not specified' },
  { value: 'teen', label: 'Teen (13-19)' },
  { value: 'young-adult', label: 'Young Adult (20-35)' },
  { value: 'adult', label: 'Adult (36-50)' },
  { value: 'mature', label: 'Mature (50+)' },
  { value: 'all', label: 'All Ages' }
]

const USAGE_OPTIONS = [
  { value: '', label: 'Not specified' },
  { value: 'morning', label: 'Morning' },
  { value: 'evening', label: 'Evening' },
  { value: 'all-day', label: 'All Day' },
  { value: 'morning-evening', label: 'Morning & Evening' }
]

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    images: '',
    category: defaultCategories[0] || '',
    inStock: true,
    size: '',
    skinType: '',
    targetConcerns: '[]',
    usage: '',
    ageGroup: '',
  })
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [availableCategories, setAvailableCategories] = useState(defaultCategories)

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        images: product.images || '',
        category: product.category,
        inStock: product.inStock,
        size: product.size || '',
        skinType: product.skinType || '',
        targetConcerns: product.targetConcerns || '[]',
        usage: product.usage || '',
        ageGroup: product.ageGroup || '',
      })
      
      // Parse target concerns
      if (product.targetConcerns) {
        try {
          const concerns = JSON.parse(product.targetConcerns)
          setSelectedConcerns(Array.isArray(concerns) ? concerns : [])
        } catch {
          setSelectedConcerns([])
        }
      } else {
        setSelectedConcerns([])
      }
      
      // Parse images if they exist
      if (product.images) {
        try {
          const parsedImages = JSON.parse(product.images)
          setImagePreviews(parsedImages)
        } catch {
          setImagePreviews([product.image])
        }
      } else {
        setImagePreviews([product.image])
      }
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
        image: '',
        images: '',
        category: defaultCategories[0] || '',
        inStock: true,
        size: '',
        skinType: '',
        targetConcerns: '[]',
        usage: '',
        ageGroup: '',
      })
      setImagePreviews([])
      setSelectedConcerns([])
    }
    setErrors({})
  }, [product])

  const handleConcernToggle = (concern: string) => {
    setSelectedConcerns(prev => {
      const newConcerns = prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
      // Update formData with JSON string
      setFormData(prevData => ({
        ...prevData,
        targetConcerns: JSON.stringify(newConcerns)
      }))
      return newConcerns
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'price' ? parseFloat(value) || 0 : value
    }))
    setErrors(prev => ({ ...prev, [name]: '' })) // Clear error on change
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 3 images total
    const remainingSlots = 3 - imagePreviews.length
    const filesToProcess = files.slice(0, remainingSlots)
    
    if (filesToProcess.length === 0) {
      alert('You can only upload up to 3 images total.')
      return
    }

    setUploadingImage(true)
    let processedCount = 0
    const newImages: string[] = []

    filesToProcess.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        newImages.push(base64String)
        processedCount++
        
        if (processedCount === filesToProcess.length) {
          const updatedImages = [...imagePreviews, ...newImages]
          setImagePreviews(updatedImages)
          
          // Update form data
          const primaryImage = updatedImages[0] || ''
          const imagesJson = JSON.stringify(updatedImages)
          
          setFormData(prev => ({ 
            ...prev, 
            image: primaryImage,
            images: imagesJson
          }))
          
          setUploadingImage(false)
          setErrors(prev => ({ ...prev, image: '' }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const updatedImages = imagePreviews.filter((_, i) => i !== index)
    setImagePreviews(updatedImages)
    
    // Update form data
    const primaryImage = updatedImages[0] || ''
    const imagesJson = updatedImages.length > 0 ? JSON.stringify(updatedImages) : ''
    
    setFormData(prev => ({ 
      ...prev, 
      image: primaryImage,
      images: imagesJson
    }))
  }

  const addCustomCategory = () => {
    if (customCategory.trim() && !availableCategories.includes(customCategory.trim())) {
      const newCategory = customCategory.trim()
      setAvailableCategories(prev => [...prev, newCategory])
      setFormData(prev => ({ ...prev, category: newCategory }))
      setCustomCategory('')
      setShowCustomCategory(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = 'Product name is required.'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be a positive number.'
    if (!formData.description?.trim()) newErrors.description = 'Description is required.'
    if (imagePreviews.length === 0) newErrors.image = 'At least one product image is required.'
    if (!formData.category?.trim()) newErrors.category = 'Category is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      alert('Please correct the errors in the form.')
      return
    }
    const success = await onSave(formData)
    if (success) {
      alert(`Product ${product ? 'updated' : 'added'} successfully!`)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="e.g., Microneedle Roller"
                  />
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (AED)</label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || 0}
                    onChange={handleChange}
                    step="0.01"
                    className={`mt-1 block w-full border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="e.g., 230.00"
                  />
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="space-y-2">
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleChange}
                      className={`mt-1 block w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    >
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {!showCustomCategory ? (
                    <button
                      type="button"
                      onClick={() => setShowCustomCategory(true)}
                      className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Category
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter new category name"
                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                      />
                      <button
                        type="button"
                        onClick={addCustomCategory}
                        className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategory(false)
                          setCustomCategory('')
                        }}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              {/* Size (Optional) */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., 50ml, 1 box"
                  />
                  <Ruler className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* In Stock */}
              <div className="flex items-center">
                <input
                  id="inStock"
                  name="inStock"
                  type="checkbox"
                  checked={formData.inStock || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-900">In Stock</label>
              </div>

              {/* Skin Recommendation Section */}
              <div className="col-span-2 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Skin Recommendation Settings</h3>
                <p className="text-sm text-gray-500 mb-4">Configure these fields for AI-powered product recommendations based on skin analysis.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Skin Type */}
                  <div>
                    <label htmlFor="skinType" className="block text-sm font-medium text-gray-700 mb-1">Skin Type</label>
                    <select
                      id="skinType"
                      name="skinType"
                      value={formData.skinType || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      {SKIN_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Age Group */}
                  <div>
                    <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                    <select
                      id="ageGroup"
                      name="ageGroup"
                      value={formData.ageGroup || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      {AGE_GROUPS.map(group => (
                        <option key={group.value} value={group.value}>{group.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Usage Time */}
                  <div>
                    <label htmlFor="usage" className="block text-sm font-medium text-gray-700 mb-1">Usage Time</label>
                    <select
                      id="usage"
                      name="usage"
                      value={formData.usage || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      {USAGE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Concerns - Multi-select */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Concerns (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_CONCERNS.map(concern => (
                      <button
                        key={concern.value}
                        type="button"
                        onClick={() => handleConcernToggle(concern.value)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedConcerns.includes(concern.value)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedConcerns.includes(concern.value) ? '✓ ' : ''}{concern.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={6}
                    className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="Detailed product description..."
                  ></textarea>
                  <FileText className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Multiple Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images ({imagePreviews.length}/3)
                </label>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {imagePreviews.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                          <Image 
                            src={image} 
                            alt={`Product Preview ${index + 1}`} 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 768px) 33vw, 200px"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Area */}
                {imagePreviews.length < 3 && (
                  <div className={`flex justify-center px-6 pt-5 pb-6 border-2 ${errors.image ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md`}>
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                        >
                          <span>{uploadingImage ? 'Uploading...' : 'Upload images'}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each. Max 3 images.
                      </p>
                    </div>
                  </div>
                )}
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}