'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

/**
 * Server actions for the unsubscribe page.
 * Both actions are idempotent and intentionally fail silently if the token is
 * bogus - we don't want to leak token validity to whoever clicked the link.
 */

export async function unsubscribeAction(formData: FormData) {
  const token = String(formData.get('token') || '')
  if (!token) redirect('/newsletter/unsubscribe')

  try {
    await prisma.newsletterSubscriber.updateMany({
      where: { unsubscribeToken: token, isActive: true },
      data: { isActive: false, unsubscribedAt: new Date() },
    })
  } catch (err) {
    errorLog('[newsletter/unsubscribe] failed to unsubscribe:', err)
  }

  redirect(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}&done=1`)
}

export async function resubscribeAction(formData: FormData) {
  const token = String(formData.get('token') || '')
  if (!token) redirect('/newsletter/unsubscribe')

  try {
    await prisma.newsletterSubscriber.updateMany({
      where: { unsubscribeToken: token, isActive: false },
      data: { isActive: true, unsubscribedAt: null, subscribedAt: new Date() },
    })
  } catch (err) {
    errorLog('[newsletter/unsubscribe] failed to resubscribe:', err)
  }

  redirect(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}&resubscribed=1`)
}
