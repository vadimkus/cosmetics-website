import { prisma } from './prisma'

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  images?: string // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products from database:', error)
    throw new Error('Failed to fetch products')
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })
    return product
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    throw new Error('Failed to fetch product')
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { category },
      orderBy: {
        name: 'asc'
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw new Error('Failed to fetch products by category')
  }
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    const product = await prisma.product.create({
      data: productData
    })
    return product
  } catch (error) {
    console.error('Error adding product:', error)
    throw new Error('Failed to add product')
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: updates
    })
    return product
  } catch (error) {
    console.error('Error updating product:', error)
    throw new Error('Failed to update product')
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prisma.product.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    return false
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } }
        ]
      },
      orderBy: {
        name: 'asc'
      }
    })
    return products
  } catch (error) {
    console.error('Error searching products:', error)
    throw new Error('Failed to search products')
  }
}
