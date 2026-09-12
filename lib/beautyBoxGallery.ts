import { BEAUTY_BOXES } from '@/components/product/beautybox/beautyBoxes'

/**
 * A beauty box's gallery is the packshot of each product inside it, in the
 * order the page lists them, followed by anything the DB `images` field adds.
 * The website builds this on the client from the catalogue; the mobile API
 * builds it here so the app sees the same slides without an app release.
 * Member images are looked up live, so a repointed packshot flows through.
 */
export const BEAUTY_BOX_NUMBERS = new Set<string>(Object.keys(BEAUTY_BOXES))

export const isBeautyBoxNumber = (productNumber: string | null | undefined): boolean =>
  Boolean(productNumber && BEAUTY_BOX_NUMBERS.has(productNumber))

export const beautyBoxMemberNumbers = (productNumber: string): string[] => {
  const config = BEAUTY_BOXES[productNumber as keyof typeof BEAUTY_BOXES]
  return config ? config.copy.en.contents.items.map((item) => item.productNumber) : []
}

const parseImages = (images: string | null | undefined): string[] => {
  if (!images) return []
  try {
    const parsed = JSON.parse(images)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string' && v.length > 0) : []
  } catch {
    return []
  }
}

/**
 * Returns the JSON `images` string for a box (kit shot first, then members),
 * or the value untouched when the product is not a box. `mainImageByNumber` maps member productNumber to
 * its current main image.
 */
export const beautyBoxImagesJson = (
  productNumber: string | null | undefined,
  mainImage: string | null | undefined,
  images: string | null | undefined,
  mainImageByNumber: ReadonlyMap<string, string | null | undefined>
): string | null => {
  if (!productNumber || !isBeautyBoxNumber(productNumber)) return images ?? null
  const members = beautyBoxMemberNumbers(productNumber)
    .map((n) => mainImageByNumber.get(n))
    .filter((src): src is string => Boolean(src))
  // The kit shot leads, as on the web page; the app renders `images` as the
  // whole gallery and does not add `image` itself.
  const list = Array.from(new Set([mainImage, ...members, ...parseImages(images)].filter((v): v is string => Boolean(v))))
  return list.length ? JSON.stringify(list) : images ?? null
}
