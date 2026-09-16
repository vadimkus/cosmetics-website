import {
  applyCartonInciOverrides,
  CARTON_INCI_OVERRIDES,
  SUPPRESSED_CARTON_INCI,
} from "@/data/cartonInciOverrides";

describe("carton INCI overrides", () => {
  it("replaces a stale localized Full INCI card and preserves key cards", () => {
    const result = applyCartonInciOverrides({
      "14": {
        ingredients: JSON.stringify([
          { name: "Key active", description: "Keep me" },
          { name: "Полный состав (INCI)", description: "stale formula order" },
        ]),
      },
    });
    const cards = JSON.parse(result["14"].ingredients || "[]");

    expect(cards).toHaveLength(2);
    expect(cards[0]).toEqual({ name: "Key active", description: "Keep me" });
    expect(cards[1]).toEqual({
      name: "Полный состав (INCI)",
      description: CARTON_INCI_OVERRIDES["14"]![0]!,
    });
    expect(cards[1].description).toContain("Lactobacillus Ferment (879.5 ppm)");
    expect(cards[1].description).toContain("Trametes Versicolor Extract");
  });

  it("keeps the two separately printed kit lists", () => {
    const result = applyCartonInciOverrides({
      "47": {
        ingredients: JSON.stringify([
          { name: "Full INCI", description: "stale" },
        ]),
      },
    });
    const cards = JSON.parse(result["47"].ingredients || "[]");

    expect(cards.map((card: { name: string }) => card.name)).toEqual([
      "Full INCI — Scalp Peeling α",
      "Full INCI — Hair Solution α",
    ]);
  });

  it.each([...SUPPRESSED_CARTON_INCI])(
    "removes unverified Full INCI for product %s",
    (productNumber) => {
      const result = applyCartonInciOverrides({
        [productNumber]: {
          ingredients: JSON.stringify([
            { name: "Key active", description: "Keep me" },
            { name: "Full ingredient list (INCI)", description: "unverified" },
          ]),
        },
      });
      expect(JSON.parse(result[productNumber]!.ingredients || "[]")).toEqual([
        { name: "Key active", description: "Keep me" },
      ]);
    },
  );

  it("uses the current photographed powder-mask jar", () => {
    const list = CARTON_INCI_OVERRIDES["51"]![0]!;
    expect(list).toContain("Hydrolyzed Corn Starch");
    expect(list).toContain("sh-Polypeptide-11");
    expect(list).not.toContain("Hydrolyzed Collagen");
    expect(list).not.toContain("Allantoin");
    expect(list).not.toContain("sh-Polypeptide-3");
  });

  it("publishes the owner-confirmed shared Cerabarrier formula", () => {
    expect([...SUPPRESSED_CARTON_INCI]).not.toContain("66");
    const list = CARTON_INCI_OVERRIDES["66"]![0]!;
    expect(list).toContain("Sodium Cocoyl Glutamate");
    expect(list).toContain("Ceramide EOP");
    expect(list).toContain("Polyquaternium-67");
    expect(list).toContain("Parfum (Fragrance)");
  });
});
