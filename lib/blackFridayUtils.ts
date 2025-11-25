/**
 * Black Friday Sale Utilities
 * Manages Black Friday promotion timing and status
 * Sale period: Starts in 10 hours, runs for 3 days (Nov 26th — Nov 28th equivalent)
 */

/**
 * Check if Black Friday sale is currently active
 * @returns boolean indicating if sale is active
 */
export function isBlackFridaySaleActive(): boolean {
  const now = new Date().getTime()
  
  // Sale starts in 10 hours from when this code was deployed
  // Calculate start time: current time + 10 hours
  const saleStartDate = new Date('2025-11-25T20:00:00Z').getTime() // Nov 26th, 2025 at 00:00:00 UAE time (UTC+4)
  
  // Sale end: 3 days after start (Nov 28th, 2025 at 23:59:59 UAE time UTC+4)
  const saleEndDate = new Date('2025-11-28T19:59:59Z').getTime()
  
  return now >= saleStartDate && now <= saleEndDate
}

/**
 * Black Friday discount percentage
 */
export const BLACK_FRIDAY_DISCOUNT_PERCENTAGE = 20

