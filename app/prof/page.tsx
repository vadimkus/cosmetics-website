import Link from 'next/link'
import { getAllProducts } from '@/lib/productsDb'
import type { Product } from '@/types'

interface TableProduct {
  name: string
  volume: string
  productCost: number
  expensePerProcedure: number | string
  procedureCost: number
  procedures: number
  productId?: string | null
  productIds?: Array<{ code: string; id: string; name: string }> | null
}

function findMatchingProduct(tableName: string, dbProducts: Product[]): Product | null {
  // Normalize names for comparison (remove extra spaces, convert to uppercase)
  const normalizedTableName = tableName.trim().toUpperCase().replace(/\s+/g, ' ')
  const normalizedTableNameNoSpaces = normalizedTableName.replace(/\s+/g, '')
  
  // Try exact match first
  let match = dbProducts.find(p => 
    p.name.trim().toUpperCase().replace(/\s+/g, ' ') === normalizedTableName ||
    p.name.trim().toUpperCase().replace(/\s+/g, '') === normalizedTableNameNoSpaces
  )
  
  // Try partial match (contains)
  if (!match) {
    match = dbProducts.find(p => {
      const dbName = p.name.trim().toUpperCase()
      return dbName.includes(normalizedTableName) || normalizedTableName.includes(dbName)
    })
  }
  
  // Try matching key words
  if (!match) {
    const tableWords = normalizedTableName.split(/\s+/).filter(w => w.length > 3)
    match = dbProducts.find(p => {
      const dbName = p.name.trim().toUpperCase()
      return tableWords.some(word => dbName.includes(word))
    })
  }
  
  return match || null
}

function findSolutionsProducts(productName: string, dbProducts: Product[]): Array<{ code: string; id: string; name: string }> | null {
  // Check if this is the Solutions product with multiple codes
  if (!productName.includes('AWS') && !productName.includes('SWS') && !productName.includes('PCS') && 
      !productName.includes('HES') && !productName.includes('CTS') && !productName.includes('CVS')) {
    return null
  }

  // Extract product codes from the name
  // Format: "Solutions (AWS/SWS/PCS/HES + CTS/CVS)"
  const codes: string[] = []
  
  // Extract codes from parentheses
  const match = productName.match(/\(([^)]+)\)/)
  if (match && match[1]) {
    const codesStr = match[1]
    // Split by / and +, then trim
    const parts = codesStr.split(/[/+]/).map(p => p.trim())
    codes.push(...parts)
  }

  if (codes.length === 0) return null

  // Find matching products in database
  const foundProducts: Array<{ code: string; id: string; name: string }> = []
  
  for (const code of codes) {
    // Look for products containing "POWER SOLUTION" and the code
    const product = dbProducts.find(p => {
      const dbName = p.name.trim().toUpperCase()
      return dbName.includes('POWER SOLUTION') && dbName.includes(code.toUpperCase())
    })
    
    if (product) {
      foundProducts.push({
        code: code.toUpperCase(),
        id: product.id,
        name: product.name
      })
    }
  }

  return foundProducts.length > 0 ? foundProducts : null
}

