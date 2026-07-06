/**
 * Serialize an object for a <script type="application/ld+json"> block, escaping
 * the characters that could break out of the script element or be mis-parsed
 * by HTML: `<`, `>`, `&`, and U+2028/U+2029. Prevents a stored value (e.g. an
 * admin-authored post title containing `</script>`) from closing the tag and
 * injecting markup.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
