require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");
const Review = require("./models/Review");

const IMAGES = {
  orange: "https://images.unsplash.com/photo-1547514704-5bbef469c4ad?w=400&q=80",
  strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  pepper: "https://images.unsplash.com/photo-1563565375-f89fdfca1c00?w=400&q=80",
  kale: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
  pumpkin: "https://images.unsplash.com/photo-1570586437453-0b5a4a7a8e0e?w=400&q=80",
  garlic: "https://images.unsplash.com/photo-1609501676725-7186abf3a0f0?w=400&q=80",
  broccoli: "https://images.unsplash.com/photo-1459411552885-d0bd4e5c4f0e?w=400&q=80",
};

const seed = async () => {
  await connectDB();

  await Category.deleteMany();
  await Product.deleteMany();
  await Supplier.deleteMany();
  await Review.deleteMany();

  const categories = await Category.insertMany([
    { name: "Fruit & Produce", description: "Fresh fruits and seasonal produce", aisle: "A1" },
    { name: "Fresh Vegetables", description: "Daily-stocked vegetable aisle", aisle: "A2" },
    { name: "Dairy & Eggs", description: "Milk, cheese, yogurt, and eggs", aisle: "B1" },
    { name: "Pantry Staples", description: "Rice, pasta, oils, and canned goods", aisle: "C1" },
    { name: "Beverages", description: "Juices, soft drinks, and water", aisle: "D1" },
    { name: "Household", description: "Cleaning and household essentials", aisle: "E1" },
    { name: "Frozen Foods", description: "Frozen meals and ice cream", aisle: "F1" },
    { name: "Bakery", description: "Bread, cakes, and baked goods", aisle: "G1" },
  ]);

  await Supplier.insertMany([
    { name: "FreshFarm Suppliers", contact: "John Miller", email: "orders@freshfarm.com", address: "12 Farm Road", items: ["Fruit", "Vegetables"] },
    { name: "DairyDirect Co.", contact: "Sarah Lee", email: "supply@dairydirect.com", address: "45 Milk Lane", items: ["Milk", "Cheese", "Yogurt"] },
    { name: "Global Grocery Wholesale", contact: "Mike Chen", email: "wholesale@globalgrocery.com", address: "88 Trade Park", items: ["Pantry", "Beverages", "Household"] },
  ]);

  const fruit = categories.find((c) => c.name === "Fruit & Produce");
  const veg = categories.find((c) => c.name === "Fresh Vegetables");
  const pantry = categories.find((c) => c.name === "Pantry Staples");

  const products = await Product.insertMany([
    { name: "Fresh Oranges 1kg — Vitamin-C Pack", description: "Premium supermarket oranges for daily nutrition.", price: 4.99, originalPrice: 6.99, stock: 120, rating: 5, isFlashSale: true, image: IMAGES.orange, category: fruit._id },
    { name: "Organic Strawberries 500g", description: "Fresh berry pack from trusted suppliers.", price: 5.49, originalPrice: 7.99, stock: 80, rating: 5, isFlashSale: true, image: IMAGES.strawberry, category: fruit._id },
    { name: "Green Bell Peppers 3-Pack", description: "Crisp peppers stocked daily.", price: 3.29, originalPrice: 4.49, stock: 95, rating: 4, isFlashSale: true, image: IMAGES.pepper, category: veg._id },
    { name: "Organic Kale Bunch", description: "Healthy greens for online delivery.", price: 2.99, originalPrice: 3.99, stock: 60, rating: 5, isFlashSale: true, image: IMAGES.kale, category: veg._id },
    { name: "Vine-Ripened Tomatoes 1kg", description: "Supermarket-quality tomatoes.", price: 3.49, originalPrice: 4.99, stock: 110, rating: 4, image: IMAGES.tomato, category: veg._id },
    { name: "Seasonal Pumpkin Each", description: "Fresh pumpkin from local suppliers.", price: 6.99, originalPrice: 8.99, stock: 40, rating: 5, image: IMAGES.pumpkin, category: veg._id },
    { name: "Fresh Garlic 200g", description: "Pantry essential.", price: 1.99, originalPrice: 2.49, stock: 200, rating: 5, image: IMAGES.garlic, category: pantry._id },
    { name: "Broccoli Florets 500g", description: "Nutritious broccoli for family meals.", price: 3.79, originalPrice: 4.99, stock: 75, rating: 4, image: IMAGES.broccoli, category: veg._id },
  ]);

  await Review.insertMany([
    { userId: "demo", userName: "Alice M.", productId: products[0]._id, productName: products[0].name, rating: 5, comment: "Always fresh from this online supermarket. Fast delivery!" },
    { userId: "demo", userName: "Bob K.", productId: products[2]._id, productName: products[2].name, rating: 4, comment: "Good quality peppers, will order again." },
  ]);

  console.log("Supermarket database seeded: categories, suppliers, products, reviews");
  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
