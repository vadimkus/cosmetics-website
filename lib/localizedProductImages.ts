import type { Locale } from '@/lib/i18n'

/**
 * Studio slides that exist in more than one language.
 *
 * The problem this solves: a claim slide is a picture of text. On the Arabic and Russian
 * pages every word around it is translated and the slide is still in English, which is the
 * one part of the page a customer cannot read. Translating the slides fixes that, but the
 * gallery comes from a single `images` field on one product row, so there is nowhere in
 * the database to put a second language.
 *
 * So the database keeps one canonical path and the swap happens at render:
 *
 *     /images/cera_o/s1.jpeg   +  ru   ->  /images/cera_o/ru/s1.jpeg
 *
 * The localized file sits in a `<locale>` subfolder beside the default under the same
 * filename. Nothing about the product record changes when a language is added, and
 * English is unaffected.
 *
 * WHY AN EXPLICIT FILE LIST rather than probing for the file. This runs in the browser
 * and during SSR, where a filesystem check is not available; guessing a path and letting
 * it 404 would put broken images on the page and noise in the logs. Listing the files
 * means an unlisted slide silently keeps the English version, which is the safe failure.
 *
 * TO ADD A LANGUAGE: drop the files into `<folder>/<locale>/` under the same names, then
 * add the locale here. There is no database work and no cache key to bump, because the
 * record never mentions the localized path.
 *
 * The mobile product routes run the same mapping against the `x-locale` header, so the
 * website and app share this manifest.
 */
/**
 * A registered slide is normally the same filename inside the locale folder. A tuple
 * `[default, localized]` covers the case where a corrected export had to take a new
 * name: `/images` is served immutable for a year, so replacing a file that the CDN has
 * already cached would leave the old artwork on the page. The default name is what the
 * product record holds; the second name is the file that actually gets served.
 */
type LocalizedSlide = string | readonly [defaultFile: string, localizedFile: string]

