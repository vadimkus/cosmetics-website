import { test, expect, type Page } from '@playwright/test'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const runId = Date.now()
const clinicEmail = `homecare-e2e-clinic-${runId}@example.test`
const patientEmail = `homecare-e2e-patient-${runId}@example.test`
const adminEmail = `homecare-e2e-admin-${runId}@example.test`
const password = 'HomecareE2E123!'
const productNumber = `HC-E2E-${runId}`
const orderNumber = `HC-E2E-ORDER-${runId}`

async function csrf(page: Page) {
  const response = await page.request.get('/api/csrf-token')
  expect(response.ok()).toBeTruthy()
  const body = await response.json()
  return String(body.token)
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.locator('input[name="email"]').first().fill(email)
  await page.locator('input[name="password"]').first().fill(password)
  const [response] = await Promise.all([
    page.waitForResponse(candidate => candidate.url().includes('/api/auth/login')),
    page.locator('button[type="submit"]').first().click(),
  ])
  expect(response.status(), await response.text()).toBe(200)
  await expect.poll(async () => (await page.context().cookies()).some(cookie => cookie.name === 'genosys_session')).toBe(true)
}

test.describe.serial('Authenticated Homecare lifecycle', () => {
  let clinicId = ''
  let productId = ''

  test.beforeAll(async () => {
    const hashed = await bcrypt.hash(password, 10)
    await prisma.order.deleteMany({ where: { orderNumber } })
    await prisma.user.deleteMany({ where: { email: { in: [clinicEmail, patientEmail, adminEmail] } } })
    await prisma.product.deleteMany({ where: { productNumber } })

    const [clinic, product] = await Promise.all([
      prisma.user.create({
        data: {
          email: clinicEmail,
          name: 'Homecare E2E Clinic',
          password: hashed,
          partnerPortalAccess: true,
          canSeePrices: true,
          phone: '+971500000001',
          address: 'Dubai',
        },
      }),
      prisma.product.create({
        data: {
          productNumber,
          name: 'Homecare E2E Serum',
          description: 'Authenticated lifecycle test product',
          price: 105,
          image: '/images/genosys-logo-transparent.png',
          category: 'Serums',
          inStock: true,
        },
      }),
      prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Homecare E2E Admin',
          password: hashed,
          isAdmin: true,
          canSeePrices: true,
        },
      }),
    ])
    clinicId = clinic.id
    productId = product.id
  })

  test.afterAll(async () => {
    await prisma.order.deleteMany({ where: { orderNumber } })
    await prisma.user.deleteMany({ where: { email: { in: [clinicEmail, patientEmail, adminEmail] } } })
    await prisma.product.deleteMany({ where: { productNumber } })
  })

  test('clinic login → recommendation → patient COD → delivery → maturity → refund', async ({ page }) => {
    const productsResponse = await page.request.get('/api/products')
    const productsBody = await productsResponse.json()
    const products = Array.isArray(productsBody) ? productsBody : productsBody.data
    expect(products.some((product: { id: string }) => product.id === productId)).toBe(true)
    await login(page, clinicEmail)
    const clinicCsrf = await csrf(page)

    const createResponse = await page.request.post('/api/partner/homecare-scripts', {
      headers: { 'x-csrf-token': clinicCsrf },
      data: {
        patientLabel: 'E2E patient',
        careInstructions: 'Use morning and evening.',
        items: [{ productId, quantity: 1 }],
      },
    })
    expect(createResponse.status()).toBe(201)
    const created = (await createResponse.json()).script
    expect(created.publicToken).toBeTruthy()

    const publicResponse = await page.request.get(`/api/homecare/${created.publicToken}`)
    expect(publicResponse.ok()).toBeTruthy()
    const publicScript = (await publicResponse.json()).script
    const item = publicScript.version.items[0]
    expect(item.productId).toBe(productId)

    // Patient checkout is intentionally unauthenticated. Clear the clinic
    // session, open the private patient link, then submit through the real COD API.
    await page.context().clearCookies()
    await page.goto(`/r/${created.publicToken}`)
    await expect(page.getByText('Your personalised homecare product selection')).toBeVisible()
    const patientCsrf = await csrf(page)
    const checkoutResponse = await page.request.post('/api/orders/cod-confirmation', {
      headers: { 'x-csrf-token': patientCsrf },
      data: {
        orderNumber,
        customerName: 'Homecare E2E Patient',
        customerEmail: patientEmail,
        customerPhone: '+971500000002',
        customerAddress: 'Dubai Marina',
        emirate: 'Dubai',
        items: [{
          id: productId,
          name: item.product.name,
          price: 105,
          quantity: 1,
          image: item.product.image,
          homecare: {
            scriptId: created.id,
            versionId: publicScript.version.id,
            scriptItemId: item.id,
            token: created.publicToken,
            addedAt: new Date().toISOString(),
          },
        }],
        subtotal: 105,
        shippingCost: 0,
        vatAmount: 5,
        total: 105,
        locale: 'en',
      },
    })
    expect(checkoutResponse.ok()).toBeTruthy()

    const order = await prisma.order.findUniqueOrThrow({ where: { orderNumber } })
    expect(order.homecareScriptId).toBe(created.id)
    expect(order.homecareAttributedSubtotal).toBe(100)

    await page.context().clearCookies()
    await page.goto('/admin')
    await page.locator('input[type="email"]').fill(adminEmail)
    await page.locator('input[type="password"]').fill(password)
    await page.locator('button[type="submit"]').click()
    await expect.poll(async () => (await page.context().cookies()).some(cookie => cookie.name === 'admin-session')).toBe(true)
    const adminCsrf = await csrf(page)

    const paid = await page.request.put(`/api/admin/orders/${order.id}`, {
      headers: { 'x-csrf-token': adminCsrf },
      data: { paymentReceived: true },
    })
    expect(paid.ok()).toBeTruthy()
    const delivered = await page.request.put(`/api/admin/orders/${order.id}`, {
      headers: { 'x-csrf-token': adminCsrf },
      data: { status: 'DELIVERED' },
    })
    expect(delivered.ok()).toBeTruthy()

    const earn = await prisma.clinicPointTransaction.findUniqueOrThrow({
      where: { idempotencyKey: `earn:${order.id}` },
    })
    expect(earn.points).toBe(5)
    expect(earn.status).toBe('PENDING')

    await prisma.clinicPointTransaction.update({
      where: { id: earn.id },
      data: { availableAt: new Date(0) },
    })
    const cronResponse = await page.request.get('/api/cron/clinic-points', {
      headers: { authorization: `Bearer ${process.env.CRON_SECRET || 'homecare-e2e-secret'}` },
    })
    expect(cronResponse.ok()).toBeTruthy()

    const refund = await page.request.put(`/api/admin/orders/${order.id}`, {
      headers: { 'x-csrf-token': adminCsrf },
      data: { refundAmount: 52.5 },
    })
    expect(refund.ok()).toBeTruthy()

    const ledger = await prisma.clinicPointTransaction.aggregate({
      where: { clinicUserId: clinicId, status: { in: ['AVAILABLE', 'SPENT'] } },
      _sum: { points: true },
    })
    expect(ledger._sum.points).toBe(2.5)
  })
})
