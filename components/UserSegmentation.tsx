'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Users,
  Filter,
  Search,
  Download,
  Tag,
  X,
  Plus,
  Save,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders } from '@/lib/csrfClient'

interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  birthday?: string | null
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  lastLoginAt?: string | null
  createdAt: string
  orderCount?: number
  totalSpent?: number
  lastOrderDate?: string | null
}

interface Segment {
  id: string
  name: string
  description?: string
  filters: SegmentFilter[]
  userCount: number
  createdAt: string
}

interface SegmentFilter {
  field: string
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'between' | 'isNull' | 'isNotNull'
  value: string | number | string[] | boolean | null
}

interface UserSegmentationProps {
  users: User[]
  onUserClick?: (userEmail: string) => void
  onSegmentUsers?: (userIds: string[]) => void
}

type FilterField = 
  | 'discountType' 
  | 'discountPercentage' 
  | 'canSeePrices' 
  | 'orderCount' 
  | 'totalSpent' 
  | 'lastLoginAt' 
  | 'createdAt'
  | 'hasOrders'
  | 'isAdmin'

const FILTER_FIELDS: Array<{ value: FilterField; label: string; type: 'string' | 'number' | 'boolean' | 'date' }> = [
  { value: 'discountType', label: 'Discount Type', type: 'string' },
  { value: 'discountPercentage', label: 'Discount Percentage', type: 'number' },
  { value: 'canSeePrices', label: 'Can See Prices', type: 'boolean' },
  { value: 'orderCount', label: 'Order Count', type: 'number' },
  { value: 'totalSpent', label: 'Total Spent', type: 'number' },
  { value: 'hasOrders', label: 'Has Orders', type: 'boolean' },
  { value: 'isAdmin', label: 'Is Admin', type: 'boolean' },
  { value: 'lastLoginAt', label: 'Last Login', type: 'date' },
  { value: 'createdAt', label: 'Registration Date', type: 'date' }
]

const OPERATORS: Record<string, Array<{ value: string; label: string }>> = {
  string: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'in', label: 'In (multiple)' },
    { value: 'notIn', label: 'Not In' },
    { value: 'isNull', label: 'Is Empty' },
    { value: 'isNotNull', label: 'Is Not Empty' }
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'between', label: 'Between' },
    { value: 'isNull', label: 'Is Empty' },
    { value: 'isNotNull', label: 'Is Not Empty' }
  ],
  boolean: [
    { value: 'equals', label: 'Equals' }
  ],
  date: [
    { value: 'greaterThan', label: 'After' },
    { value: 'lessThan', label: 'Before' },
    { value: 'between', label: 'Between' },
    { value: 'isNull', label: 'Is Empty' },
    { value: 'isNotNull', label: 'Is Not Empty' }
  ]
}

