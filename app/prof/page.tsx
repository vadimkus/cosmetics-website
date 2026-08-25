import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllProducts } from '@/lib/productsDb'
import { errorLog } from '@/lib/logger'
import type { Product } from '@/types'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

/**
 * The professional treatment-cost table: per-procedure cost, expense per procedure and
 * how many procedures a unit yields. That is clinic margin structure, and it was being
 * served to crawlers under the homepage title because the route had no metadata at all.
 *
 * Kept out of the index deliberately. If this is ever wanted as a public B2B landing page,
 * flip `index` and give it a real title and description first.
 */
export const metadata: Metadata = {
  title: 'Professional treatment costs - GENOSYS',
  description: 'Per-procedure cost reference for GENOSYS professional treatments.',
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
      productCost: 105,
      expensePerProcedure: '0.5g',
      procedureCost: 1.31,
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

  // Second table products
  const genosysProducts: TableProduct[] = [
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
      name: 'Solutions (AWS/SWS/PCS/HES + CTS/CVS)',
      volume: '2ml * 10 vials',
      productCost: 290,
      expensePerProcedure: '1 vial',
      procedureCost: 29,
      procedures: 10
    },
    {
      name: 'Standard Manual Roller',
      volume: '1 pcs',
      productCost: 115,
      expensePerProcedure: '1 pcs',
      procedureCost: 7.66,
      procedures: 15
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
      productCost: 105,
      expensePerProcedure: '0.5g',
      procedureCost: 1.31,
      procedures: 80
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
      name: 'INTENSIVE BLEMISH BALM CREAM',
      volume: '50 g',
      productCost: 125,
      expensePerProcedure: '0.5g',
      procedureCost: 1.25,
      procedures: 100
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
      name: 'SKIN RENEWAL PEELING SYSTEM (SRS)',
      volume: '2ml * 10 vials',
      productCost: 405,
      expensePerProcedure: '1 vial',
      procedureCost: 40.5,
      procedures: 10
    },
    {
      name: 'INTENSIVE HYDRO SOOTHING CREAM (250g)',
      volume: '250 ml',
      productCost: 210,
      expensePerProcedure: 0.5,
      procedureCost: 0.42,
      procedures: 500
    },
    {
      name: 'INTENSIVE MULTI FUNCTIONAL CREAM (250g)',
      volume: '250 ml',
      productCost: 210,
      expensePerProcedure: 0.5,
      procedureCost: 0.42,
      procedures: 500
    },
    {
      name: 'INTENSIVE PROBLEM CONTROL CREAM (250g)',
      volume: '250 ml',
      productCost: 210,
      expensePerProcedure: 0.5,
      procedureCost: 0.42,
      procedures: 500
    },
    {
      name: 'SKIN BARRIER PROTECTING CREAM',
      volume: '100 g',
      productCost: 225,
      expensePerProcedure: 0.5,
      procedureCost: 1.12,
      procedures: 200
    },
    {
      name: 'PEPTIDE GEL MASK',
      volume: '39g sheet x 5',
      productCost: 190,
      expensePerProcedure: '1 sheet',
      procedureCost: 38,
      procedures: 5
    },
    {
      name: 'ND Cell ANTI-WRINKLE CREAM',
      volume: '50 ml',
      productCost: 185,
      expensePerProcedure: '1ml',
      procedureCost: 3.7,
      procedures: 50
    },
    {
      name: 'EyeCell EYE CONTOUR CREAM',
      volume: '20g',
      productCost: 185,
      expensePerProcedure: 0.2,
      procedureCost: 1.85,
      procedures: 40
    },
    {
      name: 'EyeCell EYE CONTOUR SERUM',
      volume: '10 ml',
      productCost: 185,
      expensePerProcedure: 0.2,
      procedureCost: 3.7,
      procedures: 20
    },
    {
      name: 'HR³ MATRIX HAIR SOLUTION α',
      volume: 'Hair Solution x 8ea',
      productCost: 370,
      expensePerProcedure: '1 vial',
      procedureCost: 46.25,
      procedures: 8
    },
    {
      name: 'HR³ MATRIX SCALP & HAIR SHAMPOO',
      volume: '300 ml',
      productCost: 170,
      expensePerProcedure: '5ml',
      procedureCost: 2.83,
      procedures: 60
    },
    {
      name: 'HR³ MATRIX SCALP PEELING',
      volume: '100 ml',
      productCost: 145,
      expensePerProcedure: '2ml',
      procedureCost: 2.9,
      procedures: 50
    },
    {
      name: 'HR³ MATRIX HAIR TONIC',
      volume: '70 ml',
      productCost: 145,
      expensePerProcedure: '2ml',
      procedureCost: 4.14,
      procedures: 35
    },
    {
      name: 'HR³ MATRIX HAIR SOLUTION box',
      volume: '5ml*8pcs',
      productCost: 370,
      expensePerProcedure: '1 vial',
      procedureCost: 46,
      procedures: 8
    }
  ]

  // Match genosys products with database products
  const genosysProductsWithLinks = genosysProducts.map(tableProduct => {
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

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} cera-page genosys-page ${ceraSerif.variable} min-h-screen bg-[var(--cera-cream)] py-3 px-2 md:py-8 md:px-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="cera-serif mb-3 text-center text-[19px] text-[var(--cera-ink)] md:mb-4 md:text-[24px]">
          Basic Microneedling Treatment: Roller
        </h1>
        
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border-2 border-[var(--cera-line)]">
              <table className="min-w-full divide-y divide-[var(--cera-line)] text-[9px] md:text-xs border-collapse border border-[var(--cera-line)]">
                <thead className="bg-[var(--cera-cream-deep)]">
                  <tr>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-left text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Product Name
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Volume
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Product Cost, AED
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Product per 1 treatment
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      1 treatment cost
                    </th>
                    <th className="px-1.5 py-1.5 md:px-2 md:py-2 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider">
                      Treatments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--cera-line)]">
                  {productsWithLinks.map((product, index) => (
                    <tr key={index} className="hover:bg-[var(--cera-cream-deep)]">
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-ink)] font-medium border-r border-[var(--cera-line)] text-left uppercase">
                        {product.productIds && product.productIds.length > 0 ? (
                          <span>
                            PRO Solutions (
                            {product.productIds.map((p, idx) => (
                              <span key={p.id}>
                                {idx > 0 && ' / '}
                                <Link 
                                  href={`/products/${p.id}`}
                                  className="text-[var(--cera-ink)] underline hover:text-[var(--cera-body)] transition-colors"
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
                            className="text-[var(--cera-ink)] underline hover:text-[var(--cera-body)] transition-colors"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          product.name
                        )}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-body)] border-r border-[var(--cera-line)] text-center">
                        {product.volume}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-ink)] border-r border-[var(--cera-line)] text-center">
                        {product.productCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-body)] border-r border-[var(--cera-line)] text-center">
                        {typeof product.expensePerProcedure === 'number' 
                          ? <span className="whitespace-nowrap">{product.expensePerProcedure.toFixed(1)}g</span>
                          : product.expensePerProcedure}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-ink)] font-medium border-r border-[var(--cera-line)] text-center">
                        {product.procedureCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[10px] sm:text-xs md:text-sm text-[var(--cera-body)] text-center">
                        {product.procedures}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[var(--cera-blush)]">
                    <td colSpan={2} className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)]">
                      
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)]">
                      {totalProductCost.toFixed(2)} AED
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)] text-center">
                      -
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)]">
                      {totalTreatmentCost.toFixed(2)} AED
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)]">
                      
                    </td>
                  </tr>
                  <tr className="bg-[var(--cera-cream-deep)] border-t-2 border-[var(--cera-line)]">
                    <td colSpan={6} className="px-2 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3.5 text-[9px] md:text-xs text-[var(--cera-ink)]">
                      <div className="space-y-1">
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

        <h2 className="cera-serif mb-3 mt-6 text-center text-[19px] text-[var(--cera-ink)] md:mb-4 md:mt-8 md:text-[24px]">
          Genosys Product Calculation
        </h2>
        
        <div className="overflow-x-auto -mx-2 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg border-2 border-[var(--cera-line)]">
              <table className="min-w-full divide-y divide-[var(--cera-line)] text-[9px] md:text-xs border-collapse border border-[var(--cera-line)]">
                <thead className="bg-[var(--cera-cream-deep)]">
                  <tr>
                    <th className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-left text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Product Name
                    </th>
                    <th className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Volume
                    </th>
                    <th className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Product Cost, AED
                    </th>
                    <th className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      Product per 1 treatment
                    </th>
                    <th className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider border-r border-[var(--cera-line)]">
                      1 treatment cost
                    </th>
                    <th className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-semibold text-[var(--cera-body)] uppercase tracking-wider">
                      Treatments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--cera-line)]">
                  {genosysProductsWithLinks.map((product, index) => (
                    <tr key={index} className="hover:bg-[var(--cera-cream-deep)]">
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-ink)] font-medium border-r border-[var(--cera-line)] text-left uppercase">
                        {product.productIds && product.productIds.length > 0 ? (
                          <span>
                            PRO Solutions (
                            {product.productIds.map((p, idx) => (
                              <span key={p.id}>
                                {idx > 0 && ' / '}
                                <Link 
                                  href={`/products/${p.id}`}
                                  className="text-[var(--cera-ink)] underline hover:text-[var(--cera-body)] transition-colors"
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
                            className="text-[var(--cera-ink)] underline hover:text-[var(--cera-body)] transition-colors"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          product.name
                        )}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-body)] border-r border-[var(--cera-line)] text-center">
                        {product.volume}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-ink)] border-r border-[var(--cera-line)] text-center">
                        {product.productCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-body)] border-r border-[var(--cera-line)] text-center">
                        {typeof product.expensePerProcedure === 'number' 
                          ? <span className="whitespace-nowrap">{product.expensePerProcedure.toFixed(1)}g</span>
                          : product.expensePerProcedure}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-ink)] font-medium border-r border-[var(--cera-line)] text-center">
                        {product.procedureCost.toFixed(2)}
                      </td>
                      <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[10px] sm:text-xs md:text-sm text-[var(--cera-body)] text-center">
                        {product.procedures}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[var(--cera-blush)]">
                    <td colSpan={2} className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)]">
                      
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)]">
                      
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-[9px] md:text-xs text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)] text-center">
                      -
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)] border-r border-[var(--cera-line)]">
                      
                    </td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center text-[9px] md:text-xs font-bold text-[var(--cera-rose-ink)]">
                      
                    </td>
                  </tr>
                  <tr className="bg-[var(--cera-cream-deep)] border-t-2 border-[var(--cera-line)]">
                    <td colSpan={6} className="px-2 py-2.5 sm:px-3 sm:py-3 md:px-4 md:py-3.5 text-[9px] md:text-xs text-[var(--cera-ink)]">
                      You can calculate any Genosys product cost per 1 treatment.
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
