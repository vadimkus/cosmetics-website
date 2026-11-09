import { cookies } from 'next/headers'
import { verifySessionToken } from './jwt'
import { findUserByEmail } from './userStorageDb'
import { errorLog } from './logger'
import { isApplePrivateRelayEmail } from './emailHelpers'
import { rememberRelayContactEmail } from './relayContactEmail'

/**
 * Web checkout counterpart of the mobile `rememberRelayContactEmail` call: when
 * the signed-in web session belongs to an Apple Private Relay account, the real
 * address typed at checkout becomes that account's contactEmail, so status
 * emails reach it and the order shows under the Apple account.
 */
export async function rememberSessionRelayContactEmail(submittedEmail: unknown): Promise<void> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('genosys_session')?.value
    const session = token ? verifySessionToken(token) : null
    const sessionEmail = String(session?.email || '').trim()
    if (!sessionEmail || !isApplePrivateRelayEmail(sessionEmail)) return
    const user = await findUserByEmail(sessionEmail)
    if (user) await rememberRelayContactEmail(user, submittedEmail)
  } catch (error) {
    errorLog('[RELAY_CONTACT_EMAIL] Web session lookup failed:', error)
  }
}
