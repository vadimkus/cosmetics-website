import { test, expect } from '@playwright/test'

/**
 * E2E Test: Cash on Delivery (COD) Checkout Flow
 * 
 * Tests:
 * 1. Add product to cart
 * 2. View cart
 * 3. Proceed to checkout
 * 4. Fill shipping information
 * 5. Select COD payment method
 * 6. Complete order
 * 7. Verify order confirmation
 */

test.describe('COD Checkout Flow', () => {
  const testUser = {
    email: `cod-test-${Date.now()}@genosys.test`,
    password: 'TestPassword123!',
    name: 'COD Test User',
    phone: '+971501234567',
    address: 'Test Street 123',
    city: 'Dubai',
    emirate: 'Dubai'
  }

  test.beforeEach(async ({ page }) => {
    // Start from homepage
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should complete full COD checkout flow', async ({ page }) => {
    // Step 1: Add product to cart
    console.log('Step 1: Adding product to cart...')
    
    // Find and click first product
    const productCard = page.locator('[data-testid="product-card"], .product-card, a[href*="/products/"]').first()
    await productCard.click({ timeout: 10000 })
    
    // Wait for product page to load
    await page.waitForLoadState('networkidle')
    
    // Find and click "Add to Cart" button
    const addToCartButton = page.locator('button').filter({ hasText: /add to (cart|bag)/i }).first()
    await addToCartButton.click()
    
    // Wait for cart to update
    await page.waitForTimeout(2000)
    
    // Verify cart icon shows items
    const cartIcon = page.locator('[data-testid="cart-icon"], button[aria-label*="cart" i], a[href*="cart" i], a[href*="bag" i]').first()
    await expect(cartIcon).toBeVisible()
    
    console.log('✓ Product added to cart')
    
    // Step 2: Go to cart
    console.log('Step 2: Viewing cart...')
    await cartIcon.click()
    
    // Verify we're on cart page or cart modal is open
    await expect(page.locator('text=/cart|bag|shopping/i').first()).toBeVisible({ timeout: 5000 })
    
    console.log('✓ Cart page loaded')
    
    // Step 3: Proceed to checkout
    console.log('Step 3: Proceeding to checkout...')
    const checkoutButton = page.locator('button, a').filter({ hasText: /checkout|proceed/i }).first()
    await checkoutButton.click()
    
    // Wait for checkout page
    await page.waitForLoadState('networkidle')
    
    console.log('✓ Checkout page loaded')
    
    // Step 4: Fill shipping information
    console.log('Step 4: Filling shipping information...')
    
    // Check if user needs to login first
    const emailField = page.locator('input[name="email"], input[type="email"]').first()
    if (await emailField.isVisible({ timeout: 3000 })) {
      await emailField.fill(testUser.email)
      
      const passwordField = page.locator('input[name="password"], input[type="password"]').first()
      if (await passwordField.isVisible({ timeout: 1000 })) {
        // Login form
        await passwordField.fill(testUser.password)
        
        // Try to register if needed
        const nameField = page.locator('input[name="name"], input[placeholder*="name" i]').first()
        if (await nameField.isVisible({ timeout: 1000 })) {
          await nameField.fill(testUser.name)
        }
        
        await page.click('button[type="submit"]')
        await page.waitForTimeout(3000)
      }
    }
    
    // Fill shipping form
    await page.fill('input[name="name"], input[placeholder*="name" i]', testUser.name)
    await page.fill('input[name="phone"], input[type="tel"]', testUser.phone)
    await page.fill('input[name="address"], textarea[name="address"]', testUser.address)
    
    // Fill city and emirate if separate fields exist
    const cityField = page.locator('input[name="city"]').first()
    if (await cityField.isVisible({ timeout: 1000 })) {
      await cityField.fill(testUser.city)
    }
    
    console.log('✓ Shipping information filled')
    
    // Step 5: Select COD payment method
    console.log('Step 5: Selecting COD payment method...')
    
    const codOption = page.locator('input[value="cod"], label').filter({ hasText: /cash on delivery|cod/i }).first()
    await codOption.click({ timeout: 5000 })
    
    console.log('✓ COD payment method selected')
    
    // Step 6: Complete order
    console.log('Step 6: Completing order...')
    
    const placeOrderButton = page.locator('button').filter({ hasText: /place order|complete|confirm order/i }).first()
    await placeOrderButton.click()
    
    // Wait for order processing
    await page.waitForTimeout(5000)
    
    console.log('✓ Order submitted')
    
    // Step 7: Verify order confirmation
    console.log('Step 7: Verifying order confirmation...')
    
    // Should redirect to success page or show confirmation
    await expect(page).toHaveURL(/success|confirmation|thank-you/i, { timeout: 15000 })
    
    // Verify success message
    const successMessage = page.locator('text=/order confirmed|thank you|success/i').first()
    await expect(successMessage).toBeVisible({ timeout: 5000 })
    
    // Verify order number is displayed
    const orderNumber = page.locator('text=/#|order.*number|reference/i').first()
    await expect(orderNumber).toBeVisible()
    
    console.log('✓ Order confirmation verified')
    
    console.log('✅ COD Checkout Flow: PASSED')
  })

  test('should validate required fields in checkout', async ({ page }) => {
    // Add product and go to checkout
    const productCard = page.locator('[data-testid="product-card"], .product-card, a[href*="/products/"]').first()
    await productCard.click({ timeout: 10000 })
    
    await page.waitForLoadState('networkidle')
    
    const addToCartButton = page.locator('button').filter({ hasText: /add to (cart|bag)/i }).first()
    await addToCartButton.click()
    await page.waitForTimeout(2000)
    
    const cartIcon = page.locator('[data-testid="cart-icon"], button[aria-label*="cart" i], a[href*="cart" i], a[href*="bag" i]').first()
    await cartIcon.click()
    
    const checkoutButton = page.locator('button, a').filter({ hasText: /checkout|proceed/i }).first()
    await checkoutButton.click()
    
    await page.waitForLoadState('networkidle')
    
    // Try to submit without filling required fields
    const placeOrderButton = page.locator('button').filter({ hasText: /place order|complete|confirm order/i }).first()
    
    if (await placeOrderButton.isVisible({ timeout: 5000 })) {
      await placeOrderButton.click()
      
      // Should show validation errors
      await page.waitForTimeout(1000)
      
      // Verify error messages appear
      const errorMessage = page.locator('text=/required|invalid|please fill|error/i').first()
      await expect(errorMessage).toBeVisible({ timeout: 3000 })
      
      console.log('✅ Field validation: PASSED')
    }
  })
})
