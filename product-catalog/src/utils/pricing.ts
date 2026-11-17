export interface DiscountPricing {
  discount: number;
  originalPrice: string | null;
}

/**
 * Calculates the rounded discount percentage and the original price before discount.
 * Handles edge cases: 0 or missing price, 0 or missing discount, 100% discount, and fractional percentages.
 */
export function calculateDiscountPricing(
  price?: number,
  discountPercentage?: number
): DiscountPricing {
  if (!price || price <= 0 || !discountPercentage || discountPercentage <= 0) {
    return { discount: 0, originalPrice: null };
  }

  const discount = Math.round(discountPercentage);

  // Avoid division by zero or negative divisor if discount is 100% or greater
  if (discountPercentage >= 100) {
    return { discount, originalPrice: null };
  }

  const originalPrice = (price / (1 - discountPercentage / 100)).toFixed(2);

  return { discount, originalPrice };
}
