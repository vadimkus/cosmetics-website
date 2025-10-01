import { Order, OrderItem } from '@prisma/client'

// Custom type that includes the items relation
export type OrderWithItems = Order & {
  items: OrderItem[]
}

export interface ProfileEditData {
  name: string
  phone: string
  address: string
  birthday: string
}

export type ProfileTab = 'profile' | 'orders' | 'settings' | 'downloads'

export interface ProfileState {
  isEditing: boolean
  editData: ProfileEditData
  profilePicture: string | null
  previewImage: string | null
  customerNumber: number
  showDeleteConfirm: boolean
  isDeleting: boolean
  orders: OrderWithItems[]
  loadingOrders: boolean
  activeTab: ProfileTab
  isRefreshing: boolean
  showMoreMenu: boolean
}

export interface ProfileActions {
  setIsEditing: (editing: boolean) => void
  setEditData: (data: ProfileEditData) => void
  setProfilePicture: (picture: string | null) => void
  setPreviewImage: (image: string | null) => void
  setCustomerNumber: (number: number) => void
  setShowDeleteConfirm: (show: boolean) => void
  setIsDeleting: (deleting: boolean) => void
  setOrders: (orders: OrderWithItems[]) => void
  setLoadingOrders: (loading: boolean) => void
  setActiveTab: (tab: ProfileTab) => void
  setIsRefreshing: (refreshing: boolean) => void
  setShowMoreMenu: (show: boolean) => void
}

