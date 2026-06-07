export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80";

export const CATEGORY_ICONS = {
  "Fresh Fruits": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80",
  "Fresh Vegetables": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=80",
  "Dairy & Eggs": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80",
  "Pantry Staples": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80",
  Beverages: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=80",
  Household: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&q=80",
  "Frozen Foods": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=80",
  Bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
};

export const PRODUCT_IMAGES = {
  default: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
  fruit: "https://images.unsplash.com/photo-1619566636852-1565ec72267b?w=400&q=80",
  vegetable: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
  dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
  pantry: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  beverage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  household: "https://images.unsplash.com/photo-1585421514284-efb74c2b69bb?w=400&q=80",
  frozen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
};

export const getProductImage = (product) =>
  product?.image || PRODUCT_IMAGES.default;
