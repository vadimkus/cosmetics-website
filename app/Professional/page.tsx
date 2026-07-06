import { getAllProducts } from '@/lib/productsDb'
import Link from 'next/link'
import { Product } from '@/types'
import { errorLog } from '@/lib/logger'
import type { Metadata } from 'next'

// Internal professional cost/margin tool — not for public search indexing.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface TableProduct {
  name: string
  volume: string
  productCost: number
  expensePerProcedure: number | string
  procedureCost: number
  procedures: number
  productId?: string | null
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

export default async function ProfessionalPage() {
  // Fetch all products from database
  let dbProducts: Product[] = []
  try {
    dbProducts = await getAllProducts()
  } catch (error) {
    errorLog('Error fetching products:', error)
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
      name: 'SNOW O₂',
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
      volume: '40 g',
      productCost: 102,
      expensePerProcedure: '0.5 g',
      procedureCost: 1.25,
      procedures: 80
    },
    {
      name: 'INTENSIVE BLEMISH BALM CREAM',
      volume: '50 g',
      productCost: 125,
      expensePerProcedure: '0.5 g',
      procedureCost: 1.25,
      procedures: 100
    }
  ]

  // Match table products with database products
  const productsWithLinks = tableProducts.map(tableProduct => {
    const dbProduct = findMatchingProduct(tableProduct.name, dbProducts)
    return {
      ...tableProduct,
      productId: dbProduct?.id || null
    }
  })

  const totalCost = 97.88
  const totalProductCost = tableProducts.reduce((sum, product) => sum + product.productCost, 0)

  return (
    <div className="min-h-screen bg-white py-4 px-3 md:py-8 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-lg md:text-xl font-bold text-primary-600 mb-4 text-center">
          Microneedling Treatment: Roller
        </h1>
        <p className="text-sm text-gray-600 mb-4 text-center">Professional Treatment Cost Breakdown</p>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 text-xs md:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-2 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product Cost, AED
                    </th>
                    <th className="px-2 py-2 text-left text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Expense per 1 procedure
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      1 treatment cost, AED
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Procedures
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productsWithLinks.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-900 font-medium">
                        {product.productId ? (
                          <Link 
                            href={`/products/${product.productId}`}
                            className="text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          product.name
                        )}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-600">
                        {product.volume}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-900 text-right">
                        {product.productCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-600">
                        {typeof product.expensePerProcedure === 'number' 
                          ? product.expensePerProcedure.toFixed(1)
                          : product.expensePerProcedure}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-900 text-right font-medium">
                        {product.procedureCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-gray-600 text-right">
                        {product.procedures}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary-50">
                    <td colSpan={2} className="px-2 py-2 text-right text-[10px] md:text-xs font-bold text-primary-600">
                      Total:
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right text-[10px] md:text-xs font-bold text-primary-600">
                      {totalProductCost.toFixed(2)}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-[10px] md:text-xs text-primary-600">
                      -
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right text-[10px] md:text-xs text-primary-600">
                      -
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right text-[10px] md:text-xs font-bold text-primary-600">
                      {totalCost.toFixed(2)} AED
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