export default async function ProfPage() {
  // Fetch all products from database
  let dbProducts: Product[] = []
  try {
    dbProducts = await getAllProducts()
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  const tableProducts: TableProduct[] = [
    {
      name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER',
      volume: '200 ml',
      productCost: 145,
      expensePerProcedure: 0.5,
      procedureCost: 0.68,
      procedures: 400
    },
    {
      name: 'SNOW O₂ Cleanser',
      volume: '500 ml',
      productCost: 255,
      expensePerProcedure: 0.5,
      procedureCost: 0.25,
      procedures: 1000
    },
    {
      name: 'SNOW BOOSTER',
      volume: '1000 ml',
      productCost: 245,
      expensePerProcedure: 1,
      procedureCost: 0.24,
      procedures: 1000
    },
    {
      name: 'EZ CO₂ MASK',
      volume: '20g tube x 5, 12g sheet x 5',
      productCost: 230,
      expensePerProcedure: '1 tube+1 sheet',
      procedureCost: 46,
      procedures: 5
    },
    {
      name: 'Standard detachable Roller',
      volume: '1 pcs',
      productCost: 115,
      expensePerProcedure: '1 pcs',
      procedureCost: 7.66,
      procedures: 15
    },
    {
      name: 'Solutions (AWS/SWS/PCS/HES + CTS/CVS)',
      volume: '2ml * 10 vials',
      productCost: 290,
      expensePerProcedure: '1 vial',
      procedureCost: 29,
      procedures: 10
    },
    {
      name: 'HYDRO COOL MODELING MASK',
      volume: '1000 g',
      productCost: 300,
      expensePerProcedure: '30 g',
      procedureCost: 9,
      procedures: 34
    },
    {
      name: 'SOOTHING REPAIR POSTCREAM',
      volume: '20g',
      productCost: 102,
      expensePerProcedure: 0.5,
      procedureCost: 2.55,
      procedures: 40
    },
    {
      name: 'MULTI SUN CREAM',
      volume: '40g',
      productCost: 102,
      expensePerProcedure: '0.5g',
      procedureCost: 1.25,
      procedures: 80
    },
    {
      name: 'INTENSIVE BLEMISH BALM CREAM',
      volume: '50g',
      productCost: 125,
      expensePerProcedure: '0.5g',
      procedureCost: 1.25,
      procedures: 100
    }
  ]

  // Match table products with database products
  const productsWithLinks = tableProducts.map(tableProduct => {
    // Special handling for Solutions product with multiple codes
    const solutionsProducts = findSolutionsProducts(tableProduct.name, dbProducts)
    if (solutionsProducts) {
      return {
        ...tableProduct,
        productId: null,
        productIds: solutionsProducts
      }
    }
    
    // Regular product matching
    const dbProduct = findMatchingProduct(tableProduct.name, dbProducts)
    return {
      ...tableProduct,
      productId: dbProduct?.id || null,
      productIds: null
    }
  })

  const totalCost = 97.88
  const totalProductCost = tableProducts.reduce((sum, product) => sum + product.productCost, 0)
  const totalTreatmentCost = tableProducts.reduce((sum, product) => sum + product.procedureCost, 0)

  return (
    <div className="min-h-screen bg-white py-3 px-2 md:py-8 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-base md:text-xl font-bold text-primary-600 mb-3 md:mb-4 text-center">
          Basic Microneedling Treatment: Roller
        </h1>
        
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border-2 border-gray-300">
              <table className="min-w-full divide-y divide-gray-300 text-[9px] md:text-xs border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-left text-[9px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Product Name
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Volume
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Product Cost, AED
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      Product per 1 treatment
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                      1 treatment cost
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Treatments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productsWithLinks.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-[9px] md:text-xs text-gray-900 font-medium border-r border-gray-200 text-left uppercase">
                        {product.productIds && product.productIds.length > 0 ? (
                          <span>
                            PRO Solutions (
                            {product.productIds.map((p, idx) => (
                              <span key={p.id}>
                                {idx > 0 && ' / '}
                                <Link 
                                  href={`/products/${p.id}`}
                                  className="text-gray-900 underline hover:text-gray-700 transition-colors"
                                >
                                  {p.code}
                                </Link>
                              </span>
                            ))}
                            )
                          </span>
                        ) : product.productId ? (
                          <Link 
                            href={`/products/${product.productId}`}
                            className="text-gray-900 underline hover:text-gray-700 transition-colors"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          product.name
                        )}
                      </td>
                      <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-[9px] md:text-xs text-gray-600 border-r border-gray-200 text-center">
                        {product.volume}
                      </td>
                      <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-[9px] md:text-xs text-gray-900 border-r border-gray-200 text-center">
                        {product.productCost.toFixed(2)}
                      </td>
                      <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-[9px] md:text-xs text-gray-600 border-r border-gray-200 text-center">
                        {typeof product.expensePerProcedure === 'number' 
                          ? <span className="whitespace-nowrap">{product.expensePerProcedure.toFixed(1)}g</span>
                          : product.expensePerProcedure}
                      </td>
                      <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-[9px] md:text-xs text-gray-900 font-medium border-r border-gray-200 text-center">
                        {product.procedureCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-600 text-center">
                        {product.procedures}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary-50">
                    <td colSpan={2} className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-bold text-primary-600 border-r border-gray-200">
                      
                    </td>
                    <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-bold text-primary-600 border-r border-gray-200">
                      {totalProductCost.toFixed(2)} AED
                    </td>
                    <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-[9px] md:text-xs text-primary-600 border-r border-gray-200 text-center">
                      -
                    </td>
                    <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-bold text-primary-600 border-r border-gray-200">
                      {totalTreatmentCost.toFixed(2)} AED
                    </td>
                    <td className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-bold text-primary-600">
                      
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-t-2 border-gray-300">
                    <td colSpan={6} className="px-1.5 py-2 md:px-2 md:py-2.5 text-[9px] md:text-xs text-gray-900">
                      <div className="space-y-0.5">
                        <div>
                          1. Full product set: <span className="font-semibold">{totalProductCost.toFixed(2)} AED</span>
                        </div>
                        <div>
                          2. One treatment purchase cost: <span className="font-semibold">{totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
