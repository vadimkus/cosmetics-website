import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'

export default function TrainingPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Genosys Professional Video Lessons
            </h1>
          </div>

          {/* Download Documents Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-12">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Download Documents
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Access our guides and training manuals to enhance your professional/home training
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                      <Download className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Product Catalogue 2026
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Complete product overview and specifications
                    </p>
                    <a 
                      href="/documents/genosys-product-catalogue-2025.pdf.pdf"
                      download="Genosys-Product-Catalogue-2026.pdf"
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </div>
                </div>
                
                <div className="group border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                      <Download className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Home Care Guide 2026
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Professional home care protocols and guidelines
                    </p>
                    <a 
                      href="/documents/genosys-home-care-guide.pdf"
                      download="Genosys-Home-Care-Guide-2026.pdf"
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </div>
                </div>
                
                <div className="group border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors">
                      <Download className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Professional Manual 2026
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Comprehensive professional treatment manual
                    </p>
                    <a 
                      href="/documents/genosys-professional-manual.pdf"
                      download="Genosys-Professional-Manual-2026.pdf"
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Lessons Section */}
          <div className="mt-16">
            
            <div className="grid gap-8">
              {/* Genosys Bodycell Stretch Mark Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Genosys Bodycell Stretch Mark Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn the professional techniques for treating stretch marks using Genosys Bodycell technology. 
                    This comprehensive training covers proper application methods, safety protocols, and expected results.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SvjziVjhb8s"
                      title="Genosys Bodycell Stretch Mark Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Proper product application techniques</li>
                        <li>• Safety protocols and precautions</li>
                        <li>• Treatment duration and frequency</li>
                        <li>• Expected results and timeline</li>
                        <li>• Client consultation best practices</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 15-20 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Body Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys NDcell Neck & Decollete Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Genosys NDcell Neck & Decollete Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the specialized techniques for treating the delicate neck and décolletage area using Genosys NDcell technology. 
                    This advanced training covers proper application methods, safety considerations, and achieving optimal results for this sensitive area.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/m07q2XRt_OM"
                      title="Genosys NDcell Neck & Decollete Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Specialized neck and décolletage techniques</li>
                        <li>• Proper handling of sensitive skin areas</li>
                        <li>• Treatment protocols and timing</li>
                        <li>• Client positioning and comfort</li>
                        <li>• Post-treatment care instructions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 18-22 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Specialized Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys EyeCell Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Genosys EyeCell Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn the precise techniques for treating the delicate eye area using Genosys EyeCell technology. 
                    This specialized training covers safe application methods, client comfort protocols, and achieving optimal results for the sensitive periocular region.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/xH58EZtykZE"
                      title="Genosys EyeCell Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Precise eye area treatment techniques</li>
                        <li>• Safety protocols for sensitive eye region</li>
                        <li>• Client positioning and eye protection</li>
                        <li>• Treatment intensity and duration</li>
                        <li>• Post-treatment care and recommendations</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 16-20 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Specialized Eye Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys HR3 Matrix Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Genosys HR3 Matrix Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the advanced HR3 Matrix treatment techniques using Genosys technology. 
                    This comprehensive training covers matrix application methods, treatment protocols, and achieving optimal results for skin rejuvenation and matrix enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/qQRcEvd3Ks4"
                      title="Genosys HR3 Matrix Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• HR3 Matrix application techniques</li>
                        <li>• Treatment protocols and timing</li>
                        <li>• Skin preparation and assessment</li>
                        <li>• Client consultation and expectations</li>
                        <li>• Post-treatment care and follow-up</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 20-25 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Matrix Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facial Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Facial Treatment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Learn comprehensive facial treatment techniques using Genosys products and protocols. 
                    This essential training covers complete facial procedures, product application sequences, and achieving optimal results for various skin types and concerns.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/hMtodh45sME"
                      title="Facial Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Complete facial treatment protocols</li>
                        <li>• Product application sequences</li>
                        <li>• Skin analysis and assessment</li>
                        <li>• Client consultation techniques</li>
                        <li>• Treatment customization methods</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 25-30 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Facial Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to use Genosys Snow 02 Cleanser Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    How to use Genosys Snow 02 Cleanser
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Master the proper techniques for using Genosys Snow 02 Cleanser effectively. 
                    This detailed training covers correct application methods, timing, and achieving optimal cleansing results for different skin types and conditions.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SWY0f2gSzl8"
                      title="How to use Genosys Snow 02 Cleanser Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Proper Snow 02 Cleanser application</li>
                        <li>• Correct timing and duration</li>
                        <li>• Skin type considerations</li>
                        <li>• Product benefits and results</li>
                        <li>• Integration with other treatments</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 12-15 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Product Usage</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    GENOSYS HR3 MATRIX
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Advanced training on GENOSYS HR3 MATRIX technology and application techniques. 
                    This comprehensive lesson covers matrix treatment protocols, advanced application methods, and achieving optimal results for skin rejuvenation and matrix enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/pM8qIUNdORY"
                      title="GENOSYS HR3 MATRIX Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Advanced HR3 MATRIX techniques</li>
                        <li>• Matrix treatment protocols</li>
                        <li>• Skin assessment and preparation</li>
                        <li>• Treatment customization methods</li>
                        <li>• Results optimization strategies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 22-28 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Matrix Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Specialized training on GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA for advanced hair treatment protocols. 
                    This comprehensive lesson covers hair matrix treatment techniques, scalp preparation, and achieving optimal results for hair restoration and enhancement.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/ZVg5mBVStSw"
                      title="GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Hair matrix treatment protocols</li>
                        <li>• Scalp preparation techniques</li>
                        <li>• ALPHA solution application methods</li>
                        <li>• Hair restoration procedures</li>
                        <li>• Treatment customization for hair types</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 24-30 minutes</li>
                        <li>• Level: Advanced Professional</li>
                        <li>• Category: Hair Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Specialized training on Eye Cell Treatment using the Eye Roller 0.25mm for precise eye zone treatments. 
                    This detailed lesson covers proper roller techniques, eye area safety protocols, and achieving optimal results for the delicate periocular region.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/zTOnPRnMy8k"
                      title="Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Eye Roller 0.25mm application techniques</li>
                        <li>• Eye zone treatment protocols</li>
                        <li>• Safety measures for delicate eye area</li>
                        <li>• Proper roller pressure and movement</li>
                        <li>• Post-treatment care for eye zone</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Lesson Details:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Duration: 14-18 minutes</li>
                        <li>• Level: Professional</li>
                        <li>• Category: Eye Treatments</li>
                        <li>• Certification: Available upon completion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder for future lessons */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  More Training Lessons Coming Soon
                </h3>
                <p className="text-gray-500">
                  We're continuously adding new training content. Check back regularly for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
