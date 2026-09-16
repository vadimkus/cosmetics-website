/**
 * Verify that every published Full INCI reaches EN, RU and AR in the same
 * printed order, and that withheld products expose no Full INCI card.
 *
 * npx tsx --env-file=.env.local scripts/audit-runtime-inci-parity-20260916.ts
 */
import { getProductTranslations } from "../data/productTranslations";
import { getProductTranslationsRu } from "../data/productTranslationsRu";
import { SUPPRESSED_CARTON_INCI } from "../data/cartonInciOverrides";
import { prisma } from "../lib/prisma";

type Card = { name?: string; description?: string };

function cards(raw: string | null | undefined): Card[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function inci(raw: string | null | undefined): string[] {
  return cards(raw)
    .filter((card) =>
      String(card.name || "")
        .toLowerCase()
        .includes("inci"),
    )
    .map((card) => String(card.description || "").trim());
}

async function main() {
  const products = await prisma.product.findMany({
    where: { productNumber: { not: null }, isHidden: false },
    select: {
      productNumber: true,
      name: true,
      ingredients: true,
    },
    orderBy: { productNumber: "asc" },
  });

  const failures: string[] = [];
  let published = 0;

  for (const product of products) {
    const number = String(product.productNumber);
    const en = inci(product.ingredients);
    const ru = inci(getProductTranslationsRu(number)?.ingredients);
    const ar = inci(getProductTranslations(number)?.ingredients);

    if (SUPPRESSED_CARTON_INCI.has(number)) {
      for (const [locale, values] of [
        ["EN", en],
        ["RU", ru],
        ["AR", ar],
      ] as const) {
        if (values.length) {
          failures.push(`${number} ${locale}: withheld product exposes ${values.length} INCI card(s)`);
        }
      }
      continue;
    }

    if (!en.length) continue;
    published++;
    for (const [locale, values] of [
      ["RU", ru],
      ["AR", ar],
    ] as const) {
      if (!values.length) {
        failures.push(`${number} ${locale}: published EN INCI is missing`);
      } else if (JSON.stringify(values) !== JSON.stringify(en)) {
        failures.push(`${number} ${locale}: INCI content/order differs from EN`);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        published,
        withheld: [...SUPPRESSED_CARTON_INCI],
        failures,
      },
      null,
      2,
    ),
  );
  if (failures.length) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
