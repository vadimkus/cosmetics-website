'use client'

import dynamic from 'next/dynamic'

const PartnersMap = dynamic(() => import('@/components/partners/PartnersMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
      <p className="text-gray-600">Loading map...</p>
    </div>
  )
})

export default PartnersMap

