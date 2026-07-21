import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

const oldEmail = 'clairecabarles@gmail.con'
const newEmail = 'clairecabarles@gmail.com'
const expectedName = 'Claire Cabarles'
const apply = process.argv.includes('--apply')

async function main() {
  const [user, conflictingUser, conflictingSubscriber, orderCount] = await Promise.all([
    prisma.user.findUnique({ where: { email: oldEmail } }),
    prisma.user.findUnique({ where: { email: newEmail } }),
    prisma.newsletterSubscriber.findUnique({ where: { email: newEmail } }),
    prisma.order.count({ where: { customerEmail: oldEmail } }),
  ])

  if (!user) throw new Error(`No user found with ${oldEmail}`)
  if (user.name !== expectedName) {
    throw new Error(`Expected ${expectedName}, found ${user.name}`)
  }
  if (conflictingUser) throw new Error(`${newEmail} is already assigned to another user`)
  if (conflictingSubscriber) {
    throw new Error(`${newEmail} is already assigned to another newsletter subscriber`)
  }
  if (!user.password?.startsWith('$2')) {
    throw new Error('Claire does not have a valid bcrypt password hash')
  }
  if (orderCount > 0) {
    throw new Error(`Found ${orderCount} linked order(s); refusing an unsafe email-key update`)
  }

  console.log(`User: ${user.name}`)
  console.log(`Current login: ${user.email}`)
  console.log(`Corrected login: ${newEmail}`)
  console.log('Password: bcrypt hash present')

  if (!apply) {
    console.log('Dry run only. Re-run with --apply to update and send the welcome email.')
    return
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        ...(user.contactEmail === oldEmail ? { contactEmail: newEmail } : {}),
      },
    })

    await Promise.all([
      tx.pageView.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.userAction.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.userSession.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.pDFDownload.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.blogComment.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.productReview.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.chatConversation.updateMany({ where: { userEmail: oldEmail }, data: { userEmail: newEmail } }),
      tx.newsletterSubscriber.updateMany({ where: { email: oldEmail }, data: { email: newEmail } }),
    ])
  })

  const correctedUser = await prisma.user.findUnique({ where: { email: newEmail } })
  if (!correctedUser || correctedUser.id !== user.id || !correctedUser.password?.startsWith('$2')) {
    throw new Error('Post-update login verification failed')
  }

  const welcomeResult = await sendWelcomeEmail(correctedUser.name, correctedUser.email)
  if (!welcomeResult.success) {
    throw new Error(`Email was corrected, but welcome delivery failed: ${welcomeResult.error}`)
  }

  console.log(`Updated login email to ${correctedUser.email}`)
  console.log(`Welcome email sent: ${welcomeResult.messageId}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