const LOCALIZED_SLIDES: Record<string, Partial<Record<Locale, readonly LocalizedSlide[]>>> = {
  // Product 66, CERABARRIER BIOME GEL CLEANSER. Main.jpeg is a packshot with no text on
  // it, so it is deliberately absent from both languages: there is nothing to translate
  // and shipping a second identical file would only cost a download.
  '/images/cera_o': {
    ru: ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg', 's7.jpeg'],
    ar: ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg', 's7.jpeg'],
  },
  // Product 65, BIO-MESO PDRN HOMECARE AMPOULE 5000. The supplied translated
  // exports were numbered by sequence rather than by their English counterparts;
  // the files on disk have been aligned by content to the canonical names below.
  '/images/pdrn_5000_new': {
    ru: ['S1.jpeg', 'S2.jpeg', 'S3.jpeg', 'S4.jpeg', 'S6.jpeg', 'S7.jpeg', 'S8.jpeg', 'Close.jpeg'],
    ar: ['S1.jpeg', 'S2.jpeg', 'S3.jpeg', 'S4.jpeg', 'S6.jpeg', 'S7.jpeg', 'S8.jpeg', 'Close.jpeg'],
  },
  // Product 63, REVITA GLOW BB CREAM. The five inline editorial figures and
  // full gallery localize on both web and mobile. Russian s7 and Arabic s1 were
  // initially withheld until corrected exports removed unsupported claims.
  '/images/revita_o': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 'closing.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 'closing.jpg'],
  },
  // Product 51, BIO-FERMENT AGE DEFYING POWDER MASK. main.jpeg is a plain
  // packshot and is not translated. s7 and Closing were held back on the first
  // pass over a garbled headline and an unreadable jar label, by which point the
  // original files were already cached at the edge, so the corrected exports
  // ship as s7b and Closingb.
  '/images/bio_ferment2': {
    ru: ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg',
      ['s7.jpeg', 's7b.jpeg'], ['Closing.jpeg', 'Closingb.jpeg']],
    ar: ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg',
      ['s7.jpeg', 's7b.jpeg'], ['Closing.jpeg', 'Closingb.jpeg']],
  },
  // Product 64, HR3 MATRIX HAIR STAMP. Main.jpeg is a plain packshot and is not
  // translated. The first Russian s1 was withheld for a missing glyph after each
  // product name; the corrected export landed the same day and is registered here.
  // s1b is the refreshed opening slide: /images is served immutable for a year,
  // so the reissued artwork had to take a new name rather than replace s1.jpeg.
  '/images/needles2': {
    ru: ['s1b.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 'closing.jpeg'],
    ar: ['s1b.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 'closing.jpeg'],
  },
  // Product 53, INTENSIVE REPAIR COLLAGEN MASK, "Red means stop" campaign. main.jpg is
  // a plain packshot and is not translated.
  '/images/collagen_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 37, PEPTIDE GEL MASK, "Blue means cool" campaign. main.jpg is a plain
  // packshot and is not translated. s4b / s6b / s9b / s10b replace the first exports,
  // which drew the two-piece mask as one sheet.
  '/images/peptide_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4b.jpg', 's5.jpg', 's6b.jpg', 's7.jpg', 's8.jpg', 's9b.jpg', 's10b.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4b.jpg', 's5.jpg', 's6b.jpg', 's7.jpg', 's8.jpg', 's9b.jpg', 's10b.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 46, HR³ MATRIX SCALP PEELING α, "Cold start" campaign. main.jpg is a plain
  // packshot and is not translated.
  '/images/scalp_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 16, SNOW BOOSTER, "Let it snow" campaign. main.jpg is a plain packshot and
  // is not translated.
  '/images/booster_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 3, HairGen BOOSTER, "In. Not on." campaign. The main packshot is not translated;
  // the b-slides replace renders that showed a handle the device does not have.
  '/images/hairgen_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's4b.jpg', 's5.jpg', 's5b.jpg', 's6.jpg', 's7.jpg', 's7b.jpg', 's8.jpg', 's8b.jpg', 's9.jpg', 's9b.jpg',
      's10.jpg', 's11.jpg', 's11b.jpg', 's12.jpg', 's12b.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's4b.jpg', 's5.jpg', 's5b.jpg', 's6.jpg', 's7.jpg', 's7b.jpg', 's8.jpg', 's8b.jpg', 's9.jpg', 's9b.jpg',
      's10.jpg', 's11.jpg', 's11b.jpg', 's12.jpg', 's12b.jpg'],
  },
  // Product 1, GENOSYS DTS Microneedle Roller, "Every needle counts." campaign. The main
  // packshot is not translated.
  '/images/roller_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 67, GENOSYS DTS Microneedle Stamp, "Press here." scalp campaign. The main packshot
  // is not translated. s10b and s11b replace the first s10 and s11 exports.
  '/images/stamp_scalp': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10b.jpg', 's11b.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10b.jpg', 's11b.jpg', 's12.jpg'],
  },
  // Product 36, SOOTHING BOMB SEA ALGAE MASK, "Calm on contact." campaign. The main
  // packshot is not translated.
  '/images/seaalgae_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 40, MULTI SUN CREAM SPF 40 PA++, "Your daily shade." campaign. The main
  // packshot is not translated.
  '/images/multisun_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 50, EyeCell EYE ZONE CARE KIT, "Rested eyes." campaign. The main packshot is
  // not translated. s7b and s8c replace s7, s8 and s8b: the patch shown worn, as the real clear crescent.
  '/images/eyekit_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7b.jpg', 's8c.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7b.jpg', 's8c.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 9, POWER SOLUTION AWS, "Line by line." campaign. The main packshot is not
  // translated; the page's inline figures swap from this list too. The b slides (1, 3,
  // 11) replace composites whose carton and vials sat on the set instead of in it.
  // s12c replaces s12b, whose carton lost its side panel and square edges; s9c replaces
  // s9b, whose ten vials stood in a stamped grid.
  '/images/aws_campaign': {
    ru: ['s1b.jpg', 's2.jpg', 's3b.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9c.jpg', 's10.jpg', 's11b.jpg', 's12c.jpg'],
    ar: ['s1b.jpg', 's2.jpg', 's3b.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9c.jpg', 's10.jpg', 's11b.jpg', 's12c.jpg'],
  },
  // Product 49, GENO-LED IR II, "Five lights. One dome." campaign. The main packshot is not
  // translated; the page's two inline figures (s7, s11) swap from this list too.
  '/images/led_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 5, POWER SOLUTION CVS, "Vitality, concentrated." campaign. The main packshot
  // is not translated; the page's inline figures and section slides swap from this list too.
  // Product 15, INTENSIVE PROBLEM CONTROL TONER, "Oil off. Cool on." campaign. The main
  // packshot is not translated; the page's section slides swap from this list too.
  '/images/pct_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9b.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9b.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 55, PROBLEM SKIN CARE BEAUTY BOX, "The Oil Change" (Beauty Box style v1). The
  // main kit shot carries the English product name only and is not translated.
  '/images/bb_problem_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 58, ANTI-AGING BEAUTY BOX, "Time, well kept" (Beauty Box style v1). The main
  // kit shot carries the English product name only and is not translated. s4b replaced s4
  // (the toner re-shot without its clear overcap).
  '/images/bb_age_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4b.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4b.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 59, DEEP MOISTURIZING BEAUTY BOX, "The refill." campaign (Beauty Box style v1).
  // The main kit shot carries the English product name only and is not translated.
  '/images/bb_deep_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 29, MOISTURE REPLENISHING HYALURON CREAM, "Sealed fresh." campaign. The main
  // packshot carries no type; the page's section figures swap from this list too.
  '/images/mhcream_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 62, SENSITIVE SKIN BEAUTY BOX, "Handle with care." campaign (Beauty Box style v1).
  // The main kit shot carries the English product name only and is not translated.
  '/images/bb_sensitive_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 57, CHARMING LOOK BEAUTY BOX, "Curtain up." campaign (Beauty Box style v1).
  // The main kit shot carries the English product name only and is not translated.
  '/images/bb_charming_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 41, SKIN CARING BLEMISH BALM CUSHION, "Shade to go." campaign. The main packshot
  // carries no type and is not translated.
  '/images/cushion_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 43, HR³ MATRIX HAIR TONIC α, "Forecast: cool up top." art set. The main
  // (tonic_campaign/main.jpg) is a packshot with no type and has no localized copies.
  '/images/tonic_art': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 18, MOISTURE REPLENISHING HYALURON SERUM, "Drink up." campaign. main.jpg is a
  // packshot with no type, so only the twelve slides have Russian and Arabic exports.
  '/images/hsserum_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 10, SNOW O2 CLEANSER, "It fizzes." campaign. main.jpg is a packshot with no
  // type, so only the twelve slides have Russian and Arabic exports.
  '/images/snowo2_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 68, GLASS SKIN RITUAL KIT, "Full moon glow." holiday campaign. The main kit shot
  // carries the English product name only and is not translated.
  '/images/glass_skin_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 56, SKIN BRIGHTENING BEAUTY BOX, "Let the light in." campaign. The main kit shot
  // carries the English product name only and is not translated.
  '/images/bb_bright_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 48, Hair-GENTRON, "Lights on. World off." The main packshot carries no text.
  '/images/gentron_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  '/images/cvs_campaign': {
    ru: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
    ar: ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9.jpg', 's10.jpg', 's11.jpg', 's12.jpg'],
  },
  // Product 6, POWER SOLUTION CTS, "Back to smooth." campaign. The main packshot is not
  // translated; the page's inline figures swap from this list too. s10b replaces s10,
  // whose serum on the cheek read as a blue-grey paste instead of a clear sheen. The other
  // b slides (1, 3, 11) replace composites whose carton and vials sat on the set.
  // s12c replaces s12b, whose carton lost its side panel and square edges; s9c replaces
  // s9b, whose ten vials stood in a stamped grid.
  '/images/cts_campaign': {
    ru: ['s1b.jpg', 's2.jpg', 's3b.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9c.jpg', 's10b.jpg', 's11b.jpg', 's12c.jpg'],
    ar: ['s1b.jpg', 's2.jpg', 's3b.jpg', 's4.jpg', 's5.jpg', 's6.jpg', 's7.jpg', 's8.jpg', 's9c.jpg', 's10b.jpg', 's11b.jpg', 's12c.jpg'],
  },
}

