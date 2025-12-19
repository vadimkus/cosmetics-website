'use client'

import { useState } from 'react'

export default function InitDbPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const initializeDatabase = async () => {
    setLoading(true)
    setStatus('Initializing database...')
    
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStatus(`✅ ${data.message}`)
      } else {
        setStatus(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    setLoading(true)
    setStatus('Checking database status...')
    
    try {
      const response = await fetch('/api/init-db')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`📊 Database Status:
- Products: ${data.database.products}
- Users: ${data.database.users}
- Orders: ${data.database.orders}`)
      } else {
        setStatus(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Initialization</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <button
              onClick={checkStatus}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Check Database Status'}
            </button>
            
            <button
              onClick={initializeDatabase}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Initializing...' : 'Initialize Database with Products'}
            </button>
          </div>
          
          {status && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{status}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
