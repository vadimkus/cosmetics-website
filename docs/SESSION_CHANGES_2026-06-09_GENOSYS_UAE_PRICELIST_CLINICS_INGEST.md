# GENOSYS UAE Price List Clinics 2026 - Ingest

**Date ingested:** 2026-06-09
**Source file:** `/Users/vadimkus/Desktop/GENOSYS_UAE_PriceList_Clinics_2026.xlsx`
**Workbook sheet:** `Genosys UAE Price list 2024`
**Document title in workbook:** `Price List Clinics: 2026 United Arab Emirates` / `United Arab Emirates Price List Clinics: 2026`
**Normalized CSV:** `/Users/vadimkus/cosmetics-website/docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv`
**Professional PDF (v1):** `/Users/vadimkus/Desktop/GENOSYS_UAE_PriceList_Clinics_2026.pdf`
**Premium PDF (v2, recommended):** `/Users/vadimkus/Desktop/GENOSYS_UAE_Price_List_Clinics_2026.pdf`
**PDF generator script:** `/Users/vadimkus/cosmetics-website/scripts/build_genosys_pricelist_pdf.py`
**Image extraction + whitening script:** `/Users/vadimkus/cosmetics-website/scripts/extract_and_whiten_images.py`
**Promo assets (badges + QR) script:** `/Users/vadimkus/cosmetics-website/scripts/build_promo_assets.py`

## Summary

- Extracted **100 priced line items** from **1 worksheet**.
- Categories detected: **25**.
- Numeric AED price range: **10 AED** to **5500 AED**.
- Source workbook contains repeated page headers and merged cells; the normalized table removes page headers and keeps source row numbers for traceability.
- Product variant rows with a blank product-name cell inherit the previous product name, while keeping the row-specific description, quantity/specification, unit, and price.
- Created an **11-page professional PDF (v1)** on Desktop with a cover page, grouped sections, wrapped descriptions, repeated table headers, controlled row/page breaks, page numbers, and source notes.
- Created a **13-page premium PDF (v2, recommended)** rebuilt via `scripts/build_genosys_pricelist_pdf.py`: branded green/gold cover with GENOSYS wordmark, clickable auto Table of Contents with real page numbers, "Page X of Y" footers + running header, section bands, category chips, alternating rows, gold-tinted AED column, inline [PERSONAL]/[PROFESSIONAL] tags, correct CO₂/HR³ glyphs, product photos, and a closing online-store / app page. No page overlap.
- **Product photos added (v2):** extracted **all 100** embedded product images from the source workbook's "Pictures" column (column D) and mapped each to its product row. Mapping uses the image cell anchor (1-indexed source row); 95 rows matched exactly, the remaining 5 (Make-up Remover, Postcream professional, EyeCell Kit, Starter Kit, GENTRON) matched the nearest orphan anchor one row below. Thumbnails saved to `scripts/genosys_product_images/row_<n>.png` and rendered into a new left-hand **Photo** column.
- **White backgrounds (v2, 2026-06-09 update):** `scripts/extract_and_whiten_images.py` re-extracts the photos at full resolution and normalizes every studio shot onto a clean white background. It uses a corner-consensus flood fill — when 3+ image corners agree on a background colour (black, grey or off-white) that background is filled to white from the edges, which is robust to a tall product touching one border. Black-background shots (creams, eye serums, GENO-LED, GENTRON, hair products, droppers) are now pure white; genuine multi-colour marketing posters / kit composites and X-banners (corners disagree) are left untouched on purpose. Output is a padded white thumbnail per row.
- **Removed "Range by category" summary table** and replaced the closing page with a **"Shop Online & Download the GENOSYS App"** page. Links are clickable in the PDF.
  - Website: `https://genosys.ae`
  - App Store (iOS): `https://apps.apple.com/ae/app/genosys-uae/id6756648064`
  - Google Play (Android): `https://play.google.com/store/apps/details?id=ae.genosys.app`
- **Promo page polish (2026-06-09):** `scripts/build_promo_assets.py` renders proper store-style **badges** (PIL-drawn globe / Apple / Google Play glyphs, brand colours, gold bottom accent) and brand-green **QR codes** for the three links. The page now shows: badge row → QR row with "Scan to…" captions (great for printed/shared copies) → "Why order online" highlights table → ordering footer → a closing GENOSYS brand band that anchors the bottom (removes the earlier dead whitespace). Assets live in `scripts/genosys_promo_assets/`.

