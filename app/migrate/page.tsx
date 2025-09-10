'use client'

import { useState, useEffect } from 'react'
import { Database, Users, Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface MigrationStatus {
  status: string
  currentData: {
    users: number
    orders: number
    products: number
  }
  migration: {
    database: string
    status: string
    nextSteps: string[]
  }
}

interface MigrationResult {
  message: string
  results: Array<{
    email?: string
    id?: string
    name?: string
    status: string
    message: string
  }>
  total: number
  successful: number
}

export default function MigrationPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)
  const [activeTab, setActiveTab] = useState<'status' | 'users' | 'products'>('status')

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check-status' })
      })
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Status check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const migrateUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate-users' })
      })
      const data = await response.json()
      setMigrationResult(data)
      setActiveTab('users')
    } catch (error) {
      console.error('User migration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const migrateProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate-products' })
      })
      const data = await response.json()
      setMigrationResult(data)
      setActiveTab('products')
    } catch (error) {
      console.error('Product migration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Database Migration</h1>
          </div>

          {/* Status Overview */}
          {status && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{status.currentData.users}</p>
                <p className="text-sm text-blue-600">Ready for migration</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Products</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{status.currentData.products}</p>
                <p className="text-sm text-green-600">Ready for migration</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-800">Orders</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{status.currentData.orders}</p>
                <p className="text-sm text-purple-600">Ready for migration</p>
              </div>
            </div>
          )}

          {/* Migration Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={checkStatus}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Check Status
            </button>

            <button
              onClick={migrateUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
              Migrate Users
            </button>

            <button
              onClick={migrateProducts}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
              Migrate Products
            </button>
          </div>

          {/* Migration Status */}
          {status && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Migration Status</h3>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Database: {status.migration.database}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Status: {status.migration.status}</span>
              </div>
              
              <h4 className="font-medium text-gray-800 mb-2">Next Steps:</h4>
              <ul className="list-disc list-inside space-y-1">
                {status.migration.nextSteps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-600">{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Migration Results */}
          {migrationResult && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Migration Results</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{migrationResult.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{migrationResult.successful}</p>
                  <p className="text-sm text-gray-600">Successful</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{migrationResult.total - migrationResult.successful}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {migrationResult.results.slice(0, 10).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">
                          {result.email || result.name || result.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.status === 'migrated' || result.status === 'ready' || result.status === 'exists' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${
                          result.status === 'migrated' || result.status === 'ready' || result.status === 'exists' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {migrationResult.results.length > 10 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... and {migrationResult.results.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
