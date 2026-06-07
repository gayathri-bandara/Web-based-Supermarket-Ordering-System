require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");
const Review = require("./models/Review");
const { CATEGORIES, buildProducts } = require("./data/productCatalog");

const seed = async () => {
  await connectDB();

  await Category.deleteMany();
  await Product.deleteMany();
  await Supplier.deleteMany();
  await Review.deleteMany();

  const categories = await Category.insertMany(
    CATEGORIES.map(({ name, description, aisle }) => ({ name, description, aisle }))
  );

  await Supplier.insertMany([
    { name: "FreshFarm Suppliers", contact: "John Miller", email: "orders@freshfarm.com", address: "12 Farm Road", items: ["Fresh Fruits", "Fresh Vegetables"] },
    { name: "DairyDirect Co.", contact: "Sarah Lee", email: "supply@dairydirect.com", address: "45 Milk Lane", items: ["Milk", "Cheese", "Yogurt", "Eggs"] },
    { name: "Global Grocery Wholesale", contact: "Mike Chen", email: "wholesale@globalgrocery.com", address: "88 Trade Park", items: ["Pantry", "Beverages", "Household", "Frozen", "Bakery"] },
  ]);

  const products = await Product.insertMany(buildProducts(categories));

  const fruits = categories.find((c) => c.name === "Fresh Fruits");
  const veg = categories.find((c) => c.name === "Fresh Vegetables");
  const fruitProduct = products.find((p) => p.category.equals(fruits._id));
  const vegProduct = products.find((p) => p.category.equals(veg._id));

  await Review.insertMany([
    { userId: "demo", userName: "Alice M.", productId: fruitProduct._id, productName: fruitProduct.name, rating: 5, comment: "Always fresh from this online supermarket. Fast delivery!" },
    { userId: "demo", userName: "Bob K.", productId: vegProduct._id, productName: vegProduct.name, rating: 4, comment: "Great quality vegetables, will order again." },
  ]);

  console.log(`Seeded ${categories.length} categories and ${products.length} products (30 per aisle)`);
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
