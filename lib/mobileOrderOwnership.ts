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

export function getCustomerEmailWhere(user: MobileOrderUser) {
  const emails = getCustomerOrderEmails(user)

  if (emails.length <= 1) {
    return { customerEmail: emails[0] || user.email }
  }

  return {
    OR: emails.map((customerEmail) => ({ customerEmail })),
  }
}

export function canAccessCustomerEmail(user: MobileOrderUser, customerEmail: string | null | undefined): boolean {
  const normalizedCustomerEmail = String(customerEmail || '').trim().toLowerCase()
  return Boolean(normalizedCustomerEmail) && getCustomerOrderEmails(user).includes(normalizedCustomerEmail)
}
