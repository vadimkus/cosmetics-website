'use client'

import { useState } from 'react'
import { Package, Plus, RefreshCw, Edit, Eye, ImageIcon } from 'lucide-react'
import type { Product } from '@/types'
import Link from 'next/link'

interface AdminProductsManagerProps {
  products: Product[]
  productsRefreshing: boolean
  onRefreshProducts: () => Promise<void>
  onShowProductForm: () => void
  onEditProduct: (product: Product) => void
}

export default function AdminProductsManager({
  products,
  productsRefreshing,
  onRefreshProducts,
  onShowProductForm,
  onEditProduct
}: AdminProductsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const getStockStatus = (product: Product) => {
    if (product.inStock) {
      return { text: 'In Stock', color: 'text-green-600 bg-green-100' }
    } else {
      return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Products Header */}
      <div className="bg-white rounded-lg border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-2 mr-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Products</h2>
              <p className="text-sm text-gray-500">Manage your product catalog</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm w-full sm:w-64"
              />
            </div>
            <button
              onClick={onShowProductForm}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
            <button
              onClick={onRefreshProducts}
              disabled={productsRefreshing}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${productsRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg border">
        {filteredProducts.length === 0 && !searchTerm ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-gray-400 mb-4">Add your first product to get started.</p>
            <button
              onClick={onShowProductForm}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        ) : filteredProducts.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:-mx-4 md:mx-0 scrollbar-hide">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Product</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Category</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Stock</th>
                      <th className="px-2 sm:px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product)
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {product.image ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={product.image}
                                    alt={product.name}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">ID: {product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                            {product.category || 'Uncategorized'}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                              {stockStatus.text}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/products/${product.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900 transition-colors touch-manipulation p-1"
                                title="View Product"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => onEditProduct(product)}
                                className="text-primary-600 hover:text-primary-900 transition-colors touch-manipulation p-1"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {searchTerm && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  )
}