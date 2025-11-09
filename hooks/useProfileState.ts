import { useState, useCallback } from 'react'
import { ProfileState, ProfileEditData, ProfileTab, OrderWithItems } from '@/types/profile'
import { User } from '@/types/user'

export function useProfileState(initialUser: User | null) {
  const [state, setState] = useState<ProfileState>({
    isEditing: false,
    editData: {
      name: initialUser?.name || '',
      phone: initialUser?.phone || '',
      address: initialUser?.address || '',
      birthday: initialUser?.birthday || ''
    },
    profilePicture: null,
    previewImage: null,
    customerNumber: 0,
    showDeleteConfirm: false,
    isDeleting: false,
    orders: [],
    loadingOrders: false,
    activeTab: 'profile',
    isRefreshing: false,
    showMoreMenu: false
  })

  const actions = {
    setIsEditing: useCallback((editing: boolean) => {
      setState(prev => ({ ...prev, isEditing: editing }))
    }, []),

    setEditData: useCallback((data: ProfileEditData) => {
      setState(prev => ({ ...prev, editData: data }))
    }, []),

    setProfilePicture: useCallback((picture: string | null) => {
      setState(prev => ({ ...prev, profilePicture: picture }))
    }, []),

    setPreviewImage: useCallback((image: string | null) => {
      setState(prev => ({ ...prev, previewImage: image }))
    }, []),

    setCustomerNumber: useCallback((number: number) => {
      setState(prev => ({ ...prev, customerNumber: number }))
    }, []),

    setShowDeleteConfirm: useCallback((show: boolean) => {
      setState(prev => ({ ...prev, showDeleteConfirm: show }))
    }, []),

    setIsDeleting: useCallback((deleting: boolean) => {
      setState(prev => ({ ...prev, isDeleting: deleting }))
    }, []),

    setOrders: useCallback((orders: OrderWithItems[]) => {
      setState(prev => ({ ...prev, orders }))
    }, []),

    setLoadingOrders: useCallback((loading: boolean) => {
      setState(prev => ({ ...prev, loadingOrders: loading }))
    }, []),

    setActiveTab: useCallback((tab: ProfileTab) => {
      setState(prev => ({ ...prev, activeTab: tab }))
    }, []),

    setIsRefreshing: useCallback((refreshing: boolean) => {
      setState(prev => ({ ...prev, isRefreshing: refreshing }))
    }, []),

    setShowMoreMenu: useCallback((show: boolean) => {
      setState(prev => ({ ...prev, showMoreMenu: show }))
    }, [])
  }

  return { state, actions }
}