export default function UserSegmentation({ users, onUserClick, onSegmentUsers: _onSegmentUsers }: UserSegmentationProps) {
  const [segments, setSegments] = useState<Segment[]>([])
  const [activeSegment, setActiveSegment] = useState<string | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSegmentForm, setShowSegmentForm] = useState(false)
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null)
  const [segmentName, setSegmentName] = useState('')
  const [segmentDescription, setSegmentDescription] = useState('')
  const [filters, setFilters] = useState<SegmentFilter[]>([])
  const [__loading, setLoading] = useState(false)

  // Fetch saved segments
  const fetchSegments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/segments')
      if (response.ok) {
        const data = await response.json()
        setSegments(data.segments || [])
      }
    } catch (error) {
      errorLog('Error fetching segments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSegments()
  }, [fetchSegments])

  // Apply filters to users
  const applyFilters = useCallback((filterList: SegmentFilter[], userList: User[]): User[] => {
    return userList.filter(user => {
      return filterList.every(filter => {
        const field = filter.field as FilterField
        const operator = filter.operator
        const value = filter.value

        // Get user value based on field
        let userValue: unknown
        switch (field) {
          case 'discountType':
            userValue = user.discountType
            break
          case 'discountPercentage':
            userValue = user.discountPercentage
            break
          case 'canSeePrices':
            userValue = user.canSeePrices
            break
          case 'orderCount':
            userValue = user.orderCount || 0
            break
          case 'totalSpent':
            userValue = user.totalSpent || 0
            break
          case 'hasOrders':
            userValue = (user.orderCount || 0) > 0
            break
          case 'isAdmin':
            userValue = user.isAdmin
            break
          case 'lastLoginAt':
            userValue = user.lastLoginAt ? new Date(user.lastLoginAt).getTime() : null
            break
          case 'createdAt':
            userValue = new Date(user.createdAt).getTime()
            break
          default:
            return true
        }

        // Apply operator
        switch (operator) {
          case 'equals':
            return userValue === value
          case 'contains':
            return typeof userValue === 'string' && typeof value === 'string' && userValue.toLowerCase().includes(value.toLowerCase())
          case 'greaterThan':
            return typeof userValue === 'number' && typeof value === 'number' && userValue > value
          case 'lessThan':
            return typeof userValue === 'number' && typeof value === 'number' && userValue < value
          case 'in':
            return Array.isArray(value) && value.includes(String(userValue))
          case 'notIn':
            return Array.isArray(value) && !value.includes(String(userValue))
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              const numValue = typeof userValue === 'number' ? userValue : Number(userValue)
              return numValue >= Number(value[0]) && numValue <= Number(value[1])
            }
            return false
          case 'isNull':
            return userValue === null || userValue === undefined || userValue === ''
          case 'isNotNull':
            return userValue !== null && userValue !== undefined && userValue !== ''
          default:
            return true
        }
      })
    })
  }, [])

  // Update filtered users when filters or users change
  useEffect(() => {
    if (activeSegment) {
      const segment = segments.find(s => s.id === activeSegment)
      if (segment) {
        const filtered = applyFilters(segment.filters, users)
        setFilteredUsers(filtered)
      }
    } else if (filters.length > 0) {
      const filtered = applyFilters(filters, users)
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [activeSegment, segments, filters, users, applyFilters])

  // Apply search query
  const searchedUsers = useMemo(() => {
    if (!searchQuery) return filteredUsers
    const query = searchQuery.toLowerCase()
    return filteredUsers.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.toLowerCase().includes(query))
    )
  }, [filteredUsers, searchQuery])

  const addFilter = () => {
    setFilters([...filters, { field: 'discountType', operator: 'equals', value: '' }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, updates: Partial<SegmentFilter>) => {
    const newFilters = [...filters]
    if (newFilters[index]) {
      newFilters[index] = { ...newFilters[index], ...updates } as SegmentFilter
    }
    setFilters(newFilters)
  }

  const getFieldType = (field: FilterField) => {
    return FILTER_FIELDS.find(f => f.value === field)?.type || 'string'
  }

  const saveSegment = async () => {
    if (!segmentName.trim()) {
      alert('Please enter a segment name')
      return
    }

    try {
      const segmentData = {
        name: segmentName,
        description: segmentDescription,
        filters
      }

      const url = editingSegment ? `/api/admin/segments/${editingSegment.id}` : '/api/admin/segments'
      const method = editingSegment ? 'PUT' : 'POST'

      await fetchCsrfToken()
      const response = await fetch(url, {
        method,
        headers: getCsrfHeaders(),
        body: JSON.stringify(segmentData)
      })

      if (response.ok) {
        await fetchSegments()
        setShowSegmentForm(false)
        setEditingSegment(null)
        setSegmentName('')
        setSegmentDescription('')
        setFilters([])
      } else {
        const error = await response.json()
        alert(`Failed to save segment: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      errorLog('Error saving segment:', error)
      alert('Failed to save segment')
    }
  }

  const deleteSegment = async (segmentId: string) => {
    if (!confirm('Are you sure you want to delete this segment?')) return

    try {
      await fetchCsrfToken()
      const response = await fetch(`/api/admin/segments/${segmentId}`, {
        method: 'DELETE',
        headers: getCsrfHeaders()
      })

      if (response.ok) {
        await fetchSegments()
        if (activeSegment === segmentId) {
          setActiveSegment(null)
        }
      } else {
        alert('Failed to delete segment')
      }
    } catch (error) {
      errorLog('Error deleting segment:', error)
      alert('Failed to delete segment')
    }
  }

  const loadSegment = (segment: Segment) => {
    setEditingSegment(segment)
    setSegmentName(segment.name)
    setSegmentDescription(segment.description || '')
    setFilters(segment.filters)
    setShowSegmentForm(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(amount)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-AE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleUserClick = (email: string) => {
    if (onUserClick) {
      onUserClick(email)
    }
  }

  const exportUsers = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Discount Type', 'Discount %', 'Last Login', 'Created'].join(','),
      ...searchedUsers.map(user => [
        user.name,
        user.email,
        user.phone || '',
        user.orderCount || 0,
        user.totalSpent || 0,
        user.discountType || '',
        user.discountPercentage || 0,
        user.lastLoginAt || '',
        user.createdAt
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${activeSegment || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">User Segmentation</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage user segments based on filters</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setShowSegmentForm(true)
              setEditingSegment(null)
              setSegmentName('')
              setSegmentDescription('')
              setFilters([])
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Segment
          </button>
          <button
            onClick={exportUsers}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Saved Segments */}
      {segments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Saved Segments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map((segment) => (
              <div
                key={segment.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  activeSegment === segment.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setActiveSegment(activeSegment === segment.id ? null : segment.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                    {segment.description && (
                      <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                    )}
                  </div>
                  {activeSegment === segment.id && (
                    <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">{segment.userCount} users</span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        loadSegment(segment)
                      }}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSegment(segment.id)
                      }}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Builder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {activeSegment ? 'Segment Filters' : 'Build Custom Filter'}
          </h3>
          {filters.length > 0 && (
            <button
              onClick={() => {
                setFilters([])
                setActiveSegment(null)
              }}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {filters.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No filters applied</p>
            <button
              onClick={addFilter}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add Filter
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filters.map((filter, index) => {
              const fieldType = getFieldType(filter.field as FilterField)
              const operators = OPERATORS[fieldType] || OPERATORS.string

              return (
                <div key={index} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
                    <select
                      value={filter.field}
                      onChange={(e) => updateFilter(index, { field: e.target.value as FilterField, operator: 'equals', value: '' })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {FILTER_FIELDS.map(field => (
                        <option key={field.value} value={field.value}>{field.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                    <select
                      value={filter.operator}
                      onChange={(e) => updateFilter(index, { operator: e.target.value as SegmentFilter['operator'] })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {(operators || []).map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                  </div>

                  {filter.operator !== 'isNull' && filter.operator !== 'isNotNull' && (
                    <div className="flex-1 min-w-[150px]">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                      {filter.operator === 'between' ? (
                        <div className="flex gap-2">
                          <input
                            type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
                            placeholder="Min"
                            value={Array.isArray(filter.value) ? filter.value[0] : ''}
                            onChange={(e) => {
                              const current = Array.isArray(filter.value) ? filter.value : ['', '']
                              updateFilter(index, { value: [e.target.value, current[1] || ''] })
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
                            placeholder="Max"
                            value={Array.isArray(filter.value) ? filter.value[1] : ''}
                            onChange={(e) => {
                              const current = Array.isArray(filter.value) ? filter.value : ['', '']
                              updateFilter(index, { value: [current[0] || '', e.target.value] })
                            }}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      ) : filter.operator === 'in' || filter.operator === 'notIn' ? (
                        <input
                          type="text"
                          placeholder="Comma-separated values"
                          value={Array.isArray(filter.value) ? filter.value.join(', ') : ''}
                          onChange={(e) => updateFilter(index, { value: e.target.value.split(',').map(v => v.trim()).filter(Boolean) })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : fieldType === 'boolean' ? (
                        <select
                          value={String(filter.value)}
                          onChange={(e) => updateFilter(index, { value: e.target.value === 'true' ? true : false })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        <input
                          type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
                          value={typeof filter.value === 'string' || typeof filter.value === 'number' ? filter.value : ''}
                          onChange={(e) => {
                            const newValue = fieldType === 'number' ? Number(e.target.value) : e.target.value
                            updateFilter(index, { value: newValue })
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => removeFilter(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove filter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            })}

            <button
              onClick={addFilter}
              className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium border-2 border-dashed border-primary-300 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Filter
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Results ({searchedUsers.length} {searchedUsers.length === 1 ? 'user' : 'users'})
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {searchedUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No users match the current filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchedUsers.slice(0, 50).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <button
                        onClick={() => handleUserClick(user.email)}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {user.email}
                      </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.orderCount || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatCurrency(user.totalSpent || 0)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.discountType && user.discountPercentage ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {user.discountPercentage}% {user.discountType}
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(user.lastLoginAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleUserClick(user.email)}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {searchedUsers.length > 50 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Showing first 50 of {searchedUsers.length} users
              </div>
            )}
          </div>
        )}
      </div>

      {/* Segment Form Modal */}
      {showSegmentForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingSegment ? 'Edit Segment' : 'Create New Segment'}
                </h3>
                <button
                  onClick={() => {
                    setShowSegmentForm(false)
                    setEditingSegment(null)
                    setSegmentName('')
                    setSegmentDescription('')
                    setFilters([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segment Name *</label>
                  <input
                    type="text"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="e.g., VIP Customers, High Spenders"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    placeholder="Optional description for this segment"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {filters.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">No filters added</p>
                      <p className="text-xs text-yellow-700 mt-1">Add filters above before saving the segment</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={saveSegment}
                    disabled={!segmentName.trim() || filters.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    {editingSegment ? 'Update Segment' : 'Save Segment'}
                  </button>
                  <button
                    onClick={() => {
                      setShowSegmentForm(false)
                      setEditingSegment(null)
                      setSegmentName('')
                      setSegmentDescription('')
                      setFilters([])
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

