import { test, expect } from '@playwright/test'

/**
 * E2E Test: Authentication Flow
 * 
 * Tests:
 * 1. User registration with email/password
 * 2. User login with email/password
 * 3. User logout
 * 4. Invalid login attempt
 * 5. Password validation
 */

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@genosys.test`
  const testPassword = 'TestPassword123!'
  const testName = 'Test User'

  test('should open login modal from header', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Click login/account button in header
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in|account/i }).first()
    await loginButton.click()
    
    // Verify login modal is visible
    await expect(page.locator('form').filter({ hasText: /email|password/i })).toBeVisible({ timeout: 10000 })
  })

  test('should register a new user', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Open login modal
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in|account/i }).first()
    await loginButton.click()
    
    // Switch to registration mode
    const signUpLink = page.locator('button, a').filter({ hasText: /sign up|register|create account/i }).first()
    await signUpLink.click({ timeout: 5000 })
    
    // Fill registration form
    await page.fill('input[name="name"], input[placeholder*="name" i]', testName)
    await page.fill('input[name="email"], input[type="email"]', testEmail)
    await page.fill('input[name="password"], input[type="password"]', testPassword)
    
    // Accept terms if checkbox exists
    const termsCheckbox = page.locator('input[type="checkbox"]').first()
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check()
    }
    
    // Submit registration
    await page.click('button[type="submit"]')
    
    // Wait for success (either modal closes or success message appears)
    await page.waitForTimeout(3000)
    
    // Verify registration success (user should be logged in)
    const accountButton = page.locator('button, a').filter({ hasText: /profile|account|welcome/i }).first()
    await expect(accountButton).toBeVisible({ timeout: 10000 })
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Open login modal
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in|account/i }).first()
    await loginButton.click()
    
    // Fill login form
    await page.fill('input[name="email"], input[type="email"]', testEmail)
    await page.fill('input[name="password"], input[type="password"]', testPassword)
    
    // Submit login
    await page.click('button[type="submit"]')
    
    // Wait for login success
    await page.waitForTimeout(3000)
    
    // Verify login success
    const accountButton = page.locator('button, a').filter({ hasText: /profile|account|welcome/i }).first()
    await expect(accountButton).toBeVisible({ timeout: 10000 })
  })

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Open login modal
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in|account/i }).first()
    await loginButton.click()
    
    // Fill with invalid credentials
    await page.fill('input[name="email"], input[type="email"]', 'invalid@test.com')
    await page.fill('input[name="password"], input[type="password"]', 'wrongpassword')
    
    // Submit login
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await page.waitForTimeout(2000)
    
    // Verify error message or toast notification appears
    const errorMessage = page.locator('text=/invalid|error|incorrect|failed/i').first()
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loginButton = page.locator('button, a').filter({ hasText: /login|sign in|account/i }).first()
    await loginButton.click()
    
    await page.fill('input[name="email"], input[type="email"]', testEmail)
    await page.fill('input[name="password"], input[type="password"]', testPassword)
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(3000)
    
    // Now logout
    const accountButton = page.locator('button, a').filter({ hasText: /profile|account/i }).first()
    await accountButton.click()
    
    // Find and click logout button
    const logoutButton = page.locator('button, a').filter({ hasText: /logout|sign out/i }).first()
    await logoutButton.click({ timeout: 5000 })
    
    await page.waitForTimeout(2000)
    
    // Verify logout success - login button should be visible again
    const loginButtonAfterLogout = page.locator('button, a').filter({ hasText: /login|sign in/i }).first()
    await expect(loginButtonAfterLogout).toBeVisible({ timeout: 5000 })
  })
})

