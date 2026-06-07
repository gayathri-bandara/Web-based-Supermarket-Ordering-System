import { CATEGORIES, buildFallbackProducts } from "./productCatalog";

export const FALLBACK_CATEGORIES = CATEGORIES.map((c) => ({
  _id: c.key,
  name: c.name,
  description: c.description,
  aisle: c.aisle,
}));

// Force rebuild to pick up latest image changes
export const FALLBACK_PRODUCTS = buildFallbackProducts();
