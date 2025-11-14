const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createBioFermentBlogPost() {
  try {
    const title = 'NEW: BIO-FERMENT AGE DEFYING POWDER MASK - Advanced Anti-Aging with Growth Factors & Fermented Energy'
    const slug = 'bio-ferment-age-defying-powder-mask-launch'
    const excerpt = 'Introducing the GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK - a revolutionary powder mask infused with fermented energy and growth factors that provides rapid soothing and deep nourishment to skin weakened by external stressors.'
    
    const content = `
<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      We're thrilled to introduce the newest addition to the GENOSYS professional skincare collection: the <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">BIO-FERMENT AGE DEFYING POWDER MASK</a>. This revolutionary powder mask combines the power of fermented energy and growth factors to deliver rapid soothing and deep nourishment to skin weakened by external stressors.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      Unlike traditional masks that dry out, this moisture-locking top-quality diatomaceous earth base mask provides powerful anti-aging benefits with exceptional hydrating effects and a temporary decrease in skin temperature for a cooling sensation.
    </p>
  </div>

  <div class="feature-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">What Makes This Powder Mask Special?</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      The <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> is a professional-grade powder mask designed for both professional use and homecare. It stands out with its unique combination of advanced ingredients:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <div class="text-4xl mb-4">🌿</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">6 Types of Regenerative Peptides</h3>
        <p class="text-gray-700 leading-relaxed">
          Features a comprehensive Growth Factor Complex including EGF, FGF, IGF, KGF, VEGF, and TGF. These powerful peptides stimulate cell proliferation, promote collagen synthesis, accelerate wound healing, and enhance skin's natural renewal process.
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="text-4xl mb-4">⚗️</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">4 Types of Fermented Products</h3>
        <p class="text-gray-700 leading-relaxed">
          Harnesses the power of fermentation with Lactobacillus/Punica Granatum Fruit Ferment, Bacillus/Soybean Ferment, Galactomyces Ferment Filtrate, and Bifida Ferment Lysate. Fermentation enhances ingredient effectiveness and safety while supporting the skin's barrier.
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="text-4xl mb-4">💧</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Moisture-Locking Technology</h3>
        <p class="text-gray-700 leading-relaxed">
          Built on a top-quality diatomaceous earth base, this mask doesn't dry out like traditional masks. It locks in moisture while providing deep hydration and a temporary cooling effect that reduces skin temperature.
        </p>
      </div>
    </div>
  </div>

  <div class="comparison-section mb-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Comparison: BIO-FERMENT vs HYDRO COOL MODELING MASK</h2>
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">BIO-FERMENT AGE DEFYING POWDER MASK</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Size:</strong> 300g / 10.582 oz</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Use:</strong> Professional / Homecare</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Specialty:</strong> Moisturizing mask that doesn't dry out</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Best For:</strong> Moisturizing and soothing with added nutrients</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">HYDRO COOL MODELING MASK</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Size:</strong> 1kg / 35.2 oz</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Use:</strong> Professional use</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Specialty:</strong> Cooling mask until removed</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Best For:</strong> Quickly calming down skin temperature</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="clinical-results-section mb-10 bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Clinical Results</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Clinical studies have demonstrated exceptional results in both skin hydration and cooling effects:
    </p>
    
    <div class="grid md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Improvement of Skin Hydration</h3>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-primary-600 mb-1">322.971%</div>
            <p class="text-sm text-gray-600">Improvement in skin moisture content</p>
            <p class="text-xs text-gray-500 mt-1">Mid 50s, normal to dry skin</p>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="text-2xl font-bold text-primary-600 mb-1">327.066%</div>
            <p class="text-sm text-gray-600">Improvement in skin moisture content</p>
            <p class="text-xs text-gray-500 mt-1">Late 40s, dry skin</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Decrease in Skin Temperature (Cooling Effect)</h3>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-primary-600 mb-1">29.569%</div>
            <p class="text-sm text-gray-600">Temperature reduction (-11°C)</p>
            <p class="text-xs text-gray-500 mt-1">Mid 50s, normal to dry skin</p>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="text-2xl font-bold text-primary-600 mb-1">27.520%</div>
            <p class="text-sm text-gray-600">Temperature reduction (-10°C)</p>
            <p class="text-xs text-gray-500 mt-1">Late 30s, oily skin</p>
          </div>
        </div>
      </div>
    </div>
    
    <p class="text-gray-700 mt-4 leading-relaxed">
      These clinically proven results demonstrate the mask's exceptional ability to improve skin hydration while providing a significant cooling effect, making it ideal for calming irritated or heated skin.
    </p>
  </div>

  <div class="images-section mb-10">
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof.jpeg" alt="BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof2.jpeg" alt="BIO-FERMENT AGE DEFYING POWDER MASK Application" class="w-full h-64 object-cover" />
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof3.jpeg" alt="BIO-FERMENT AGE DEFYING POWDER MASK Results" class="w-full h-64 object-cover" />
      </div>
    </div>
  </div>

  <div class="ingredients-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Key Ingredients</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      The <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">BIO-FERMENT AGE DEFYING POWDER MASK</a> is formulated with a comprehensive blend of scientifically-proven ingredients organized into three key complexes:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Growth Factor Complex (6GFs)</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">EGF (Epidermal Growth Factor):</strong> Stimulates proliferation and differentiation of keratinocytes, promotes natural cell renewal and wound healing.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">FGF (Fibroblast Growth Factor):</strong> Stimulates fibroblast cell growth, promotes synthesis of collagen, elastin and extracellular matrix components.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">IGF (Insulin-like Growth Factor):</strong> Stimulates cell proliferation and promotes wound healing.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">KGF (Keratinocyte Growth Factor):</strong> Stimulates proliferation and migration of keratinocytes, accelerates natural healing, promotes stratum corneum growth.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">VEGF (Vascular Endothelial Growth Factor):</strong> Stimulates blood vessel formation, promoting oxygen and nutrient delivery to skin.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">TGF (Transforming Growth Factor):</strong> Stimulates cell proliferation and differentiation, heals wounds.
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Fermented Energy Complex</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Lactobacillus/Punica Granatum Fruit Ferment Extract:</strong> Probiotic benefits that support skin barrier and reduce inflammation.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Bacillus/Soybean Ferment Extract:</strong> Enhanced bioavailability and effectiveness through fermentation process.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Galactomyces Ferment Filtrate:</strong> Rich in amino acids and vitamins, brightens and hydrates skin.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Bifida Ferment Lysate:</strong> Strengthens skin barrier, improves skin resilience and reduces sensitivity.
            </div>
          </li>
        </ul>
        <p class="text-sm text-gray-600 mt-4 italic">
          Fermentation leverages natural biochemical reactions to enhance effectiveness and safety, resulting in probiotics or postbiotics that support the skin's barrier and reduce inflammation.
        </p>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Moisturizing & Soothing Complex</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Glycyrrhiza Glabra (Licorice) Root Extract:</strong> Rich in flavonoids (glabridin, liquiritin, licochalcone) and saponin (Glycyrrhizin). Inhibits melanogenesis, provides anti-inflammatory effects, neutralizes free radicals.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Oryza Sativa (Rice) Bran Extract:</strong> Rich source of over 100 antioxidant compounds including vitamin E, ferulic acid, and oryzanol. Protects from oxidative stress, keeps skin smooth and moist.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Chamaecyparis Obtusa Water (Cypress Water):</strong> Rich in phytoncides with antimicrobial, anti-inflammatory, and soothing properties. Calms irritated skin and improves skin infections.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Aloe Barbadensis Leaf Extract:</strong> Rich in vitamins (A,B,C,E,B12), amino acids, and minerals. Offers antioxidant qualities, reduces irritation, promotes healing, and moisturizes skin.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Hydrolyzed Collagen:</strong> Promotes dewy and smooth appearance by increasing skin's moisture levels, firms skin.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Allantoin:</strong> Excellent anti-inflammatory and anti-irritant properties. Increases water content, exfoliates dead skin cells for cleaner, brighter complexion.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="how-to-use-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">How to Use</h2>
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <ol class="space-y-4 text-gray-700">
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
          <span class="pt-1">Mix three scoops of powder (40g) with four and a half scoops of water using the provided measuring cup. Use a Powder 1: Water 1.5 ratio.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
          <span class="pt-1">Apply evenly to the treatment area, avoiding the eyes and eyebrows.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
          <span class="pt-1">Peel off after 15-20 minutes and wipe off any residue with toner.</span>
        </li>
      </ol>
      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-gray-700 font-semibold mb-2">⚠️ Important Caution:</p>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• After use, close the cap and keep it tightly sealed.</li>
          <li>• Due to the nature of the powder type, the product may deteriorate if exposed to light or moisture in the air.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="benefits-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Key Benefits</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Exceptional Hydration</h3>
          <p class="text-gray-600 text-sm">Clinically proven to improve skin moisture content by over 320%</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Cooling Effect</h3>
          <p class="text-gray-600 text-sm">Reduces skin temperature by up to 11°C, providing immediate cooling sensation</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Anti-Aging Power</h3>
          <p class="text-gray-600 text-sm">6 types of growth factors stimulate collagen synthesis and cell renewal</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Moisture-Locking Technology</h3>
          <p class="text-gray-600 text-sm">Doesn't dry out like traditional masks, maintains hydration throughout use</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Dual Use</h3>
          <p class="text-gray-600 text-sm">Suitable for both professional use in clinics and homecare applications</p>
        </div>
      </div>
    </div>
  </div>

  <div class="beneficiaries-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Who Can Benefit?</h2>
    <p class="text-lg text-gray-700 mb-4 leading-relaxed">
      This powder mask is ideal for:
    </p>
    <ul class="space-y-3 text-gray-700">
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Clients seeking advanced anti-aging treatments</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Those with dehydrated or dry skin</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Individuals experiencing skin irritation or inflammation</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Clients needing post-treatment recovery and soothing</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Professional clinics requiring effective anti-aging treatments</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Homecare users seeking professional-grade results</span>
      </li>
    </ul>
  </div>

  <div class="application-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Professional Application</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      The <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> is designed for both professional use in clinics and spas, as well as homecare applications. It can be incorporated into facial treatments, used as a post-treatment recovery mask, or recommended for regular at-home use. The 300g size provides multiple applications, making it cost-effective for both professional and personal use.
    </p>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">About GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS is a professional Korean dermacosmetics brand distributed by GENOSYS Middle East FZ-LLC in the UAE. All our products are certified by Dubai Municipality and are suitable for licensed practitioners and professional beauty clinics. We are the official distributor of DTS MG Co., Ltd. Korea, ensuring authentic and certified products.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 mb-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Experience Clinically Proven Results</h2>
    <p class="text-lg mb-6 text-gray-700 leading-relaxed">
      Experience the exceptional anti-aging and hydrating effects with the new <a href="/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a>. This innovative product combines cutting-edge Korean skincare technology with fermented energy and growth factors to deliver exceptional results.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="/products/51" class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg">
        View Product Details
      </a>
      <a href="mailto:sales@genosys.ae" class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center border border-primary-600 shadow-md hover:shadow-lg">
        Contact Sales Team
      </a>
      <a href="https://wa.me/971585487665" target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center shadow-md hover:shadow-lg">
        WhatsApp Us
      </a>
    </div>
  </div>

  <div class="source-section text-sm text-gray-500 border-t border-gray-200 pt-6">
    <p>
      <em>Source: <a href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">Product Documentation PDF</a></em>
    </p>
  </div>
</div>
    `.trim()

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (existingPost) {
      console.log(`Blog post with slug "${slug}" already exists. Updating instead...`)
      const updatedPost = await prisma.blogPost.update({
        where: { slug },
        data: {
          title,
          excerpt,
          content,
          featuredImage: '/blog/biof3.jpeg',
          authorName: 'GENOSYS Team',
          published: true,
          publishedAt: new Date(),
          tags: JSON.stringify(['BIO-FERMENT', 'Powder Mask', 'Anti-Aging', 'Growth Factors', 'Fermented Skincare', 'Professional Skincare', 'Korean Skincare', 'Hydration', 'Cooling Mask']),
        },
      })
      console.log('✅ Blog post updated successfully!')
      console.log('Post ID:', updatedPost.id)
      console.log('Slug:', updatedPost.slug)
      console.log('Title:', updatedPost.title)
      return
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        featuredImage: '/blog/biof3.jpeg',
        authorName: 'GENOSYS Team',
        published: true,
        publishedAt: new Date(),
        tags: JSON.stringify(['BIO-FERMENT', 'Powder Mask', 'Anti-Aging', 'Growth Factors', 'Fermented Skincare', 'Professional Skincare', 'Korean Skincare', 'Hydration', 'Cooling Mask']),
      },
    })

    console.log('✅ Blog post created successfully!')
    console.log('Post ID:', newPost.id)
    console.log('Slug:', newPost.slug)
    console.log('Title:', newPost.title)
  } catch (error) {
    console.error('❌ Error creating blog post:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createBioFermentBlogPost()

