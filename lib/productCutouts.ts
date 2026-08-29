/**
 * Packshots with the studio sweep removed.
 *
 * The bespoke pages seat a packshot on a tinted panel whose colour was picked
 * per page to match that shot's background. The backgrounds are not consistent
 * across the catalogue - they run from mid grey to pure white - so the
 * photograph reads as a rectangle stamped on the panel wherever the two
 * disagree, which measured out at ten of the fifteen pages where both could be
 * compared. Framing the shot instead of matching it only adds a second
 * rectangle around the first.
 *
 * A cut-out removes the disagreement rather than hiding it: with no background
 * in the file there is no edge to see, and the panel can be any colour we like.
 *
 * Generated - do not edit by hand:
 *   python3 scripts/cutout/build-cutouts.py
 *   python3 scripts/cutout/write-manifest.py
 *
 * Keyed by the original path so a caller needs only the `src` it already holds.
 * An unlisted image, such as an infographic slide, comes back unchanged.
 */
const CUTOUTS: Record<string, string> = {
  // 1 Microneedle Roller
  '/images/genosys-microneedling-devices.jpg': '/images/cutout/1.webp',
  // 2 Needle Pen-K
  '/images/Needle-pen.jpg': '/images/cutout/2.webp',
  // 3 HairGen BOOSTER
  '/images/Booster.jpg': '/images/cutout/3.webp',
  // 4 POWER SOLUTION HES
  '/images/hes_power/main.jpeg': '/images/cutout/4.webp',
  // 5 POWER SOLUTION CVS
  '/images/cvs-hero.jpg': '/images/cutout/5.webp',
  // 6 POWER SOLUTION CTS
  '/images/cts-hero.jpg': '/images/cutout/6.webp',
  // 7 POWER SOLUTION PCS
  '/images/pcs-hero.jpg': '/images/cutout/7.webp',
  // 8 POWER SOLUTION SWS
  '/images/sws_0/Main.jpeg': '/images/cutout/8.webp',
  // 9 POWER SOLUTION AWS
  '/images/aws-hero.jpg': '/images/cutout/9.webp',
  // 10 SNOW O₂ CLEANSER
  '/images/cleanser/main_clean.jpeg': '/images/cutout/10.webp',
  // 11 SKIN DEFENDER LIP & EYE MAKEUP REMOVER
  '/images/defender_0/Main.jpeg': '/images/cutout/11.webp',
  // 12 EPI TURNOVER BOOSTING PEELING GEL
  '/images/epi/main.jpeg': '/images/cutout/12.webp',
  // 13 SKIN RENEWAL PEELING SYSTEM (SRS)
  '/images/srs_2_new/main.jpeg': '/images/cutout/13.webp',
  // 14 MICROBIOME ENERGY INFUSING MIST
  '/images/mist_0/Main.jpeg': '/images/cutout/14.webp',
  // 15 INTENSIVE PROBLEM CONTROL TONER
  '/images/problem/Main.jpg': '/images/cutout/15.webp',
  // 16 SNOW BOOSTER
  '/images/Second/main_booster.jpg': '/images/cutout/16.webp',
  // 17 EyeCell EYE CONTOUR SERUM
  '/images/eye_serum/main.jpeg': '/images/cutout/17.webp',
  // 18 MOISTURE REPLENISHING HYALURON SERUM
  '/images/hyaluron_serum/main.jpeg': '/images/cutout/18.webp',
  // 19 ALL FOR SENSITIVE SERUM
  '/images/sensitive_serum/main.jpeg': '/images/cutout/19.webp',
  // 20 PROBLEM CONTROL SERUM
  '/images/problems_serum/main.jpeg': '/images/cutout/20.webp',
  // 21 MULTI VITA RADIANCE SERUM
  '/images/radiance_serum/main.jpeg': '/images/cutout/21.webp',
  // 22 MULTI FUNCTIONAL ANTI-WRINKLE SERUM
  '/images/multif_serum/main.jpeg': '/images/cutout/22.webp',
  // 23 ND Cell ANTI-WRINKLE CREAM
  '/images/ND.jpg': '/images/cutout/23.webp',
  // 24 EyeCell EYE CONTOUR CREAM
  '/images/eye_cream/main.jpeg': '/images/cutout/24.webp',
  // 25 SOOTHING REPAIR POSTCREAM
  '/images/SRC.jpg': '/images/cutout/25.webp',
  // 26 EGF REPAIR OXYMASK CREAM
  '/images/EGF.jpg': '/images/cutout/26.webp',
  // 27 SKIN BARRIER PROTECTING CREAM
  '/images/skin_barr/main.jpeg': '/images/cutout/27.webp',
  // 28 INTENSIVE HYDRO SOOTHING CREAM
  '/images/hydro_soothing_o/Main.jpeg': '/images/cutout/28-v2.webp',
  // 29 MOISTURE REPLENISHING HYALURON CREAM
  '/images/hyaluron/main.jpeg': '/images/cutout/29.webp',
  // 30 INTENSIVE PROBLEM CONTROL CREAM
  '/images/problem_cream/main.jpeg': '/images/cutout/30.webp',
  // 31 MULTI VITA RADIANCE CREAM
  '/images/radiance/main.jpeg': '/images/cutout/31.webp',
  // 32 MULTI FUNCTIONAL ANTI-WRINKLE CREAM
  '/images/multifunc_cream/main.jpeg': '/images/cutout/32-v2.webp',
  // 33 EyeCell EYE PEPTIDE GEL PATCH
  '/images/patch/main.jpeg': '/images/cutout/33.webp',
  // 34 SKIN RESCUE OVERNIGHT CREAM MASK
  '/images/overnight/main.jpeg': '/images/cutout/34.webp',
  // 35 HYDRO COOL MODELING MASK
  '/images/hydro_o/Main.jpeg': '/images/cutout/35-v2.webp',
  // 36 SOOTHING BOMB SEA ALGAE MASK
  '/images/sea_algae/Main.jpeg': '/images/cutout/36.webp',
  // 37 PEPTIDE GEL MASK
  '/images/peptide_mask/main.jpeg': '/images/cutout/37.webp',
  // 38 EZ CO₂ MASK KIT
  '/images/ez_mask/main.jpeg': '/images/cutout/38.webp',
  // 39 ULTRA SHIELD SUN CREAM [SPF 50+ PA++++]
  '/images/ultra/main.jpeg': '/images/cutout/39.webp',
  // 40 MULTI SUN CREAM [SPF 40 PA++]
  '/images/sun/main.jpeg': '/images/cutout/40.webp',
  // 41 SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]
  '/images/cushion_2/main.jpeg': '/images/cutout/41.webp',
  // 42 INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++]
  '/images/blemish_o/Main.jpeg': '/images/cutout/42-v2.webp',
  // 43 HR³ MATRIX HAIR TONIC α
  '/images/hair_tonic/main-v2.jpeg': '/images/cutout/43.webp',
  // 44 HR³ MATRIX MEDI SCALP SHAMPOO α
  '/images/shampoo/Main.jpg': '/images/cutout/44.webp',
  // 45 HR³ MATRIX HAIR SOLUTION α
  '/images/HHR.jpg': '/images/cutout/45.webp',
  // 46 HR³ MATRIX SCALP PEELING α
  '/images/scal.jpg': '/images/cutout/46.webp',
  // 47 HR³ MATRIX MESOPECIA KIT
  '/images/meso.jpg': '/images/cutout/47.webp',
  // 48 Hair-GENTRON
  '/images/gen.jpg': '/images/cutout/48.webp',
  // 49 GENO-LED IR II
  '/images/LEDD.jpg': '/images/cutout/49.webp',
  // 50 EyeCell EYE ZONE CARE KIT
  '/images/eye_kit/main.jpeg': '/images/cutout/50.webp',
  // 51 BIO-FERMENT AGE DEFYING POWDER MASK
  '/images/bio_ferment2/main.jpeg': '/images/cutout/51.webp',
  // 52 SKIN REBOOT PDRN MASK PACK
  '/images/pdrn_mask_new/Main.jpeg': '/images/cutout/52.webp',
  // 53 INTENSIVE REPAIR COLLAGEN MASK
  '/images/collagen_mask/Main.jpeg': '/images/cutout/53.webp',
  // 54 Holiday Kit
  '/images/Hol_kit_v2.jpg': '/images/cutout/54.webp',
  // 55 PROBLEM SKIN CARE BEAUTY BOX
  '/images/beauty_boxes/Problem_skin_box.jpeg': '/images/cutout/55.webp',
  // 56 SKIN BRIGHTENING BEAUTY BOX
  '/images/bbbox_brightening/main3.jpeg': '/images/cutout/56.webp',
  // 57 CHARMING LOOK BEAUTY BOX
  '/images/bbbox_charming/main.jpeg': '/images/cutout/57.webp',
  // 58 ANTI-AGING BEAUTY BOX
  '/images/bbox_age/main.jpg': '/images/cutout/58.webp',
  // 59 DEEP MOISTURIZING BEAUTY BOX
  '/images/bb_box_deep/main.jpeg': '/images/cutout/59.webp',
  // 60 Bio Meso PDRN Ampoule 60000
  '/images/6000/main.jpg': '/images/cutout/60.webp',
  // 61 HR³ MATRIX SCALP BRUSH
  '/images/brush_o/Main2.jpeg': '/images/cutout/61.webp',
  // 62 SENSITIVE SKIN BEAUTY BOX
  '/images/bb_box_sensitive/main.jpeg': '/images/cutout/62.webp',
  // 63 REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]
  '/images/revita_o/main.jpg': '/images/cutout/63.webp',
  // 64 Hair Stamp For HAIRGEN BOOSTER
  '/images/needles2/Main.jpeg': '/images/cutout/64.webp',
  // 65 Bio-Meso PDRN Homecare Ampoule 5000
  '/images/pdrn_5000_new/Main.jpeg': '/images/cutout/65-v2.webp',
  // 66 CERABARRIER BIOME GEL CLEANSER
  '/images/cera_o/Main.jpeg': '/images/cutout/66-v2.webp',
}

/**
 * The cut-out for `src`, or `src` unchanged when there is none. Safe to call on
 * any image path.
 */
export function cutoutImage(src: string): string {
  if (!src) return src
  return CUTOUTS[src] ?? src
}

/** True when `src` has a cut-out, for callers that style the two differently. */
export function hasCutout(src: string): boolean {
  return Boolean(src) && src in CUTOUTS
}

/** Exposed for the test that checks every listed file is on disk. */
export function getCutoutManifest(): Readonly<Record<string, string>> {
  return CUTOUTS
}
