/**
 * Reconcile published INCI cards with physical packaging or approved outer-carton artwork.
 *
 * This intentionally does not use formula, quali-quanti, safety-assessment, or COA files
 * as the source for the customer-facing ingredient order.
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/sync-carton-inci-audit-20260916.ts
 *
 * Apply database and canonical source constants:
 *   npx tsx --env-file=.env.local scripts/sync-carton-inci-audit-20260916.ts --apply
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../lib/prisma";

type Card = { name?: string; description?: string; subList?: string[] };

const INTERTEK = "/Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek";

const ARTWORK: Record<string, string> = {
  "4": "Registration DOC/Artwork/[GENOSYS]POWER SOLUTION HES.pdf",
  "5": "Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf",
  "6": "Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CTS.pdf",
  "7": "Registration DOC/Artwork/[GENOSYS]POWER SOLUTION PCS.pdf",
  "8": "Registration DOC/Artwork/[GENOSYS]POWER SOLUTION SWS.pdf",
  "9": "Registration DOC/Artwork/[GENOSYS]POWER SOLUTION AWS.pdf",
  "10": "Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf",
  "11": "GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/Artwork-GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pdf",
  "12": "Registration DOC/Artwork/[GENOSYS]EPI TURNOVER BOOSTING PEELING GEL.pdf",
  "15": "Genosys Intensive Problem Control Toner/Artwork-GENOSYS INTENSIVE PROBLEM CONTROL TONER(200ml).pdf",
  "16": "Registration DOC/Artwork/[GENOSYS]SNOW BOOSTER(200ml).pdf",
  "17": "Registration DOC/Artwork/[GENOSYS]EYECELL EYE SERUM.pdf",
  "18": "MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON SERUM/Artwork_updated22062024.pdf",
  "19": "Registration DOC/Artwork/[GENOSYS]ALL FOR SENSITIVE SERUM.pdf",
  "22": "Registration DOC/Artwork/artwork-[GENOSYS]MULTI FUNCTIONAL ANTI-WIRINKLE SERUM.pdf",
  "23": "Registration DOC/Artwork/[GENOSYS]NDCELL ANTI-WRINKLE CREAM.pdf",
  "24": "Registration DOC/Artwork/[GENOSYS]EYECELL EYE CREAM.pdf",
  "25": "Registration DOC/Artwork/[GENOSYS]SOOTHING REPAIR POSTCREAM(20g).pdf",
  "31": "Registration DOC/Artwork/[GENOSYS]MULTI VITA RADIANCE CREAM(50g).pdf",
  "32": "Registration DOC/Artwork/Artwork-GENOSYS MULTI FUNCTIONAL ANTI WRINCLE CREAM(50g).pdf",
  "33": "Registration DOC/Artwork/[GENOSYS]EYECELL EYE PEPTIDE GEL PATCH.pdf",
  "37": "Registration DOC/Artwork/[GENOSYS]PEPTIDE GEL MASK.pdf",
  "41": "SKIN CARING BLEMISH BALM CUSHION/CARING BLEMISH BALM CUSHION #3_Camel/Artwork-[GENOSYS]SKIN CARING BLEMISH BALM CUSHION #03.pdf",
  "45": "Registration DOC/Artwork/[GENOSYS]HR3 MATRIX HAIR SOLUTION α_Professional.pdf",
  "47": "Registration DOC/Artwork/[GENOSYS]HAIR MATRIX MESOPECIA KIT.pdf",
  "52": "SKIN REBOOT PDRN MASK PACK /Artwork-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf",
  // Owner confirmed the 200 ml and 600 ml bottles are the same product and
  // formula; only the bottle size differs.
  "66": "Cerrabar/600ml/Artwork-GENOSYS CERABARRIER BIOME GEL CLEANSER_600ml.pdf",
};

const MANUAL_PHYSICAL: Record<string, string> = {
  // Current 80 ml carton and bottle:
  // Genosys Microbiome Energy Infusing Mist/Pics/image3.jpeg
  "14": "Aqua (Water), Butylene Glycol, Glycerin, 1,2-Hexanediol, Butyrospermum Parkii (Shea) Butter, Lactobacillus Ferment (879.5 ppm), Sodium Hyaluronate, Hyaluronic Acid, Sodium Hyaluronate Crosspolymer, Potassium Hyaluronate, Hydroxypropyltrimonium Hyaluronate, Hydrolyzed Hyaluronic Acid, Sodium Acetylated Hyaluronate, Acetyl Heptapeptide-4, Inulin (800 ppm), Alpha-Glucan Oligosaccharide (200 ppm), Centella Asiatica Extract, Bambusa Vulgaris Leaf Extract, Olea Europaea (Olive) Fruit Oil, Vitis Vinifera (Grape) Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Macadamia Integrifolia Seed Oil, Trametes Versicolor Extract, Sucrose Palmitate, Ethylhexylglycerin, Polyglycerin-3, Polyglyceryl-10 Laurate, Caprylyl Glycol, Citric Acid, Sodium Citrate, Disodium EDTA, Polyglyceryl-10 Oleate, Inulin Lauryl Carbamate, Citrus Aurantium Bergamia (Bergamot) Fruit Oil, Limonene, Linalool.",
  // Current 25 g pouch:
  // Soothing Bomb Sea Mask/Back.jpg
  "36": "Aqua (Water), Methylpropanediol, Glycerin, Dipropylene Glycol, Jania Rubens Extract (10 ppm), Undaria Pinnatifida Extract (10 ppm), Panthenol, Allantoin, Hamamelis Virginiana (Witch Hazel) Leaf Extract, Centella Asiatica Extract, Castanea Crenata (Chestnut) Shell Extract, Bambusa Vulgaris Extract, Betaine, Carbomer, Chlorphenesin, Tromethamine, Ethylhexylglycerin, Dextrin, Polyglyceryl-10 Laurate, Polyglutamic Acid, Butylene Glycol, Disodium EDTA, 1,2-Hexanediol, Gardenia Florida Fruit Extract, Xanthan Gum, Mentha Piperita (Peppermint) Oil, Phenoxyethanol, Tocopherol.",
  // Current photographed 300 g jar, which supersedes the older flat artwork:
  // BIOFERMENT_MASK/Back.jpeg
  "51": "Diatomaceous Earth, Glucose, Algin, Calcium Sulfate, Aqua (Water), Sodium Benzoate, Sodium Dehydroacetate, Hydrolyzed Corn Starch, Lactobacillus/Punica Granatum Fruit Ferment Extract, Bacillus/Soybean Ferment Extract, Galactomyces Ferment Filtrate, Bifida Ferment Lysate, Chamaecyparis Obtusa Water, Aloe Barbadensis Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Oryza Sativa (Rice) Bran Extract, Gardenia Florida Fruit Extract, sh-Oligopeptide-1, sh-Oligopeptide-2, sh-Polypeptide-1, sh-Polypeptide-11, sh-Polypeptide-9, sh-Polypeptide-22, Glycerin, Ethylhexylglycerin, Menthol, 1,2-Hexanediol, Butylene Glycol, Tetrasodium Pyrophosphate, Dextrin.",
};

// A list is removed, rather than guessed, when current pack evidence is absent or conflicts.
const SUPPRESS = new Set(["27", "28", "44", "46"]);

const SOURCE_CONSTANTS: Record<string, { file: string; name: string }> = {
  "10": {
    file: "components/product/snowo2/snowo2Copy.ts",
    name: "SNOW_O2_FULL_INCI",
  },
  "11": {
    file: "components/product/remover/removerCopy.ts",
    name: "REMOVER_FULL_INCI",
  },
  "12": { file: "components/product/epi/epiCopy.ts", name: "FULL_INCI" },
  "14": { file: "components/product/mist/mistCopy.ts", name: "MIST_FULL_INCI" },
  "15": {
    file: "components/product/pcttoner/pctTonerCopy.ts",
    name: "PCT_TONER_FULL_INCI",
  },
  "16": {
    file: "components/product/booster/boosterCopy.ts",
    name: "BOOSTER_FULL_INCI",
  },
  "17": {
    file: "components/product/eyeserum/eyeserumCopy.ts",
    name: "FULL_INCI",
  },
  "18": {
    file: "components/product/hsserum/hsserumCopy.ts",
    name: "HSSERUM_FULL_INCI",
  },
  "24": {
    file: "components/product/eyecream/eyecreamCopy.ts",
    name: "FULL_INCI",
  },
  "33": {
    file: "components/product/eyepatch/eyepatchCopy.ts",
    name: "FULL_INCI",
  },
  "37": {
    file: "components/product/peptidegel/peptideGelCopy.ts",
    name: "FULL_INCI",
  },
  "41": {
    file: "data/product41LocalizedCopy.ts",
    name: "PRODUCT_41_FULL_INCI",
  },
  "45": {
    file: "data/product45LocalizedCopy.ts",
    name: "PRODUCT_45_FULL_INCI",
  },
  "51": {
    file: "components/product/bioferment/bioFermentCopy.ts",
    name: "FULL_INCI",
  },
  "52": {
    file: "components/product/pdrnmask/pdrnMaskCopy.ts",
    name: "FULL_INCI",
  },
  "66": {
    file: "data/product66LocalizedCopy.ts",
    name: "PRODUCT_66_FULL_INCI",
  },
};

const CANONICAL_OVERRIDES = new Map([
  [baseKey("OlusOil"), "Olus Oil"],
  [baseKey("Water"), "Water"],
  [baseKey("1,2-Hexanediol"), "1,2-Hexanediol"],
  [baseKey("Sodium Cocoyl Glutamate"), "Sodium Cocoyl Glutamate"],
  [baseKey("Cichorium Intybus (Chicory) Root Extract"), "Cichorium Intybus (Chicory) Root Extract"],
  [baseKey("Taraxacum Officinale (Dandelion) Rhizome/Root Extract"), "Taraxacum Officinale (Dandelion) Rhizome/Root Extract"],
  [baseKey("Fructan"), "Fructan"],
  [baseKey("Anastatica Hierochuntica Extract"), "Anastatica Hierochuntica Extract"],
  [baseKey("Polyquaternium-67"), "Polyquaternium-67"],
]);

function parseCards(raw: string | null): Card[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Product 47 is the known legacy plain-string record this audit repairs.
    return [];
  }
}

function splitInci(value: string): string[] {
  const tokens: string[] = [];
  let token = "";
  let depth = 0;
  const source = value
    .replace(/\.$/, "")
    .replace(/(\d),(?=\d-[A-Za-z])/g, "$1§");
  for (let index = 0; index < source.length; index++) {
    const character = source[index] === "§" ? "," : source[index];
    if (character === "(") depth++;
    if (character === ")") depth = Math.max(0, depth - 1);
    if (character === "," && depth === 0 && source[index] !== "§") {
      if (token.trim()) tokens.push(token.trim());
      token = "";
      continue;
    }
    token += character;
  }
  if (token.trim()) tokens.push(token.trim());
  return tokens;
}

function baseKey(value: string): string {
  return value
    .replace(/\(\s*[\d,.]+\s*(?:ppm|ppb)\s*\)/gi, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function annotation(value: string): string {
  const match = value.match(/\(\s*([\d,.]+)\s*(ppm|ppb)\s*\)/i);
  return match ? ` (${match[1]} ${match[2].toLowerCase()})` : "";
}

function extractArtworkBlocks(relativePath: string): string[][] {
  const path = join(INTERTEK, relativePath);
  const text = execFileSync("pdftotext", ["-raw", path, "-"], {
    encoding: "utf8",
    maxBuffer: 20_000_000,
  });
  const starts = [...text.matchAll(/ingredients?/gi)];
  const blocks: string[][] = [];
  for (const start of starts) {
    const tail = text.slice((start.index ?? 0) + start[0].length);
    if (!/^\s*(?:Aqua|Water|Diatomaceous|Macadamia)/i.test(tail)) continue;
    const end = tail.search(
      /(?:Precaution|Preautions|Warning|Caution|How to use|Application|HR3 MATRIX HAIR SOLUTION)/i,
    );
    const raw = tail.slice(0, end >= 0 ? end : 8_000);
    const tokens = splitInci(raw.replace(/\u00ad/g, "").replace(/\s+/g, " "));
    if (tokens.length >= 5) blocks.push(tokens);
  }
  const unique = new Map(
    blocks.map((tokens) => [tokens.map(baseKey).join("|"), tokens]),
  );
  return [...unique.values()];
}

function buildDictionary(
  products: Array<{ ingredients: string | null }>,
): Map<string, string[]> {
  const dictionary = new Map<string, string[]>();
  for (const product of products) {
    for (const card of parseCards(product.ingredients)) {
      if (
        !String(card.name || "")
          .toLowerCase()
          .includes("inci") ||
        !card.description
      )
        continue;
      for (const token of splitInci(card.description)) {
        const key = baseKey(token);
        if (!key) continue;
        const values = dictionary.get(key) || [];
        if (!values.includes(token)) values.push(token);
        dictionary.set(key, values);
      }
    }
  }
  return dictionary;
}

function canonicalize(
  rawTokens: string[],
  localTokens: string[],
  dictionary: Map<string, string[]>,
  productNumber: string,
): string {
  const local = new Map(localTokens.map((token) => [baseKey(token), token]));
  const unresolved: string[] = [];
  const result = rawTokens.map((raw) => {
    const key = baseKey(raw);
    const candidate =
      CANONICAL_OVERRIDES.get(key) ||
      local.get(key) ||
      dictionary.get(key)?.[0];
    if (!candidate) {
      unresolved.push(raw);
      return raw;
    }
    const suffix = annotation(raw);
    const base = candidate.replace(/\s*\(\s*[\d,.]+\s*(?:ppm|ppb)\s*\)/gi, "");
    return `${base}${suffix}`;
  });
  if (unresolved.length) {
    throw new Error(
      `Product ${productNumber} has unresolved artwork tokens: ${unresolved.join(" | ")}`,
    );
  }
  return `${result.join(", ")}.`;
}

function replaceExportedString(
  path: string,
  constantName: string,
  value: string,
): void {
  const source = readFileSync(path, "utf8").replace(
    `export const ${constantName} =\\n  `,
    `export const ${constantName} =\n  `,
  );
  const escaped = constantName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `export const ${escaped}\\s*=\\s*(?:'[^']*'|\"[^\"]*\")(?:\\s*\\+\\s*(?:'[^']*'|\"[^\"]*\"))*`,
    "m",
  );
  if (!pattern.test(source))
    throw new Error(`Could not locate ${constantName} in ${path}`);
  const replacement = `export const ${constantName} =\n  ${JSON.stringify(value)}`;
  writeFileSync(path, source.replace(pattern, replacement), "utf8");
}

function writeRuntimeOverrides(targets: Map<string, string[]>): void {
  const lines = [
    "/** Generated by scripts/sync-carton-inci-audit-20260916.ts. */",
    "export const CARTON_INCI_OVERRIDES: Record<string, readonly string[]> = {",
  ];
  for (const [productNumber, values] of [...targets].sort(
    ([a], [b]) => Number(a) - Number(b),
  )) {
    lines.push(
      `  ${JSON.stringify(productNumber)}: ${JSON.stringify(values)},`,
    );
  }
  lines.push(
    "}",
    "",
    `export const SUPPRESSED_CARTON_INCI = new Set(${JSON.stringify([...SUPPRESS].sort((a, b) => Number(a) - Number(b)))})`,
    "",
    "type Translation = { ingredients?: string | null }",
    "type Card = { name?: string; description?: string; subList?: string[] }",
    "",
    "export function applyCartonInciOverrides<T extends Record<string, Translation>>(translations: T): T {",
    "  const next: Record<string, Translation> = { ...translations }",
    "  for (const [productNumber, translation] of Object.entries(next)) {",
    "    if (!translation?.ingredients) continue",
    "    let cards: Card[]",
    "    try {",
    "      const parsed = JSON.parse(translation.ingredients)",
    "      if (!Array.isArray(parsed)) continue",
    "      cards = parsed",
    "    } catch {",
    "      continue",
    "    }",
    "    const inciCards = cards.filter((card) => String(card?.name || '').toLowerCase().includes('inci'))",
    "    const withoutInci = cards.filter((card) => !String(card?.name || '').toLowerCase().includes('inci'))",
    "    if (SUPPRESSED_CARTON_INCI.has(productNumber)) {",
    "      next[productNumber] = { ...translation, ingredients: JSON.stringify(withoutInci) }",
    "      continue",
    "    }",
    "    const values = CARTON_INCI_OVERRIDES[productNumber]",
    "    if (!values) continue",
    "    const fullCards = productNumber === '47'",
    "      ? [{ name: 'Full INCI — Scalp Peeling α', description: values[0] }, { name: 'Full INCI — Hair Solution α', description: values[1] }]",
    "      : [{ name: inciCards[0]?.name || 'Full INCI', description: values[0] }]",
    "    next[productNumber] = { ...translation, ingredients: JSON.stringify([...withoutInci, ...fullCards]) }",
    "  }",
    "  return next as T",
    "}",
  );
  writeFileSync(
    join(process.cwd(), "data/cartonInciOverrides.ts"),
    `${lines.join("\n")}\n`,
    "utf8",
  );
}

