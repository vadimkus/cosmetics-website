export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const getProductImage = (productName: string) => {
  const imageMap: Record<string, string> = {
    'GENOSYS MICRONEEDLE ROLLER': '/images/MICRONEEDLE.jpg',
    'GENOSYS EGF REPAIR SERUM': '/images/EGF.jpg',
    'GENOSYS VITAMIN C SERUM': '/images/VITAMIN-C.jpg',
    'GENOSYS HYALURONIC ACID': '/images/HYALURONIC.jpg',
    'GENOSYS RETINOL SERUM': '/images/RETINOL.jpg',
    'GENOSYS NIACINAMIDE SERUM': '/images/NIACINAMIDE.jpg',
    'GENOSYS PEPTIDE CREAM': '/images/PEPTIDE.jpg',
    'GENOSYS SUNSCREEN SPF 50': '/images/SUNSCREEN.jpg',
    'GENOSYS CLEANSER': '/images/CLEANSER.jpg',
    'GENOSYS TONER': '/images/TONER.jpg',
  }
  
  return imageMap[productName] || '/images/placeholder.jpg'
}

// Re-export getStatusColor from lib/utils for backward compatibility
export { getStatusColor } from '@/lib/utils'

export const getStatusIcon = (status: string) => {
  const iconMap: Record<string, any> = {
    pending: 'Clock',
    confirmed: 'CheckCircle',
    shipped: 'Truck',
    delivered: 'Package',
    cancelled: 'X',
  }
  
  return iconMap[status] || 'Clock'
}
