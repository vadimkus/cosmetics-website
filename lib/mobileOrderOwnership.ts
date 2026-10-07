type MobileOrderUser = {
  email: string
  contactEmail?: string | null
}

export function getCustomerOrderEmails(user: MobileOrderUser): string[] {
  return Array.from(new Set(
    [user.email, user.contactEmail]
      .map((email) => String(email || '').trim().toLowerCase())
      .filter(Boolean)
  ))
}

// Orders keep the email exactly as typed at checkout ("Liza..." vs "liza..."), and
// Postgres equality is case-sensitive, so the match must be insensitive.
const emailMatch = (email: string) => ({
  customerEmail: { equals: email, mode: 'insensitive' as const },
})

export function getCustomerEmailWhere(user: MobileOrderUser) {
  const emails = getCustomerOrderEmails(user)

  if (emails.length <= 1) {
    return emailMatch(emails[0] || user.email)
  }

  return {
    OR: emails.map(emailMatch),
  }
}

export function canAccessCustomerEmail(user: MobileOrderUser, customerEmail: string | null | undefined): boolean {
  const normalizedCustomerEmail = String(customerEmail || '').trim().toLowerCase()
  return Boolean(normalizedCustomerEmail) && getCustomerOrderEmails(user).includes(normalizedCustomerEmail)
}
