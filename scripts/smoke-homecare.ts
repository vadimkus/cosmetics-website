import assert from 'node:assert/strict'
import { prisma } from '@/lib/prisma'
import {
  awardClinicPointsForOrder,
  adjustClinicPoints,
  createPartnerOrderWithClinicPoints,
  createHomecareScript,
  getClinicPointBalances,
  getPublicHomecareScript,
  releaseMatureClinicPoints,
  restoreClinicPointsRedemptionForOrder,
  reverseClinicPointsForOrder,
  updateHomecareScript,
  validateHomecareAttribution,
} from '@/lib/homecare'

const runId = Date.now()
const clinicEmail = `homecare-clinic-${runId}@example.test`
const patientEmail = `homecare-patient-${runId}@example.test`
const orderNumber = `HC-SMOKE-${runId}`
const partnerOrderNumber = `HC-REDEEM-${runId}`

async function main() {
  const [clinic, patient, product] = await Promise.all([
    prisma.user.create({
      data: {
        email: clinicEmail,
        name: 'Homecare Smoke Clinic',
        partnerPortalAccess: true,
      },
    }),
    prisma.user.create({
      data: {
        email: patientEmail,
        name: 'Homecare Smoke Patient',
      },
    }),
    prisma.product.create({
      data: {
        productNumber: `HC-${runId}`,
        name: 'Homecare Smoke Serum',
        price: 105,
        description: 'Local smoke-test product',
        image: '/images/genosys-logo-transparent.png',
        category: 'Serums',
      },
    }),
  ])

  const script = await createHomecareScript(clinic.id, {
    patientLabel: 'Patient A',
    careInstructions: 'Apply in the evening.',
    items: [{ productId: product.id }],
  })
  assert.equal(script.versions[0]?.versionNumber, 1)
  assert.equal(script.versions[0]?.items.length, 1)

  const versionOne = script.versions[0]!
  const scriptItem = versionOne.items[0]!
  const publicScript = await getPublicHomecareScript(script.publicToken)
  assert.equal(publicScript?.status, 'ACTIVE')
  assert.equal(publicScript?.version?.items[0]?.available, true)

  const attribution = await validateHomecareAttribution({
    attribution: {
      scriptId: script.id,
      versionId: versionOne.id,
      scriptItemId: scriptItem.id,
      token: script.publicToken,
      addedAt: new Date().toISOString(),
    },
    product,
  })
  assert.equal(attribution?.clinicUserId, clinic.id)

  const versionTwo = await updateHomecareScript(clinic.id, script.id, {
    patientLabel: 'Patient A',
    careInstructions: 'Apply morning and evening.',
    items: [{ productId: product.id }],
  })
  assert.equal(versionTwo.versionNumber, 2)
  assert.equal(await prisma.homecareScriptVersion.count({ where: { scriptId: script.id } }), 2)

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerEmail: patient.email,
      customerName: patient.name,
      customerPhone: '+971500000001',
      customerEmirate: 'Dubai',
      customerAddress: 'Local smoke test',
      subtotal: 105,
      shipping: 0,
      vat: 5,
      total: 105,
      status: 'DELIVERED',
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      homecareScriptId: script.id,
      homecareScriptVersionId: versionOne.id,
      homecareAttributedSubtotal: 100,
      items: {
        create: {
          productId: product.id,
          productName: product.name,
          price: 105,
          quantity: 1,
          image: product.image,
          homecareScriptItemId: scriptItem.id,
          homecareScriptVersionId: versionOne.id,
          homecareEligibleAmount: 100,
        },
      },
    },
  })
  const award = await awardClinicPointsForOrder(order.id)
  assert.equal(award?.awarded, true)
  assert.equal(award?.points, 5)
  const persistedAward = await prisma.clinicPointTransaction.findUnique({
    where: { idempotencyKey: `earn:${order.id}` },
  })
  assert.equal(persistedAward?.points, 5)
  const duplicate = await awardClinicPointsForOrder(order.id)
  assert.equal(duplicate?.reason, 'already_awarded')

  await prisma.clinicPointTransaction.update({
    where: { idempotencyKey: `earn:${order.id}` },
    data: { availableAt: new Date(0) },
  })
  assert.ok((await releaseMatureClinicPoints()).count >= 1)
  assert.equal(
    (await prisma.clinicPointTransaction.findUnique({
      where: { idempotencyKey: `earn:${order.id}` },
      select: { status: true },
    }))?.status,
    'AVAILABLE',
  )

  const reversal = await reverseClinicPointsForOrder(order.id, 52.5)
  assert.equal(reversal?.reversed, true)
  assert.equal(reversal?.points, 2.5)

  const ledger = await prisma.clinicPointTransaction.aggregate({
    where: { clinicUserId: clinic.id, status: 'AVAILABLE' },
    _sum: { points: true },
  })
  assert.equal(ledger._sum.points, 2.5)

  await adjustClinicPoints({
    clinicUserId: clinic.id,
    points: 1,
    description: 'Smoke-test admin adjustment',
    adminId: 'smoke',
  })
  assert.equal((await getClinicPointBalances(clinic.id)).available, 3.5)

  const redemption = await createPartnerOrderWithClinicPoints({
    clinicUserId: clinic.id,
    requestedPoints: 10,
    orderData: {
      orderNumber: partnerOrderNumber,
      customerEmail: clinic.email,
      customerName: clinic.name,
      customerPhone: '',
      customerEmirate: 'Dubai',
      customerAddress: 'Partner account',
      items: [{
        productId: product.id,
        productName: product.name,
        price: 105,
        quantity: 1,
        image: product.image,
      }],
      subtotal: 105,
      shipping: 0,
      vat: 5,
      total: 105,
      paymentMethod: 'partner_cod',
      paymentStatus: 'pending',
    },
  })
  assert.equal(redemption.redeemed, 3.5)
  assert.equal(redemption.order.total, 101.5)
  assert.equal((await getClinicPointBalances(clinic.id)).available, 0)

  const restored = await restoreClinicPointsRedemptionForOrder(redemption.order.id, 50.75)
  assert.equal(restored?.restored, true)
  assert.equal(restored?.points, 1.75)
  assert.equal((await getClinicPointBalances(clinic.id)).available, 1.75)
  assert.equal((await restoreClinicPointsRedemptionForOrder(redemption.order.id))?.points, 1.75)
  assert.equal((await getClinicPointBalances(clinic.id)).available, 3.5)
  assert.equal((await restoreClinicPointsRedemptionForOrder(redemption.order.id))?.reason, 'already_restored')

  console.log('Homecare smoke test passed: versions, attribution, awards, maturity, reversals, admin adjustments, redemption and restoration.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.order.deleteMany({ where: { orderNumber: { in: [orderNumber, partnerOrderNumber] } } })
    await prisma.user.deleteMany({ where: { email: { in: [clinicEmail, patientEmail] } } })
    await prisma.product.deleteMany({ where: { productNumber: `HC-${runId}` } })
    await prisma.$disconnect()
  })
