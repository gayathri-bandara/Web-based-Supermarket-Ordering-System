import { CATEGORIES, buildFallbackProducts } from "./productCatalog";

export const FALLBACK_CATEGORIES = CATEGORIES.map((c) => ({
  _id: c.key,
  name: c.name,
  description: c.description,
  aisle: c.aisle,
}));

export const FALLBACK_PRODUCTS = buildFallbackProducts();
