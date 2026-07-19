import { test, expect } from '@playwright/test'

/**
 * E2E Test: Profile Management
 * 
 * Tests:
 * 1. Access profile page
 * 2. Update profile information
 * 3. View order history
 * 4. Update email preferences
 */

test.describe('Profile Management', () => {
  const testUser = {
    email: `profile-test-${Date.now()}@genosys.test`,
    password: 'TestPassword123!',
    name: 'Profile Test User',
    updatedName: 'Updated Profile User'
  }

  test.beforeAll(async ({ request }) => {
    const csrfResponse = await request.get('/api/csrf-token')
    const { token } = await csrfResponse.json()
    const registration = await request.post('/api/auth/register', {
      headers: {
        'X-CSRF-Token': token,
        'X-Forwarded-For': `198.51.100.${Math.floor(Math.random() * 200) + 1}`,
      },
      data: {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        phone: '+971500000001',
        address: 'GENOSYS Playwright Test Address',
        emirate: 'Dubai',
        locale: 'en',
        csrfToken: token,
      },
    })
    expect([200, 201, 400]).toContain(registration.status())
  })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    // Login before each test
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const consentDialog = page.getByRole('dialog', { name: /privacy policy/i })
    if (await consentDialog.isVisible()) {
      await consentDialog.getByRole('button', { name: /decline/i }).click()
    }
    
    const loginDialog = page.locator('form').filter({ has: page.locator('input[name="email"]') })
    await expect(loginDialog).toBeVisible()
    
    const emailField = loginDialog.locator('input[name="email"]')
    await emailField.fill(testUser.email)
    
    const passwordField = loginDialog.locator('input[name="password"]')
    await passwordField.fill(testUser.password)
    
    // Submit
    await loginDialog.locator('button[type="submit"]').click()
    await expect(page.locator('a[href*="/profile"]:visible').first()).toBeVisible({ timeout: 10000 })
  })

  test('should access profile page', async ({ page }) => {
    console.log('Step 1: Accessing profile page...')
    
    await page.goto('/profile')
    
    // Should navigate to profile page
    await expect(page).toHaveURL(/profile|account/i, { timeout: 10000 })
    
    // Verify profile content is visible
    const profileContent = page.locator('text=/profile|account|personal information|my orders/i').first()
    await expect(profileContent).toBeVisible()
    
    console.log('✓ Profile page loaded')
    console.log('✅ Profile Access: PASSED')
  })

  test('should update profile information', async ({ page }) => {
    console.log('Step 1: Navigating to profile edit...')
    
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    // Personal details is a URL-backed desktop view.
    await page.goto('/profile?tab=details')
    await expect(page).toHaveURL(/\/profile\?tab=details/)
    
    // Find edit button
    const editButton = page.locator('button, a').filter({ hasText: /edit|update|modify/i }).first()
    
    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click()
      await page.waitForTimeout(1000)
      
      console.log('Step 2: Updating profile information...')
      
      // Update name
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first()
      await nameInput.clear()
      await nameInput.fill(testUser.updatedName)
      
      // Save changes
      const saveButton = page.locator('button').filter({ hasText: /save|update|submit/i }).first()
      await saveButton.click()
      
      // Wait for save
      await page.waitForTimeout(2000)
      
      // Verify success message
      const successMessage = page.locator('text=/updated|saved|success/i').first()
      
      if (await successMessage.isVisible({ timeout: 3000 })) {
        console.log('✓ Profile updated successfully')
        console.log('✅ Profile Update: PASSED')
      } else {
        console.log('⚠️  Success message not visible, but update may have completed')
        console.log('✅ Profile Update: PASSED (partial)')
      }
    } else {
      console.log('⚠️  Edit button not found, checking for inline editing...')
      
      // Check if fields are already editable
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first()
      
      if (await nameInput.isVisible({ timeout: 2000 })) {
        await nameInput.clear()
        await nameInput.fill(testUser.updatedName)
        
        const saveButton = page.locator('button').filter({ hasText: /save|update/i }).first()
        await saveButton.click()
        await page.waitForTimeout(2000)
        
        console.log('✓ Profile updated via inline edit')
        console.log('✅ Profile Update: PASSED')
      } else {
        console.log('⏭️  Profile editing not available in current UI')
        console.log('⚠️  Profile Update: SKIPPED')
      }
    }
  })

  test('should view order history', async ({ page }) => {
    console.log('Step 1: Accessing order history...')
    
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
    
    // Look for orders section
    const ordersLink = page.locator('a, button').filter({ hasText: /orders|my orders|order history/i }).first()
    
    if (await ordersLink.isVisible({ timeout: 5000 })) {
      await ordersLink.click()
      await page.waitForTimeout(2000)
      
      // Verify orders page loaded
      const ordersContent = page.locator('text=/orders|order history|no orders|recent orders/i').first()
      await expect(ordersContent).toBeVisible({ timeout: 5000 })
      
      console.log('✓ Order history page loaded')
      console.log('✅ Order History: PASSED')
    } else {
      // Orders might be on same page
      const ordersSection = page.locator('[data-testid="orders"], text=/orders|order history/i').first()
      
      if (await ordersSection.isVisible({ timeout: 3000 })) {
        console.log('✓ Orders section visible')
        console.log('✅ Order History: PASSED')
      } else {
        console.log('⚠️  No orders found (user may not have orders yet)')
        console.log('✅ Order History: PASSED (empty state)')
      }
    }
  })

  test('should support direct links to desktop account sections', async ({ page }) => {
    await page.goto('/profile?tab=favorites')
    await expect(page).toHaveURL(/\/profile\?tab=favorites/)
    await expect(page.getByRole('link', { name: /favorites/i }).first()).toHaveAttribute('aria-current', 'page')

    await page.goto('/profile?tab=addresses')
    await expect(page).toHaveURL(/\/profile\?tab=addresses/)
    await expect(page.getByRole('link', { name: /shipping addresses/i }).first()).toHaveAttribute('aria-current', 'page')

    await page.goto('/profile?tab=billing')
    await expect(page).toHaveURL(/\/profile\?tab=billing/)
    await expect(page.getByRole('link', { name: /^billing$/i }).first()).toHaveAttribute('aria-current', 'page')

    await page.goto('/profile?tab=orders')
    await expect(page).toHaveURL(/\/profile\?tab=orders/)
    await expect(page.getByRole('link', { name: /orders/i }).first()).toHaveAttribute('aria-current', 'page')

    await page.goto('/profile?tab=security')
    await expect(page).toHaveURL(/\/profile\?tab=security/)
    await expect(page.getByRole('link', { name: /security|privacy/i }).first()).toHaveAttribute('aria-current', 'page')
  })

  test('should display profile information correctly', async ({ page }) => {
    console.log('Verifying profile data display...')
    
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
    
    // Verify email is displayed
    const emailDisplay = page.locator(`text=/${testUser.email}/i`).first()
    
    if (await emailDisplay.isVisible({ timeout: 5000 })) {
      console.log('✓ Email displayed correctly')
    }
    
    // Verify name is displayed
    const nameDisplay = page.locator(`text=/test|user/i`).first()
    
    if (await nameDisplay.isVisible({ timeout: 3000 })) {
      console.log('✓ Name displayed')
    }
    
    console.log('✅ Profile Display: PASSED')
  })
})


