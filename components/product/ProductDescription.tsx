'use client'

import { Product } from '@/types'

interface ProductDescriptionProps {
  product: Product
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const renderProductDescription = () => {
    if (product.id === '1') {
      return (
        <>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
          <p className="text-gray-600 mb-4 text-sm">
            DTS Roller is a medical device for skin needling. It is a derma roller with 192 needles. It is used for skin regeneration, skin tightening, and to improve the appearance of scars, wrinkles, and stretch marks. It is also used to enhance the absorption of active ingredients.
          </p>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
          <ul className="list-disc list-inside text-gray-600 mb-4 text-sm">
            <li>192 needles</li>
            <li>Medical device</li>
            <li>Sterilized by gamma radiation</li>
            <li>Ergonomic design</li>
            <li>Needle length options: 0.25mm, 0.5mm, 0.1mm, 0.15mm, 0.2mm</li>
          </ul>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
          <p className="text-gray-600 mb-4 text-sm">
            Cleanse face thoroughly. Gently roll the DTS Roller over the skin in horizontal, vertical, and diagonal directions for 5-10 minutes. Apply a suitable serum or cream after rolling. Clean the roller with alcohol after each use.
          </p>
        </>
      )
    }

    if (product.id === '10') {
      return (
        <>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
          <p className="text-gray-600 mb-4 text-sm">
            SNOW O₂ CLEANSER is a revolutionary oxygen bubble cleanser that combines gentle cleansing with oxygen therapy
            for deep skin nourishment. This innovative formula naturally generates oxygen bubbles to effectively
            remove makeup, dirt, and impurities while providing a luxurious treatment sensation without irritation.
          </p>

          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
          <ul className="list-disc list-inside text-gray-600 mb-4 text-sm">
            <li>All-in-one gentle cleanser with oxygen bubbles</li>
            <li>Cleans make-up, dirt, and skin impurities without irritation</li>
            <li>Oxygen therapy mechanism for deep cleansing and nutrifying</li>
            <li>Key ingredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether</li>
            <li>Dermatologically tested</li>
          </ul>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
          <p className="text-gray-600 mb-4 text-sm">
            Apply the product to a dry face, avoiding the eyes, and wait for oxygen bubbles to come up. Wet your fingers to spread the product and let bubbles form again. After they fully develop, massage gently with wet hands, then rinse with lukewarm water.
          </p>
        </>
      )
    }

    if (product.id === '52' || product.name === 'GENOSYS SKIN REBOOT PDRN MASK PACK') {
      return (
        <>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
          <p className="text-gray-600 mb-4 text-sm">
            The GENOSYS Skin Reboot PDRN Mask Pack is an innovative facial mask designed to rejuvenate and revitalize the skin. Infused with Polydeoxyribonucleotide (PDRN), this mask promotes cell regeneration, improves skin elasticity, and provides intense hydration. It helps to reduce the appearance of fine lines and wrinkles, leaving the skin smoother, firmer, and more radiant. Ideal for post-procedure care or as a weekly treatment for enhanced skin health.
          </p>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
          <ul className="list-disc list-inside text-gray-600 mb-4 text-sm">
            <li>Contains PDRN for cell regeneration</li>
            <li>Improves skin elasticity and firmness</li>
            <li>Provides intense hydration</li>
            <li>Reduces fine lines and wrinkles</li>
            <li>Suitable for post-procedure care</li>
          </ul>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
          <p className="text-gray-600 mb-4 text-sm">
            After cleansing and toning, apply the mask evenly to the face. Leave on for 15-20 minutes, then remove and gently pat any remaining essence into the skin. Use 1-2 times a week for best results.
          </p>
        </>
      )
    }

    if (product.id === '4') {
      return (
        <>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
          <p className="text-gray-600 mb-4 text-sm">
            POWER SOLUTION HES is a professional hydrating and firming ampoule specifically formulated for microneedling treatments.
            This advanced formula combines powerful hydrating agents with firming peptides to provide long-lasting moisturizing
            and plumping effects while relieving skin irritation and promoting optimal healing post-treatment.
          </p>

          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Professional Microneedling Formula</h5>
              <p className="text-sm text-gray-600">
                Specifically designed for use with microneedling treatments to maximize ingredient penetration and effectiveness.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hydrating & Firming</h5>
              <p className="text-sm text-gray-600">
                Advanced formula that provides deep hydration while promoting skin firmness and elasticity.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Growth Factor Technology</h5>
              <p className="text-sm text-gray-600">
                Contains sh-polypeptide-7, a human growth hormone-like peptide for enhanced skin regeneration.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Skin-Friendly Formulation</h5>
              <p className="text-sm text-gray-600">
                Free from harmful additives, parabens, ethanol, artificial fragrances, and sulfates for safe use.
              </p>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits</h4>
          <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
            <li>Deep Hydration - Provides long-lasting moisturizing effects for plump, hydrated skin</li>
            <li>Skin Firming - Promotes skin elasticity and firmness for youthful appearance</li>
            <li>Irritation Relief - Soothes and calms skin irritation from microneedling treatments</li>
            <li>Enhanced Penetration - Optimized for microneedling to maximize ingredient absorption</li>
            <li>Skin Regeneration - Stimulates cellular renewal and healing processes</li>
            <li>Professional Results - Delivers clinical-grade results for advanced skincare treatments</li>
          </ul>

          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Ingredients</h4>
          <div className="space-y-3 mb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">sh-Polypeptide-7</h5>
              <p className="text-sm text-gray-600">
                Human growth hormone-like peptide that stimulates skin regeneration and healing processes.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Hyaluronic Acid</h5>
              <p className="text-sm text-gray-600">
                Powerful humectant that attracts and retains moisture for deep hydration and plumping effects.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">BIOPHYTEX™</h5>
              <p className="text-sm text-gray-600">
                Advanced botanical complex that provides antioxidant protection and skin nourishment.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Copper Tripeptide-1</h5>
              <p className="text-sm text-gray-600">
                Healing peptide that promotes skin repair and reduces inflammation for faster recovery.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Panthenol</h5>
              <p className="text-sm text-gray-600">
                Soothing and hydrating ingredient that helps maintain skin barrier function and comfort.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h5 className="font-semibold text-gray-800 mb-1 text-sm">Phytosphingosine</h5>
              <p className="text-sm text-gray-600">
                Natural lipid that supports skin barrier function and provides anti-inflammatory benefits.
              </p>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <ol className="list-decimal list-inside text-gray-600 space-y-2 text-sm">
              <li><strong>Preparation:</strong> Cleanse skin thoroughly and prepare for microneedling treatment</li>
              <li><strong>Application:</strong> Apply 1-2 ampoules during microneedling treatment for optimal penetration</li>
              <li><strong>Post-Treatment:</strong> Continue application for 3-5 days post-treatment for enhanced results</li>
              <li><strong>Frequency:</strong> Use as directed by your skincare professional</li>
              <li><strong>Storage:</strong> Store in cool, dry place and use within recommended timeframe</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-blue-800 mb-2 text-sm">Product Details</h5>
            <div className="space-y-2 text-blue-800 text-sm">
              <p><strong>Type:</strong> Professional hydrating and firming ampoule</p>
              <p><strong>Size:</strong> 2ml x 10ea</p>
              <p><strong>Treatment:</strong> Microneedling, professional skincare</p>
              <p><strong>Skin Type:</strong> All skin types, especially dry and aging skin</p>
              <p><strong>Usage:</strong> Professional treatments, post-microneedling care</p>
              <p><strong>Origin:</strong> Made in South Korea</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <strong>Note:</strong> This product is dermatologically tested and specifically formulated for professional use.
              For best results, use as directed by your skincare professional. Not recommended for home use without
              professional guidance. Store in a cool, dry place away from direct sunlight.
            </p>
          </div>
        </>
      )
    }

    if (product.id === '5') {
      return (
        <>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Product Description</h3>
          <p className="text-gray-600 mb-4 text-sm">
            POWER SOLUTION CVS is a professional skin revitalizing ampoule designed specifically for microneedling treatments.
            This advanced formula supplies essential nutrients to the skin while providing soothing and hydrating benefits
            to promote optimal healing and skin regeneration post-treatment.
          </p>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features</h4>
          <ul className="list-disc list-inside text-gray-600 mb-4 text-sm">
            <li>Professional microneedling formula</li>
            <li>Skin revitalizing and nutrient supply</li>
            <li>Soothing and hydrating benefits</li>
            <li>Promotes optimal healing</li>
            <li>Skin regeneration support</li>
          </ul>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">How to Use</h4>
          <p className="text-gray-600 mb-4 text-sm">
            Apply during microneedling treatment for optimal penetration. Continue application for 3-5 days post-treatment for enhanced results. Use as directed by your skincare professional.
          </p>
        </>
      )
    }

    return <p className="text-gray-600 text-sm">{product.description}</p>
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
      {renderProductDescription()}
    </div>
  )
}
