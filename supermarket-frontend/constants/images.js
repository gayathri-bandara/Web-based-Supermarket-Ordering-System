export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80";

export const CATEGORY_ICONS = {
  "Fruit & Produce": "https://images.unsplash.com/photo-1619566636852-1565ec72267b?w=200&q=80",
  "Fresh Vegetables": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80",
  "Dairy & Eggs": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80",
  "Pantry Staples": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80",
  Beverages: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=80",
  Household: "https://images.unsplash.com/photo-1585421514284-efb74c2b69bb?w=200&q=80",
  "Frozen Foods": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=80",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
  Fruit: "https://images.unsplash.com/photo-1619566636852-1565ec72267b?w=200&q=80",
  Vegetable: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80",
};

export const PRODUCT_IMAGES = {
  orange: "https://images.unsplash.com/photo-1547514704-5bbef469c4ad?w=400&q=80",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  pepper: "https://images.unsplash.com/photo-1563565375-f89fdfca1c00?w=400&q=80",
  kale: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
  pumpkin: "https://images.unsplash.com/photo-1570586437453-0b5a4a7a8e0e?w=400&q=80",
  garlic: "https://images.unsplash.com/photo-1609501676725-7186abf3a0f0?w=400&q=80",
  broccoli: "https://images.unsplash.com/photo-1459411552885-d0bd4e5c4f0e?w=400&q=80",
  grapes: "https://images.unsplash.com/photo-1537640538966-79f369143eb8?w=400&q=80",
  carrot: "https://images.unsplash.com/photo-1447175008436-170170753886?w=400&q=80",
  default: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
};

export const getProductImage = (product) => {
  if (product?.image) return product.image;
  const name = (product?.name || "").toLowerCase();
  if (name.includes("orange")) return PRODUCT_IMAGES.orange;
  if (name.includes("strawberr")) return PRODUCT_IMAGES.strawberry;
  if (name.includes("pepper")) return PRODUCT_IMAGES.pepper;
  if (name.includes("kale")) return PRODUCT_IMAGES.kale;
  if (name.includes("tomato")) return PRODUCT_IMAGES.tomato;
  if (name.includes("pumpkin")) return PRODUCT_IMAGES.pumpkin;
  if (name.includes("garlic")) return PRODUCT_IMAGES.garlic;
  if (name.includes("broccoli")) return PRODUCT_IMAGES.broccoli;
  if (name.includes("grape")) return PRODUCT_IMAGES.grapes;
  if (name.includes("carrot")) return PRODUCT_IMAGES.carrot;
  return PRODUCT_IMAGES.default;
};
