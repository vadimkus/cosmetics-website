#!/usr/bin/env node

/**
 * Fix Svitlana customer phone (website DB + MoySklad counterparty).
 *
 *   node --import dotenv/config scripts/moysklad-update-svitlana-phone-20260612.js
 *   node --import dotenv/config scripts/moysklad-update-svitlana-phone-20260612.js --commit
 */

const { PrismaClient } = require('@prisma/client')

const API = 'https://api.moysklad.ru/api/remap/1.2'
const LOGIN = process.env.MOYSKLAD_LOGIN
const PASSWORD = process.env.MOYSKLAD_PASSWORD

if (!LOGIN || !PASSWORD) {
  console.error('ERROR: set MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD')
  process.exit(1)
}

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('ERROR: set DATABASE_URL / PRISMA_DATABASE_URL')
  process.exit(1)
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64')
const COMMIT = process.argv.includes('--commit')

const USER_ID = 'cmq9tun3e0082dxl09ikxafit'
const USER_EMAIL = 'svetlana.hubr@gmail.com'
const ORDER_NUMBER = 'GENCardW2606124107'
const MOYSKLAD_CP_ID = '0c2f3142-6692-11f1-0a80-10fa004df201'
const OLD_PHONE = '05477494727'
const NEW_PHONE = '+971547749727'

let prisma
if (databaseUrl.startsWith('prisma+')) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ['error'] })
}

async function msApi(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
    method,
    headers: {
      Authorization: AUTH,
      Accept: 'application/json;charset=utf-8',
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`HTTP ${res.status} ${method} ${path} — ${text.slice(0, 1200)}`)
  return text ? JSON.parse(text) : null
}

async function main() {
  console.log('====================================================================')
  console.log('  Svitlana — phone fix (DB + MoySklad)')
  console.log('====================================================================')
  console.log(`  Mode       : ${COMMIT ? 'COMMIT' : 'DRY RUN'}`)
  console.log(`  Email      : ${USER_EMAIL}`)
  console.log(`  Phone      : ${OLD_PHONE} → ${NEW_PHONE}`)

  const user = await prisma.user.findUnique({ where: { id: USER_ID } })
  if (!user || user.email !== USER_EMAIL) {
    throw new Error(`User ${USER_ID} not found or email mismatch`)
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: ORDER_NUMBER, customerEmail: USER_EMAIL },
  })

  console.log('\n  Website DB — current:')
  console.log(`    user.id         : ${user.id}`)
  console.log(`    user.phone      : ${user.phone}`)
  console.log(`    user.name       : ${JSON.stringify(user.name)}`)
  console.log(`    user.address    : ${user.address}`)
  if (order) {
    console.log(`    order.number    : ${order.orderNumber}`)
    console.log(`    order.phone     : ${order.customerPhone}`)
  } else {
    console.log('    order           : (none matched)')
  }

  const cp = await msApi('GET', `/entity/counterparty/${MOYSKLAD_CP_ID}`)
  console.log('\n  MoySklad — current:')
  console.log(`    counterparty.id : ${cp.id}`)
  console.log(`    name            : ${cp.name}`)
  console.log(`    phone           : ${cp.phone}`)
  console.log(`    email           : ${cp.email}`)
  console.log(`    street          : ${cp.actualAddressFull?.street || '—'}`)

  if (!COMMIT) {
    console.log('\n  DRY RUN — would update DB user, order, and MoySklad counterparty.')
    console.log('  Re-run with --commit to apply.')
    return
  }

  const updatedUser = await prisma.user.update({
    where: { id: USER_ID },
    data: { phone: NEW_PHONE },
  })

  let updatedOrder = null
  if (order) {
    updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { customerPhone: NEW_PHONE },
    })
  }

  const updatedCp = await msApi('PUT', `/entity/counterparty/${MOYSKLAD_CP_ID}`, {
    phone: NEW_PHONE,
  })

  console.log('\n  Updated:')
  console.log(`    user.phone      : ${updatedUser.phone}`)
  if (updatedOrder) console.log(`    order.phone     : ${updatedOrder.customerPhone}`)
  console.log(`    MoySklad phone  : ${updatedCp.phone}`)
  console.log(
    `    MoySklad UI     : https://online.moysklad.ru/app/#company/edit?id=${updatedCp.id}`
  )
}

main()
  .catch((e) => {
    console.error('FATAL:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
