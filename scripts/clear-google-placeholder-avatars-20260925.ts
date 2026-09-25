import { prisma } from '@/lib/prisma'
import { isGoogleDefaultAvatar } from '@/lib/googleProfilePicture'

// Clears profilePicture where it is Google's generic blue silhouette, so the
// app and site show the customer's initials. Uploaded photos are not Google
// hosted and are never selected.
//   npx tsx --env-file=.env.local scripts/clear-google-placeholder-avatars-20260925.ts [--apply]
const apply = process.argv.includes('--apply')

async function main() {
  const users = await prisma.user.findMany({
    where: { profilePicture: { contains: 'googleusercontent.com' } },
    select: { id: true, email: true, profilePicture: true },
  })
  const hits = []
  for (const u of users) if (u.profilePicture && (await isGoogleDefaultAvatar(u.profilePicture))) hits.push(u)
  console.log(`Google-hosted pictures: ${users.length}, placeholders: ${hits.length}`)
  for (const u of hits) console.log('  ', u.email.replace(/(.{3}).+(@.+)/, '$1***$2'))
  if (!apply) return console.log('dry run. Re-run with --apply')
  await prisma.user.updateMany({ where: { id: { in: hits.map((u) => u.id) } }, data: { profilePicture: null } })
  console.log('cleared', hits.length)
}

main().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => prisma.$disconnect())