async function main() {
  const apply = process.argv.includes("--apply");
  const products = await prisma.product.findMany({
    where: { ingredients: { not: null } },
    select: { id: true, productNumber: true, name: true, ingredients: true },
  });
  const byNumber = new Map(
    products.map((product) => [product.productNumber || product.id, product]),
  );
  const dictionary = buildDictionary(products);
  const targets = new Map<string, string[]>();

  for (const [productNumber, relativePath] of Object.entries(ARTWORK)) {
    const product = byNumber.get(productNumber);
    if (!product) throw new Error(`Product ${productNumber} not found`);
    const currentCards = parseCards(product.ingredients);
    const currentTokens = currentCards
      .filter((card) =>
        String(card.name || "")
          .toLowerCase()
          .includes("inci"),
      )
      .flatMap((card) => splitInci(card.description || ""));
    const blocks = extractArtworkBlocks(relativePath);
    if (productNumber === "47") {
      if (blocks.length !== 2)
        throw new Error(
          `Product 47 expected two artwork INCI blocks, got ${blocks.length}`,
        );
      targets.set(
        productNumber,
        blocks.map((block) =>
          canonicalize(block, currentTokens, dictionary, productNumber),
        ),
      );
    } else {
      if (blocks.length !== 1) {
        throw new Error(
          `Product ${productNumber} expected one artwork INCI block, got ${blocks.length}`,
        );
      }
      targets.set(productNumber, [
        canonicalize(blocks[0], currentTokens, dictionary, productNumber),
      ]);
    }
  }
  for (const [productNumber, value] of Object.entries(MANUAL_PHYSICAL)) {
    targets.set(productNumber, [value]);
  }

  for (const [productNumber, values] of targets) {
    const product = byNumber.get(productNumber);
    if (!product) throw new Error(`Product ${productNumber} not found`);
    const cards = parseCards(product.ingredients);
    const current = cards
      .filter((card) =>
        String(card.name || "")
          .toLowerCase()
          .includes("inci"),
      )
      .map((card) => card.description || "");
    const changed = JSON.stringify(current) !== JSON.stringify(values);
    console.log(
      `${productNumber} ${product.name}: ${changed ? "CHANGE" : "MATCH"} (${values.length} list${values.length === 1 ? "" : "s"})`,
    );
    if (!apply) continue;
    const withoutInci = cards.filter(
      (card) =>
        !String(card.name || "")
          .toLowerCase()
          .includes("inci"),
    );
    const fullCards =
      productNumber === "47"
        ? [
            { name: "Full INCI — Scalp Peeling α", description: values[0] },
            { name: "Full INCI — Hair Solution α", description: values[1] },
          ]
        : [{ name: "Full INCI", description: values[0] }];
    await prisma.product.update({
      where: { id: product.id },
      data: { ingredients: JSON.stringify([...withoutInci, ...fullCards]) },
    });
  }

  for (const productNumber of SUPPRESS) {
    const product = byNumber.get(productNumber);
    if (!product) throw new Error(`Product ${productNumber} not found`);
    const cards = parseCards(product.ingredients);
    const withoutInci = cards.filter(
      (card) =>
        !String(card.name || "")
          .toLowerCase()
          .includes("inci"),
    );
    const removed = cards.length - withoutInci.length;
    console.log(
      `${productNumber} ${product.name}: SUPPRESS (${removed} unverified list${removed === 1 ? "" : "s"})`,
    );
    if (apply && removed) {
      await prisma.product.update({
        where: { id: product.id },
        data: { ingredients: JSON.stringify(withoutInci) },
      });
    }
  }

  if (!apply) {
    console.log(
      "DRY RUN — pass --apply to update the database and canonical constants",
    );
    return;
  }

  for (const [productNumber, config] of Object.entries(SOURCE_CONSTANTS)) {
    const values = targets.get(productNumber);
    if (!values || values.length !== 1) {
      throw new Error(
        `No single canonical source value for product ${productNumber}`,
      );
    }
    replaceExportedString(
      join(process.cwd(), config.file),
      config.name,
      values[0],
    );
    console.log(`${productNumber}: updated ${config.file}#${config.name}`);
  }
  writeRuntimeOverrides(targets);
  console.log("Wrote data/cartonInciOverrides.ts");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
