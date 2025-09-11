import { NextRequest, NextResponse } from 'next/server'

// This would typically come from a database, but for now we'll use static data
// You can replace these with actual blob URLs after uploading
const trainingFiles = [
  {
    id: 'catalogue-2026',
    name: 'Product Catalogue 2026',
    description: 'Complete product overview and specifications',
    url: '/documents/genosys-product-catalogue-2025.pdf.pdf', // Replace with blob URL
    filename: 'Genosys-Product-Catalogue-2026.pdf'
  },
  {
    id: 'home-care-guide',
    name: 'Home Care Guide 2026',
    description: 'Professional home care protocols and guidelines',
    url: '/documents/genosys-home-care-guide.pdf', // Replace with blob URL
    filename: 'Genosys-Home-Care-Guide-2026.pdf'
  },
  {
    id: 'professional-manual',
    name: 'Professional Manual 2026',
    description: 'Comprehensive professional treatment manual',
    url: '/documents/genosys-professional-manual.pdf', // Replace with blob URL
    filename: 'Genosys-Professional-Manual-2026.pdf'
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      files: trainingFiles
    })
  } catch (error) {
    console.error('Error fetching training files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training files' },
      { status: 500 }
    )
  }
}
