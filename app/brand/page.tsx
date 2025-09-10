import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function BrandPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Genosys Gene Re-Birth System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              GENOSYS is the world's first microneedling-dedicated brand born by combining microneedling with the cosmeceuticals specially formulated for microneedling treatment to optimize the skin care effects.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/4L9xZc7wAjI"
                  title="Genosys Gene Re-Birth System"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <p className="text-gray-600 leading-relaxed text-lg text-center mb-8">
              With skin-friendly formulations and powerful active ingredients, GENOSYS homecare/professional lines not only provide long-lasting, visible results but also boosts the effectiveness of professional treatments.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/v-i6CHJfWIg?autoplay=1&loop=1&playlist=v-i6CHJfWIg&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1"
                  title="GENOSYS Professional Treatment"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <Image
                src="/images/genosys-products.jpg"
                alt="GENOSYS Professional Skincare Products"
                width={800}
                height={600}
                className="rounded-lg shadow-md mx-auto"
                priority
              />
              <p className="text-gray-500 text-base mt-4">
                GENOSYS Professional Skincare Line - Dermatologically Tested Products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}