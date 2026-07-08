/**
 * Client-safe display helpers for the "N+ sold" social-proof badge.
 * (The DB query lives in lib/salesStats.ts — server only.)
 */

/** Minimum units before we show the badge (avoid "3+ sold" looking weak). */
export const UNITS_SOLD_DISPLAY_THRESHOLD = 20

/** 390 -> 350, 47 -> 40: round down to a clean "N+" figure. */
export function roundUnitsSold(units: number): number {
  if (units >= 100) return Math.floor(units / 50) * 50
  return Math.floor(units / 10) * 10
}
