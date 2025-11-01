import { renderHook, act } from '@testing-library/react'
import { useProfileState } from '@/hooks/useProfileState'

describe('useProfileState', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    birthday: '1990-01-01'
  }

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    expect(result.current.state.isEditing).toBe(false)
    expect(result.current.state.editData.name).toBe('John Doe')
    expect(result.current.state.editData.phone).toBe('1234567890')
    expect(result.current.state.activeTab).toBe('profile')
    expect(result.current.state.orders).toEqual([])
  })

  it('updates isEditing state correctly', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    act(() => {
      result.current.actions.setIsEditing(true)
    })
    
    expect(result.current.state.isEditing).toBe(true)
  })

  it('updates editData correctly', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    const newData = {
      name: 'Jane Doe',
      phone: '0987654321',
      address: '456 Oak Ave',
      birthday: '1995-05-15'
    }
    
    act(() => {
      result.current.actions.setEditData(newData)
    })
    
    expect(result.current.state.editData).toEqual(newData)
  })

  it('updates activeTab correctly', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    act(() => {
      result.current.actions.setActiveTab('orders')
    })
    
    expect(result.current.state.activeTab).toBe('orders')
  })

  it('updates orders correctly', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'GEN123456',
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        customerPhone: '1234567890',
        customerEmirate: 'Dubai',
        customerAddress: 'Test Address',
        subtotal: 100,
        discountAmount: 0,
        shipping: 0,
        vat: 5,
        total: 100,
        status: 'pending',
        sessionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: []
      },
      {
        id: '2',
        orderNumber: 'GEN789012',
        customerEmail: 'test2@example.com',
        customerName: 'Test Customer 2',
        customerPhone: '0987654321',
        customerEmirate: 'Abu Dhabi',
        customerAddress: 'Test Address 2',
        subtotal: 200,
        discountAmount: 0,
        shipping: 0,
        vat: 10,
        total: 200,
        status: 'delivered',
        sessionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: []
      }
    ]
    
    act(() => {
      result.current.actions.setOrders(mockOrders)
    })
    
    expect(result.current.state.orders).toEqual(mockOrders)
  })

  it('updates loading states correctly', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    act(() => {
      result.current.actions.setLoadingOrders(true)
    })
    
    expect(result.current.state.loadingOrders).toBe(true)
    
    act(() => {
      result.current.actions.setIsRefreshing(true)
    })
    
    expect(result.current.state.isRefreshing).toBe(true)
  })

  it('handles multiple state updates in sequence', () => {
    const { result } = renderHook(() => useProfileState(mockUser))
    
    act(() => {
      result.current.actions.setIsEditing(true)
      result.current.actions.setActiveTab('settings')
      result.current.actions.setShowDeleteConfirm(true)
    })
    
    expect(result.current.state.isEditing).toBe(true)
    expect(result.current.state.activeTab).toBe('settings')
    expect(result.current.state.showDeleteConfirm).toBe(true)
  })
})















