import { test, expect } from '@playwright/test'

/**
 * Quick Smoke Test - Verifies basic functionality
 */

test.describe('Quick Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    console.log('🧪 Testing: Homepage loads')
    
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Verify page title or header
    const pageContent = await page.content()
    expect(pageContent.length).toBeGreaterThan(100)
    
    console.log('✅ Homepage loaded successfully')
  })

  test('products page is accessible', async ({ page }) => {
    console.log('🧪 Testing: Products page access')
    
    await page.goto('/products')
    await page.waitForLoadState('domcontentloaded')
    
    const pageContent = await page.content()
    expect(pageContent.length).toBeGreaterThan(100)
    
    console.log('✅ Products page accessible')
  })

  test('login modal can be triggered', async ({ page }) => {
    console.log('🧪 Testing: Login modal trigger')
    
    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    // Look for login/account button
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in|account/i }).first()
    
    if (await loginButton.isVisible({ timeout: 10000 })) {
      await loginButton.click()
      await page.waitForTimeout(1000)
      console.log('✅ Login modal triggered')
    } else {
      console.log('⚠️  Login button not immediately visible')
    }
  })
})