## Source Notes

- The Excel filename and workbook title indicate **2026 UAE clinic pricing**, but the worksheet tab is named **`Genosys UAE Price list 2024`**.
- Source spellings are preserved where meaningful, including `CUSHION: BIEGE` and `C02 Mask Kit`.
- `SOOTHING REPAIR POSTCREAM` professional 100g has a blank unit cell in the source; price is **220 AED**.
- `NEEDLE PEN-K NEEDLE CARTRIDGE (10 PCS)` price is marked **N/A** in the source.

## Category Counts

| Category | Lines |
|---|---:|
| GENOSYS Detachable Manual Roller (Head part is detachable, handle is autoclavable) | 2 |
| GENOSYS Vibrating Roller (Vibrating, Head part is detachable) | 3 |
| GENOSYS Stamp (Stamp, handle is not detachable) | 1 |
| GENOSYS Eye Roller (One-body type, head part is not detachable) | 1 |
| GENOSYS Manual Roller (One-body type, handle is not detachable) | 2 |
| GENOSYS Mask | 7 |
| GENOSYS Peeling & Power Solution | 7 |
| GENOSYS CLEANSER | 2 |
| GENOSYS TONER | 4 |
| GENOSYS MAKEUP REMOVER | 1 |
| GENOSYS CREAM | 22 |
| GENOSYS Cosmetics - Daily Serum | 5 |
| GENOSYS Cosmetics - CUSHION | 3 |
| GENOSYS Cosmetics - HAIR | 6 |
| GENOSYS Cosmetics - EYE | 4 |
| GENOSYS Cosmetics - ND CELL Treatment - Neck&Decollete | 1 |
| GENOSYS Cosmetics - KIT BOX | 1 |
| GENOSYS DERMAFIX | 6 |
| GENOSYS X-Banner | 8 |
| Genosys Roller Case | 1 |
| Genosys Cosmetic Cradle | 2 |
| Genosys Accessories and Bags | 6 |
| Genosys Dropper | 1 |
| Genosys Bed Blanket | 1 |
| Genosys Uniform | 3 |

## Normalized Price List