/**
 * Web passes a bare 'ru'; the mobile app sends an `x-locale` header that may be a full
 * tag such as 'ru-RU'. Both have to resolve to the same folder.
 */
function normalizeLocale(locale: string | undefined): Locale | null {
  if (!locale) return null
  const base = locale.toLowerCase().split(/[-_]/)[0]
  return base === 'ru' || base === 'ar' ? base : null
}

/**
 * The localized variant of `src` for `locale`, or `src` unchanged when no translated file
 * is registered. Safe to call on every image path, including ones with no localization.
 */
export function localizeProductImage(src: string, locale: string | undefined): string {
  if (!src) return src

  const normalized = normalizeLocale(locale)
  if (!normalized) return src

  const lastSlash = src.lastIndexOf('/')
  if (lastSlash < 0) return src

  const folder = src.slice(0, lastSlash)
  const file = src.slice(lastSlash + 1)

  const files = LOCALIZED_SLIDES[folder]?.[normalized]
  if (!files) return src

  const match = files.find(entry => (typeof entry === 'string' ? entry : entry[0]) === file)
  if (!match) return src

  return `${folder}/${normalized}/${typeof match === 'string' ? match : match[1]}`
}

/**
 * Same mapping over a JSON-encoded `images` column, returned in the same shape. The
 * mobile routes hand this column through untouched, so they can localize without having
 * to parse and re-encode it themselves.
 */
export function localizeProductImagesJson(
  imagesJson: string | null | undefined,
  locale: string | undefined
): string | null {
  if (!imagesJson) return imagesJson ?? null
  if (!normalizeLocale(locale)) return imagesJson

  try {
    const parsed = JSON.parse(imagesJson)
    if (!Array.isArray(parsed)) return imagesJson
    return JSON.stringify(parsed.map((src: unknown) =>
      typeof src === 'string' ? localizeProductImage(src, locale) : src
    ))
  } catch {
    // A malformed column is a pre-existing problem; do not turn it into a new one.
    return imagesJson
  }
}

/** Convenience for galleries. Preserves order and length. */
export function localizeProductImages(list: readonly string[], locale: string | undefined): string[] {
  return list.map(src => localizeProductImage(src, locale))
}

/** Exposed for tests and for a future admin view of which sets are translated. */
export function getLocalizedSlideManifest() {
  return LOCALIZED_SLIDES
}