| Source Row | Category | Product | Description | Quantity / Specification | Unit | Price AED |
|---:|---|---|---|---|---|---:|
| 9 | GENOSYS Detachable Manual Roller (Head part is detachable, handle is autoclavable) | Standard Detachable Manual Roller | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 1pcs | Pcs | 115 |
| 11 | GENOSYS Detachable Manual Roller (Head part is detachable, handle is autoclavable) | Narrow Detachable Manual Roller | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 1pcs | Pcs | 115 |
| 14 | GENOSYS Vibrating Roller (Vibrating, Head part is detachable) | Vibrating Roller | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 1pcs | Pcs | 205 |
| 16 | GENOSYS Vibrating Roller (Vibrating, Head part is detachable) | Standard Replacement Heads | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 2pcs in a box | Box | 200 |
| 18 | GENOSYS Vibrating Roller (Vibrating, Head part is detachable) | Narrow Replacement Heads | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 2pcs in a box | Box | 205 |
| 21 | GENOSYS Stamp (Stamp, handle is not detachable) | Stamp | Needle length: 0.25, 0.50, 1.00, 1.50mm | 1pcs | Pcs | 100 |
| 24 | GENOSYS Eye Roller (One-body type, head part is not detachable) | Eye Roller | Needle Length: 0.25mm | 2pcs in a box | Box | 105 |
| 27 | GENOSYS Manual Roller (One-body type, handle is not detachable) | Standard Manual Roller | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 1pcs | Pcs | 105 |
| 29 | GENOSYS Manual Roller (One-body type, handle is not detachable) | Narrow Manual Roller | Needle length: 0.25, 0.50, 1.00, 1.50, 2.00mm | 1pcs | Pcs | 105 |
| 34 | GENOSYS Mask | EZ CO₂ MASK | C02 Mask Kit | 20g tube x 5 12g sheet x 5 | Box | 230 |
| 36 | GENOSYS Mask | INTENSIVE REPAIR COLLAGEN MASK | Intensive repair Collagen Mask | 23g sheet | Pcs | 18 |
| 38 | GENOSYS Mask | SOOTHING BOMB SEA ALGAE MASK | Soothing Bomb Sea Algae Mask | 23g sheet | Pcs | 18 |
| 39 | GENOSYS Mask | PEPTIDE GEL MASK | Peptide Gel Mask | 39g sheet x 5 | Box | 190 |
| 41 | GENOSYS Mask | BIO-FERMENT AGE DEFYING POWDER MASK | Bio-Ferment Age Defying Powder Mask | 300g | Pcs | 125 |
| 42 | GENOSYS Mask | SKIN REBOOT PDRN MASK PACK | Skin Reboot PDRN Mask | 350g (30 sheets) | Pcs | 200 |
| 43 | GENOSYS Mask | HYDRO COOL MODELING MASK | Modelling Mask | 1 KG | Pcs | 300 |
| 46 | GENOSYS Peeling & Power Solution | SKIN RENEWAL PEELING SYSTEM (SRS) | Soft Peeling | 2ml * 10 vials | Box | 405 |
| 48 | GENOSYS Peeling & Power Solution | POWER SOLUTION AWS | Anti-Wrinkle Solution | 2ml * 10 vials | Box | 290 |
| 50 | GENOSYS Peeling & Power Solution | POWER SOLUTION SWS | Skin Whitening Solution | 2ml * 10 vials | Box | 290 |
| 52 | GENOSYS Peeling & Power Solution | POWER SOLUTION PCS | Problem Control Solution | 2ml * 10 vials | Box | 290 |
| 54 | GENOSYS Peeling & Power Solution | POWER SOLUTION CVS | Protection, Nutrition Solution | 2ml * 10 vials | Box | 290 |
| 56 | GENOSYS Peeling & Power Solution | POWER SOLUTION CTS | Anti-Scar, Regeneration Solution | 2ml * 10 vials | Box | 290 |
| 58 | GENOSYS Peeling & Power Solution | POWER SOLUTION HES | Anti redness, Instant Plumping Solution | 2ml * 10 vials | Box | 290 |
| 70 | GENOSYS CLEANSER | SNOW O₂ | Daily Bubble form Cleanser / Personal use | 180ml | Pcs | 165 |
| 72 | GENOSYS CLEANSER | SNOW O₂ | Professional Bubble form Cleanser | 500ml | Pcs | 255 |
| 75 | GENOSYS TONER | SNOW BOOSTER | Daily Skin Toner / Personal use | 200ml | Pcs | 130 |
| 77 | GENOSYS TONER | SNOW BOOSTER | Professional Skin Toner | 1000ml | Pcs | 245 |
| 79 | GENOSYS TONER | PROBLEM CONTROL TONER | Daily Problem Control Toner / Personal use | 200ml | Pcs | 130 |
| 80 | GENOSYS TONER | PROBLEM CONTROL TONER | Professional Problem Control Toner | 500ml | Pcs | 245 |
| 82 | GENOSYS MAKEUP REMOVER | SKIN DEFENDER LIP & EYE MAKEUP REMOVER | Professional Make-up Remover for lip and eyes | 200ml | Pcs | 145 |
| 85 | GENOSYS CREAM | SKIN RESCUE OVERNIGHT CREAM MASK | Skin Rescue Overnight Cream Mask | 100g | Pcs | 170 |
| 87 | GENOSYS CREAM | MULTI FUNCTIONAL ANTI-WRINKLE CREAM | Multi Functional Anti-Wrinkle Cream/ Personal | 50g | Pcs | 145 |
| 88 | GENOSYS CREAM | MULTI FUNCTIONAL ANTI-WRINKLE CREAM | Multi Functional Anti-Wrinkle Cream/ Professional | 250g | Pcs | 210 |
| 89 | GENOSYS CREAM | INTENSIVE HYDRO SOOTHING CREAM | Daily Hydrating & Soothing Cream/ Personal | 50g | Pcs | 145 |
| 91 | GENOSYS CREAM | INTENSIVE HYDRO SOOTHING CREAM | Daily Hydrating & Soothing Cream/ Professional | 250g | Pcs | 210 |
| 93 | GENOSYS CREAM | MOISTURE REPLENISHING HYALURON CREAM | Daily Replenishing Hyaluron Cream/ Personal | 50g | PCs | 145 |
| 94 | GENOSYS CREAM | MOISTURE REPLENISHING HYALURON CREAM | Daily Replenishing Hyaluron Cream/ Professional | 250g | Pcs | 210 |
| 96 | GENOSYS CREAM | INTENSIVE MULTI FUNCTIONAL CREAM | Anti-Wrinkle & Skin Brightening Cream/ Professional | 250g | Pcs | 210 |
| 98 | GENOSYS CREAM | INTENSIVE PROBLEM CONTROL CREAM | Daily Problem Control Cream/ Personal | 50g | Pcs | 145 |
| 100 | GENOSYS CREAM | INTENSIVE PROBLEM CONTROL CREAM | Problem Control Cream/ Professional | 250g | Pcs | 210 |
| 102 | GENOSYS CREAM | MULTI VITA RADIANCE CREAM | Multi Vita Radiance cream/ Personal | 50g | Pcs | 145 |
| 103 | GENOSYS CREAM | MULTI VITA RADIANCE CREAM | Multi Vita Radiance cream/ Professional | 230g | Pcs | 210 |
| 104 | GENOSYS CREAM | SKIN BARRIER PROTECTING CREAM | Soothing & Relieving Cream/ Professional | 100g | Pcs | 225 |
| 106 | GENOSYS CREAM | SOOTHING REPAIR POSTCREAM | Postcream after Treatment/ Personal | 20g | Pcs | 102 |
| 109 | GENOSYS CREAM | SOOTHING REPAIR POSTCREAM | Postcream after Treatment/ Professional | 100g |  | 220 |
| 110 | GENOSYS CREAM | INTENSIVE BLEMISH BALM CREAM | Blemish Cover Cream (SPF30 PA++) | 50g | Pcs | 125 |
| 112 | GENOSYS CREAM | MULTI SUN CREAM | Sun Protector (SPF40 PA++) | 40g | Pcs | 105 |
| 114 | GENOSYS CREAM | ULTRA SHIELD SUN CREAM | Sun Protector SPF50/PA++++ 50g | 40g | Pcs | 125 |
| 115 | GENOSYS CREAM | EPI TURNOVER BOOSTING PEELING GEL | Mild Enzyme Peeling Gel | 100g | Pcs | 125 |
| 117 | GENOSYS CREAM | MICROBIOME ENERGY INFUSING MIST | Daily Revitalizing Mist | 80ml | Box | 80 |
| 118 | GENOSYS CREAM | REVITA GLOW BB CREAM #01 BRIGHT | Blemish coverage, glow, and sun protection SPF 38 PA+++ | 50g | Pcs | 125 |
| 119 | GENOSYS CREAM | REVITA GLOW BB CREAM #02 NATURAL | Blemish coverage, glow, and sun protection SPF 38 PA+++ | 50g | Pcs | 125 |
| 132 | GENOSYS Cosmetics - Daily Serum | MULTI FUNCTIONAL ANTI-WRINKLE SERUM | Daily Anti-Wrinkle Serum | 30ml | Pcs | 165 |
| 133 | GENOSYS Cosmetics - Daily Serum | MULTI VITA RADIANCE SERUM | Daily Skin Radiance Serum | 30ml | Pcs | 165 |
| 134 | GENOSYS Cosmetics - Daily Serum | MOISTURE REPLENISHING HYALURON SERUM | Daily Skin Replenishing Serum | 30ml | Pcs | 165 |
| 135 | GENOSYS Cosmetics - Daily Serum | PROBLEM CONTROL SERUM | Daily Problem Control Serum | 30ml | Pcs | 165 |
| 136 | GENOSYS Cosmetics - Daily Serum | ALL FOR SENSITIVE SERUM | Daily Sensitive Skin Care Serum | 30ml | Pcs | 165 |
| 139 | GENOSYS Cosmetics - CUSHION | CUSHION: IVORY | Cushion + Refiller / Color: #01 IVORY | Cushion 15g x 1ea, Refiller 15g x 1ea | Pcs | 150 |
| 141 | GENOSYS Cosmetics - CUSHION | CUSHION: BIEGE | Cushion + Refiller / Color: #02 BEIGE | Cushion 15g x 1ea, Refiller 15g x 1ea | Pcs | 150 |
| 142 | GENOSYS Cosmetics - CUSHION | CUSHION: CAMEL | Cushion + Refiller / Color: #03 CAMEL | Cushion 15g x 1ea, Refiller 15g x 1ea | Pcs | 150 |
| 152 | GENOSYS Cosmetics - HAIR | HR³ MATRIX HAIR SOLUTION | Hair Solution | 5ml * 8pcs | Box | 370 |
| 154 | GENOSYS Cosmetics - HAIR | HR³ MATRIX SCALP PEELING ALPHA | Scalp Peeling | 100ml | Pcs | 145 |
| 156 | GENOSYS Cosmetics - HAIR | HR³ MATRIX HAIR TONIC | Daily Hair Tonic | 70ml | Pcs | 145 |
| 158 | GENOSYS Cosmetics - HAIR | HR³ MATRIX SCALP & HAIR SHAMPOO | Daily Hair Shampoo | 300ml | Pcs | 170 |
| 160 | GENOSYS Cosmetics - HAIR | HR³ MATRIX MESOPECIA KIT (Stamp/Roller) | The Mesopecia system for hair & scalp | Stamp 0.50mm x 1 CHS -1 x 6 CSP x 1 Dropper x 2 | Box | 550 |
| 162 | GENOSYS Cosmetics - HAIR | HR³ MATRIX HAIR SOLUTION α (Homecare) | The Mesopecia system for hair & scalp | Hair Solution x 8ea / Applicator x 1ea / Cleansing Brush x 1ea / Disinfecting Jar x 1ea | Box | 450 |
| 165 | GENOSYS Cosmetics - EYE | EYE PEPTIDE GEL PATCH | Eye Gel Patch | 98g (60 pcs) | Pcs | 190 |
| 167 | GENOSYS Cosmetics - EYE | EyeCell EYE CONTOUR SERUM | Eye Serum | 10ml | Pcs | 185 |
| 169 | GENOSYS Cosmetics - EYE | EyeCell EYE CONTOUR CREAM | Eye Cream | 20g | Pcs | 185 |
| 171 | GENOSYS Cosmetics - EYE | EyeCell COSMECEUTICAL EYE ZONE CARE KIT | Eye zone care Kit | Eye Cream x 1 Eye Serum x 1 Eye Patch x 1 Eye Roller x 1 | Box | 490 |
| 174 | GENOSYS Cosmetics - ND CELL Treatment - Neck&Decollete | ND Cell Anti-Wrinkle Cream | ND Cell Anti-Wrinkle Cream | 50g | Pcs | 185 |
| 186 | GENOSYS Cosmetics - KIT BOX | Starter Kit | GENOSYS Starter Kit | Power solution (AWS, SWS, PCS x 1) Peptide Gel Mask x 1 EZ CO2 Mask x 1 Muliti Sun Cream x1 | Box | 170 |
| 190 | GENOSYS DERMAFIX | NEEDLE PEN-K KIT | DERMAFIX PREMIUM HANDLE DERMAFIX PREMIUM NEEDLE | Handle x 1 Needle x 2 Adaptor x 1 | Box | 1450 |
| 192 | GENOSYS DERMAFIX | NEEDLE PEN-K NEEDLE CARTRIDGE (10 PCS) | DERMAFIX PREMIUM NEEDLE SHORT (10 PCS) | 10pcs | Box | N/A |
| 206 | GENOSYS DERMAFIX | Genosys GENO-LED | 4 Colours: Red - 640nm Blue - 423nm Green - 532nm Yellow- 583nm | Weight: 2.5kg (product ) 3.5kg (with outer box). Components:1 DEVICE, 1 EYESHIELD, 1 ADAPTOR, 1 DEVICE BOX. | Box | 5500 |
| 212 | GENOSYS DERMAFIX | Genosys GENTRON | Hair Gentron ( 5V ~ 6V DC) | 1 pcs | Box | 3300 |
| 218 | GENOSYS DERMAFIX | Genosys Hairgen Booster | 2 Colours: Red - 640nm Blue - 423nm | 1 pcs | Box | 1800 |
| 219 | GENOSYS DERMAFIX | Genosys Hairstamp for Hairgen Booster | 8 pcs of hairstamp | 1 pcs | Box | 370 |
| 230 | GENOSYS X-Banner | GENOSYS POWER SOLUTION X-Banner | GENOSYS POWER SOLUTION X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 232 | GENOSYS X-Banner | GENOSYS ROLLER & DERMAFIX X-Banner | GENOSYS ROLLER & DERMAFIX X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 234 | GENOSYS X-Banner | GENOSYS EyeCell X-Banner | GENOSYS EyeCell X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 236 | GENOSYS X-Banner | GENOSYS HR3 MATRIX X-Banner | GENOSYS HR3 MATRIX X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 238 | GENOSYS X-Banner | GENOSYS Bodycell X-Banner | GENOSYS Bodycell X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 240 | GENOSYS X-Banner | GENOSYS NDCell X-Banner | GENOSYS NDCell X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 242 | GENOSYS X-Banner | GENOSYS HOMECARE X-Banner | GENOSYS HOMECARE X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 244 | GENOSYS X-Banner | GENOSYS DERMAPEEL X-Banner | GENOSYS DERMAPEEL X-Banner (Size: H1800mm x W 600mm) | Banner x 1EA Holder x 1EA | Pcs | 325 |
| 247 | Genosys Roller Case | Roller Storage Case | Case for the roller replacement head (Size: Ф55mm, H: 35mm) | 1 EA | Pcs | 10 |
| 250 | Genosys Cosmetic Cradle | Cosmetic Cradle (L) | Display cradle for cosmetics (Size: 410 x 157 x 280mm) | 1 pcs | acrylic | 610 |
| 252 | Genosys Cosmetic Cradle | Cosmetic Cradle (S) | Display cradle for cosmetics (Size: 220 x 140 x 310mm) | 1 pcs | acrylic | 185 |
| 255 | Genosys Accessories and Bags | Badge | GENOSYS Badge (Size: 30 x 5 mm) | 1 pcs | Stainless steel | 25 |
| 257 | Genosys Accessories and Bags | Key Holder | Roller Disk Key Holder (Size: Ф30mm) | 1 pcs | Epoxy resin | 10 |
| 259 | Genosys Accessories and Bags | GENOSYS Paper Bag (L) | GENOSYS Paper Bag (Size: 430 x 110 x 290mm) | 1 pcs | Paper | 17 |
| 261 | Genosys Accessories and Bags | GENOSYS Paper Bag (S) | GENOSYS Paper Bag (Size: 220 x 100 x 300mm) | 1 pcs | Paper | 15 |
| 263 | Genosys Accessories and Bags | Pen | Touch Pen with GENOSYS LOGO (50pcs) | 50 pcs | Black Ink | 165 |
| 265 | Genosys Accessories and Bags | GENOSYS Cosmetic Pouch | GENOSYS Travel Pouch (Size: 200 * 145mm) | 1 pcs | Plastic | 35 |
| 268 | Genosys Dropper | Dropper(s) | Individually sealed and sterilized Dropper for GENOSYS Solutions | 5 pcs | PE | 10 |
| 271 | Genosys Bed Blanket | Bed Blanket | GENOSYS Bed Blanket | 1 pcs | Cotton | 210 |
| 274 | Genosys Uniform | Aesthetician Uniform | GENOSYS Aesthetic Uniform (Size: L, M, S) | 1 pcs | Polyester | 410 |
| 276 | Genosys Uniform | Physician Uniform | GENOSYS Physician Uniform (Size: L, M, S) | 1 pcs | Polyester | 410 |
| 278 | Genosys Uniform | Hair Turban | GENOSYS Hair Turban | 1 pcs | Cotton | 50 |

## Practical Use

- Use this as the current **GENOSYS UAE clinic/professional price list** reference for quotes, clinic orders, proforma invoices, and consignment discussions.
- For ingredient/formula claims, continue using the Intertek documents as the source of truth; this file is pricing and packaging/specification reference only.
